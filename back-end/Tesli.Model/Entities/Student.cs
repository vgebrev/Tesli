using System;
using System.Collections.Generic;

namespace Tesli.Model.Entities
{
    public class Student : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public byte? Grade { get; set; }
        public string School { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Goals { get; set; }
        public string ParentName { get; set; }
        public string Address { get; set; }
        public string ParentContactNumber { get; set; }
        public string ParentEmail { get; set; }
        public virtual ICollection<LessonAttendee> LessonAttendees { get; set; } = new HashSet<LessonAttendee>();
    }
}
