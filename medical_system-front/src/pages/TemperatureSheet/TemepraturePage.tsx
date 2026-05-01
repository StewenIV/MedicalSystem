import { useState } from 'react';
import {
  Thermometer,
  Activity,
  Heart,
  Droplet,
  Save,
  FileLineChart,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Thermometer as ThermometerIcon,
  FileText,
  User,
  Home,
  Calendar
} from 'lucide-react';

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { toast } from 'react-toastify';
import { mockHospitalBeds } from 'data/mockData';
import { VitalSign } from 'data/mockData';
import { mockPathientVitalSigns } from 'data/mockData';
import { mockReferenceVitalSings } from 'data/mockData';
import { z } from 'zod';
import Select, { components, DropdownIndicatorProps, StylesConfig } from 'react-select';

import {
  Content,
  TwoColumnGrid,
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  FieldLabel,
  FieldLabelIcon,
  BpGrid,
  OpenSheetBtn,
  SaveBtn,
  Container,
  StyledCard,
  HeaderRow,
  HeaderLeft,
  Title,
  CardContent,
  InfoGrid,
  InfoItem,
  InfoText,
  InfoLabel,
  InfoValue
} from './styled';

import Input from 'components/Input/index';
import colors from 'consts/colors';

type VitalSignField =
  | 'temperature'
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'pulse'
  | 'spo2'
  | 'respiratoryRate';

const NORMAL_RANGES: Record<string, { min: number; max: number; label: string; unit: string }> = {
  temperature: { min: 36.0, max: 37.2, label: 'Температура', unit: '°C' },
  bloodPressureSystolic: { min: 100, max: 130, label: 'АД систолическое', unit: 'мм рт. ст.' },
  bloodPressureDiastolic: { min: 60, max: 90, label: 'АД диастолическое', unit: 'мм рт. ст.' },
  pulse: { min: 65, max: 95, label: 'Пульс', unit: 'уд/мин' },
  spo2: { min: 95, max: 100, label: 'Сатурация', unit: '%' },
  respiratoryRate: { min: 12, max: 20, label: 'Частота дыхания', unit: 'дых/мин' }
};

const VITAL_RULES: Record<
  VitalSignField,
  { label: string; min: number; max: number; integerOnly?: boolean }
> = {
  temperature: {
    label: 'Температура',
    min: 34,
    max: 42,
    integerOnly: false
  },
  bloodPressureSystolic: {
    label: 'Систолическое давление',
    min: 70,
    max: 250,
    integerOnly: true
  },
  bloodPressureDiastolic: {
    label: 'Диастолическое давление',
    min: 40,
    max: 150,
    integerOnly: true
  },
  pulse: {
    label: 'Пульс',
    min: 30,
    max: 220,
    integerOnly: true
  },
  spo2: {
    label: 'Сатурация',
    min: 50,
    max: 100,
    integerOnly: true
  },
  respiratoryRate: {
    label: 'Частота дыхания',
    min: 5,
    max: 60,
    integerOnly: true
  }
};

const createFieldErrors = (): Record<VitalSignField, string> => ({
  temperature: '',
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  pulse: '',
  spo2: '',
  respiratoryRate: ''
});

const getPulseSegments = (pulse: number) => {
  const min = NORMAL_RANGES.pulse.min;
  const max = NORMAL_RANGES.pulse.max;

  if (pulse < min) {
    return { pulseRange: 0, pulseUpper: pulse };
  }

  if (pulse <= max) {
    return { pulseRange: pulse, pulseUpper: 0 };
  }

  return { pulseRange: max, pulseUpper: pulse - max };
};

const getBloodPressureSegments = (systolic: number, diastolic: number) => {
  const min = NORMAL_RANGES.bloodPressureDiastolic.min;
  const max = NORMAL_RANGES.bloodPressureSystolic.max;
  const start = Math.min(diastolic, systolic);
  const end = Math.max(diastolic, systolic);

  const below = Math.max(Math.min(end, min) - start, 0);
  const normalStart = Math.max(start, min);
  const normalEnd = Math.min(end, max);
  const normal = Math.max(normalEnd - normalStart, 0);
  const above = Math.max(end - Math.max(start, max), 0);

  return {
    bpBase: start,
    bpLow: below,
    bpNormal: normal,
    bpHigh: above
  };
};

const createVitalFieldSchema = (field: VitalSignField) => {
  const rule = VITAL_RULES[field];

  return z
    .string()
    .trim()
    .min(1, `${rule.label}: введите числовое значение`)
    .refine(
      (value) => Number.isFinite(Number(value.replace(',', '.'))),
      `${rule.label}: введите числовое значение`
    )
    .refine(
      (value) => !rule.integerOnly || Number.isInteger(Number(value.replace(',', '.'))),
      `${rule.label}: допустимы только целые числа`
    )
    .refine((value) => {
      const numberValue = Number(value.replace(',', '.'));
      return numberValue >= rule.min && numberValue <= rule.max;
    }, `${rule.label}: диапазон ${rule.min}-${rule.max}`);
};

