using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Storage;
using Tesli.Model.Repositories;

namespace Tesli.Model.Sqlite.Repositories 
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext dataContext;
        private IDbContextTransaction transaction;
        private Hashtable repositories;

        public UnitOfWork(DataContext dataContext) 
        {
            this.dataContext = dataContext;
            this.repositories = new Hashtable();
        }

        public void Start()
        {
            this.transaction = this.dataContext.Database.BeginTransaction();
        }

        public void End()
        {
           try 
           {
               this.dataContext.SaveChanges();
               this.transaction?.Commit();
           } 
           catch 
           {
               this.transaction?.Rollback();
               throw;
           }
        }

        IRepository<TEntity> IUnitOfWork.GetRepository<TEntity>()
        {
            var entityType = typeof(TEntity);
            if (this.repositories.ContainsKey(entityType))
                return (IRepository<TEntity>)this.repositories[entityType];

            var repositoryType = typeof(Repository<>);
            var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(entityType), this.dataContext);
            this.repositories.Add(entityType, repositoryInstance);
            return (IRepository<TEntity>)this.repositories[entityType];
        }

        public void Dispose() => this.transaction?.Dispose();
    }
}