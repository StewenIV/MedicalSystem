import { useState } from 'react'
import {
  Thermometer,
  Activity,
  Heart,
  Droplet,
  Save,
  FileLineChart,
  ChevronsDown
} from 'lucide-react'

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { toast } from 'react-toastify'
import { mockHospitalBeds } from 'data/mockData'
import { z } from 'zod'
import Select, {
  components,
  DropdownIndicatorProps,
  StylesConfig
} from 'react-select'

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
  SaveBtn
} from './styled'

import Input from 'components/Input/index'
import colors from 'consts/colors'

type VitalSignField =
  | 'temperature'
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'pulse'
  | 'spo2'
  | 'respiratoryRate'

const VITAL_RULES: Record<
  VitalSignField,
  { label: string; min: number; max: number; integerOnly?: boolean }
> = {
  temperature: {
    label: 'Температура',
    min: 34,
    max: 42
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
}

const createFieldErrors = (): Record<VitalSignField, string> => ({
  temperature: '',
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  pulse: '',
  spo2: '',
  respiratoryRate: ''
})

const createVitalFieldSchema = (field: VitalSignField) => {
  const rule = VITAL_RULES[field]

  return z
    .string()
    .trim()
    .min(1, `${rule.label}: введите числовое значение`)
    .refine(
      (value) => Number.isFinite(Number(value.replace(',', '.'))),
      `${rule.label}: введите числовое значение`
    )
    .refine(
      (value) =>
        !rule.integerOnly || Number.isInteger(Number(value.replace(',', '.'))),
      `${rule.label}: допустимы только целые числа`
    )
    .refine((value) => {
      const numberValue = Number(value.replace(',', '.'))
      return numberValue >= rule.min && numberValue <= rule.max
    }, `${rule.label}: диапазон ${rule.min}-${rule.max}`)
}

const vitalFieldSchemas: Record<
  VitalSignField,
  ReturnType<typeof createVitalFieldSchema>
> = {
  temperature: createVitalFieldSchema('temperature'),
  bloodPressureSystolic: createVitalFieldSchema('bloodPressureSystolic'),
  bloodPressureDiastolic: createVitalFieldSchema('bloodPressureDiastolic'),
  pulse: createVitalFieldSchema('pulse'),
  spo2: createVitalFieldSchema('spo2'),
  respiratoryRate: createVitalFieldSchema('respiratoryRate')
}

const vitalSignsSchema = z.object(vitalFieldSchemas)

const mapZodErrors = (error: z.ZodError): Record<VitalSignField, string> => {
  const nextErrors = createFieldErrors()

  for (const issue of error.issues) {
    const key = issue.path[0]

    if (typeof key !== 'string' || !(key in nextErrors)) {
      continue
    }

    const field = key as VitalSignField
    if (!nextErrors[field]) {
      nextErrors[field] = issue.message
    }
  }

  return nextErrors
}

interface PatientOption {
  value: string
  label: string
}

const DropdownIndicator = (
  props: DropdownIndicatorProps<PatientOption, false>
) => {
  return (
    <components.DropdownIndicator {...props}></components.DropdownIndicator>
  )
}

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
    backgroundColor: state.isSelected
      ? colors.mainColor
      : state.isFocused
        ? '#eff6ff'
        : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    transition: 'all 0.15s ease',
    ':active': {
      backgroundColor: state.isSelected ? colors.mainColor : '#dbeafe'
    }
  })
}

interface NurseWorkplaceProps {
  onNavigate: (screen: string) => void
  onLogout: () => void
  userRole: 'doctor' | 'nurse' | 'patient' | null
}