const vitalFieldSchemas: Record<VitalSignField, ReturnType<typeof createVitalFieldSchema>> = {
  temperature: createVitalFieldSchema('temperature'),
  bloodPressureSystolic: createVitalFieldSchema('bloodPressureSystolic'),
  bloodPressureDiastolic: createVitalFieldSchema('bloodPressureDiastolic'),
  pulse: createVitalFieldSchema('pulse'),
  spo2: createVitalFieldSchema('spo2'),
  respiratoryRate: createVitalFieldSchema('respiratoryRate')
};

const vitalSignsSchema = z.object(vitalFieldSchemas);

const mapZodErrors = (error: z.ZodError): Record<VitalSignField, string> => {
  const nextErrors = createFieldErrors();

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key !== 'string' || !(key in nextErrors)) {
      continue;
    }

    const field = key as VitalSignField;
    if (!nextErrors[field]) {
      nextErrors[field] = issue.message;
    }
  }

  return nextErrors;
};

const CustomTempDot = (props: any) => {
  const { cx, cy, payload } = props;
  const abnormal =
    payload.temperature > NORMAL_RANGES.temperature.max ||
    payload.temperature < NORMAL_RANGES.temperature.min ||
    payload.spo2 > NORMAL_RANGES.spo2.max ||
    payload.spo2 < NORMAL_RANGES.spo2.min ||
    payload.respiratoryRate > NORMAL_RANGES.respiratoryRate.max ||
    payload.respiratoryRate < NORMAL_RANGES.respiratoryRate.min;

  if (props.dataKey === 'temperature') {
    return (
      <g>
        {abnormal && (
          <>
            <circle cx={cx} cy={cy} r={13} fill="#ef4444" fillOpacity={0.12} />
            <circle cx={cx} cy={cy} r={9} fill="#ef4444" fillOpacity={0.2} />
          </>
        )}
        <circle cx={cx} cy={cy} r={abnormal ? 6 : 4} fill={abnormal ? '#ef4444' : '#f97316'} />
      </g>
    );
  }

  if (props.dataKey === 'spo2') {
    return (
      <g>
        {abnormal && (
          <>
            <circle cx={cx} cy={cy} r={14} fill="#3b82f6" fillOpacity={0.15} />
            <circle cx={cx} cy={cy} r={9} fill="#3b82f6" fillOpacity={0.25} />
          </>
        )}

        <circle
          cx={cx}
          cy={cy}
          r={abnormal ? 6 : 4}
          fill={abnormal ? '#1d4ed8' : '#60a5fa'}
          stroke={abnormal ? '#fff' : 'none'}
          strokeWidth={2}
        />
      </g>
    );
  }
  if (props.dataKey === 'respiratoryRate') {
    return (
      <g>
        {abnormal && (
          <>
            <circle cx={cx} cy={cy} r={14} fill="#10b981" fillOpacity={0.15} />
            <circle cx={cx} cy={cy} r={9} fill="#10b981" fillOpacity={0.25} />
          </>
        )}
        <circle
          cx={cx}
          cy={cy}
          r={abnormal ? 6 : 4}
          fill={abnormal ? '#059669' : '#34d399'}
          stroke={abnormal ? '#fff' : 'none'}
          strokeWidth={2}
        />
      </g>
    );
  }

  return null;
};

const CustomTempActiveDot = (props: any) => {
  const { cx, cy, payload } = props;
  const abnormal =
    payload.temperature > NORMAL_RANGES.temperature.max ||
    payload.temperature < NORMAL_RANGES.temperature.min;
  return <circle cx={cx} cy={cy} r={7} fill={abnormal ? '#ef4444' : '#f97316'} />;
};

interface PatientOption {
  value: string;
  label: string;
}

const DropdownIndicator = (props: DropdownIndicatorProps<PatientOption, false>) => {
  return <components.DropdownIndicator {...props}></components.DropdownIndicator>;
};

const patientSelectStyles: StylesConfig<PatientOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    borderRadius: '8px',
    borderColor: state.isFocused ? colors.button : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: state.isFocused ? colors.button : '#9ca3af'
    }
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px 0 12px'
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '14px'
  }),
  input: (base) => ({
    ...base,
    color: '#111827',
    fontSize: '14px'
  }),
  singleValue: (base) => ({
    ...base,
    color: '#111827',
    fontSize: '14px'
  }),
  indicatorsContainer: (base) => ({
    ...base,
    paddingRight: '5px'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? colors.mainColor : '#64748b',
    padding: '2px',
    margin: '0 4px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: state.selectProps.menuIsOpen ? '#eaf1ff' : '#f8fafc',
    transition: 'all 0.15s ease',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      color: colors.mainColor,
      backgroundColor: '#eaf1ff',
      borderColor: '#c7d2fe'
    },

    svg: {
      width: '14px',
      height: '14px'
    }
  }),
  menu: (base) => ({
    ...base,
    marginTop: '6px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
    overflow: 'hidden'
  }),
  menuList: (base) => ({
    ...base,
    padding: '6px'
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: '7px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? colors.mainColor : state.isFocused ? '#eff6ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    transition: 'all 0.15s ease',
    ':active': {
      backgroundColor: state.isSelected ? colors.mainColor : '#dbeafe'
    }
  })
};

interface NurseWorkplaceProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  userRole: 'doctor' | 'nurse' | 'patient' | null;
}

type TrendDir = 'up' | 'down' | 'stable';

