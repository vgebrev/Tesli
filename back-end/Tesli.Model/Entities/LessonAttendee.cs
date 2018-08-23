using Newtonsoft.Json;

namespace Tesli.Model.Entities
{
    public class LessonAttendee : IEntity 
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }
        public int LessonId { get; set; }
        [JsonIgnore]
        public virtual Lesson Lesson { get; set; }
        public bool HasAttended { get; set; }
        public bool HasPaid { get; set; }
        public decimal Price { get; set; }
    }
}
