using MedicalSystem.Domain.Enums;

namespace MedicalSystem.App.Services
{
    public static class MedicineEnumMapper
    {
        public static string ToFrontend(MedicineCategory category) => category switch
        {
            MedicineCategory.Antibiotics => "Антибиотики",
            MedicineCategory.Analgesics => "Анальгетики",
            MedicineCategory.Hormones => "Гормоны",
            MedicineCategory.Cardio => "Кардио",
            MedicineCategory.Antiseptics => "Антисептики",
            _ => "Прочее"
        };

        public static MedicineCategory ToBackendCategory(string category) => category switch
        {
            "Антибиотики" => MedicineCategory.Antibiotics,
            "Анальгетики" => MedicineCategory.Analgesics,
            "Гормоны" => MedicineCategory.Hormones,
            "Кардио" => MedicineCategory.Cardio,
            "Антисептики" => MedicineCategory.Antiseptics,
            _ => MedicineCategory.Other
        };

        public static string ToFrontend(MedicineUnit unit) => unit switch
        {
            MedicineUnit.Ml => "мл",
            MedicineUnit.Mg => "мг",
            MedicineUnit.Tablet => "таблетки",
            MedicineUnit.Capsule => "капсулы",
            MedicineUnit.Ampule => "ампулы",
            MedicineUnit.Vial => "флаконы",
            _ => "ед."
        };

        public static MedicineUnit ToBackendUnit(string unit) => unit?.ToLower() switch
        {
            "мл" => MedicineUnit.Ml,
            "мг" => MedicineUnit.Mg,
            "таблетки" => MedicineUnit.Tablet,
            "табл." => MedicineUnit.Tablet,
            "табл" => MedicineUnit.Tablet,
            "капсулы" => MedicineUnit.Capsule,
            "ампулы" => MedicineUnit.Ampule,
            "амп." => MedicineUnit.Ampule,
            "амп" => MedicineUnit.Ampule,
            "флаконы" => MedicineUnit.Vial,
            "фл." => MedicineUnit.Vial,
            "фл" => MedicineUnit.Vial,
            _ => MedicineUnit.Unit
        };

        public static string ToFrontend(OperationType type) => type switch
        {
            OperationType.Receipt => "Получено",
            OperationType.Writeoff => "Списано",
            _ => "Откорректировано"
        };

        public static OperationType ToBackendOperationType(string type) => type switch
        {
            "Получено" => OperationType.Receipt,
            "Списано" => OperationType.Writeoff,
            _ => OperationType.Adjustment
        };

        public static string? ToFrontend(WriteOffReason? reason) => reason switch
        {
            WriteOffReason.Patient => "Назначено пациенту",
            WriteOffReason.Iv => "Внутривенная процедура",
            WriteOffReason.Im => "Внутримышечная процедура",
            WriteOffReason.Drip => "Капельница",
            WriteOffReason.Adjustment => "Корректировка",
            WriteOffReason.Other => "Другое",
            _ => null
        };

        public static WriteOffReason? ToBackendReason(string? reason) => reason switch
        {
            "Назначено пациенту" => WriteOffReason.Patient,
            "Внутривенная процедура" => WriteOffReason.Iv,
            "Внутримышечная процедура" => WriteOffReason.Im,
            "Капельница" => WriteOffReason.Drip,
            "Корректировка" => WriteOffReason.Adjustment,
            "Другое" => WriteOffReason.Other,
            _ => null
        };

        public static string ToFrontend(MedicineStatus status) => status switch
        {
            MedicineStatus.Norm => "В норме",
            MedicineStatus.Low => "Мало",
            _ => "Отсутствует"
        };
    }
}
