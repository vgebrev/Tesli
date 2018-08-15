using System;
using System.Collections.Generic;
using AutoMapper;
using Tesli.Model.Entities;
using Tesli.Tests.Model;

namespace Tesli.Tests.Infrastructure
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile(){
            CreateMap<MockEntity, MockEntity>()
               .ForMember(destination => destination.Id, map => map.Ignore());
        }
    }
}