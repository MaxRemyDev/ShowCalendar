using AutoMapper;
using Backend.Models;
using Backend.Dtos;

namespace Backend.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // USER MAPPINGS
            CreateMap<UserRegistrationDto, User>().ReverseMap();
            CreateMap<UserLoginDto, User>().ReverseMap();
            CreateMap<UserDto, User>().ReverseMap();
            CreateMap<UserUpdateDto, User>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<UserDetailsDto, UserDetails>().ReverseMap();
            CreateMap<UserStatusDto, UserStatus>().ReverseMap();

            // CALENDAR MAPPINGS
            CreateMap<CalendarDto, Calendar>().ReverseMap();
            CreateMap<CalendarUpdateDto, Calendar>().ReverseMap();

            // APPOINTMENT MAPPINGS
            CreateMap<AppointmentDto, Appointment>().ReverseMap();
            CreateMap<AppointmentUpdateDto, Appointment>().ReverseMap();

            // NOTIFICATION MAPPINGS
            CreateMap<NotificationDto, Notification>().ReverseMap();
            CreateMap<NotificationUpdateDto, Notification>().ReverseMap();
        }
    }
}
