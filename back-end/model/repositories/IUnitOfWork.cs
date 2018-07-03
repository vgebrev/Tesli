using System;
using System.Collections.Generic;
using Tesli.Model.Entities;

namespace Tesli.Model.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        void Start();
        void End();
        IRepository<TEntity> GetRepository<TEntity>() where TEntity: class, IEntity;
    }
}