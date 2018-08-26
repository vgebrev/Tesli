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
using Tesli.Services;
using Moq;
using Tesli.Model.Lookups;
using System.Collections.Generic;
using AutoMapper;
using Newtonsoft.Json;

namespace Tesli.Tests.Model.Sqlite.Repositories
{
    [Collection("Service Fixture")]
    public class LessonServiceFacts : IDisposable
    {
        private readonly string propertiesToInclude = $"{nameof(Lesson.LessonAttendees)}.{nameof(LessonAttendee.Student)}";
        private readonly ServiceFixture fixture;
        private readonly ILessonService service;
        private readonly Mock<IRepository<Lesson>> lessonRepositoryMock;
        private readonly Mock<IRepository<LessonAttendee>> lessonAttendeeRepositoryMock;
        private readonly Mock<IUnitOfWork> unitOfWorkMock;
        public LessonServiceFacts(ServiceFixture fixture) 
        {
            this.fixture = fixture;
            this.service = this.fixture.ServiceProvider.GetService<ILessonService>();
            this.lessonRepositoryMock = this.fixture.ServiceProvider.GetService<Mock<IRepository<Lesson>>>();
            this.lessonAttendeeRepositoryMock = this.fixture.ServiceProvider.GetService<Mock<IRepository<LessonAttendee>>>();
            this.unitOfWorkMock = this.fixture.ServiceProvider.GetService<Mock<IUnitOfWork>>();
        }

        public void Dispose()
        {
            this.unitOfWorkMock.ResetCalls();
            this.lessonRepositoryMock.ResetCalls();
            this.lessonAttendeeRepositoryMock.ResetCalls();
        }

        [Fact(DisplayName = "GetAll uses the repository overload to load nested entities LessonAttendees and their nested Student")]
        public void GetAllIncludesAttendees()
        {
            var lessons = service.GetAll();
            Assert.Equal(this.fixture.Lessons, lessons);
            lessonRepositoryMock.Verify(repository => repository.GetAll(propertiesToInclude), Times.Once());
        }

        [Fact(DisplayName = "GetById uses the repository GetById overload which loads nested entities LessonAttendees and their nested Student")]
        public void GetByIdIncludesAttendees()
        {
            var lesson = service.GetById(1);
            Assert.Equal(this.fixture.Lessons[0], lesson);
            lessonRepositoryMock.Verify(repository => repository.GetById(1, propertiesToInclude), Times.Once());
        }

        [Fact(DisplayName = "Inserting new lesson with an Id that exists throws argument exception")]
        public void InsertExistingLessonThrowsArgumentException()
        {
            var lesson = this.fixture.Lessons[0];
            Assert.Throws<ArgumentException>(() => this.service.Insert(lesson));
        }

        [Fact(DisplayName = "Inserting new lesson calls Lesson and Lesson Attendee repository Insert methods (wrapped within a unit of work Start and End) and returns inserted lesson id")]
        public void InsertNewLessonSuccess()
        {
            var newLesson = new Lesson 
            {
                Id = 999,
                Date = DateTime.Today,
                StartTime = "15:00",
                EndTime = "16:00",
                Status = LessonStatuses.ACTIVE,
                LessonAttendees = new HashSet<LessonAttendee> 
                {
                    new LessonAttendee
                    {
                        Id = 9999,
                        HasAttended = false,
                        HasPaid = false,
                        Price = 240,
                        StudentId = 101,
                        Student = new Student 
                        {
                            Id = 101,
                            Name = "Mock Student"
                        }
                    }
                }
            };

            var lessonId = this.service.Insert(newLesson);
            Assert.Equal(999, lessonId);
            this.lessonRepositoryMock.Verify(repository =>
                repository.Insert(It.Is<Lesson>(l =>
                    l.Id == 0
                    && l.Date == newLesson.Date
                    && l.StartTime == newLesson.StartTime
                    && l.EndTime == newLesson.EndTime
                    && l.Status == newLesson.Status
                )), Times.Once());

            var lessonAttendee = newLesson.LessonAttendees.Single();

            this.lessonAttendeeRepositoryMock.Verify(repository =>
                repository.Insert(It.Is<LessonAttendee>(la => AreLessonAttendeesEqual(la, lessonAttendee))), Times.Once());

            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Once());
        }

        [Fact(DisplayName = "Update with a non-existing entity Id throws ArgumentException")]
        public void UpdateNonExistentLessonThorwsArgumentException()
        {
            var lesson = this.fixture.Mapper.Map<Lesson>(this.fixture.Lessons.First());
            lesson.Id = 999;

            Assert.Throws<ArgumentException>(() => service.Update(lesson.Id, lesson));
        }

        [Fact(DisplayName = "Update existing lesson updates repository, upserts new/existing attendees and deletes removed attendees")]
        public void UpdateExistingLessonSuccess()
        {
            var originalLesson = this.fixture.Lessons.First();
            var deletedAttendee = originalLesson.LessonAttendees.Last();
            var updatedAttendee = new LessonAttendee
            {
                Id = 11,
                HasAttended = false,
                HasPaid = true,
                Price = 240,
                StudentId = 101,
                Student = new Student 
                {
                    Id = 101,
                    Name = "Updated Student"
                }
            };
            var insertedAttendee = new LessonAttendee 
            {
                Id = 0,
                HasAttended = false,
                HasPaid = true,
                Price = 240,
                StudentId = 103,
                Student = new Student 
                {
                    Id = 103,
                    Name = "New Student"
                }
            };
            var updatedLesson = new Lesson 
            {
                Id = 1,
                Date = DateTime.Today.AddDays(1),
                StartTime = "14:00",
                EndTime = "15:00",
                Status = LessonStatuses.CANCELLED,
                LessonAttendees = new HashSet<LessonAttendee> 
                {
                    updatedAttendee,
                    // LessonAttendee 12 has been Removed
                    insertedAttendee
                }
            };

            service.Update(updatedLesson.Id, updatedLesson);

            this.lessonRepositoryMock.Verify(repository =>
                repository.Update(It.Is<Lesson>(l =>
                    l.Id == updatedLesson.Id
                    && l.Date == updatedLesson.Date
                    && l.StartTime == updatedLesson.StartTime
                    && l.EndTime == updatedLesson.EndTime
                    && l.Status == updatedLesson.Status
                )), Times.Once());

            this.lessonAttendeeRepositoryMock.Verify(repository => 
                repository.Insert(It.Is<LessonAttendee>(la => AreLessonAttendeesEqual(la, insertedAttendee))), Times.Once());

            this.lessonAttendeeRepositoryMock.Verify(repository => 
                repository.Update(It.Is<LessonAttendee>(la => AreLessonAttendeesEqual(la, updatedAttendee))), Times.Once());

            this.lessonAttendeeRepositoryMock.Verify(repository => 
                repository.Delete(It.Is<LessonAttendee>(la => AreLessonAttendeesEqual(la, deletedAttendee))), Times.Once());

            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.Start(), Times.Once());
            this.unitOfWorkMock.Verify(unitOfWork => unitOfWork.End(), Times.Once());
        }

        private bool AreLessonAttendeesEqual(LessonAttendee lessonAttendee1, LessonAttendee lessonAttendee2) 
        {
            return  lessonAttendee1.Id == lessonAttendee2.Id
                    && lessonAttendee1.HasAttended == lessonAttendee2.HasAttended
                    && lessonAttendee1.HasPaid == lessonAttendee2.HasPaid
                    && lessonAttendee1.Price == lessonAttendee2.Price
                    && lessonAttendee1.StudentId == lessonAttendee2.StudentId;
        }
    }
}