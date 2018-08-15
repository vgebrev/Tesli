using System;
using System.IO;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

using Tesli.Model.Repositories;
using Tesli.Model.Sqlite;
using Tesli.Model.Sqlite.Repositories;
using Tesli.Tests.Infrastructure.Model;

namespace Tesli.Tests.Infrastructure.Fixtures
{
    public class SqliteFixture : BaseFixture
    {
        internal void DatabaseTest(Action<DataContext, IServiceProvider> testAction)
        {
            using (var scope = this.ServiceProvider.CreateScope())
            {
                var dataContext = scope.ServiceProvider.GetService<DataContext>();
                dataContext.Database.OpenConnection();
                dataContext.Database.EnsureCreated();
                var unitOfWork = scope.ServiceProvider.GetService<IUnitOfWork>(); 
                try 
                {
                    testAction(dataContext, scope.ServiceProvider);
                } 
                finally 
                {
                    dataContext.Database.CloseConnection();
                    dataContext.Database.EnsureDeleted();
                }
            }
        }

        protected override void BootstrapServices(IServiceCollection serviceCollection) 
        {
            serviceCollection
                .AddDbContext<DataContext>(options => 
                    options.UseSqlite(Configuration.GetConnectionString("TesliDataContext")))
                .AddScoped<IUnitOfWork, UnitOfWork>()
                .AddScoped(typeof(IRepository<>), typeof(Repository<>))
                .AddScoped<DataHelper>();  
        }
    }

    [CollectionDefinition("Sqlite Fixture")]
    public class SqliteFixtureCollection : ICollectionFixture<SqliteFixture> 
    { }
}