const TREND_META: {
  field: keyof Omit<VitalSign, 'id' | 'date'>;
  label: string;
  goodDir: TrendDir | 'any';
}[] = [
  { field: 'temperature', label: 'Темп.', goodDir: 'any' },
  { field: 'pulse', label: 'Пульс', goodDir: 'any' },
  { field: 'bloodPressureSystolic', label: 'АД с.', goodDir: 'any' },
  { field: 'bloodPressureDiastolic', label: 'АД д.', goodDir: 'any' },
  { field: 'respiratoryRate', label: 'ЧД', goodDir: 'any' },
  { field: 'spo2', label: 'SpO₂ (%)', goodDir: 'up' }
];

const TemperaturePage: React.FC<NurseWorkplaceProps> = ({ onNavigate, onLogout, userRole }) => {
  const [patientsVitals, setPatientsVitals] =
    useState<Record<string, VitalSign[]>>(mockPathientVitalSigns);
  const [referenceVitals, setReferenceVitals] =
    useState<Record<string, VitalSign[]>>(mockReferenceVitalSings);
  const [hospitalBeds, setHospitalBeds] = useState(mockHospitalBeds);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [showTemperatureSheet, setShowTemperatureSheet] = useState(true);
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulse: '',
    spo2: '',
    respiratoryRate: ''
  });
  const [fieldErrors, setFieldErrors] =
    useState<Record<VitalSignField, string>>(createFieldErrors());

  const spoRespiratoryRate = (patientsVitals[selectedPatientId] || []).map((item) => ({
    name: item.date,
    spo2: item.spo2,
    respiratoryRate: item.respiratoryRate
  }));

  const chartData = (patientsVitals[selectedPatientId] || []).map((item) => {
    const pulseSegments = getPulseSegments(item.pulse);
    const bpSegments = getBloodPressureSegments(
      item.bloodPressureSystolic,
      item.bloodPressureDiastolic
    );

    return {
      ...item,
      name: item.date,
      pulseBase: 0,
      pulseRange: pulseSegments.pulseRange,
      pulseUpper: pulseSegments.pulseUpper,
      bpBase: bpSegments.bpBase,
      bpLow: bpSegments.bpLow,
      bpNormal: bpSegments.bpNormal,
      bpHigh: bpSegments.bpHigh,
      bpsUpper: NORMAL_RANGES.bloodPressureSystolic.max,
      bpsLower: NORMAL_RANGES.bloodPressureSystolic.min,
      bpdUpper: NORMAL_RANGES.bloodPressureDiastolic.max,
      bpdLower: NORMAL_RANGES.bloodPressureDiastolic.min
    };
  });

  const referenceData = referenceVitals['Good']?.map((item) => {
    const pulseSegments = getPulseSegments(item.pulse);
    const bpSegments = getBloodPressureSegments(
      item.bloodPressureSystolic,
      item.bloodPressureDiastolic
    );

    return {
      ...item,
      name: item.date,
      pulseBase: 0,
      pulseRange: pulseSegments.pulseRange,
      pulseUpper: pulseSegments.pulseUpper,
      bpBase: bpSegments.bpBase,
      bpLow: bpSegments.bpLow,
      bpNormal: bpSegments.bpNormal,
      bpHigh: bpSegments.bpHigh,
      spo2: item.spo2,
      respiratoryRate: item.respiratoryRate
    };
  });

  const patientVitalsList = patientsVitals[selectedPatientId] || [];
  const latestVitals = patientVitalsList.at(-1) ?? null;
  const previousVitals = patientVitalsList.at(-2) ?? null;

  const warnings: { label: string; value: number; unit: string; direction: 'high' | 'low' }[] = [];
  if (latestVitals) {
    const checks = [
      { key: 'temperature', value: latestVitals.temperature },
      { key: 'bloodPressureSystolic', value: latestVitals.bloodPressureSystolic },
      { key: 'bloodPressureDiastolic', value: latestVitals.bloodPressureDiastolic },
      { key: 'pulse', value: latestVitals.pulse },
      { key: 'spo2', value: latestVitals.spo2 },
      { key: 'respiratoryRate', value: latestVitals.respiratoryRate }
    ] as const;

    for (const { key, value } of checks) {
      const range = NORMAL_RANGES[key];
      if (value < range.min)
        warnings.push({ label: range.label, value, unit: range.unit, direction: 'low' });
      if (value > range.max)
        warnings.push({ label: range.label, value, unit: range.unit, direction: 'high' });
    }
  }

  const getMonthsFromVitals = (vitals: Record<string, VitalSign[]>): string[] => {
    if (!selectedPatientId || !vitals[selectedPatientId]) {
      return [];
    }
    const monthsSet = new Set<string>();

    const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' });

    vitals[selectedPatientId].forEach((vital) => {
      if (vital.date) {
        const date = new Date(vital.date);
        if (!isNaN(date.getTime())) {
          const monthName = monthFormatter.format(date);
          const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
          monthsSet.add(capitalizedMonth);
        }
      }
    });

    return Array.from(monthsSet);
  };

  const getTrend = (field: keyof Omit<VitalSign, 'id' | 'date'>): TrendDir => {
    if (!latestVitals || !previousVitals) return 'stable';
    const diff = (latestVitals[field] as number) - (previousVitals[field] as number);
    return diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
  };

  const patientsWithVitals = mockHospitalBeds.filter((bed) => bed.patientId);
  const selectedPatient = patientsWithVitals.find((bed) => bed.patientId === selectedPatientId); //берем только занятый койки

  const validateField = (field: VitalSignField, rawValue: string): string => {
    const result = vitalFieldSchemas[field].safeParse(rawValue);
    return result.success ? '' : (result.error.issues[0]?.message ?? '');
  };

  const handleVitalChange = (field: VitalSignField, nextValue: string) => {
    setVitalSigns((prev) => ({
      ...prev,
      [field]: nextValue
    }));

    if (nextValue.trim() === '') {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
      return;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateField(field, nextValue)
    }));
  };

  const handleSaveVitals = () => {
    const validationResult = vitalSignsSchema.safeParse(vitalSigns);

    if (!validationResult.success) {
      setFieldErrors(mapZodErrors(validationResult.error));
      toast.error('Проверьте корректность показателей перед сохранением');
      return;
    }

    setFieldErrors(createFieldErrors());
    toast.success('Показатели сохранены в карточку пациента');
    setVitalSigns({
      temperature: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      pulse: '',
      spo2: '',
      respiratoryRate: ''
    });
  };

  const patientOptions: PatientOption[] = patientsWithVitals.reduce<PatientOption[]>((acc, bed) => {
    if (!bed.patientId) {
      return acc;
    }

    acc.push({
      value: bed.patientId,
      label: `${bed.patientName} (Палата ${bed.bedNumber})`
    });

    return acc;
  }, []);

  return (
    <Content>
      <Container>
        <StyledCard>
          <CardHeader>
            <HeaderRow>
              <HeaderLeft>
                <Thermometer size={32} />
                <Title>Температурный лист</Title>
              </HeaderLeft>
            </HeaderRow>
          </CardHeader>

          <CardContent>
            <InfoGrid>
              <InfoItem>
                <FileText size={20} color="#2563eb" />
                <InfoText>
                  <InfoLabel>Номер карты</InfoLabel>
                  <InfoValue>
                    {hospitalBeds.find((bed) => bed.patientId === selectedPatientId)?.id}
                  </InfoValue>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <User size={20} color="#2563eb" />
                <InfoText>
                  <InfoLabel>Пациент</InfoLabel>
                  <InfoValue>
                    {hospitalBeds.find((bed) => bed.patientId === selectedPatientId)?.patientName}
                  </InfoValue>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <Home size={20} color="#2563eb" />
                <InfoText>
                  <InfoLabel>Палата</InfoLabel>
                  <InfoValue>
                    {hospitalBeds.find((bed) => bed.patientId === selectedPatientId)?.roomNumber}
                  </InfoValue>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <Calendar size={20} color="#2563eb" />
                <InfoText>
                  <InfoLabel>Месяц</InfoLabel>
                  <InfoValue>
                    {(() => {
                      const months = getMonthsFromVitals(patientsVitals);
                      return months && months.length > 0 ? months.join(', ') : '';
                    })()}
                  </InfoValue>
                </InfoText>
              </InfoItem>
            </InfoGrid>
          </CardContent>
        </StyledCard>
      </Container>

      <TwoColumnGrid>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Регистрация показателей</CardTitle>
              <CardSubtitle>Внесение данных осмотра в температурный лист</CardSubtitle>
            </CardHeader>

            <CardBody>
              <div>
                <FieldLabel htmlFor="patient-select">Пациент</FieldLabel>
                <Select
                  inputId="patient-select"
                  placeholder="Выберите пациента..."
                  options={patientOptions}
                  styles={patientSelectStyles}
                  components={{ DropdownIndicator, IndicatorSeparator: () => null }}
                  isSearchable
                  noOptionsMessage={() => 'Пациенты не найдены'}
                  value={patientOptions.find((o) => o.value === selectedPatientId) ?? null}
                  onChange={(option) => setSelectedPatientId(option?.value || '')}
                />
              </div>

              {selectedPatient && (
                <OpenSheetBtn onClick={() => setShowTemperatureSheet(true)}>
                  <FileLineChart size={20} />
                  <span>Открыть температурный лист</span>
                </OpenSheetBtn>
              )}

              {selectedPatientId && warnings.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#fff5f5',
                    border: '1px solid #fecaca'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#dc2626'
                    }}
                  >
                    <AlertTriangle size={15} />
                    <span>Требует внимания (последний замер)</span>
                  </div>
                  {warnings.map((w, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: '12px',
                        color: '#b91c1c',
                        paddingLeft: '21px',
                        lineHeight: 1.5
                      }}
                    >
                      <b>{w.label}:</b> {w.value} {w.unit} -{' '}
                      {w.direction === 'high' ? '↑ выше нормы' : '↓ ниже нормы'}
                    </div>
                  ))}
                </div>
              )}

              {selectedPatientId && warnings.length === 0 && latestVitals && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#16a34a'
                  }}
                >
                  ✓ Все последние показатели в норме
                </div>
              )}

              <div>
                <FieldLabelIcon>
                  <Thermometer size={16} color="#ea580c" />
                  <span>Температура (°C)</span>
                </FieldLabelIcon>
                <Input
                  type="number"
                  step="0.1"
                  min={VITAL_RULES.temperature.min}
                  max={VITAL_RULES.temperature.max}
                  placeholder="36.6"
                  value={vitalSigns.temperature}
                  error={fieldErrors.temperature}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                />
              </div>

              <div>
                <FieldLabelIcon>
                  <Activity size={16} color="#dc2626" />
                  <span>Артериальное давление (мм рт. ст.)</span>
                </FieldLabelIcon>
                <BpGrid>
                  <Input
                    type="number"
                    placeholder="120"
                    step="1"
                    min={VITAL_RULES.bloodPressureSystolic.min}
                    max={VITAL_RULES.bloodPressureSystolic.max}
                    value={vitalSigns.bloodPressureSystolic}
                    error={fieldErrors.bloodPressureSystolic}
                    onChange={(e) => handleVitalChange('bloodPressureSystolic', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="80"
                    step="1"
                    min={VITAL_RULES.bloodPressureDiastolic.min}
                    max={VITAL_RULES.bloodPressureDiastolic.max}
                    value={vitalSigns.bloodPressureDiastolic}
                    error={fieldErrors.bloodPressureDiastolic}
                    onChange={(e) => handleVitalChange('bloodPressureDiastolic', e.target.value)}
                  />
                </BpGrid>
              </div>

              <div>
                <FieldLabelIcon>
                  <Heart size={16} color="#db2777" />
                  <span>Пульс (уд/мин)</span>
                </FieldLabelIcon>
                <Input
                  type="number"
                  placeholder="80"
                  step="1"
                  min={VITAL_RULES.pulse.min}
                  max={VITAL_RULES.pulse.max}
                  value={vitalSigns.pulse}
                  error={fieldErrors.pulse}
                  onChange={(e) => handleVitalChange('pulse', e.target.value)}
                />
              </div>

              <div>
                <FieldLabelIcon>
                  <Droplet size={16} color="#2563eb" />
                  <span>Сатурация (SpO2, %)</span>
                </FieldLabelIcon>
                <Input
                  type="number"
                  placeholder="98"
                  step="1"
                  min={VITAL_RULES.spo2.min}
                  max={VITAL_RULES.spo2.max}
                  value={vitalSigns.spo2}
                  error={fieldErrors.spo2}
                  onChange={(e) => handleVitalChange('spo2', e.target.value)}
                />
              </div>

              <div>
                <FieldLabelIcon>
                  <Activity size={16} color="#0d9488" />
                  <span>Частота дыхания (в минуту)</span>
                </FieldLabelIcon>
                <Input
                  type="number"
                  placeholder="18"
                  step="1"
                  min={VITAL_RULES.respiratoryRate.min}
                  max={VITAL_RULES.respiratoryRate.max}
                  value={vitalSigns.respiratoryRate}
                  error={fieldErrors.respiratoryRate}
                  onChange={(e) => handleVitalChange('respiratoryRate', e.target.value)}
                />
              </div>

              <SaveBtn onClick={handleSaveVitals}>
                <Save size={20} />
                <span>Сохранить показатели</span>
              </SaveBtn>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Динамика состояния</CardTitle>
              <CardSubtitle>График изменения температуры и жизненно важных функций</CardSubtitle>
            </CardHeader>

            <CardBody $noPadding>
              {patientVitalsList.length >= 2 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>
                    Динамика:
                  </span>
                  {TREND_META.map(({ field, label, goodDir }) => {
                    if (field === 'spo2' || field === 'respiratoryRate') return null;
                    const dir = getTrend(field);
                    const currentValue = latestVitals?.[field] as number | undefined;
                    const range = NORMAL_RANGES[field];
                    const isOutOfRange =
                      currentValue !== undefined &&
                      (currentValue < range.min || currentValue > range.max);
                    const isGood =
                      !isOutOfRange && (goodDir === 'any' || dir === goodDir || dir === 'stable');
                    const color = dir === 'stable' ? '#94a3b8' : isGood ? '#16a34a' : '#dc2626';
                    const Icon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;
                    return (
                      <div
                        key={field}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: `${color}14`,
                          border: `1px solid ${color}33`,
                          fontSize: '12px',
                          fontWeight: 500,
                          color
                        }}
                      >
                        <Icon size={13} />
                        <span>{label}</span>
                      </div>
                    );
                  })}
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      alignSelf: 'center',
                      marginLeft: 'auto'
                    }}
                  >
                    ← vs предыдущий замер
                  </span>
                </div>
              )}

              <ResponsiveContainer width="100%" height={420}>
                <ComposedChart
                  data={chartData.length > 0 ? chartData : referenceData}
                  margin={{ top: 20, right: 20, bottom: 6, left: 6 }}
                >
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis dataKey="name" />

                  <YAxis
                    yAxisId="vitals"
                    domain={[30, 250]}
                    width={52}
                    tickCount={12}
                    label={{
                      value: 'Пульс / АД',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 0
                    }}
                  />
                  <YAxis
                    yAxisId="temp"
                    orientation="right"
                    domain={[VITAL_RULES.temperature.min, VITAL_RULES.temperature.max]}
                    tickCount={10}
                    width={52}
                    label={{
                      value: 'Температура, °C',
                      angle: 90,
                      position: 'insideRight',
                      offset: -10
                    }}
                  />

                  <Tooltip
                    formatter={(value, name, entry) => {
                      const row = entry.payload as {
                        pulse: number;
                        temperature: number;
                        bloodPressureSystolic: number;
                        bloodPressureDiastolic: number;
                        pulseRange?: number;
                        bpNormal?: number;
                      };
                      const dataKey = entry.dataKey as string;

                      const formatAlert = (text: string, alertText?: string) =>
                        alertText ? (
                          <span style={{ color: '#dc2626', fontWeight: 600 }}>
                            {text} ({alertText})
                          </span>
                        ) : (
                          text
                        );

                      const tempHigh = row.temperature > NORMAL_RANGES.temperature.max;
                      const tempLow = row.temperature < NORMAL_RANGES.temperature.min;
                      const tempAlert = tempHigh
                        ? '⚠ ↑ выше нормы'
                        : tempLow
                          ? '⚠ ↓ ниже нормы'
                          : '';
                      const tempValue = `${row.temperature.toFixed(1)} °C`;

                      const pulseHigh = row.pulse > NORMAL_RANGES.pulse.max;
                      const pulseLow = row.pulse < NORMAL_RANGES.pulse.min;
                      const pulseAlert = pulseHigh
                        ? '↑ выше нормы'
                        : pulseLow
                          ? '↓ ниже нормы'
                          : '';
                      const pulseValue = `${row.pulse} уд/мин`;

                      const bpsHigh =
                        row.bloodPressureSystolic > NORMAL_RANGES.bloodPressureSystolic.max;
                      const bpsLow =
                        row.bloodPressureSystolic < NORMAL_RANGES.bloodPressureSystolic.min;
                      const bpdHigh =
                        row.bloodPressureDiastolic > NORMAL_RANGES.bloodPressureDiastolic.max;
                      const bpdLow =
                        row.bloodPressureDiastolic < NORMAL_RANGES.bloodPressureDiastolic.min;

                      const bpAlerts: string[] = [];
                      if (bpsHigh) bpAlerts.push('↑ сист.');
                      if (bpsLow) bpAlerts.push('↓ сист.');
                      if (bpdHigh) bpAlerts.push('↑ диаст.');
                      if (bpdLow) bpAlerts.push('↓ диаст.');
                      const bpAlertText = bpAlerts.length > 0 ? `⚠ ${bpAlerts.join(', ')}` : '';
                      const bpValue = `${row.bloodPressureSystolic}/${row.bloodPressureDiastolic} мм рт. ст.`;

                      const pulseRangeValue = row.pulseRange ?? 0;
                      const bpNormalValue = row.bpNormal ?? 0;

                      if (dataKey === 'temperature') {
                        return [formatAlert(tempValue, tempAlert), 'Температура'];
                      }

                      if (dataKey === 'pulseBase' || dataKey === 'bpBase') {
                        return null;
                      }

                      if (dataKey === 'pulseRange' || dataKey === 'pulseUpper') {
                        const segmentValue = typeof value === 'number' ? value : Number(value);
                        if (!Number.isFinite(segmentValue) || segmentValue <= 0) {
                          return null;
                        }
                        const shouldShowPulse =
                          dataKey === 'pulseRange' ||
                          (dataKey === 'pulseUpper' && pulseRangeValue === 0);
                        if (!shouldShowPulse) {
                          return null;
                        }
                        return [formatAlert(pulseValue, pulseAlert), 'Пульс'];
                      }

                      if (dataKey === 'bpNormal') {
                        return [formatAlert(bpValue, bpAlertText), 'АД'];
                      }

                      if (dataKey === 'bpLow' || dataKey === 'bpHigh') {
                        if (bpNormalValue !== 0) {
                          return null;
                        }
                        return [formatAlert(bpValue, bpAlertText), 'АД'];
                      }

                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="bottom" align="center" />

                  {/*Зелёная зона нормы температуры*/}
                  <ReferenceArea
                    yAxisId="temp"
                    y1={NORMAL_RANGES.temperature.min}
                    y2={NORMAL_RANGES.temperature.max}
                    fill="#dcfce7"
                    fillOpacity={0.35}
                    strokeOpacity={0}
                  />

                  {/*Пунктирные границы температуры*/}
                  <ReferenceLine
                    yAxisId="temp"
                    y={37.2}
                    stroke="#16a34a"
                    strokeDasharray="5 4"
                    strokeOpacity={0.55}
                    strokeWidth={1.5}
                    label={{
                      value: `${NORMAL_RANGES.temperature.max}°`,
                      position: 'left',
                      fontSize: 10,
                      fill: '#16a34a',
                      dy: -12,
                      dx: 4
                    }}
                  />
                  <ReferenceLine
                    yAxisId="temp"
                    y={36.0}
                    stroke="#16a34a"
                    strokeDasharray="5 4"
                    strokeOpacity={0.4}
                    strokeWidth={1.5}
                    label={{
                      value: `${NORMAL_RANGES.temperature.min}.0°`,
                      position: 'left',
                      fontSize: 10,
                      fill: '#16a34a',
                      dy: -4,
                      dx: 4
                    }}
                  />

                  {/*Границы АД*/}
                  <ReferenceLine
                    yAxisId="vitals"
                    y={NORMAL_RANGES.bloodPressureSystolic.max}
                    stroke="#f97316"
                    strokeDasharray="6 4"
                    strokeOpacity={0.45}
                    strokeWidth={1.5}
                    label={{
                      value: `АД ${NORMAL_RANGES.bloodPressureSystolic.max}`,
                      position: 'left',
                      fontSize: 10,
                      fill: '#f97316',
                      dy: -7,
                      dx: 3
                    }}
                  />
                  <ReferenceLine
                    yAxisId="vitals"
                    y={NORMAL_RANGES.bloodPressureDiastolic.min}
                    stroke="#f97316"
                    strokeDasharray="4 4"
                    strokeOpacity={0.35}
                    strokeWidth={1.5}
                    label={{
                      value: `АД ${NORMAL_RANGES.bloodPressureDiastolic.min}`,
                      position: 'left',
                      fontSize: 10,
                      fill: '#f97316',
                      dy: 2,
                      dx: 3
                    }}
                  />

                  {/*Границы пульса*/}
                  <ReferenceLine
                    yAxisId="vitals"
                    y={NORMAL_RANGES.pulse.max}
                    stroke="#db2777"
                    strokeDasharray="4 3"
                    strokeOpacity={0.35}
                    strokeWidth={1.5}
                    label={{
                      value: `Пульс ${NORMAL_RANGES.pulse.max}`,
                      position: 'right',
                      fontSize: 10,
                      fill: '#db2777'
                    }}
                  />
                  <ReferenceLine
                    yAxisId="vitals"
                    y={NORMAL_RANGES.pulse.min}
                    stroke="#db2777"
                    strokeDasharray="4 3"
                    strokeOpacity={0.25}
                    strokeWidth={1.5}
                    label={{
                      value: `Пульс ${NORMAL_RANGES.pulse.min}`,
                      position: 'right',
                      fontSize: 10,
                      fill: '#db2777',
                      dy: -5
                    }}
                  />

                  <Bar
                    yAxisId="vitals"
                    dataKey="pulseBase"
                    stackId="pulse"
                    fill="transparent"
                    legendType="none"
                  />

                  <Bar
                    yAxisId="vitals"
                    dataKey="pulseRange"
                    stackId="pulse"
                    name="Пульс"
                    fill="#db2777"
                    barSize={14}
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    yAxisId="vitals"
                    dataKey="pulseUpper"
                    stackId="pulse"
                    name="Пульс (плохой)"
                    fill="#ff0026"
                    barSize={14}
                    radius={[4, 4, 4, 4]}
                    legendType="none"
                  />

                  <Bar
                    yAxisId="vitals"
                    dataKey="bpBase"
                    stackId="bp"
                    fill="transparent"
                    legendType="none"
                  />

                  <Bar
                    yAxisId="vitals"
                    dataKey="bpLow"
                    stackId="bp"
                    name="АД (выше нормы)"
                    fill="#000c8b"
                    legendType="none"
                    barSize={14}
                    radius={[4, 4, 4, 4]}
                  />

                  <Bar
                    yAxisId="vitals"
                    dataKey="bpNormal"
                    stackId="bp"
                    name="АД (нижн.-верхн.)"
                    fill="#2563eb"
                    barSize={14}
                    radius={[4, 4, 4, 4]}
                  />

                  <Bar
                    yAxisId="vitals"
                    dataKey="bpHigh"
                    stackId="bp"
                    name="АД (ниже нормы)"
                    fill="#000c8b"
                    legendType="none"
                    barSize={14}
                    radius={[4, 4, 4, 4]}
                  />

                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    name="Температура"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={<CustomTempDot />}
                    activeDot={<CustomTempActiveDot />}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            {patientVitalsList.length >= 2 && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>
                  Динамика:
                </span>

                {TREND_META.filter(
                  (meta) => meta.field === 'spo2' || meta.field === 'respiratoryRate'
                ).map((meta) => {
                  const dir = getTrend(meta.field);
                  const currentValue = latestVitals?.[meta.field] as number | undefined;
                  const range = NORMAL_RANGES[meta.field];
                  const goodDir = meta.goodDir;

                  const isOutOfRange =
                    currentValue !== undefined &&
                    (currentValue < range.min || currentValue > range.max);

                  const isGood =
                    !isOutOfRange && (goodDir === 'any' || dir === goodDir || dir === 'stable');

                  const color = dir === 'stable' ? '#94a3b8' : isGood ? '#16a34a' : '#dc2626';
                  const bgColor = isGood ? '#16a34a14' : '#dc262614';
                  const borderColor = isGood ? '#16a34a33' : '#dc262633';

                  const Icon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;
                  return (
                    <div
                      key={meta.field}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        backgroundColor: bgColor,
                        border: `1px solid ${borderColor}`,
                        fontSize: '12px',
                        fontWeight: 500,
                        color: color
                      }}
                    >
                      <Icon size={13} />
                      <span>{meta.label}</span>
                    </div>
                  );
                })}
                <span
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    alignSelf: 'center',
                    marginLeft: 'auto'
                  }}
                >
                  ← vs предыдущий замер
                </span>
              </div>
            )}
            <ResponsiveContainer width="100%" height={420}>
              <ComposedChart
                data={spoRespiratoryRate.length > 0 ? spoRespiratoryRate : referenceData}
                margin={{ top: 20, right: 20, bottom: 6, left: 6 }}
              >
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis dataKey="name" />

                <Tooltip
                  formatter={(value, name, entry) => {
                    const row = entry.payload as {
                      spo2: number;
                      respiratoryRate: number;
                    };
                    const dataKey = entry.dataKey as string;

                    const formatAlert = (text: string, alertText?: string) =>
                      alertText ? (
                        <span style={{ color: '#dc2626', fontWeight: 600 }}>
                          {text} ({alertText})
                        </span>
                      ) : (
                        text
                      );

                    const spo2High = row.spo2 > NORMAL_RANGES.spo2.max;
                    const spo2Low = row.spo2 < NORMAL_RANGES.spo2.min;
                    const spo2Alert = spo2High ? '⚠ ↑ выше нормы' : spo2Low ? '⚠ ↓ ниже нормы' : '';
                    const spo2Value = `${row.spo2.toFixed(1)} %`;

                    const respiratoryRateHigh =
                      row.respiratoryRate > NORMAL_RANGES.respiratoryRate.max;
                    const respiratoryRateLow =
                      row.respiratoryRate < NORMAL_RANGES.respiratoryRate.min;
                    const respiratoryRateAlert = respiratoryRateHigh
                      ? '⚠ ↑ выше нормы'
                      : respiratoryRateLow
                        ? '⚠ ↓ ниже нормы'
                        : '';
                    const respiratoryRateValue = `${row.respiratoryRate} дых/мин`;

                    if (dataKey === 'spo2') {
                      return [formatAlert(spo2Value, spo2Alert), 'SpO₂ (%)'];
                    }
                    if (dataKey === 'respiratoryRate') {
                      return [
                        formatAlert(respiratoryRateValue, respiratoryRateAlert),
                        'Частота дыхания'
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Legend verticalAlign="bottom" align="center" />

                <YAxis
                  yAxisId="spo2"
                  domain={[VITAL_RULES.spo2.min, VITAL_RULES.spo2.max]}
                  width={52}
                  tickCount={8}
                  label={{
                    value: 'SpO₂ (%)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    dy: 50
                  }}
                />

                <YAxis
                  yAxisId="resp"
                  orientation="right"
                  domain={[VITAL_RULES.respiratoryRate.min, VITAL_RULES.respiratoryRate.max]}
                  width={52}
                  tickCount={8}
                  label={{
                    value: 'Частота дыхания, дых/мин',
                    angle: 90,
                    position: 'insideRight',
                    offset: 0,
                    dy: 90
                  }}
                />

                <ReferenceArea
                  yAxisId="spo2"
                  y1={NORMAL_RANGES.spo2.min}
                  y2={NORMAL_RANGES.spo2.max}
                  fill="#dcfce7"
                  fillOpacity={0.3}
                  strokeOpacity={0}
                />

                <ReferenceLine
                  yAxisId="spo2"
                  y={NORMAL_RANGES.spo2.max}
                  stroke="#2563eb"
                  strokeDasharray="5 4"
                  strokeOpacity={0.55}
                  strokeWidth={1.4}
                  label={{
                    value: `SpO₂ ${NORMAL_RANGES.spo2.max}%`,
                    position: 'center',
                    fontSize: 10,
                    fill: '#2563eb',
                    dy: -6
                  }}
                />
                <ReferenceLine
                  yAxisId="spo2"
                  y={NORMAL_RANGES.spo2.min}
                  stroke="#2563eb"
                  strokeDasharray="5 4"
                  strokeOpacity={0.45}
                  strokeWidth={1.4}
                  label={{
                    value: `SpO₂ ${NORMAL_RANGES.spo2.min}%`,
                    position: 'left',
                    fontSize: 10,
                    fill: '#2563eb',
                    dy: 12
                  }}
                />

                <ReferenceArea
                  yAxisId="resp"
                  y1={NORMAL_RANGES.respiratoryRate.min}
                  y2={NORMAL_RANGES.respiratoryRate.max}
                  fill="#dcfce7"
                  fillOpacity={0.22}
                  strokeOpacity={0}
                />
                <ReferenceLine
                  yAxisId="resp"
                  y={NORMAL_RANGES.respiratoryRate.max}
                  stroke="#10b981"
                  strokeDasharray="5 4"
                  strokeOpacity={0.55}
                  strokeWidth={1.4}
                  label={{
                    value: `ЧД ${NORMAL_RANGES.respiratoryRate.max}`,
                    position: 'right',
                    fontSize: 10,
                    fill: '#10b981',
                    dy: 5
                  }}
                />
                <ReferenceLine
                  yAxisId="resp"
                  y={NORMAL_RANGES.respiratoryRate.min}
                  stroke="#10b981"
                  strokeDasharray="5 4"
                  strokeOpacity={0.45}
                  strokeWidth={1.4}
                  label={{
                    value: `ЧД ${NORMAL_RANGES.respiratoryRate.min}`,
                    position: 'right',
                    fontSize: 10,
                    fill: '#10b981',
                    dy: 12
                  }}
                />

                <Line
                  yAxisId="spo2"
                  type="monotone"
                  dataKey="spo2"
                  name="SpO₂ (%)"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={<CustomTempDot />}
                />

                <Line
                  yAxisId="resp"
                  type="monotone"
                  dataKey="respiratoryRate"
                  name="Частота дыхания"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={<CustomTempDot />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </TwoColumnGrid>
    </Content>
  );
};

export default TemperaturePage;
