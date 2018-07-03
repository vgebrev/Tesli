using Tesli.Model.Entities;

namespace Tesli.Api
{
    public class DuplicateEntityError<TEntity> where TEntity : class, IEntity
    {
        public TEntity Entity { get; set; }
        public string Message => $"{typeof(TEntity).Name} with Id {Entity.Id} already exists";
        public DuplicateEntityError(TEntity entity)
        {
            this.Entity = entity;
        }
    }
}