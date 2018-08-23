using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tesli.Model.Repositories;
using Tesli.Model.Sqlite;
using Tesli.Model.Sqlite.Repositories;
using Tesli.Services;

namespace Tesli.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc();
            services
                .AddAutoMapper()
                .AddDbContext<DataContext>(options => 
                    options.UseSqlite(Configuration.GetConnectionString("TesliDataContext")))
                .AddScoped(typeof(ICrudService<>), typeof(CrudService<>))
                .AddScoped(typeof(IRepository<>), typeof(Repository<>))
                .AddScoped<IUnitOfWork, UnitOfWork>()
                .AddScoped<ILessonService, LessonService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors(configurePolicy => configurePolicy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();
        }
    }
}
