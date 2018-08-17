using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Tesli.Model.Sqlite;

namespace Tesli.Database.Sqlite
{
    public class ScriptService 
    {
        private const string SCRIPT_HISTORY_CREATE = "__ScriptHistory.Create.sql";
        private readonly DataContext DataContext;
        private readonly ILogger<ScriptService> Logger;

        public ScriptService(DataContext dataContext, ILogger<ScriptService> logger)
        {
            this.DataContext = dataContext;
            this.Logger = logger;
        }

        public ScriptService CreateScriptHistoryTable()
        {
            this.Logger.LogInformation("Creating Script History Table");
            var createHistoryTableSqlFile = Path.Combine("Scripts", SCRIPT_HISTORY_CREATE);
            this.DataContext.Database.ExecuteSqlCommand(File.ReadAllText(createHistoryTableSqlFile));
            return this;
        }

        public ScriptService ApplyScripts()
        {
            this.Logger.LogInformation("Applying scripts");
            var scripts = Directory.EnumerateFiles("Scripts", "*.sql").Where(script => Path.GetFileName(script) != SCRIPT_HISTORY_CREATE);

            using (var connection = this.GetOpenConnection())
            using (var transaction = connection.BeginTransaction()) 
            {
                try 
                {
                    ApplyScripts(connection, transaction, scripts);
                    transaction.Commit();
                } 
                catch 
                {
                    transaction.Rollback();
                    throw;
                }
            }
            return this;
        }

        private DbConnection GetOpenConnection()
        {
            var connection = this.DataContext.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
            }
            return connection;
        }
        
        private bool HasScriptAlreadyBeenApplied(DbConnection connection, DbTransaction transaction, DbParameter scriptNameParameter)
        {
            var result = true;
            using (var command = connection.CreateCommand()) 
            {
                command.CommandText = "SELECT COUNT(1) FROM __ScriptHistory WHERE Name = $scriptName";
                command.Parameters.Add(scriptNameParameter);
                command.Transaction = transaction;
                result = Convert.ToInt64(command.ExecuteScalar()) != 0;
                this.Logger.LogInformation($"Has Script Already Been Applied: {result}");
            }
            return result;
        }

        private void ApplyScripts(DbConnection connection, DbTransaction transaction, IEnumerable<string> scripts)
        {
            var index = 1;
            foreach (var script in scripts)
            {
                var scriptNameParameter = new SqliteParameter("$scriptName", Path.GetFileNameWithoutExtension(script));
                this.Logger.LogInformation($"Applying {script} ({index++} of {scripts.Count()})");
                
                if (HasScriptAlreadyBeenApplied(connection, transaction, scriptNameParameter)) 
                {
                    continue;
                }

                this.Logger.LogInformation("Executing Script SQL");
                this.DataContext.Database.ExecuteSqlCommand(File.ReadAllText(script));
                this.Logger.LogInformation("Adding Script to Script History");
                this.DataContext.Database.ExecuteSqlCommand("INSERT INTO __ScriptHistory (Name) VALUES ($scriptName)", scriptNameParameter);
            } 
        }
    }
}