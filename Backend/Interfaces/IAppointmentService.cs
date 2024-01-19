using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<Appointment>> GetAllAppointments();
        Task<Appointment> GetAppointmentById(int id);
        Task<Appointment> CreateAppointment(Appointment appointment);
        Task<Appointment> UpdateAppointment(int id, Appointment appointment);
        Task<bool> DeleteAppointment(int id);
    }
}
