using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Interfaces;
using Backend.Dtos;
using Backend.Models;
using AutoMapper;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Backend.Controllers
{
    // CONTROLLER FOR MANAGING APPOINTMENTS (GET, POST, PUT, DELETE)
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        // DEPENDENCY INJECTION FOR APPOINTMENT SERVICE AND AUTOMAPPER
        private readonly IAppointmentService _appointmentService;
        private readonly IMapper _mapper;

        // CONSTRUCTOR INITIALIZING DEPENDENCIES
        public AppointmentsController(IAppointmentService appointmentService, IMapper mapper)
        {
            _appointmentService = appointmentService;
            _mapper = mapper;
        }

        // GET ALL APPOINTMENTS (GET)
        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointments();
            var appointmentDtos = _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
            return Ok(appointmentDtos);
        }

        // GET APPOINTMENT BY ID (GET)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            var appointment = await _appointmentService.GetAppointmentById(id);
            if (appointment == null) return NotFound();

            var appointmentDto = _mapper.Map<AppointmentDto>(appointment);
            return Ok(appointmentDto);
        }

        // CREATE A NEW APPOINTMENT (POST)
        [HttpPost]
        public async Task<IActionResult> CreateAppointment(AppointmentDto appointmentDto)
        {
            var appointment = _mapper.Map<Appointment>(appointmentDto);
            var newAppointment = await _appointmentService.CreateAppointment(appointment);
            if (newAppointment == null) return BadRequest("Appointment creation failed");

            var newAppointmentDto = _mapper.Map<AppointmentDto>(newAppointment);
            return CreatedAtAction(nameof(GetAppointmentById), new { id = newAppointmentDto.AppointmentId }, newAppointmentDto);
        }

        // UPDATE AN EXISTING APPOINTMENT BY ID (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, AppointmentDto appointmentDto)
        {
            var appointmentToUpdate = await _appointmentService.GetAppointmentById(id);
            if (appointmentToUpdate == null) return NotFound();

            _mapper.Map(appointmentDto, appointmentToUpdate);
            var updatedAppointment = await _appointmentService.UpdateAppointment(id, appointmentToUpdate);
            if (updatedAppointment == null) return BadRequest("Appointment update failed");

            var updatedAppointmentDto = _mapper.Map<AppointmentDto>(updatedAppointment);
            return Ok(updatedAppointmentDto);
        }

        // DELETE AN APPOINTMENT BY ID (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            bool deleted = await _appointmentService.DeleteAppointment(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
