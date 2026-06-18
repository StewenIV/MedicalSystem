namespace MedicalSystem.API.Services
{
    public class MinioSettings
    {
        public string Endpoint { get; set; } = "localhost:9000";
        public string AccessKey { get; set; } = "minioadmin";
        public string SecretKey { get; set; } = "minioadmin123";
        public bool Secure { get; set; } = false;
        public string DefaultBucket { get; set; } = "medical-files";
    }
}
