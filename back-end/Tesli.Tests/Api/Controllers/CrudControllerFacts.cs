using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Tesli.Api;
using Tesli.Api.Controllers;
using Tesli.Services;
using Tesli.Tests.Infrastructure.Fixtures;
using Tesli.Tests.Model;
using Xunit;

namespace Tesli.Tests.Api.Controllers 
{
    [Collection("Api Fixture")]
    public class CrudControllerFacts : IDisposable
    {
        private readonly ApiFixture fixture;
        private readonly CrudController<MockEntity> controller;
        private readonly Mock<ICrudService<MockEntity>> serviceMock;
        public CrudControllerFacts(ApiFixture fixture)
        {
            this.fixture = fixture;
            this.controller = this.fixture.ServiceProvider.GetService<CrudController<MockEntity>>();
            this.serviceMock = this.fixture.ServiceProvider.GetService<Mock<ICrudService<MockEntity>>>();
        }

        public void Dispose()
        {
            this.serviceMock.ResetCalls();
        }

        [Fact]
        public void GetReturnsResultOfServiceGetAllMethod()
        {
            var result = this.controller.Get();

            Assert.Equal(this.fixture.MockEntities, result);
            this.serviceMock.Verify(service => service.GetAll(), Times.Once());
        }

        [Fact]
        public void GetWithIdParameterReturnsResultOfServiceGetByIdMethodIfEntityExists()
        {
            var entity = this.fixture.MockEntities.First();
           
            var result = this.controller.GetById(entity.Id);
           
            Assert.IsType<ActionResult<MockEntity>>(result);
            Assert.Equal(entity, result.Value);
            this.serviceMock.Verify(service => service.GetById(entity.Id), Times.Once());
        }

        [Fact]
        public void GetWithIdParameterReturnsNotFoundResultIfEntityDoesntExist()
        {
            var id = 100;
            
            var result = this.controller.GetById(id);
            
            Assert.IsType<ActionResult<MockEntity>>(result);
            Assert.IsType<NotFoundResult>(result.Result);
            Assert.Null(result.Value);
            this.serviceMock.Verify(service => service.GetById(id), Times.Once());
        }

        [Fact]
        public void PostCallsServiceInsertAndReturnsCreatedAtActionResultWithNewEntityAndRoute()
        {
            var unsetId = 0;
            var newEntity = new MockEntity { Id = unsetId, StringProperty = "New", DateTimeProperty = DateTime.UtcNow, NullableDecimalProperty = 1.7M, IntegerProperty = 1000 };

            var postResult = this.controller.Post(newEntity);
            Assert.IsType<ActionResult<MockEntity>>(postResult);
            
            var createdResult = postResult.Result as CreatedAtActionResult;
            Assert.NotNull(createdResult);
            Assert.Equal(nameof(this.controller.GetById), createdResult.ActionName);
            Assert.Equal(createdResult.Value, newEntity);
            this.serviceMock.Verify(service => service.GetById(unsetId), Times.Once());
            this.serviceMock.Verify(service => service.Insert(newEntity), Times.Once());
            this.serviceMock.Verify(service => service.GetById(newEntity.Id), Times.Once());
        }

        [Fact]
        public void PostWithEntityWithDuplicateIdReturnsObjectResultWithConflictStatus()
        {
            var duplicateEntity = this.fixture.MockEntities.First();
            
            var result = this.controller.Post(duplicateEntity);

            Assert.IsType<ActionResult<MockEntity>>(result);
            var conflictResult = result.Result as ConflictObjectResult;
            Assert.NotNull(conflictResult);
            var error = conflictResult.Value as DuplicateEntityError<MockEntity>;
            Assert.NotNull(error);
            Assert.Equal(duplicateEntity, error.Entity);
            Assert.Equal($"{nameof(MockEntity)} with Id {duplicateEntity.Id} already exists", error.Message);
            this.serviceMock.Verify(service => service.GetById(duplicateEntity.Id), Times.Once());
            this.serviceMock.Verify(service => service.Insert(It.IsAny<MockEntity>()), Times.Never());
        }

        [Fact]
        public void PutCallsServiceUpdateWithValidEntityId()
        {
            var updatedEntity = this.fixture.MockEntities.First();

            var result = this.controller.Put(updatedEntity.Id, updatedEntity);
            
            Assert.IsType<NoContentResult>(result);
            this.serviceMock.Verify(service => service.GetById(updatedEntity.Id), Times.Once());
            this.serviceMock.Verify(service => service.Update(updatedEntity.Id, updatedEntity), Times.Once());
        }

        [Fact]
        public void PutReturnsNotFoundResultWithInvalidEntityId()
        {
            var invalidId = 100;
            var updatedEntity = this.fixture.MockEntities.First();

            var result = this.controller.Put(invalidId, updatedEntity);
            
            Assert.IsType<NotFoundResult>(result);
            this.serviceMock.Verify(service => service.GetById(invalidId), Times.Once());
            this.serviceMock.Verify(service => service.Update(It.IsAny<int>(), It.IsAny<MockEntity>()), Times.Never());
        }

        [Fact]
        public void DeleteCallsServiceDeleteWithValidEntityId()
        {
            var entityId = this.fixture.MockEntities.First().Id;

            var result = this.controller.Delete(entityId);
            
            Assert.IsType<NoContentResult>(result);
            this.serviceMock.Verify(service => service.GetById(entityId), Times.Once());
            this.serviceMock.Verify(service => service.Delete(entityId), Times.Once());
        }

        [Fact]
        public void DeleteReturnsNotFoundResultWithInvalidEntityId()
        {
            var invalidId = 100;

            var result = this.controller.Delete(invalidId);
            
            Assert.IsType<NotFoundResult>(result);
            this.serviceMock.Verify(service => service.GetById(invalidId), Times.Once());
            this.serviceMock.Verify(service => service.Delete(It.IsAny<int>()), Times.Never());
        }
    }
}