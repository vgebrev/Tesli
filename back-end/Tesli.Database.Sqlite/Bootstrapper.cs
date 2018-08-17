using System;
using System.IO;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;

using Tesli.Model.Sqlite;

namespace Tesli.Database.Sqlite
{
    public class Bootstrapper 
    {
        public IConfigurationRoot Configuration { get; private set; }

        public IServiceProvider ServiceProvider { get; private set; }

        private string DatabaseName { get; set; }

        public Bootstrapper(string databaseName = "tesli.db") 
        {
            this.DatabaseName = databaseName;

            this.Configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            var serviceCollection = new ServiceCollection();
            serviceCollection
                .AddLogging(logging =>
                {
                    logging.AddConfiguration(this.Configuration.GetSection("Logging"));
                    logging.AddConsole();
                    logging.AddDebug();
                })
                .Configure<LoggerFilterOptions>(options => options.MinLevel = LogLevel.Trace);

            this.BootstrapServices(serviceCollection);

            this.ServiceProvider = serviceCollection.BuildServiceProvider();
        }

        protected void BootstrapServices(IServiceCollection serviceCollection)
        {
            var connectionString = String.Format(Configuration["ConnectionStringTemplate"], this.DatabaseName);

            serviceCollection
                .AddDbContext<DataContext>(options => 
                    options.UseSqlite(connectionString))
                .AddScoped<DatabaseService>()
                .AddScoped<ScriptService>();
        }
    }
}