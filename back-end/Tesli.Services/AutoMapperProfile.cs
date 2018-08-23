using System;
using System.Collections.Generic;
using AutoMapper;
using Tesli.Model.Entities;

namespace Tesli.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile(){
            CreateMap<Student, Student>()
                .ForMember(destination => destination.Id, map => map.Ignore());
            CreateMap<LessonRate, LessonRate>()
                .ForMember(destination => destination.Id, map => map.Ignore());
            CreateMap<Lesson, Lesson>()
                .ForMember(destination => destination.Id, map => map.Ignore())
                .ForMember(destination => destination.LessonAttendees, map => map.Ignore());
            CreateMap<LessonAttendee, LessonAttendee>()
                //.ForMember(destination => destination.Id, map => map.Ignore())
                .ForMember(destination => destination.Student, map => map.Ignore());
        }
    }
}