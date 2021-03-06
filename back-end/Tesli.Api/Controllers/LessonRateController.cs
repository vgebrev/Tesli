﻿using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Tesli.Model.Entities;
using Tesli.Services;

namespace Tesli.Api.Controllers
{
    [Route("api/[controller]")]
    public class LessonRateController : CrudController<LessonRate>
    {
        public LessonRateController(ICrudService<LessonRate> service, ILogger<LessonRateController> logger) : base(service, logger) 
        { }
    }
}