const TemperaturePage: React.FC<NurseWorkplaceProps> = ({
  onNavigate,
  onLogout,
  userRole
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [showTemperatureSheet, setShowTemperatureSheet] = useState(true)
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulse: '',
    spo2: '',
    respiratoryRate: ''
  })
  const [fieldErrors, setFieldErrors] =
    useState<Record<VitalSignField, string>>(createFieldErrors())

  const chartSource = [
    {
      name: '12.03',
      pulse: 120,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 50,
      temperature: 36.6
    },
    {
      name: '13.03',
      pulse: 130,
      bloodPressureSystolic: 150,
      bloodPressureDiastolic: 55,
      temperature: 36.8
    },
    {
      name: '14.03',
      pulse: 140,
      bloodPressureSystolic: 160,
      bloodPressureDiastolic: 60,
      temperature: 37.0
    },
    {
      name: '15.03',
      pulse: 150,
      bloodPressureSystolic: 105,
      bloodPressureDiastolic: 65,
      temperature: 37.2
    }
  ]

  const chartData = chartSource.map((item) => ({
    ...item,
    pulseBase: VITAL_RULES.pulse.min,
    pulseRange: Math.max(item.pulse - VITAL_RULES.pulse.min, 0),
    bpBase: item.bloodPressureDiastolic,
    bpRange: Math.max(
      item.bloodPressureSystolic - item.bloodPressureDiastolic,
      0
    )
  }))

  const [procedures] = useState([
    {
      id: 'PR001',
      patientName: 'Петров И.С.',
      procedure: 'Внутривенная инъекция',
      time: '08:00',
      status: 'completed'
    },
    {
      id: 'PR002',
      patientName: 'Иванова М.А.',
      procedure: 'Измерение АД',
      time: '08:30',
      status: 'completed'
    },
    {
      id: 'PR003',
      patientName: 'Смирнов А.Д.',
      procedure: 'Капельница (NaCl + Dexamethasone)',
      time: '09:00',
      status: 'pending'
    },
    {
      id: 'PR004',
      patientName: 'Петров И.С.',
      procedure: 'Подкожная инъекция Heparin',
      time: '12:00',
      status: 'pending'
    },
    {
      id: 'PR005',
      patientName: 'Иванова М.А.',
      procedure: 'Измерение температуры',
      time: '14:00',
      status: 'pending'
    }
  ])

  const patientsWithVitals = mockHospitalBeds.filter((bed) => bed.patientId)
  const selectedPatient = patientsWithVitals.find(
    (bed) => bed.patientId === selectedPatientId
  )

  const validateField = (field: VitalSignField, rawValue: string): string => {
    const result = vitalFieldSchemas[field].safeParse(rawValue)
    return result.success ? '' : (result.error.issues[0]?.message ?? '')
  }

  const handleVitalChange = (field: VitalSignField, nextValue: string) => {
    setVitalSigns((prev) => ({
      ...prev,
      [field]: nextValue
    }))

    if (nextValue.trim() === '') {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: ''
      }))
      return
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateField(field, nextValue)
    }))
  }

  const handleSaveVitals = () => {
    const validationResult = vitalSignsSchema.safeParse(vitalSigns)

    if (!validationResult.success) {
      setFieldErrors(mapZodErrors(validationResult.error))
      toast.error('Проверьте корректность показателей перед сохранением')
      return
    }

    setFieldErrors(createFieldErrors())
    toast.success('Показатели сохранены в карточку пациента')
    setVitalSigns({
      temperature: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      pulse: '',
      spo2: '',
      respiratoryRate: ''
    })
  }

  const patientOptions: PatientOption[] = patientsWithVitals.reduce<
    PatientOption[]
  >((acc, bed) => {
    if (!bed.patientId) {
      return acc
    }

    acc.push({
      value: bed.patientId,
      label: `${bed.patientName} (Палата ${bed.bedNumber})`
    })

    return acc
  }, [])

  return (
    <Content>
      <TwoColumnGrid>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Температурный лист</CardTitle>
              <CardSubtitle>Внесение жизненно важных показателей</CardSubtitle>
            </CardHeader>

            <CardBody>
              <div>
                <FieldLabel htmlFor="patient-select">Пациент</FieldLabel>
                <Select
                  inputId="patient-select"
                  placeholder="Выберите пациента..."
                  options={patientOptions}
                  styles={patientSelectStyles}
                  components={{
                    DropdownIndicator,
                    IndicatorSeparator: () => null
                  }}
                  isSearchable
                  noOptionsMessage={() => 'Пациенты не найдены'}
                  value={patientOptions.find(
                    (option) => option.value === selectedPatientId
                  )}
                  onChange={(option) =>
                    setSelectedPatientId(option?.value || '')
                  }
                />
              </div>

              {selectedPatient && (
                <OpenSheetBtn onClick={() => setShowTemperatureSheet(true)}>
                  <FileLineChart size={20} />
                  <span>Открыть температурный лист</span>
                </OpenSheetBtn>
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
                  onChange={(e) =>
                    handleVitalChange('temperature', e.target.value)
                  }
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
                    onChange={(e) =>
                      handleVitalChange('bloodPressureSystolic', e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="80"
                    step="1"
                    min={VITAL_RULES.bloodPressureDiastolic.min}
                    max={VITAL_RULES.bloodPressureDiastolic.max}
                    value={vitalSigns.bloodPressureDiastolic}
                    error={fieldErrors.bloodPressureDiastolic}
                    onChange={(e) =>
                      handleVitalChange(
                        'bloodPressureDiastolic',
                        e.target.value
                      )
                    }
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
                  onChange={(e) =>
                    handleVitalChange('respiratoryRate', e.target.value)
                  }
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
              <CardTitle>Температурный лист</CardTitle>
              <CardSubtitle>
                График изменения температуры и других показателей
              </CardSubtitle>
            </CardHeader>

            <CardBody $noPadding>
              <ResponsiveContainer width="100%" height={420}>
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 6,
                    left: 6
                  }}
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
                    domain={[34, 42]}
                    tickCount={9}
                    width={52}
                    label={{
                      value: 'Температура, °C',
                      angle: 90,
                      position: 'insideRight',
                      offset: 0
                    }}
                  />
                  <Tooltip
                    formatter={(value, name, entry) => {
                      const row = entry.payload as {
                        pulse: number
                        temperature: number
                        bloodPressureSystolic: number
                        bloodPressureDiastolic: number
                      }

                      if (name === 'Пульс') {
                        return [`${row.pulse} уд/мин`, 'Пульс']
                      }

                      if (name === 'АД (нижн.-верхн.)') {
                        return [
                          `${row.bloodPressureDiastolic}-${row.bloodPressureSystolic} мм рт. ст.`,
                          'АД'
                        ]
                      }

                      if (name === 'Температура') {
                        return [
                          `${row.temperature.toFixed(1)} °C`,
                          'Температура'
                        ]
                      }

                      return [value, name]
                    }}
                  />
                  <Legend verticalAlign="bottom" align="center" />

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
                    dataKey="bpBase"
                    stackId="bp"
                    fill="transparent"
                    legendType="none"
                  />
                  <Bar
                    yAxisId="vitals"
                    dataKey="bpRange"
                    stackId="bp"
                    name="АД (нижн.-верхн.)"
                    fill="#2563eb"
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
                    dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      </TwoColumnGrid>
    </Content>
  )
}

export default TemperaturePage
