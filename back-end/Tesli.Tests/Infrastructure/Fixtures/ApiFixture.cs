
using System;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Tesli.Api.Controllers;
using Tesli.Services;
using Tesli.Tests.Model;
using Xunit;

namespace Tesli.Tests.Infrastructure.Fixtures
{
    public class ApiFixture : ServiceFixture
    {
        public ApiFixture() : base()
        { }

        protected override void BootstrapServices(IServiceCollection serviceCollection)
        {
            serviceCollection
                .AddScoped<CrudController<MockEntity>>()
                .AddScoped(typeof(Mock<>))
                .AddScoped<ICrudService<MockEntity>>(serviceProvider => {
                    var crudServiceMock = serviceProvider.GetService<Mock<ICrudService<MockEntity>>>();
                    crudServiceMock.Setup(service => service.GetAll()).Returns(base.MockEntities);
                    crudServiceMock.Setup(service => service.GetById(It.IsAny<int>())).Returns<int>(id => base.MockEntities.SingleOrDefault(e => e.Id == id));
                    crudServiceMock.Setup(service => service.Insert(It.IsAny<MockEntity>()))
                        .Callback<MockEntity>((entity) => { 
                            entity.Id = this.MockEntities.Count + 1;
                            this.MockEntities.Add(entity);
                        })
                        .Returns<MockEntity>(entity => entity.Id);
                    return crudServiceMock.Object;
                });         
        }
    }

    [CollectionDefinition("Api Fixture")]
    public class ApiFixtureCollection : ICollectionFixture<ApiFixture> 
    { }
}