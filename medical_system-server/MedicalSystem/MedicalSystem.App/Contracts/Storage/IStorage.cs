using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MedicalSystem.App.Contracts.Storage
{
    public interface IStorage<TEntity>
    {
        TEntity? Get(Guid id);
        Task<TEntity?> GetAsync(Guid id, CancellationToken token);
        IReadOnlyCollection<TEntity> GetAll();
        Task<IReadOnlyCollection<TEntity>> GetAllAsync(CancellationToken token);
        void Add(TEntity entity);
        Task AddAsync(TEntity entity, CancellationToken token);
        void Update(TEntity entity);
        Task UpdateAsync(TEntity entity, CancellationToken token);
        void Remove(Guid id);
        Task RemoveAsync(Guid id, CancellationToken token);
        bool Exists(Guid id);
        Task<bool> ExistsAsync(Guid id, CancellationToken token);
    }
}
