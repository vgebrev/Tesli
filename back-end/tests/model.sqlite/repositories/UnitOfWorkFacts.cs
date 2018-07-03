using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tesli.Model.Entities;
using Tesli.Model.Repositories;
using Tesli.Model.Sqlite;
using Tesli.Model.Sqlite.Repositories;
using Tesli.Tests.Infrastructure.Model;
using Tesli.Tests.Infrastructure.Fixtures;
using Xunit;

namespace Tesli.Tests.Model.Sqlite.Repositories
{
    [Collection("Sqlite Fixture")]
    public class UnitOfWorkFacts
    {
        private readonly SqliteFixture fixture;

        public UnitOfWorkFacts(SqliteFixture fixture) 
        {
            this.fixture = fixture;
        }

        [Fact]
        public void GetRepositoryCreatesAnInstance() 
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var unitOfWork = serviceProvider.GetService<IUnitOfWork>();
                var repository = unitOfWork.GetRepository<Student>();
                Assert.NotNull(repository);
                Assert.IsType<Repository<Student>>(repository);
            });
        }

        [Fact]
        public void StartCreatesTransaction() 
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var unitOfWork = serviceProvider.GetService<IUnitOfWork>();
                try 
                {
                    Assert.Null(dataContext.Database.CurrentTransaction);
                    unitOfWork.Start();
                    Assert.NotNull(dataContext.Database.CurrentTransaction);
                } 
                finally 
                {
                    dataContext.Database.CurrentTransaction?.Rollback();
                }
            });
        }

        [Fact]
        public void EndSavesChangesAndCommitsTransactionWhenSuccessful() 
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var student = new Student { FirstName = "Some", Surname = "Student" };
                var unitOfWork = serviceProvider.GetService<IUnitOfWork>();
                try 
                {
                    unitOfWork.Start();
                    dataContext.Students.Add(student);
                    unitOfWork.End();
                } 
                finally 
                {
                    var savedStudent = dataContext.Students.Single();
                    Assert.NotEqual(0, savedStudent.Id);
                    Assert.Equal(student, savedStudent, new StudentEqualityComparer());
                }
            });
        }

        
        [Fact]
        public void EndSavesChangesAndRollsBackTransactionWhenUnsuccessful() 
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var unitOfWork = serviceProvider.GetService<IUnitOfWork>();
                var student = new Student { FirstName = "Preppy", Surname = "Pupil" };
                dataContext.Students.Add(student);
                dataContext.SaveChanges();

                Assert.Throws<DbUpdateConcurrencyException>(() => {
                
                    unitOfWork.Start();
                    dataContext.Students.Remove(student);
                    dataContext.SaveChanges();
                    dataContext.Students.Remove(student);
                    unitOfWork.End();
                });
                
                var savedStudent = dataContext.Students.Single();
                Assert.NotEqual(0, savedStudent.Id);
                Assert.Equal(student, savedStudent, new StudentEqualityComparer());
            });
        }
    }
}