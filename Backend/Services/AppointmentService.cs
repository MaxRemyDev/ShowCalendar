using Backend.Interfaces;
using Backend.Models;
using Backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    // SERVICE CLASS FOR MANAGING APPOINTMENTS (GET, POST, PUT, DELETE)
    public class AppointmentService : IAppointmentService
    {
        // DATABASE CONTEXT FOR ACCESSING DATABASE VIA ENTITY FRAMEWORK
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR FOR INITIALIZING DATABASE CONTEXT VIA DEPENDENCY INJECTION
        public AppointmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL APPOINTMENTS FROM DATABASE (FOR TESTING PURPOSES)
        public async Task<IEnumerable<Appointment>> GetAllAppointments()
        {
            return await _context.Appointments.ToListAsync();
        }

        // GET A SPECIFIC APPOINTMENT BY ID FROM DATABASE
        public async Task<Appointment> GetAppointmentById(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            return appointment ?? throw new KeyNotFoundException("Appointment not found");
        }

        // CREATE A NEW APPOINTMENT AND SAVE TO DATABASE
        public async Task<Appointment> CreateAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        // UPDATE AN EXISTING APPOINTMENT IN DATABASE
        public async Task<Appointment> UpdateAppointment(int id, Appointment updatedAppointment)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                throw new KeyNotFoundException("Appointment not found");
            }

            // UPDATING APPOINTMENT DETAILS WITH UPDATED APPOINTMENT DETAILS
            appointment.Title = updatedAppointment.Title;
            appointment.Start = updatedAppointment.Start;
            appointment.End = updatedAppointment.End;

            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return appointment;
        }

        // DELETE AN APPOINTMENT FROM DATABASE BY ID
        public async Task<bool> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                throw new KeyNotFoundException("Appointment not found");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
