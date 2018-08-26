using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;

using Tesli.Model.Entities;
using Tesli.Model.Repositories;

namespace Tesli.Services
{
    public class LessonService : CrudService<Lesson>, ILessonService
    {
        private readonly string propertiesToInclude = $"{nameof(Lesson.LessonAttendees)}.{nameof(LessonAttendee.Student)}";
        private readonly IRepository<Lesson> lessonRepository;
        private readonly IRepository<LessonAttendee> lessonAttendeeRepository;

        public LessonService(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper) 
        { 
            this.lessonRepository = base.repository;
            this.lessonAttendeeRepository = unitOfWork.GetRepository<LessonAttendee>();
        }

        public override IEnumerable<Lesson> GetAll() => base.repository.GetAll(this.propertiesToInclude);

        public override Lesson GetById(int id) => base.repository.GetById(id, propertiesToInclude);

        public override int Insert(Lesson lesson)
        {
            var lessonToInsert = this.GetById(lesson.Id);
            if (lessonToInsert != null)
            {
                throw new ArgumentException($"{EntityName} with Id {lesson.Id} already exists", nameof(lesson));
            }
            lessonToInsert = new Lesson();
            mapper.Map(lesson, lessonToInsert);
            this.unitOfWork.Start();
            lessonToInsert.LessonAttendees = UpsertLessonAttendees(lesson);
            this.lessonRepository.Insert(lessonToInsert);
            this.unitOfWork.End();
            return lesson.Id;
        }
        
        public override void Update(int id, Lesson lesson)
        {
            var existingLesson = this.GetById(id);
            if (existingLesson == null)
            {
                throw new ArgumentException($"{EntityName} with Id {id} not found", nameof(id));
            }
            this.unitOfWork.Start();
            mapper.Map(lesson, existingLesson);
            var updatedLessonAttendees =  UpsertLessonAttendees(lesson);
            DeleteRemovedLessonAttendees(lesson, existingLesson);
            existingLesson.LessonAttendees = updatedLessonAttendees;
            this.lessonRepository.Update(existingLesson);
            this.unitOfWork.End();
        }

        private void DeleteRemovedLessonAttendees(Lesson lesson, Lesson existingLesson)
        {
            var lessonAttendeesToDelete = existingLesson.LessonAttendees.Where(a => a.Id > 0 && !lesson.LessonAttendees.Any(b => a.Id == b.Id));
            foreach (var existingLessonAttendee in lessonAttendeesToDelete)
            {
                this.lessonAttendeeRepository.Delete(existingLessonAttendee);
            }
        }

        private HashSet<LessonAttendee> UpsertLessonAttendees(Lesson lesson)
        {
            var updatedLessonAttendees = new HashSet<LessonAttendee>();
            foreach (var lessonAttendee in lesson.LessonAttendees)
            {
                LessonAttendee existingLessonAttendee = UpsertLessonAttendee(lessonAttendee);
                updatedLessonAttendees.Add(existingLessonAttendee);
            }

            return updatedLessonAttendees;
        }

        private LessonAttendee UpsertLessonAttendee(LessonAttendee lessonAttendee)
        {
            var existingLessonAttendee = this.lessonAttendeeRepository.GetById(lessonAttendee.Id);
            if (existingLessonAttendee == null)
            {
                existingLessonAttendee = new LessonAttendee();
                mapper.Map(lessonAttendee, existingLessonAttendee);
                this.lessonAttendeeRepository.Insert(existingLessonAttendee);
            }
            else
            {
                mapper.Map(lessonAttendee, existingLessonAttendee);
                this.lessonAttendeeRepository.Update(existingLessonAttendee);
            }

            return existingLessonAttendee;
        }
    }
}