using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Tesli.Model.Entities;

namespace Tesli.Tests.Infrastructure.Model
{
    public class StudentEqualityComparer : IEqualityComparer<Student>
    {
        public bool Equals(Student x, Student y)
        {
            return JsonConvert.SerializeObject(x) == JsonConvert.SerializeObject(y);
        }

        public int GetHashCode(Student obj)
        {
            return obj.GetHashCode();
        }
    }
}