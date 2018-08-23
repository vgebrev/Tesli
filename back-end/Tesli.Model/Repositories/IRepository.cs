using System;
using System.Collections.Generic;
using Tesli.Model.Entities;

namespace Tesli.Model.Repositories
{
    public interface IRepository<TEntity> where TEntity : class, IEntity
    {
        IEnumerable<TEntity> GetAll();
        IEnumerable<TEntity> GetAll(string navigationPropertyPath);
        TEntity GetById(int id);
        TEntity GetById(int id, string navigationPropertyPath);
        void Insert(TEntity entity);
        void Update(TEntity entity);
        void Delete(int id);
        void Delete(TEntity entity);
    }
}
