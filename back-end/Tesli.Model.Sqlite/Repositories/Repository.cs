using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Tesli.Model.Entities;
using Tesli.Model.Repositories;

namespace Tesli.Model.Sqlite.Repositories 
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class, IEntity
    {
        private readonly DataContext dataContext;
        private readonly DbSet<TEntity> dbSet;

        public Repository(DataContext dataContext)
        {
            this.dataContext = dataContext;
            this.dbSet = this.dataContext.Set<TEntity>();
        }

        public virtual IEnumerable<TEntity> GetAll() => this.dbSet;

        public virtual IEnumerable<TEntity> GetAll(string navigationPropertyPath) => this.dbSet.Include(navigationPropertyPath);

        public virtual TEntity GetById(int id) => this.dbSet.SingleOrDefault(e => e.Id == id);

        public virtual TEntity GetById(int id, string navigationPropertyPath) => 
            this.dbSet.Include(navigationPropertyPath).SingleOrDefault(e => e.Id == id);

        public virtual void Insert(TEntity entity) => this.dbSet.Add(entity);

        public virtual void Update(TEntity entity) 
        {
            var entry = this.dataContext.Entry(entity);
            entry.State = EntityState.Modified;
        }

        public virtual void Delete(int id) {
            var entityToDelete = this.GetById(id);
            if (entityToDelete == null)
            {
                throw new InvalidOperationException($"Cannot delete entity with Id of {id} because it doesn't exist");
            }
            this.Delete(this.GetById(id));
        }

        public virtual void Delete(TEntity entity)
        {
            var entry = this.dataContext.Entry(entity);
            this.dbSet.Remove(entity);
        }
    }
}