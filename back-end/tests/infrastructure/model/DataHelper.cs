using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Tesli.Model.Entities;
using Tesli.Model.Sqlite;

namespace Tesli.Tests.Infrastructure.Model 
{
    internal class DataHelper
    {
        private readonly DataContext dataContext;
        internal Student[] Students => this.dataContext.Students.ToArray();

        public DataHelper(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        internal DataHelper AddStudents(int count) 
        {
            for (int index = 0; index < count; index++)
            {
                var student = new Student
                {
                    FirstName = this.GetRandomString(minLength: 3, maxLength: 12),
                    Surname = this.GetRandomString(minLength: 4, maxLength: 12),
                };
                this.dataContext.Students.Add(student);
            }
            this.dataContext.SaveChanges();
            return this;
        }

        private string GetRandomString(int minLength = 3, int maxLength = 12)
        {
            return Guid.NewGuid().ToString("n").Substring(0, new Random().Next(minLength, maxLength + 1));
        }

        internal static Student[] SeedStudents(IServiceProvider serviceProvider, int count) 
        {
            var dataHelper = serviceProvider.GetService<DataHelper>();
            dataHelper.AddStudents(count);
            return dataHelper.Students;
        }
    }
}