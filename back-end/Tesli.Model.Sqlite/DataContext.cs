﻿using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Tesli.Model.Entities;

namespace Tesli.Model.Sqlite
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
        public DbSet<Student> Students { get; set; }
        public DbSet<LessonRate> LessonRates { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<LessonAttendee> LessonAttendees { get; set;}
    }
}
