using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace MedicalSystem.API.Services
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(string objectName, Stream contentStream, long size, string contentType, CancellationToken token = default);
        Task<(Stream ContentStream, string ContentType)> DownloadFileAsync(string objectName, CancellationToken token = default);
        Task DeleteFileAsync(string objectName, CancellationToken token = default);
        Task<bool> FileExistsAsync(string objectName, CancellationToken token = default);
    }
}
