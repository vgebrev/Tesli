using System;
using System.Collections.Generic;

using Tesli.Model.Entities;

namespace Tesli.Services
{
    public interface ICrudService<TEntity> where TEntity: class, IEntity
    {
        IEnumerable<TEntity> GetAll();
        TEntity GetById(int id);
        int Insert(TEntity entity);
        void Update(int id, TEntity entity);
        void Delete(int id);
    }
}
