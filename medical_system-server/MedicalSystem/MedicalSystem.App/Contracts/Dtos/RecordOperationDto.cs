using System;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class RecordReceiptDto
    {
        public string Date { get; set; }
        public decimal Quantity { get; set; }
        public string Supplier { get; set; }
        public string Comment { get; set; }
    }

    public class RecordWriteoffDto
    {
        public string Date { get; set; }
        public decimal Quantity { get; set; }
        public string Reason { get; set; }
        public Guid? PatientId { get; set; }
        public string? PatientName { get; set; }
        public string Comment { get; set; }
    }
}
