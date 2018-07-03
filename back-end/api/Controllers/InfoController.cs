using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Tesli.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InfoController : Controller
    {
        readonly IHostingEnvironment environment;
        readonly IConfiguration configuration;
        public InfoController(IHostingEnvironment environment, IConfiguration configuration)
        {
            this.environment = environment;
            this.configuration = configuration;
        }

        [HttpGet]
        public object Get()
        {
            return new 
            {
                Environment = this.environment.EnvironmentName,
                ConnectionString = this.configuration.GetConnectionString("TesliDataContext")
            };
        }
    }
}