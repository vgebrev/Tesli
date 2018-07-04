using System;
using System.Collections.Generic;
using AutoMapper;

using Tesli.Model.Entities;
using Tesli.Model.Repositories;

namespace Tesli.Services
{
    public class CrudService<TEntity> : ICrudService<TEntity> where TEntity: class, IEntity
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IRepository<TEntity> repository;
        private readonly IMapper mapper;

        public CrudService(IUnitOfWork unitOfWork, IMapper mapper) 
        {
            this.unitOfWork = unitOfWork;
            this.repository = this.unitOfWork.GetRepository<TEntity>();
            this.mapper = mapper;
        }

        public IEnumerable<TEntity> GetAll() => this.repository.GetAll();

        public TEntity GetById(int id) => this.repository.GetById(id);

        public int Insert(TEntity entity)
        {
            var existingEntity = this.GetById(entity.Id);
            if (existingEntity != null)
            {
                throw new ArgumentException($"{EntityName} with Id {entity.Id} already exists", nameof(entity));
            }
            this.unitOfWork.Start();
            this.repository.Insert(entity);
            this.unitOfWork.End();
            return entity.Id;
        }

        public void Update(int id, TEntity entity)
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

        public void Delete(int id)
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

        private string EntityName => typeof(TEntity).Name;
    }
}
