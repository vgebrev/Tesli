using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Tesli.Model.Entities;
using Tesli.Services;

namespace Tesli.Api.Controllers
{
    [ApiController]
    public class CrudController<TEntity> : Controller where TEntity : class, IEntity
    {
        protected virtual ICrudService<TEntity> Service { get; private set; }
        protected virtual ILogger<CrudController<TEntity>> Logger { get; private set; }
        public CrudController(ICrudService<TEntity> service, ILogger<CrudController<TEntity>> logger) 
        {
            this.Service = service;
            this.Logger = logger;
        }

        [HttpGet]
        public virtual IEnumerable<TEntity> Get()
        {
            var result = this.Service.GetAll();
            this.Logger.LogInformation($"Returning {result.Count()} items");
            return result;
        }

        [HttpGet("{id}", Name = nameof(ICrudService<TEntity>.GetById))]
        public virtual ActionResult<TEntity> Get(int id)
        {
            var entity = this.Service.GetById(id);
            if (entity == null)
            {
                this.Logger.LogWarning($"{EntityName} with Id {id} not found");
                return NotFound();
            }

            this.Logger.LogInformation($"Result: {Json(entity)}");
            return entity;
        }

        [HttpPost]
        public virtual ActionResult<TEntity> Post([FromBody]TEntity value)
        {
            var existingEntity = this.Service.GetById(value.Id);
            if (existingEntity != null)
            {
                this.Logger.LogWarning($"{EntityName} with Id {value.Id} is a duplicate of: {Json(existingEntity)}");
                return Conflict(new DuplicateEntityError<TEntity>(existingEntity));
            }
            var id = this.Service.Insert(value);
            var newEntity = this.Service.GetById(id);
            this.Logger.LogInformation($"Inserted with Id {id}. Value: {Json(newEntity)}");
            return CreatedAtRoute(nameof(ICrudService<TEntity>.GetById), new { id = id }, newEntity);
        }

        [HttpPut("{id}")]
        public virtual IActionResult Put(int id, [FromBody]TEntity value)
        {
            var entity = this.Service.GetById(id);
            if (entity == null)
            {
                this.Logger.LogWarning($"{EntityName} with Id {id} not found");
                return NotFound();
            }
            this.Service.Update(id, value);
            this.Logger.LogInformation($"Updated {EntityName} with Id {id}. Old Value: {Json(entity)}. New Value: {Json(value)}");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public virtual IActionResult Delete(int id)
        {
            var entity = this.Service.GetById(id);
            if (entity == null)
            {
                this.Logger.LogWarning($"{EntityName} with Id {id} not found");
                return NotFound();
            }
            this.Service.Delete(id);
            this.Logger.LogInformation($"Deleted {EntityName} with Id {id}. Value: {Json(entity)}");
            return NoContent();
        }

        private string EntityName => typeof(TEntity).Name;
        private string Json(TEntity entity) => JsonConvert.SerializeObject(entity);
    }
}