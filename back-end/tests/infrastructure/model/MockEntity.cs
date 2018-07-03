using System;
using Tesli.Model.Entities;

namespace Tesli.Tests.Model 
{
    public class MockEntity : IEntity
    {
        public int Id { get; set; }
        public string StringProperty { get; set; }
        public int IntegerProperty { get; set; }
        public DateTime DateTimeProperty { get; set; }
        public decimal? NullableDecimalProperty { get; set; }
    }
}