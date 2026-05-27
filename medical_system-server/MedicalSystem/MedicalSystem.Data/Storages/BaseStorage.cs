using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.Data.DbContext;
using Microsoft.EntityFrameworkCore;

namespace MedicalSystem.Data.Storages
{
    public class BaseStorage<TEntity> : IStorage<TEntity> where TEntity : class
    {
        protected readonly MedicalSystemDbContext _context;
        protected readonly DbSet<TEntity> _dbSet;

        public BaseStorage(MedicalSystemDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }

        public virtual async Task AddAsync(TEntity entity, CancellationToken token)
        {
            await _dbSet.AddAsync(entity, token);
            await _context.SaveChangesAsync(token);
        }

        public virtual async Task<TEntity?> GetAsync(Guid id, CancellationToken token)
        {
            return await _dbSet.FindAsync(new object[] { id }, token);
        }

        public virtual async Task<IReadOnlyCollection<TEntity>> GetAllAsync(CancellationToken token)
        {
            return await _dbSet.ToListAsync(token);
        }

        public virtual async Task RemoveAsync(Guid id, CancellationToken token)
        {
            var entity = await GetAsync(id, token);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync(token);
            }
        }

        public virtual async Task UpdateAsync(TEntity entity, CancellationToken token)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync(token);
        }

        public virtual async Task<bool> ExistsAsync(Guid id, CancellationToken token)
        {
            var entity = await GetAsync(id, token);
            return entity != null;
        }

        public void Add(TEntity entity) => throw new NotImplementedException();
        public TEntity? Get(Guid id) => throw new NotImplementedException();
        public IReadOnlyCollection<TEntity> GetAll() => throw new NotImplementedException();
        public void Remove(Guid id) => throw new NotImplementedException();
        public void Update(TEntity entity) => throw new NotImplementedException();
        public bool Exists(Guid id) => throw new NotImplementedException();
    }
}
