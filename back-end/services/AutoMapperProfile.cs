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
        }
    }
}