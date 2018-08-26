using System;
using System.IO;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Tesli.Model.Sqlite;

namespace Tesli.Tests.Infrastructure.Fixtures
{
    public abstract class BaseFixture
    {
        internal IServiceProvider ServiceProvider { get; private set; }
        internal IConfigurationRoot Configuration { get; private set; }
        
        public BaseFixture()
        {
            this.Configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

           ServiceCollectionExtensions.UseStaticRegistration = false;

            var serviceCollection = new ServiceCollection();
            serviceCollection
                .AddAutoMapper()
                .AddLogging();
            this.BootstrapServices(serviceCollection);

            this.ServiceProvider = serviceCollection.BuildServiceProvider();
        }

        protected abstract void BootstrapServices(IServiceCollection serviceCollection);
    }
}