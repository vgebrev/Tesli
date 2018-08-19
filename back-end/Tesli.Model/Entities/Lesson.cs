using System;
using System.Collections.Generic;

namespace Tesli.Model.Entities 
{
    public class Lesson : IEntity
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public virtual ICollection<LessonAttendee> LessonAttendees { get; set; } = new HashSet<LessonAttendee>();
        public string Status { get; set; }
    }
}