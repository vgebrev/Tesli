using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Tesli.Database.Sqlite
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Tesli Database Tool");
            var databaseName = args.Length > 0 ? args[0] : "tesli.db";
            var serviceProvider = new Bootstrapper(databaseName).ServiceProvider;
            var logger = serviceProvider.GetService<ILogger<Program>>();
            
            logger.LogInformation($"Database Name: {databaseName}");

            serviceProvider.GetService<DatabaseService>()
                .Migrate()
                .ApplyScripts();
            
            ((IDisposable)serviceProvider)?.Dispose();
            logger.LogInformation("Done");
        }
    }
}
