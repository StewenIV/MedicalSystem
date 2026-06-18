using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace MedicalSystem.API.Services
{
    public class MinioFileStorageService : IFileStorageService
    {
        private readonly IMinioClient _minioClient;
        private readonly string _bucketName;

        public MinioFileStorageService(IMinioClient minioClient, IOptions<MinioSettings> settings)
        {
            _minioClient = minioClient;
            _bucketName = settings.Value.DefaultBucket;
        }

        private async Task EnsureBucketExistsAsync(CancellationToken token)
        {
            var existsArgs = new BucketExistsArgs().WithBucket(_bucketName);
            var found = await _minioClient.BucketExistsAsync(existsArgs, token);
            if (!found)
            {
                var makeArgs = new MakeBucketArgs().WithBucket(_bucketName);
                await _minioClient.MakeBucketAsync(makeArgs, token);
            }
        }

        public async Task<string> UploadFileAsync(string objectName, Stream contentStream, long size, string contentType, CancellationToken token = default)
        {
            await EnsureBucketExistsAsync(token);

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithStreamData(contentStream)
                .WithObjectSize(size)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs, token);
            return objectName;
        }

        public async Task<(Stream ContentStream, string ContentType)> DownloadFileAsync(string objectName, CancellationToken token = default)
        {
            await EnsureBucketExistsAsync(token);

            string contentType = "application/octet-stream";
            try
            {
                var statObjectArgs = new StatObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName);
                var stat = await _minioClient.StatObjectAsync(statObjectArgs, token);
                contentType = stat.ContentType;
            }
            catch
            {
                
            }

            var memoryStream = new MemoryStream();
            var getObjectArgs = new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithCallbackStream(stream =>
                {
                    stream.CopyTo(memoryStream);
                });

            await _minioClient.GetObjectAsync(getObjectArgs, token);
            memoryStream.Position = 0;

            return (memoryStream, contentType);
        }

        public async Task DeleteFileAsync(string objectName, CancellationToken token = default)
        {
            await EnsureBucketExistsAsync(token);

            var removeObjectArgs = new RemoveObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName);

            await _minioClient.RemoveObjectAsync(removeObjectArgs, token);
        }

        public async Task<bool> FileExistsAsync(string objectName, CancellationToken token = default)
        {
            await EnsureBucketExistsAsync(token);

            try
            {
                var statObjectArgs = new StatObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName);
                await _minioClient.StatObjectAsync(statObjectArgs, token);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
