using System;
using System.Linq;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tesli.Model.Entities;
using Tesli.Model.Repositories;
using Tesli.Model.Sqlite;
using Tesli.Model.Sqlite.Repositories;
using Tesli.Tests.Infrastructure.Fixtures;
using Tesli.Tests.Infrastructure.Model;
using Xunit;

namespace Tesli.Tests.Model.Sqlite.Repositories
{
    [Collection("Sqlite Fixture")]
    public class RepositoryFacts
    {
        private readonly SqliteFixture fixture;

        public RepositoryFacts(SqliteFixture fixture) 
        {
            this.fixture = fixture;
        } 

        [Fact]
        public void GetAll()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var students = DataHelper.SeedStudents(serviceProvider, 3);
                var repository = serviceProvider.GetService<IRepository<Student>>();

                var actualStudents = repository.GetAll().ToArray();

                Assert.Equal(students, actualStudents, new StudentEqualityComparer());
            });
        }

        [Fact]
        public void GetByIdWithExistentId()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var student = DataHelper.SeedStudents(serviceProvider, 1).Single();
                var repository = serviceProvider.GetService<IRepository<Student>>();

                var actualStudent = repository.GetById(student.Id);

                Assert.NotNull(actualStudent);
                Assert.Equal(student, actualStudent, new StudentEqualityComparer());
            });
        }

        [Fact]
        public void GetByIdWithNonExistentId()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var repository = serviceProvider.GetService<IRepository<Student>>();

                var nonExistentStudent = repository.GetById(1);

                Assert.Null(nonExistentStudent);
            });
        }

        [Fact]
        public void DeleteById()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var students = DataHelper.SeedStudents(serviceProvider, 2);
                var studentToDelete = students.First();
                var repository = serviceProvider.GetService<IRepository<Student>>();

                repository.Delete(studentToDelete.Id);

                var deletedStudent = dataContext.Students.Single(s => s.Id == studentToDelete.Id);
                Assert.Equal(EntityState.Deleted, dataContext.Entry(deletedStudent).State);

                dataContext.SaveChanges();
                deletedStudent = dataContext.Students.SingleOrDefault(s => s.Id == studentToDelete.Id);
                Assert.Null(deletedStudent);
                Assert.Equal(students.Skip(1), dataContext.Students, new StudentEqualityComparer());
            });
        }

        [Fact]
        public void DeleteNonExistentId()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var repository = serviceProvider.GetService<IRepository<Student>>();

                Assert.Throws<InvalidOperationException>(() => repository.Delete(100));
            });
        }

        [Fact]
        public void DeleteNonExistentEntityWithNoId()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var repository = serviceProvider.GetService<IRepository<Student>>();

                Assert.Throws<InvalidOperationException>(() => repository.Delete(new Student { FirstName = "Tom", Surname = "Jones"}));
            });
        }

        [Fact]
        public void DeleteNonExistentEntityWithId()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var repository = serviceProvider.GetService<IRepository<Student>>();

                repository.Delete(new Student { Id = 1, FirstName = "Tom", Surname = "Jones"});

                Assert.Throws<DbUpdateConcurrencyException>(() => dataContext.SaveChanges());
            });
        }

        [Fact]
        public void DeleteByReference()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var students = DataHelper.SeedStudents(serviceProvider, 2);
                var studentToDelete = students.First();
                var repository = serviceProvider.GetService<IRepository<Student>>();

                repository.Delete(studentToDelete);

                var deletedStudent = dataContext.Students.Single(s => s.Id == studentToDelete.Id);
                Assert.Equal(EntityState.Deleted, dataContext.Entry(deletedStudent).State);

                dataContext.SaveChanges();
                deletedStudent = dataContext.Students.SingleOrDefault(s => s.Id == studentToDelete.Id);
                Assert.Null(deletedStudent);
                Assert.Equal(students.Skip(1), dataContext.Students, new StudentEqualityComparer());
            });
        } 

        [Fact]
        public void Update()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var student = DataHelper.SeedStudents(serviceProvider, 1).Single();
                var repository = serviceProvider.GetService<IRepository<Student>>();
                student.FirstName = "Updated";
                student.Surname = "Values";

                repository.Update(student);

                Assert.Equal(EntityState.Modified, dataContext.Entry(student).State);

                dataContext.SaveChanges();
                var updatedStudent = dataContext.Students.Single();
                Assert.Equal(student, updatedStudent, new StudentEqualityComparer());
            });
        }

        [Fact]
        public void UpdateCannotChangeId()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var student = DataHelper.SeedStudents(serviceProvider, 1).Single();
                var repository = serviceProvider.GetService<IRepository<Student>>();
                student.Id = 10;

                Assert.Throws<InvalidOperationException>(() => repository.Update(student));
            });
        }

        [Theory]
        [InlineData(0)]
        [InlineData(10)]
        public void UpdateCannotSaveDetachedEntityWithIdNotMatchinExistingEntity(int entityId)
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var detachedStudent = new Student { Id = entityId, FirstName = "Dave", Surname = "Detachson" };
                var repository = serviceProvider.GetService<IRepository<Student>>();

                repository.Update(detachedStudent);

                Assert.Throws<DbUpdateConcurrencyException>(() => dataContext.SaveChanges());
            });
        }

        [Fact]
        public void UpdateCannotAttachDetachedEntityWithIdMatchinExistingEntity()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                DataHelper.SeedStudents(serviceProvider, 1);
                var detachedStudent = new Student { Id = 1, FirstName = "Dave", Surname = "Detachson" };
                var repository = serviceProvider.GetService<IRepository<Student>>();
                
                Assert.Throws<InvalidOperationException>(() => repository.Update(detachedStudent));
            });
        }

        [Theory]
        [InlineData(0)]
        [InlineData(1)]
        public void Insert(int entityId)
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                var studentToInsert = new Student { Id = entityId, FirstName = "Dave", Surname = "Detachson" };
                var repository = serviceProvider.GetService<IRepository<Student>>();
                
                repository.Insert(studentToInsert);
                Assert.Equal(EntityState.Added, dataContext.Entry(studentToInsert).State);

                dataContext.SaveChanges();
                var savedStudent = dataContext.Students.Single();
                Assert.Equal(studentToInsert, savedStudent, new StudentEqualityComparer());
            });
        }

        [Fact]
        public void InsertDuplicateEntity()
        {
            this.fixture.DatabaseTest((dataContext, serviceProvider) => 
            {
                DataHelper.SeedStudents(serviceProvider, 1);
                var studentToInsert = new Student { Id = 1, FirstName = "Dave", Surname = "Detachson" };
                var repository = serviceProvider.GetService<IRepository<Student>>();
                
                Assert.Throws<InvalidOperationException>(() => repository.Insert(studentToInsert));
            });
        }
    }
}