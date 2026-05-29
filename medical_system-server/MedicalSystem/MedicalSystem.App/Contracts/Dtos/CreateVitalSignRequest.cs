using System.ComponentModel.DataAnnotations;

namespace MedicalSystem.App.Contracts.Dtos
{
    public class CreateVitalSignRequest
    {
        [Range(34, 42)]
        public decimal? Temperature { get; set; }

        [Range(70, 250)]
        public short? BloodPressureSystolic { get; set; }

        [Range(40, 150)]
        public short? BloodPressureDiastolic { get; set; }

        [Range(40, 200)]
        public short? Pulse { get; set; }

        [Range(80, 100)]
        public short? SpO2 { get; set; }

        [Range(10, 30)]
        public short? RespiratoryRate { get; set; }
    }
}
