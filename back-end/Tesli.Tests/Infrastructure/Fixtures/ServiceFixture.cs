
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Tesli.Model.Entities;
using Tesli.Model.Lookups;
using Tesli.Model.Repositories;
using Tesli.Model.Sqlite;
using Tesli.Services;
using Tesli.Tests.Model;
using Xunit;

namespace Tesli.Tests.Infrastructure.Fixtures
{
    public class ServiceFixture : BaseFixture
    {
        internal List<MockEntity> MockEntities { get; private set; }
        internal List<Lesson> Lessons { get; private set; }

        private IMapper mapper;
        internal IMapper Mapper 
        { 
            get 
            {
                if (this.mapper == null)
                {
                    this.mapper = this.ServiceProvider.GetService<IMapper>();
                }
                return this.mapper;
            }
        }

        public ServiceFixture()
        {
            this.MockEntities = new List<MockEntity> 
            {
                new MockEntity 
                { 
                    Id = 1, 
                    StringProperty = "I'm a string", 
                    IntegerProperty = 42, 
                    DateTimeProperty = DateTime.UtcNow, 
                    NullableDecimalProperty = 3.14M 
                },
                new MockEntity 
                { 
                    Id = 2, 
                    StringProperty = "Another string", 
                    IntegerProperty = 69, 
                    DateTimeProperty = DateTime.UtcNow.AddDays(1), 
                    NullableDecimalProperty = null 
                }
            };

            this.Lessons = new List<Lesson> 
            {
                new Lesson 
                {
                    Id = 1,
                    Date = DateTime.Today,
                    StartTime = "15:00",
                    EndTime = "16:00",
                    Status = LessonStatuses.ACTIVE,
                    LessonAttendees = new HashSet<LessonAttendee> 
                    {
                        new LessonAttendee
                        {
                            Id = 11,
                            HasAttended = false,
                            HasPaid = false,
                            Price = 240,
                            StudentId = 101,
                            Student = new Student 
                            {
                                Id = 101,
                                Name = "Mock Student"
                            }
                        },
                        new LessonAttendee 
                        {
                            Id = 12,
                            HasAttended = false,
                            HasPaid = false,
                            Price = 240,
                            StudentId = 102,
                            Student = new Student 
                            {
                                Id = 102,
                                Name = "Mock Student"
                            }
                        }
                    }
                }
            };
        }

        protected override void BootstrapServices(IServiceCollection serviceCollection)
        {
            serviceCollection
                .AddScoped<ICrudService<MockEntity>, CrudService<MockEntity>>()
                .AddScoped(typeof(Mock<>))
                .AddScoped<IUnitOfWork>(serviceProvider => {
                    var unitOfWorkMock = serviceProvider.GetService<Mock<IUnitOfWork>>();
                    unitOfWorkMock.Setup(unitOfWork =>
                        unitOfWork.GetRepository<MockEntity>()).Returns(serviceProvider.GetService<IRepository<MockEntity>>());

                    unitOfWorkMock.Setup(unitOfWork => 
                        unitOfWork.GetRepository<Lesson>()).Returns(serviceProvider.GetService<IRepository<Lesson>>());
                    unitOfWorkMock.Setup(unitOfWork => 
                        unitOfWork.GetRepository<LessonAttendee>()).Returns(serviceProvider.GetService<IRepository<LessonAttendee>>());
                    return unitOfWorkMock.Object;
                })
                .AddScoped<IRepository<MockEntity>>(serviceProvider => {
                    var repositoryMock = serviceProvider.GetService<Mock<IRepository<MockEntity>>>();
                    repositoryMock.Setup(repository => repository.GetAll()).Returns(this.MockEntities);
                    repositoryMock.Setup(repository => repository.GetById(It.IsAny<int>())).Returns<int>(id => this.MockEntities.SingleOrDefault(e => e.Id == id));
                    return repositoryMock.Object;
                })
                .AddScoped<IRepository<Lesson>>(serviceProvider => {
                    var repositoryMock = serviceProvider.GetService<Mock<IRepository<Lesson>>>();
                    repositoryMock.Setup(repository => 
                        repository.GetAll(It.IsAny<string>())).Returns(this.Lessons);
                    repositoryMock.Setup(repository => 
                        repository.GetById(It.IsAny<int>(), It.IsAny<string>())).Returns<int, string>((id, propertiesToInclude) => this.Lessons.SingleOrDefault(e => e.Id == id));
                    return repositoryMock.Object;
                })
                .AddScoped<IRepository<LessonAttendee>>(serviceProvider => {
                    var repositoryMock = serviceProvider.GetService<Mock<IRepository<LessonAttendee>>>();
                    repositoryMock.Setup(repository => 
                        repository.GetAll(It.IsAny<string>())).Returns(this.Lessons.SelectMany(l => l.LessonAttendees));
                    repositoryMock.Setup(repository => 
                        repository.GetById(It.IsAny<int>())).Returns<int>(id => this.Lessons.SelectMany(e => e.LessonAttendees).SingleOrDefault(e => e.Id == id));
                    return repositoryMock.Object;
                })
                .AddScoped<ILessonService, LessonService>();            
        }
    }

    [CollectionDefinition("Service Fixture")]
    public class ServiceFixtureCollection : ICollectionFixture<ServiceFixture> 
    { }
}