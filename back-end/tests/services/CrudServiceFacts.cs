using System;
using System.Linq;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Tesli.Model.Repositories;
using Tesli.Services;
using Tesli.Tests.Infrastructure.Fixtures;
using Tesli.Tests.Infrastructure.Model;
using Xunit;

namespace Tesli.Tests.Model.Sqlite.Repositories
{
    [Collection("Service Fixture")]
    public class CrudServiceFacts : IDisposable
    {
        private readonly ServiceFixture fixture;
        private readonly ICrudService<MockEntity> service;
        private readonly Mock<IRepository<MockEntity>> repositoryMock;
        private readonly Mock<IUnitOfWork> unitOfWorkMock;

        public CrudServiceFacts(ServiceFixture fixture)
        {
            this.fixture = fixture;
            this.service = this.fixture.ServiceProvider.GetService<ICrudService<MockEntity>>();
            this.repositoryMock = this.fixture.ServiceProvider.GetService<Mock<IRepository<MockEntity>>>();
            this.unitOfWorkMock = this.fixture.ServiceProvider.GetService<Mock<IUnitOfWork>>();
        }

        public void Dispose()
        {
            this.unitOfWorkMock.ResetCalls();
            this.repositoryMock.ResetCalls();
        }

        [Fact]
        public void GetAllCallsRepositoryGetAllAndReturnsItsResult()
        {
            var result = this.service.GetAll();

            this.repositoryMock.Verify(repository => repository.GetAll(), Times.Once());
            Assert.Equal(this.fixture.MockEntities, result);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public void GetByIdCallsRepositoryGetByIdAndReturnsItsResult(int entityId)
        {
            var result = this.service.GetById(entityId);

            this.repositoryMock.Verify(repository => repository.GetById(entityId), Times.Once());
            Assert.Equal(this.fixture.MockEntities.SingleOrDefault(e => e.Id == entityId), result);
        }

        [Fact]
        public void InsertCallsRepositoryInsertWithinAUnitOfWorkAndReturnsId()
        {
            var entity = new MockEntity { Id = this.fixture.MockEntities.Count + 1 };
    
            var result = this.service.Insert(entity);

            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Once());
            this.repositoryMock.Verify(repository => repository.Insert(entity), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Once());
            Assert.Equal(entity.Id, result);
        }

        [Fact]
        public void InsertThrowsArgumentExceptionWhenIdExists()
        {
            var entity = this.fixture.MockEntities.First();
    
            Assert.Throws<ArgumentException>(() => this.service.Insert(entity));
            this.repositoryMock.Verify(repository => repository.GetById(entity.Id), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Never());
            this.repositoryMock.Verify(repository => repository.Insert(entity), Times.Never());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Never());
        }

        [Fact]
        public void UpdateCallsRepositoryUpdateWithinAUnitOfWork()
        {
            var entity = this.fixture.MockEntities.First();
            
            this.service.Update(entity.Id, entity);

            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Once());
            this.repositoryMock.Verify(repository => repository.Update(entity), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Once());
        }

        [Fact]
        public void UpdateThrowsArgumentExceptionWhenEntityWithIdDoesntExist()
        {
            var entity = this.fixture.MockEntities.First();
            var id = 100;
            
            Assert.Throws<ArgumentException>(() => this.service.Update(id, entity));
            this.repositoryMock.Verify(repository => repository.GetById(id), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Never());
            this.repositoryMock.Verify(repository => repository.Update(entity), Times.Never());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Never());
        }

        
        [Fact]
        public void UpdateUsesIdArgumentNotNewEntityId()
        {
            var entityToUpdate = this.fixture.MockEntities.First();
            var entityNotToUpdate = this.fixture.MockEntities.Last();
            var newEntity = new MockEntity { Id = entityNotToUpdate.Id, StringProperty = "changed" };
            
            this.service.Update(entityToUpdate.Id, newEntity);

            this.repositoryMock.Verify(repository => repository.GetById(entityToUpdate.Id), Times.Once());
            Assert.Equal(1, entityToUpdate.Id);
            Assert.Equal("changed", entityToUpdate.StringProperty);
            Assert.NotEqual("changed", entityNotToUpdate.StringProperty);
        }

        [Fact]
        public void DeleteCallsRepositoryDeleteWithinAUnitOfWork()
        {
            var entityToDelete = this.fixture.MockEntities.First();
            
            this.service.Delete(entityToDelete.Id);

            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Once());
            this.repositoryMock.Verify(repository => repository.Delete(entityToDelete), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Once());
        }

        [Fact]
        public void DeleteThrowsArgumentExceptionWhenEntityWithIdDoesntExist()
        {
            var id = 100;
            Assert.Throws<ArgumentException>(() => this.service.Delete(id));
            this.repositoryMock.Verify(repository => repository.GetById(id), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Never());
            this.repositoryMock.Verify(repository => repository.Delete(It.IsAny<MockEntity>()), Times.Never());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Never());
        }
    }
}