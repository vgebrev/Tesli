using System;

namespace Tesli.Model.Entities 
{
    public class LessonRate : IEntity 
    {
        public int Id { get; set; }
        public DateTime EffectiveDate { get; set; }
        public int NumberOfStudents { get; set; }
        public decimal Price { get; set; }
    }
}