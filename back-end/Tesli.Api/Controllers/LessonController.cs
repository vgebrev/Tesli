using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Tesli.Model.Entities;
using Tesli.Services;

namespace Tesli.Api.Controllers
{
    [Route("api/[controller]")]
    public class LessonController : CrudController<Lesson>
    {
        public LessonController(ICrudService<Lesson> service, ILogger<LessonController> logger) : base(service, logger) 
        { }
    }
}
