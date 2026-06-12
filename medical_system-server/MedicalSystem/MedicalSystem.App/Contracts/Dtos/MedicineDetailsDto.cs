using System;
using System.Collections.Generic;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class MedicineDetailsDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal MinBalance { get; set; }
        public decimal TotalReceived { get; set; }
        public decimal TotalWrittenOff { get; set; }
        public string? LastReceiptDate { get; set; }
        public string? LastWriteOffDate { get; set; }
        public string? LastReceiptFrom { get; set; }
        public string? LastOperation { get; set; }
        public string? LastChangedBy { get; set; }
        public string? LastUpdated { get; set; }
        public string Status { get; set; }
        public bool IsArchived { get; set; }
        public List<MedicineOperationLogDto> OperationLog { get; set; } = new();
    }

    public class MedicineOperationLogDto
    {
        public string Id { get; set; }
        public string Date { get; set; }
        public string Type { get; set; }
        public decimal Quantity { get; set; }
        public decimal BalanceAfter { get; set; }
        public string PerformedBy { get; set; }
        public string PerformedById { get; set; }
        public string Comment { get; set; }
        public string? PatientId { get; set; }
        public string? PatientName { get; set; }
        public string? PrescriptionId { get; set; }
        public string? Supplier { get; set; }
        public string? Reason { get; set; }
    }
}
