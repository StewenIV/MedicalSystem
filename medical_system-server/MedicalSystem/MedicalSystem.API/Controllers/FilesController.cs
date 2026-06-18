using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using MedicalSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MedicalSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;

        public FilesController(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadFile(IFormFile file, CancellationToken token)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Файл не предоставлен или пуст." });
            }

            const long maxFileSize = 15 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                return BadRequest(new { message = "Размер файла превышает допустимый лимит (15 МБ)." });
            }

            try
            {
                var extension = Path.GetExtension(file.FileName);
                var uniqueName = $"{Guid.NewGuid()}{extension}";

                using (var stream = file.OpenReadStream())
                {
                    await _fileStorageService.UploadFileAsync(
                        uniqueName,
                        stream,
                        file.Length,
                        file.ContentType,
                        token
                    );
                }

                var downloadUrl = $"/api/files/download/{uniqueName}";

                return Ok(new
                {
                    fileName = file.FileName,
                    objectName = uniqueName,
                    contentType = file.ContentType,
                    url = downloadUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Ошибка при загрузке файла: {ex.Message}" });
            }
        }

        [HttpGet("download/{objectName}")]
        [AllowAnonymous]
        public async Task<IActionResult> DownloadFile(string objectName, CancellationToken token)
        {
            if (string.IsNullOrWhiteSpace(objectName))
            {
                return BadRequest(new { message = "Имя объекта не указано." });
            }

            try
            {
                var (stream, contentType) = await _fileStorageService.DownloadFileAsync(objectName, token);
                
                return File(stream, contentType);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = $"Файл не найден или недоступен: {ex.Message}" });
            }
        }
    }
}
