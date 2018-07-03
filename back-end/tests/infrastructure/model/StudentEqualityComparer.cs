using System;
using System.Collections.Generic;
using Tesli.Model.Entities;

namespace Tesli.Tests.Infrastructure.Model
{
    public class StudentEqualityComparer : IEqualityComparer<Student>
    {
        public bool Equals(Student x, Student y)
        {
            return x.Id == y.Id 
                && x.FirstName == y.FirstName 
                && x.Surname == y.Surname;
        }

        public int GetHashCode(Student obj)
        {
            return obj.GetHashCode();
        }
    }
}