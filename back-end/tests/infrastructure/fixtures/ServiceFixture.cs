
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Tesli.Model.Repositories;
using Tesli.Model.Sqlite;
using Tesli.Services;
using Tesli.Tests.Model;
using Xunit;

namespace Tesli.Tests.Infrastructure.Fixtures
{
    public class ServiceFixture : BaseFixture
    {
        internal List<MockEntity> MockEntities { get; private set;}
        public ServiceFixture()
        {
            this.MockEntities = new List<MockEntity> {
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
        }

        protected override void BootstrapServices(IServiceCollection serviceCollection)
        {
            serviceCollection
                .AddAutoMapper()
                .AddScoped<ICrudService<MockEntity>, CrudService<MockEntity>>()
                .AddScoped(typeof(Mock<>))
                .AddScoped<IUnitOfWork>(serviceProvider => {
                    var unitOfWorkMock = serviceProvider.GetService<Mock<IUnitOfWork>>();
                    unitOfWorkMock.Setup(unitOfWork => unitOfWork.GetRepository<MockEntity>()).Returns(serviceProvider.GetService<IRepository<MockEntity>>());
                    return unitOfWorkMock.Object;
                })
                .AddScoped<IRepository<MockEntity>>(serviceProvider => {
                    var repositoryMock = serviceProvider.GetService<Mock<IRepository<MockEntity>>>();
                    repositoryMock.Setup(repository => repository.GetAll()).Returns(this.MockEntities);
                    repositoryMock.Setup(repository => repository.GetById(It.IsAny<int>())).Returns<int>(id => this.MockEntities.SingleOrDefault(e => e.Id == id));
                    return repositoryMock.Object;
                });            
        }
    }

    [CollectionDefinition("Service Fixture")]
    public class ServiceFixtureCollection : ICollectionFixture<ServiceFixture> 
    { }
}