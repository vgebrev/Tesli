using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using Tesli.Model.Sqlite;

namespace Tesli.Database.Sqlite 
{
    public class DatabaseService
    {
        private readonly DataContext DataContext;
        private readonly ScriptService ScriptService;
        private readonly ILogger<DatabaseService> Logger;

        public DatabaseService(DataContext dataContext, ScriptService scriptService, ILogger<DatabaseService> logger)
        {
            this.DataContext = dataContext;
            this.ScriptService = scriptService;
            this.Logger = logger;
        }

        public DatabaseService Migrate()
        {
            this.Logger.LogInformation("Migrating Database");
            this.DataContext.Database.Migrate();
            return this;
        }

        public DatabaseService ApplyScripts()
        {
            this.Logger.LogInformation("Applying Scripts");
            this.ScriptService
                .CreateScriptHistoryTable()
                .ApplyScripts();
            return this;
        }
    }
}