using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Tesli.Model.Entities;
using Tesli.Services;

namespace Tesli.Api.Controllers
{
    [Route("api/[controller]")]
    public class StudentController : CrudController<Student>
    {
        public StudentController(ICrudService<Student> service, ILogger<StudentController> logger) : base(service, logger) 
        { }
    }
}
