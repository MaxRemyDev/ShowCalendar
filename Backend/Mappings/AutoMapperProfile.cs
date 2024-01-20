using AutoMapper;
using Backend.Models;
using Backend.Dtos;

namespace Backend.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<CalendarDto, Calendar>().ReverseMap();
            CreateMap<CalendarUpdateDto, Calendar>().ReverseMap();
            CreateMap<AppointmentDto, Appointment>().ReverseMap();
            CreateMap<UserDto, User>().ReverseMap();
            CreateMap<UserUpdateDto, User>().ReverseMap();
            CreateMap<NotificationDto, Notification>().ReverseMap();
        }
    }
}
