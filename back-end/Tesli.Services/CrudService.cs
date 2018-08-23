using System;
using System.Collections.Generic;
using AutoMapper;

using Tesli.Model.Entities;
using Tesli.Model.Repositories;

namespace Tesli.Services
{
    public class CrudService<TEntity> : ICrudService<TEntity> where TEntity: class, IEntity
    {
        protected readonly IUnitOfWork unitOfWork;
        protected readonly IRepository<TEntity> repository;
        protected readonly IMapper mapper;

        public CrudService(IUnitOfWork unitOfWork, IMapper mapper) 
        {
            this.unitOfWork = unitOfWork;
            this.repository = this.unitOfWork.GetRepository<TEntity>();
            this.mapper = mapper;
        }

        public virtual IEnumerable<TEntity> GetAll() => this.repository.GetAll();

        public virtual TEntity GetById(int id) => this.repository.GetById(id);

        public virtual int Insert(TEntity entity)
        {
            var entityToInsert = this.GetById(entity.Id);
            if (entityToInsert != null)
            {
                throw new ArgumentException($"{EntityName} with Id {entity.Id} already exists", nameof(entity));
            }
            entityToInsert = (TEntity)Activator.CreateInstance(typeof(TEntity));
            Mapper.Map(entity, entityToInsert);
            this.unitOfWork.Start();
            this.repository.Insert(entityToInsert);
            this.unitOfWork.End();
            return entity.Id;
        }

        public virtual void Update(int id, TEntity entity)
        {
            var entityToUpdate = this.GetById(id);
            if (entityToUpdate == null) 
            {
                throw new ArgumentException($"{EntityName} with Id {id} not found", nameof(id));
            }
            this.unitOfWork.Start();
            mapper.Map(entity, entityToUpdate);
            this.repository.Update(entityToUpdate);
            this.unitOfWork.End();
        }

        public virtual void Delete(int id)
        {
            var entityToDelete = this.GetById(id);
            if (entityToDelete == null) 
            {
                throw new ArgumentException($"{EntityName} with Id {id} not found", nameof(id));
            }

            this.unitOfWork.Start();
            this.repository.Delete(entityToDelete);
            this.unitOfWork.End();
        }

        protected string EntityName => typeof(TEntity).Name;
    }
}
