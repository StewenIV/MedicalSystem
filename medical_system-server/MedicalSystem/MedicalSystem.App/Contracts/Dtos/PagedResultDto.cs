using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}
