import { useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  SlidersHorizontal,
  RotateCcw,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Users,
  User,
  ArrowRight,
  UserPlus,
  X,
  Building,
  BedDouble,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  Search,
  MapPin,
  Check
} from 'lucide-react'
import Select, { components, DropdownIndicatorProps, StylesConfig } from 'react-select'

import colors from 'consts/colors'
import { toast } from 'react-toastify'
import { showApiError } from 'utils/showApiError'
import { toLocalDateTimeLocalString, toBackendDateTimeString } from 'utils/dateUtils'
import {
  fetchAdminRooms,
  fetchAdminRoomById,
  createRoom as apiCreateRoom,
  updateRoom,
  updateRoomPriority,
  deleteRoom as apiDeleteRoom,
  getAvailableFloors,
  getRoomsByFloor,
  fetchAdminBedsByRoom,
  addBed as apiAddBed,
  deleteBed as apiDeleteBed,
  assignPatient,
  transferPatient,
  freeAdminBed,
  updateBedNote,
  searchPatients,
  searchDoctors,
  SearchPatientDto,
  RoomType as ApiRoomType,
  RoomGender as ApiRoomGender,
  RoomListItemDto,
  RoomDetailsDto
} from 'api/adminApi'

import {
  PageWrapper,
  StyledCard,
  CardHeader,
  CardContent,
  HeaderRow,
  PageTitle,
  CardSubtitle,
  TwoColLayout,
  StatsBadgesRow,
  StatBadge,
  StatBadgeLabel,
  StatBadgeValue,
  FilterBar,
  FilterIcon,
  SearchInput,
  ResetBtn,
  TableWrap,
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  TdBold,
  TdMuted,
  TypeBadge,
  GenderCell,
  BedCountCell,
  BedCountNum,
  BedCountUnit,
  PriorityWrap,
  PriorityBar,
  ActionCell,
  ActionIconBtn,
  PaginationRow,
  PaginationInfo,
  PaginationBtns,
  PageBtn,
  EditorPanel,
  EditorTitle,
  EditorSubtitle,
  Divider,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  RadioGroup,
  RadioLabel,
  SliderRow,
  SliderLabel,
  PriorityBadge,
  PriorityLevelLabel,
  RangeInput,
  BedsMgmtHeader,
  BedsMgmtTitle,
  AddBedBtn,
  BedsList,
  EmptyBedsState,
  BedItem,
  BedTag,
  BedInfo,
  BedName,
  BedId,
  BedStatus,
  BedDeleteBtn,
  EditorFooter,
  SaveBtn,
  ResetEditorBtn,
  Overlay,
  InputModal,
  ModalShell,
  ModalHeader,
  PatientAvatar,
  ModalInfoPatient,
  ModalRow,
  ModalHeaderText,
  ModalIconWrap,
  ModalTitle,
  ModalSubtitle,
  CloseBtn,
  ModalContent,
  Section,
  LocationRow,
  LocationCard,
  LocationCardLabel,
  LocationFieldsGrid,
  LocationField,
  LocationFieldLabel,
  LocationFieldValue,
  ArrowWrap,
  ArrowCircle,
  SelectionCard,
  SelectionTopRow,
  SelectionTitle,
  FreeOnlyLabel,
  SelectsGrid,
  SelectField,
  SelectLabel,
  BedsSection,
  BedsLabel,
  BedsGrid,
  BedBtn,
  BedStatusDot,
  BedBtnLabel,
  BedSelectedMark,
  NoBedsBanner,
  DetailsCard,
  DetailsSectionTitle,
  DetailsGrid,
  DetailsField,
  DetailsLabel,
  DetailsOptional,
  StyledInput,
  StyledTextarea,
  ModalFooter,
  CancelBtn,
  ConfirmBtn,
  SectionHeaderFlex,
  NewPatientBtn,
  NotificationBox,
  CheckboxWrap,
  CheckboxHint,
  FooterLeftInfo,
  FooterRightActions,
  LocationText
} from './styled'

type RoomType = 'Обычная' | 'Реанимация' | 'Изолятор'
type GenderType = 'Мужская' | 'Женская'

interface Location {
  floor: number
  room: string
  bedNumber: number
  bedId: string
}

interface BedEntry {
  id: string
  name: string
  status: 'Занято' | 'Свободно'
  location?: Location
  patientId?: string
  patientAge?: number
  patientName?: string
  patientGender?: string
  diagnosis?: string
  doctorName?: string
  doctorRole?: string
  bedNumber?: number
}

interface Room {
  id: string
  floor: number
  number: string
  type: RoomType
  gender: GenderType
  beds: BedEntry[]
  priority: number
  bedsCount?: number
}

interface SelectOption {
  value: string
  label: string
  data?: any
}

const PAGE_SIZE = 5

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Низкий',
  2: 'Средний',
  3: 'Средний',
  4: 'Высокий',
  5: 'Критичный'
}

const ROOM_TYPES: RoomType[] = ['Обычная', 'Реанимация', 'Изолятор']

export const mapRoomTypeToLocal = (type: ApiRoomType): RoomType => {
  if (type === ApiRoomType.ICU) return 'Реанимация'
  if (type === ApiRoomType.Isolation) return 'Изолятор'
  return 'Обычная'
}

export const mapLocalToRoomType = (type: RoomType): ApiRoomType => {
  if (type === 'Реанимация') return ApiRoomType.ICU
  if (type === 'Изолятор') return ApiRoomType.Isolation
  return ApiRoomType.Normal
}

export const mapRoomGenderToLocal = (gender: ApiRoomGender): GenderType => {
  if (gender === ApiRoomGender.Female) return 'Женская'
  return 'Мужская'
}

export const mapLocalToRoomGender = (gender: GenderType): ApiRoomGender => {
  if (gender === 'Женская') return ApiRoomGender.Female
  return ApiRoomGender.Male
}

const getGenderIcon = (gender: GenderType) => {
  if (gender === 'Мужская') return <User size={14} color="#3b82f6" />
  if (gender === 'Женская') return <User size={14} color="#ec4899" />
  return <Users size={14} color="#9ca3af" />
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, false>) => {
  return <components.DropdownIndicator {...props} />
}

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    pointerEvents: state.isDisabled ? 'auto' : base.pointerEvents,
    minHeight: '40px',
    borderRadius: '10px',
    borderColor: state.isDisabled
      ? '#e5e7eb'
      : state.isFocused
        ? colors.button
        : 'rgba(191, 219, 254, 0.8)',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : 'none',
    backgroundColor: state.isDisabled ? '#f3f4f6' : '#ffffff',
    transition: 'all 0.2s ease',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    '&:hover': {
      borderColor: state.isDisabled ? '#e5e7eb' : state.isFocused ? colors.button : '#9ca3af'
    }
  }),
  valueContainer: (base, state) => ({
    ...base,
    padding: '0 8px 0 12px',
    opacity: state.selectProps.isDisabled ? 0.6 : 1
  }),
  placeholder: (base) => ({
    ...base,
    color: '#d1d5db',
    fontSize: '14px'
  }),
  input: (base, state) => ({
    ...base,
    color: state.selectProps.isDisabled ? '#cbd5e1' : '#111827',
    fontSize: '14px'
  }),
  singleValue: (base, state) => ({
    ...base,
    color: state.selectProps.isDisabled ? '#cbd5e1' : '#111827',
    fontSize: '14px'
  }),
  indicatorsContainer: (base, state) => ({
    ...base,
    paddingRight: '5px',
    opacity: state.selectProps.isDisabled ? 0.6 : 1
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.selectProps.isDisabled
      ? '#cbd5e1'
      : state.isFocused
        ? colors.mainColor
        : '#64748b',
    padding: '2px',
    margin: '0 4px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: state.selectProps.isDisabled
      ? '#e5e7eb'
      : state.selectProps.menuIsOpen
        ? '#eaf1ff'
        : '#f8fafc',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: state.selectProps.isDisabled ? 'not-allowed' : 'pointer',
    textDecoration: state.selectProps.isDisabled ? 'line-through' : 'none',
    '&:hover': {
      color: state.selectProps.isDisabled ? '#cbd5e1' : colors.mainColor,
      backgroundColor: state.selectProps.isDisabled ? '#e5e7eb' : '#eaf1ff',
      borderColor: state.selectProps.isDisabled ? '#e2e8f0' : '#c7d2fe'
    },
    svg: {
      width: '14px',
      height: '14px'
    }
  }),
  menu: (base, state) => ({
    ...base,
    marginTop: '6px',
    borderRadius: '10px',
    border: state.selectProps.isDisabled ? '1px dashed #cbd5e1' : '1px solid #e5e7eb',
    boxShadow: state.selectProps.isDisabled ? 'none' : '0 10px 24px rgba(15, 23, 42, 0.12)',
    overflow: 'hidden',
    zIndex: 10,
    opacity: state.selectProps.isDisabled ? 0.5 : 1
  }),
  menuList: (base, state) => ({
    ...base,
    padding: '6px',
    pointerEvents: state.selectProps.isDisabled ? 'none' : 'auto'
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: '7px',
    fontSize: '14px',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    backgroundColor: state.isDisabled
      ? '#f3f4f6'
      : state.isSelected
        ? colors.mainColor
        : state.isFocused
          ? '#eff6ff'
          : '#ffffff',
    color: state.isDisabled ? '#cbd5e1' : state.isSelected ? '#ffffff' : '#1f2937',
    opacity: state.isDisabled ? 0.5 : 1,
    textDecoration: state.isDisabled ? 'line-through' : 'none',
    transition: 'all 0.15s ease',
    ':active': {
      backgroundColor: state.isDisabled
        ? '#f3f4f6'
        : state.isSelected
          ? colors.mainColor
          : '#dbeafe'
    }
  })
}

const selectComponents = {
  DropdownIndicator,
  IndicatorSeparator: () => null
}

const formatBedShortLabel = (bedNumber?: number | string) => `К${bedNumber || '...'}`

const formatBedTextLabel = (bedNumber?: number) => (bedNumber ? `Койка ${bedNumber}` : 'Койка')

const formatPatientFullName = (patient: SearchPatientDto | null) =>
  patient ? [patient.lastName, patient.firstName, patient.middleName].filter(Boolean).join(' ') : ''

const formatPatientAge = (age?: number) =>
  typeof age === 'number' ? `${age} лет` : 'Возраст не указан'

const formatPatientGender = (gender?: string | number) => {
  if (gender === 'Male' || gender === 'Мужская' || gender === 0 || gender === '0') return 'Мужской'
  if (gender === 'Female' || gender === 'Женская' || gender === 1 || gender === '1')
    return 'Женский'
  return gender ? String(gender) : 'Пол не указан'
}

const getPatientPrimaryPhone = (patient: SearchPatientDto) =>
  patient.phoneNumber || patient.phone || patient.phoneHome

const getPatientRecordNumber = (patient: SearchPatientDto) =>
  patient.numberCard || patient.medicalRecordNumber

export function WardAdmin() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [floors, setFloors] = useState<number[]>([])

  const loadRoomsFromServer = async () => {
    try {
      const result = await fetchAdminRooms(undefined, undefined, undefined, 1, 1000)
      const mapped = result.items.map((r) => ({
        id: r.id,
        floor: r.floor,
        number: r.number,
        type: mapRoomTypeToLocal(r.type),
        gender: mapRoomGenderToLocal(r.gender),
        priority: r.priority,
        bedsCount: r.bedsCount,
        beds: []
      }))
      setRooms(mapped)

      const uniqueFloors = Array.from(new Set(mapped.map((room) => room.floor))).sort(
        (a, b) => a - b
      )
      setFloors(uniqueFloors)

      return mapped
    } catch (e: any) {
      showApiError(e, 'Ошибка при загрузке палат')
      return []
    }
  }

  const loadRoomData = async (roomId: string) => {
    setSelectedId(roomId)
    try {
      const details = await fetchAdminRoomById(roomId)
      setEditorNum(details.number)
      setEditorFloor(details.floor)
      setEditorType(mapRoomTypeToLocal(details.type))
      setEditorGender(mapRoomGenderToLocal(details.gender))
      setEditorPriority(details.priority)
      setEditorBeds(
        details.beds.map((b) => ({
          id: b.id,
          name: formatBedTextLabel(b.bedNumber),
          bedNumber: b.bedNumber,
          status: b.patientId ? 'Занято' : 'Свободно',
          location: {
            floor: details.floor,
            room: details.number,
            bedNumber: b.bedNumber,
            bedId: b.id
          },
          patientId: b.patientId,
          patientName:
            [b.patientLastName, b.patientName, b.patientMiddleName].filter(Boolean).join(' ') ||
            undefined,
          patientAge: b.patientAge,
          patientGender:
            (b as typeof b & { patientGender?: string; gender?: string }).patientGender ||
            (b as typeof b & { patientGender?: string; gender?: string }).gender,
          diagnosis: b.diagnosis,
          doctorName: b.doctorName,
          doctorRole: b.doctorRole
        }))
      )
    } catch (e: any) {
      showApiError(e, 'Ошибка загрузки деталей палаты')
    }
  }

  useEffect(() => {
    loadRoomsFromServer().then((data) => {
      if (data.length > 0) {
        loadRoomData(data[0].id)
      }
      setLoading(false)
    })
  }, [])

  const [floorFilter, setFloorFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState('')

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<SearchPatientDto | null>(null)
  const [selectedPatientLocation, setSelectedPatientLocation] = useState<Location | null>(null)

  const [showOnlyFree, setShowOnlyFree] = useState(true)
  const [transferFloor, setTransferFloor] = useState<number | ''>('')
  const [transferRoom, setTransferRoom] = useState<string>('')
  const [transferBed, setTransferBed] = useState<string>('')
  const [transferDate, setTransferDate] = useState<string>('')
  const [transferReason, setTransferReason] = useState<string>('')
  const [transferNotes, setTransferNotes] = useState<string>('')

  const [availableTransferRooms, setAvailableTransferRooms] = useState<string[]>([])
  const [availableTransferBeds, setAvailableTransferBeds] = useState<
    {
      id: string
      number: number
      roomNumber: string
      isFree: boolean
      patientName?: string
      patientAge?: number
      patientGender?: string
    }[]
  >([])

  const [assignBedData, setAssignBedData] = useState<{
    floor: number
    roomId: string
    room: string
    bedNumber: number
    bedId: string
    priority: number
  } | null>(null)
  const [assignDate, setAssignDate] = useState<string>('')
  const [assignDoctor, setAssignDoctor] = useState<string>('')
  const [doctorOptions, setDoctorOptions] = useState<SelectOption[]>([])
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>('')
  const [doctorSearchLoading, setDoctorSearchLoading] = useState<boolean>(false)
  const [assignNotes, setAssignNotes] = useState<string>('')
  const [assignNotify, setAssignNotify] = useState<boolean>(true)
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>('')
  const [patientSearchResults, setPatientSearchResults] = useState<SearchPatientDto[]>([])
  const [patientSearchLoading, setPatientSearchLoading] = useState<boolean>(false)
  const [selectedPatientForAssign, setSelectedPatientForAssign] = useState<SearchPatientDto | null>(
    null
  )

  const floorFilterOptions = useMemo<SelectOption[]>(
    () => [
      { value: 'all', label: 'Все этажи' },
      ...floors.map((floor) => ({ value: floor.toString(), label: `${floor} этаж` }))
    ],
    [floors]
  )

  const typeFilterOptions = useMemo<SelectOption[]>(
    () => [
      { value: 'all', label: 'Все типы' },
      ...ROOM_TYPES.map((type) => ({ value: type, label: type }))
    ],
    []
  )

  const editorFloorOptions = useMemo<SelectOption[]>(
    () => floors.map((floor) => ({ value: floor.toString(), label: `${floor} этаж` })),
    [floors]
  )

  const genderOptions = useMemo<SelectOption[]>(
    () => [
      { value: 'Мужская', label: 'Мужская' },
      { value: 'Женская', label: 'Женская' }
    ],
    []
  )

  const transferFloorOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: 'Выберите этаж...' },
      ...floors.map((floor) => ({
        value: floor.toString(),
        label: `${floor} этаж`
      }))
    ],
    [floors]
  )

  const [availableTransferRoomObjs, setAvailableTransferRoomObjs] = useState<
    { id: string; number: string }[]
  >([])

  const transferRoomOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: 'Выберите палату...' },
      ...availableTransferRoomObjs.map((room) => ({
        value: room.id,
        label: `Палата ${room.number}`
      }))
    ],
    [availableTransferRoomObjs]
  )

  const transferReasonOptions: SelectOption[] = [
    { value: '', label: 'Выберите причину...' },
    { value: 'improvement', label: 'Улучшение состояния' },
    { value: 'deterioration', label: 'Ухудшение состояния (в реанимацию)' },
    { value: 'profile_change', label: 'Смена профиля лечения' },
    { value: 'conflict', label: 'Конфликт в палате' },
    { value: 'other', label: 'Другое' }
  ]

  const selectedRoom = rooms.find((room) => room.id === selectedId)

  const [editorNum, setEditorNum] = useState('')
  const [editorFloor, setEditorFloor] = useState(1)
  const [editorType, setEditorType] = useState<RoomType>('Обычная')
  const [editorGender, setEditorGender] = useState<GenderType>('Мужская')
  const [editorPriority, setEditorPriority] = useState(1)
  const [editorBeds, setEditorBeds] = useState<BedEntry[]>([])

  useEffect(() => {
    if (isTransferModalOpen) {
      setTransferDate(toLocalDateTimeLocalString(new Date()))
    }
  }, [isTransferModalOpen])

  useEffect(() => {
    if (transferFloor !== '') {
      getRoomsByFloor(Number(transferFloor))
        .then((res) => {
          setAvailableTransferRoomObjs(res.map((r) => ({ id: r.id, number: r.number })))
        })
        .catch(console.error)
      setTransferRoom('')
      setTransferBed('')
    } else {
      setAvailableTransferRoomObjs([])
    }
  }, [transferFloor])

  useEffect(() => {
    if (transferRoom) {
      fetchAdminBedsByRoom(transferRoom)
        .then((beds) => {
          let mapped = beds.map((b) => ({
            id: b.id,
            number: b.bedNumber,
            roomNumber: b.roomNumber,
            isFree: b.status === 'free',
            patientName:
              [b.patientLastName, b.patientName, b.patientMiddleName].filter(Boolean).join(' ') ||
              undefined,
            patientAge: b.patientAge,
            patientGender:
              (b as typeof b & { patientGender?: string; gender?: string }).patientGender ||
              (b as typeof b & { patientGender?: string; gender?: string }).gender
          }))
          if (showOnlyFree) {
            mapped = mapped.filter((b) => b.isFree)
          }
          setAvailableTransferBeds(mapped.sort((a, b) => a.number - b.number))
        })
        .catch(console.error)
      setTransferBed('')
    } else {
      setAvailableTransferBeds([])
    }
  }, [transferRoom, showOnlyFree])

  useEffect(() => {
    if (!assignBedData) return

    const query = patientSearchQuery.trim()

    if (query.length > 0 && query.length < 2) {
      setPatientSearchResults([])
      return
    }

    if (query.length === 0) {
      setPatientSearchResults([])
      return
    }

    const abortController = new AbortController()

    const timeoutId = window.setTimeout(() => {
      setPatientSearchLoading(true)
      searchPatients(query, abortController.signal)
        .then((results) => {
          if (!abortController.signal.aborted) setPatientSearchResults(results)
        })
        .catch((err) => {
          if (err.name === 'AbortError') return
          console.error('Error searching patients:', err)
          if (!abortController.signal.aborted) setPatientSearchResults([])
        })
        .finally(() => {
          if (!abortController.signal.aborted) setPatientSearchLoading(false)
        })
    }, 400)

    return () => {
      abortController.abort()
      window.clearTimeout(timeoutId)
    }
  }, [patientSearchQuery, assignBedData])

  useEffect(() => {
    if (!assignBedData) return

    const query = doctorSearchQuery.trim()

    const abortController = new AbortController()

    const timeoutId = window.setTimeout(() => {
      setDoctorSearchLoading(true)
      searchDoctors(query, abortController.signal)
        .then((docs) => {
          if (!abortController.signal.aborted) {
            setDoctorOptions(
              docs.map((d) => ({
                value: d.id,
                label: [d.fullName, d.position, d.department].filter(Boolean).join(' - ')
              }))
            )
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') return
          console.error('Error searching doctors:', err)
          if (!abortController.signal.aborted) setDoctorOptions([])
        })
        .finally(() => {
          if (!abortController.signal.aborted) setDoctorSearchLoading(false)
        })
    }, 400)

    return () => {
      abortController.abort()
      window.clearTimeout(timeoutId)
    }
  }, [doctorSearchQuery, assignBedData])

  const addBed = () => {
    const nextId = `new-${Date.now()}`
    setEditorBeds((prev) => [
      ...prev,
      { id: nextId, name: `Новое койко-место`, status: 'Свободно' }
    ])
  }

  const removeBed = (id: string) => {
    setEditorBeds((prev) => prev.filter((bed) => bed.id !== id))
  }

  const saveRoom = async () => {
    try {
      const bedsPayload = editorBeds.map((b) => {
        if (b.id.startsWith('new-')) return { isNew: true }
        return { id: b.id }
      })

      const payload = {
        number: editorNum,
        floor: editorFloor,
        type: mapLocalToRoomType(editorType),
        gender: mapLocalToRoomGender(editorGender),
        priority: editorPriority,
        beds: bedsPayload
      }

      let roomId = selectedId
      if (!roomId) {
        const newRoom = await apiCreateRoom(payload)
        roomId = newRoom.id
      } else {
        await updateRoom(roomId, { ...payload, roomId })
      }

      toast.success('Изменения сохранены')
      await loadRoomsFromServer()
      await loadRoomData(roomId)
    } catch (e: any) {
      showApiError(e, 'Ошибка сохранения палаты')
    }
  }

  const resetEditor = () => {
    if (selectedId) {
      loadRoomData(selectedId)
    }
  }

  const deleteRoom = async (id: string) => {
    if (!window.confirm('Удалить палату?')) return

    try {
      await apiDeleteRoom(id)
      toast.success('Палата удалена')

      const newRooms = rooms.filter((r) => r.id !== id)
      setRooms(newRooms)

      if (id === selectedId) {
        if (newRooms.length > 0) {
          loadRoomData(newRooms[0].id)
        } else {
          setSelectedId('')
          setEditorNum('')
          setEditorBeds([])
        }
      }
    } catch (e: any) {
      showApiError(e, 'Ошибка при удалении палаты')
    }
  }

  const loadDoctorOptions = async (query = '') => {
    try {
      const docs = await searchDoctors(query)
      setDoctorOptions(
        docs.map((d) => ({
          value: d.id,
          label: [d.fullName, d.position, d.department].filter(Boolean).join(' - ')
        }))
      )
    } catch (err) {
      console.error('Error searching doctors:', err)
      setDoctorOptions([])
    }
  }

  const handleOpenTransferModal = (patient: SearchPatientDto, location: Location) => {
    setSelectedPatient(patient)
    setSelectedPatientLocation(location)
    setIsTransferModalOpen(true)

    setShowOnlyFree(true)
    setTransferFloor('')
    setTransferRoom('')
    setTransferBed('')
    setTransferReason('')
    setTransferNotes('')
  }

  const handleOpenTransferFromBed = async (bed: BedEntry) => {
    if (!bed.patientId) {
      toast.error('На этой койке нет пациента!')
      return
    }

    const nameParts = (bed.patientName || '').split(' ').filter(Boolean)
    const fallbackPatient: SearchPatientDto = {
      id: bed.patientId,
      lastName: nameParts[0] || 'Пациент',
      firstName: nameParts[1] || '',
      middleName: nameParts.slice(2).join(' ') || undefined,
      dateOfBirth: toBackendDateTimeString(new Date()),
      age: bed.patientAge ?? 0,
      gender: bed.patientGender ?? 'Unknown'
    }

    let patient = fallbackPatient
    try {
      const results = await searchPatients(bed.patientName || bed.patientId)
      patient = results.find((item) => item.id === bed.patientId) || results[0] || fallbackPatient
    } catch (err) {
      console.error('Error loading patient for transfer:', err)
    }

    const location: Location = {
      floor: bed.location?.floor ?? editorFloor,
      room: bed.location?.room ?? editorNum,
      bedNumber: bed.bedNumber ?? 0,
      bedId: bed.id
    }
    handleOpenTransferModal(patient, location)
  }

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false)
    setSelectedPatient(null)
    setSelectedPatientLocation(null)
    setTransferFloor('')
    setTransferRoom('')
    setTransferBed('')
    setTransferReason('')
    setTransferNotes('')
  }

  const handleOpenAssignModal = (bed: BedEntry, room: Room) => {
    if (!bed.id || bed.id.startsWith('new-')) {
      toast.warning('Сначала сохраните палату, чтобы назначить пациента на новую койку.')
      return
    }

    setAssignBedData({
      floor: room.floor,
      roomId: room.id,
      room: room.number,
      bedNumber: bed.bedNumber ?? 0,
      bedId: bed.id,
      priority: room.priority
    })
    setAssignDate(toLocalDateTimeLocalString(new Date()))
    setAssignDoctor('')
    setDoctorOptions([])
    setDoctorSearchQuery('')
    setAssignNotes('')
    setAssignNotify(true)
    setPatientSearchQuery('')
    setPatientSearchResults([])
    setSelectedPatientForAssign(null)

    loadDoctorOptions()
  }

  const handleCloseAssignModal = () => {
    setAssignBedData(null)
    setPatientSearchQuery('')
    setDoctorSearchQuery('')
    setPatientSearchResults([])
    setSelectedPatientForAssign(null)
  }

  const handleAssignSubmit = async () => {
    if (!selectedPatientForAssign || !assignBedData) {
      toast.error('Выберите пациента')
      return
    }
    try {
      await assignPatient({
        bedId: assignBedData.bedId,
        patientId: selectedPatientForAssign.id,
        notes: assignNotes,
        doctorId: assignDoctor || undefined,
        admissionDateTime: assignDate ? toBackendDateTimeString(assignDate) : undefined
      })

      await updateRoomPriority(assignBedData.roomId, assignBedData.priority)

      toast.success('Пациент успешно назначен на койку!')
      handleCloseAssignModal()
      await loadRoomsFromServer()
      if (selectedId) await loadRoomData(selectedId)
    } catch (e: any) {
      showApiError(e, 'Ошибка назначения пациента')
    }
  }

  const handleTransferSubmit = async () => {
    if (!selectedPatient || !transferBed || !selectedPatientLocation) {
      console.warn('Transfer submit validation failed', { selectedPatient, transferBed })
      return
    }
    try {
      const targetRoomId = transferRoom
      const transferDateTime = transferDate
        ? toBackendDateTimeString(transferDate)
        : toBackendDateTimeString(new Date())

      await transferPatient({
        patientId: selectedPatient.id,
        fromBedId: selectedPatientLocation.bedId,
        toBedId: transferBed,
        sourceBedId: selectedPatientLocation.bedId,
        targetBedId: transferBed,
        transferDateTime,
        reason: transferReason,
        notes: transferNotes
      })

      toast.success('Пациент успешно перемещен')
      handleCloseTransferModal()
      await loadRoomsFromServer()
      const roomIdToReload = targetRoomId || selectedId
      if (roomIdToReload) await loadRoomData(roomIdToReload)
    } catch (e: any) {
      console.error('Transfer submit - error:', e)
      showApiError(e, 'Ошибка при перемещении пациента')
    }
  }

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      if (floorFilter !== 'all' && room.floor !== parseInt(floorFilter, 10)) return false
      if (typeFilter !== 'all' && room.type !== typeFilter) return false
      if (search && !room.number.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [rooms, floorFilter, typeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const totalBeds = rooms.reduce((sum, room) => sum + (room.bedsCount ?? room.beds.length), 0)
  const isConfirmDisabled = !transferFloor || !transferRoom || !transferBed || !transferReason
  const selectedBedAvatarLabel = selectedPatientLocation
    ? formatBedShortLabel(selectedPatientLocation.bedNumber)
    : 'К'

  const progress = ((editorPriority - 1) / (5 - 1)) * 100
  return (
    <PageWrapper>
      <StyledCard>
        <CardHeader>
          <HeaderRow>
            <div>
              <PageTitle>Администрирование палат</PageTitle>
              <CardSubtitle>
                Управление структурой отделения и коечным фондом пульмонологического отделения
              </CardSubtitle>
            </div>
          </HeaderRow>
        </CardHeader>

        <CardContent>
          <StatsBadgesRow>
            <StatBadge>
              <StatBadgeLabel>Всего палат</StatBadgeLabel>
              <StatBadgeValue>{rooms.length}</StatBadgeValue>
            </StatBadge>
            <StatBadge>
              <StatBadgeLabel>Всего коек</StatBadgeLabel>
              <StatBadgeValue>{totalBeds}</StatBadgeValue>
            </StatBadge>
          </StatsBadgesRow>
        </CardContent>
      </StyledCard>

      <TwoColLayout>
        <div>
          <FilterBar>
            <FilterIcon>
              <SlidersHorizontal size={14} />
              Фильтры:
            </FilterIcon>

            <div style={{ minWidth: 0 }}>
              <Select
                inputId="floor-filter-select"
                placeholder="Все этажи"
                options={floorFilterOptions}
                styles={selectStyles}
                components={selectComponents}
                isSearchable={false}
                value={floorFilterOptions.find((option) => option.value === floorFilter) ?? null}
                onChange={(option) => {
                  setFloorFilter(option?.value ?? 'all')
                  setPage(1)
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <Select
                inputId="type-filter-select"
                placeholder="Все типы"
                options={typeFilterOptions}
                styles={selectStyles}
                components={selectComponents}
                isSearchable={false}
                value={typeFilterOptions.find((option) => option.value === typeFilter) ?? null}
                onChange={(option) => {
                  setTypeFilter(option?.value ?? 'all')
                  setPage(1)
                }}
              />
            </div>

            <SearchInput
              type="text"
              placeholder="Поиск по номеру..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />

            <ResetBtn
              onClick={() => {
                setFloorFilter('all')
                setTypeFilter('all')
                setSearch('')
                setPage(1)
              }}
            >
              Сбросить
            </ResetBtn>
          </FilterBar>

          <TableWrap>
            <TableContainer>
              <Table>
                <Thead>
                  <tr>
                    <Th>Этаж</Th>
                    <Th>Номер</Th>
                    <Th>Тип</Th>
                    <Th>Пол</Th>
                    <Th>Койки</Th>
                    <Th>Приор.</Th>
                    <Th>Действия</Th>
                  </tr>
                </Thead>

                <Tbody>
                  {paged.map((room) => (
                    <Tr
                      key={room.id}
                      $selected={room.id === selectedId}
                      onClick={() => loadRoomData(room.id)}
                    >
                      <TdMuted>{room.floor}</TdMuted>
                      <TdBold>{room.number}</TdBold>

                      <Td>
                        <TypeBadge $type={room.type}>{room.type}</TypeBadge>
                      </Td>

                      <Td>
                        <GenderCell>
                          {getGenderIcon(room.gender)}
                          {room.gender}
                        </GenderCell>
                      </Td>

                      <Td>
                        <BedCountCell>
                          <BedCountNum>{room.bedsCount ?? room.beds.length}</BedCountNum>
                          <BedCountUnit>ед.</BedCountUnit>
                        </BedCountCell>
                      </Td>

                      <Td>
                        <PriorityWrap>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <PriorityBar key={level} $filled={level <= room.priority} />
                          ))}
                        </PriorityWrap>
                      </Td>

                      <Td onClick={(event) => event.stopPropagation()}>
                        <ActionCell>
                          <ActionIconBtn
                            title="Редактировать"
                            onClick={() => loadRoomData(room.id)}
                          >
                            <Pencil size={13} />
                          </ActionIconBtn>
                          <ActionIconBtn
                            $danger
                            title="Удалить"
                            onClick={() => deleteRoom(room.id)}
                          >
                            <Trash2 size={13} />
                          </ActionIconBtn>
                        </ActionCell>
                      </Td>
                    </Tr>
                  ))}

                  {paged.length === 0 && (
                    <tr>
                      <Td
                        colSpan={7}
                        style={{
                          textAlign: 'center',
                          padding: '32px 16px',
                          color: '#94a3b8',
                          fontSize: 13
                        }}
                      >
                        Палаты не найдены
                      </Td>
                    </tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            <PaginationRow>
              <PaginationInfo>
                Показано {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}-
                {Math.min(safePage * PAGE_SIZE, filtered.length)} из {filtered.length} палат
              </PaginationInfo>

              <PaginationBtns>
                <PageBtn
                  disabled={safePage === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft size={13} />
                </PageBtn>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <PageBtn
                    key={pageNumber}
                    $active={pageNumber === safePage}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PageBtn>
                ))}

                <PageBtn
                  disabled={safePage === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  <ChevronRight size={13} />
                </PageBtn>
              </PaginationBtns>
            </PaginationRow>
          </TableWrap>
        </div>

        <EditorPanel>
          <EditorTitle>Редактор палаты</EditorTitle>
          <EditorSubtitle>Параметры палаты и конфигурация коек</EditorSubtitle>

          <FormRow>
            <FormGroup>
              <FormLabel>Номер палаты</FormLabel>
              <FormInput
                value={editorNum}
                onChange={(event) => setEditorNum(event.target.value)}
                placeholder="305"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Этаж</FormLabel>
              <div style={{ minWidth: 0 }}>
                <Select
                  inputId="editor-floor-select"
                  options={editorFloorOptions}
                  styles={selectStyles}
                  components={selectComponents}
                  isSearchable={false}
                  value={
                    editorFloorOptions.find((option) => option.value === editorFloor.toString()) ??
                    null
                  }
                  onChange={(option) => setEditorFloor(parseInt(option?.value ?? '1', 10))}
                />
              </div>
            </FormGroup>
          </FormRow>

          <Divider />

          <FormGroup style={{ marginBottom: 16 }}>
            <FormLabel>Тип палаты</FormLabel>
            <RadioGroup>
              {ROOM_TYPES.map((type) => (
                <RadioLabel key={type}>
                  <input
                    type="radio"
                    name="room-type"
                    value={type}
                    checked={editorType === type}
                    onChange={() => setEditorType(type)}
                  />
                  <span>{type}</span>
                </RadioLabel>
              ))}
            </RadioGroup>
          </FormGroup>

          <Divider />

          <FormGroup style={{ marginBottom: 16 }}>
            <FormLabel>Профиль по полу</FormLabel>
            <div style={{ minWidth: 0 }}>
              <Select
                inputId="editor-gender-select"
                options={genderOptions}
                styles={selectStyles}
                components={selectComponents}
                isSearchable={false}
                value={genderOptions.find((option) => option.value === editorGender) ?? null}
                onChange={(option) =>
                  setEditorGender((option?.value ?? 'Смешанная (Mixed)') as GenderType)
                }
              />
            </div>
          </FormGroup>

          <Divider />

          <SliderRow>
            <SliderLabel>
              Приоритет обслуживания
              <PriorityBadge>{editorPriority}</PriorityBadge>
            </SliderLabel>
            <PriorityLevelLabel>{PRIORITY_LABELS[editorPriority]}</PriorityLevelLabel>
          </SliderRow>
          <RangeInput
            type="range"
            min={1}
            max={5}
            step={1}
            value={editorPriority}
            style={{ '--progress': `${progress}%` }}
            onChange={(event) => setEditorPriority(parseInt(event.target.value, 10))}
          />

          <Divider />

          <BedsMgmtHeader>
            <BedsMgmtTitle>Управление койками</BedsMgmtTitle>
            <AddBedBtn onClick={addBed}>
              <Plus size={13} />
              Добавить
            </AddBedBtn>
          </BedsMgmtHeader>

          <BedsList>
            {editorBeds.length === 0 ? (
              <EmptyBedsState>
                В этой палате пока нет коек.
                <br />
                Добавьте новое койко-место через кнопку выше.
              </EmptyBedsState>
            ) : (
              [...editorBeds]
                .sort((a, b) => {
                  if (a.status === 'Занято' && b.status === 'Свободно') return -1
                  if (a.status === 'Свободно' && b.status === 'Занято') return 1
                  return (
                    (a.bedNumber ?? Number.MAX_SAFE_INTEGER) -
                    (b.bedNumber ?? Number.MAX_SAFE_INTEGER)
                  )
                })
                .map((bed) => (
                  <BedItem key={bed.id} $extra={bed.status === 'Свободно'}>
                    <BedTag>{formatBedShortLabel(bed.bedNumber)}</BedTag>
                    <BedInfo>
                      <BedName>
                        {bed.bedNumber ? formatBedTextLabel(bed.bedNumber) : 'Новая койка'}
                      </BedName>
                      {bed.status === 'Занято' ? (
                        <>
                          <BedId>
                            {bed.patientName || 'Нет данных'}{' '}
                            {bed.patientAge ? `(${bed.patientAge} лет)` : ''}
                          </BedId>
                          <BedId>Пол: {formatPatientGender(bed.patientGender)}</BedId>
                        </>
                      ) : (
                        <BedId
                          onClick={() => handleOpenAssignModal(bed, selectedRoom!)}
                          style={{ cursor: 'pointer', color: '#2563EB' }}
                        >
                          {bed.status === 'Свободно' && 'Назначить пациента'}
                        </BedId>
                      )}
                    </BedInfo>
                    <BedStatus>{bed.status}</BedStatus>
                    {bed.status === 'Свободно' && (
                      <ActionIconBtn
                        $userplus={true}
                        title="Назначить пациента"
                        onClick={() => {
                          handleOpenAssignModal(bed, selectedRoom!)
                        }}
                      >
                        <UserPlus size={13} />
                      </ActionIconBtn>
                    )}
                    <ActionIconBtn
                      title="Переместить пациента"
                      onClick={() => handleOpenTransferFromBed(bed)}
                    >
                      <ArrowRight size={13} />
                    </ActionIconBtn>
                    <BedDeleteBtn onClick={() => removeBed(bed.id)}>
                      <Trash2 size={13} />
                    </BedDeleteBtn>
                  </BedItem>
                ))
            )}
          </BedsList>

          <EditorFooter>
            <SaveBtn onClick={saveRoom}>
              <Save size={15} />
              Сохранить изменения
            </SaveBtn>
            <ResetEditorBtn onClick={resetEditor} title="Сбросить">
              <RotateCcw size={15} />
            </ResetEditorBtn>
          </EditorFooter>
        </EditorPanel>
      </TwoColLayout>

      {selectedPatient &&
        selectedPatientLocation &&
        createPortal(
          <Overlay onClick={(e) => e.target === e.currentTarget && handleCloseTransferModal()}>
            <ModalShell id="target">
              <ModalHeader>
                <ModalHeaderText>
                  <ModalRow>
                    <ModalIconWrap>
                      <ArrowLeftRight size={24} />
                    </ModalIconWrap>
                    <ModalTitle>Перемещение пациента</ModalTitle>
                  </ModalRow>
                  <ModalSubtitle>
                    Выберите новое место размещения и укажите детали перевода
                  </ModalSubtitle>
                </ModalHeaderText>

                <CloseBtn onClick={handleCloseTransferModal} aria-label="Закрыть">
                  <X size={20} />
                </CloseBtn>
              </ModalHeader>

              <ModalContent>
                <ModalInfoPatient>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <PatientAvatar style={{ width: 44, height: 44, fontSize: 14 }}>
                      {selectedBedAvatarLabel}
                    </PatientAvatar>
                    <div>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: '#111827',
                          letterSpacing: '-0.03em'
                        }}
                      >
                        {formatPatientFullName(selectedPatient)}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                        {formatBedTextLabel(selectedPatientLocation.bedNumber)} ·{' '}
                        {formatPatientAge(selectedPatient.age)} ·{' '}
                        {formatPatientGender(selectedPatient.gender)}
                      </div>
                    </div>
                  </div>
                </ModalInfoPatient>

                <Section>
                  <LocationRow>
                    <LocationCard>
                      <LocationCardLabel>
                        <Building size={14} />
                        Текущее место
                      </LocationCardLabel>
                      <LocationFieldsGrid>
                        <LocationField>
                          <LocationFieldLabel>Этаж</LocationFieldLabel>
                          <LocationFieldValue>{selectedPatientLocation.floor}</LocationFieldValue>
                        </LocationField>
                        <LocationField>
                          <LocationFieldLabel>Палата</LocationFieldLabel>
                          <LocationFieldValue>{selectedPatientLocation.room}</LocationFieldValue>
                        </LocationField>
                        <LocationField>
                          <LocationFieldLabel>Койка</LocationFieldLabel>
                          <LocationFieldValue>
                            {formatBedShortLabel(selectedPatientLocation.bedNumber)}
                          </LocationFieldValue>
                        </LocationField>
                      </LocationFieldsGrid>
                    </LocationCard>

                    <ArrowWrap>
                      <ArrowCircle>
                        <ArrowRight size={20} />
                      </ArrowCircle>
                    </ArrowWrap>

                    <LocationCard $new $filled={!!transferBed}>
                      <LocationCardLabel $accent>
                        <BedDouble size={14} />
                        Новое место
                      </LocationCardLabel>
                      <LocationFieldsGrid>
                        <LocationField $highlighted={!!transferFloor}>
                          <LocationFieldLabel>Этаж</LocationFieldLabel>
                          <LocationFieldValue>{transferFloor || '—'}</LocationFieldValue>
                        </LocationField>
                        <LocationField $highlighted={!!transferRoom}>
                          <LocationFieldLabel>Палата</LocationFieldLabel>
                          <LocationFieldValue>
                            {availableTransferRoomObjs.find((r) => r.id === transferRoom)?.number ||
                              '—'}
                          </LocationFieldValue>
                        </LocationField>
                        <LocationField $selected={!!transferBed}>
                          <LocationFieldLabel $light={!!transferBed}>Койка</LocationFieldLabel>
                          <LocationFieldValue $white={!!transferBed}>
                            {transferBed
                              ? formatBedShortLabel(
                                  availableTransferBeds.find((b) => b.id === transferBed)?.number
                                )
                              : '—'}
                          </LocationFieldValue>
                        </LocationField>
                      </LocationFieldsGrid>
                    </LocationCard>
                  </LocationRow>
                </Section>

                <Section>
                  <SelectionCard>
                    <SelectionTopRow>
                      <SelectionTitle>Выбор нового места</SelectionTitle>
                      <FreeOnlyLabel>
                        <input
                          type="checkbox"
                          checked={showOnlyFree}
                          onChange={(e) => setShowOnlyFree(e.target.checked)}
                        />
                        Показывать только свободные
                      </FreeOnlyLabel>
                    </SelectionTopRow>

                    <SelectsGrid>
                      <SelectField>
                        <SelectLabel>Этаж</SelectLabel>
                        <div style={{ minWidth: 0 }}>
                          <Select
                            inputId="transfer-floor-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            options={transferFloorOptions}
                            styles={selectStyles}
                            components={selectComponents}
                            isSearchable={false}
                            isClearable={false}
                            value={
                              transferFloorOptions.find(
                                (option) => option.value === transferFloor.toString()
                              ) ?? null
                            }
                            onChange={(option) =>
                              setTransferFloor(option?.value ? Number(option.value) : '')
                            }
                          />
                        </div>
                      </SelectField>

                      <SelectField>
                        <SelectLabel>Палата</SelectLabel>
                        <div style={{ minWidth: 0 }}>
                          <Select
                            inputId="transfer-room-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            options={transferRoomOptions}
                            styles={selectStyles}
                            components={selectComponents}
                            isSearchable={false}
                            isClearable={false}
                            isDisabled={!transferFloor}
                            value={
                              transferRoomOptions.find((option) => option.value === transferRoom) ??
                              null
                            }
                            onChange={(option) => setTransferRoom(option?.value ?? '')}
                          />
                        </div>
                      </SelectField>
                    </SelectsGrid>

                    {transferRoom && (
                      <BedsSection>
                        <BedsLabel>Доступные койки</BedsLabel>

                        {availableTransferBeds.length === 0 ? (
                          <NoBedsBanner>
                            <AlertCircle size={18} style={{ flexShrink: 0 }} />
                            <p style={{ margin: 0 }}>
                              В этой палате нет {showOnlyFree ? 'свободных ' : ''}коек.
                            </p>
                          </NoBedsBanner>
                        ) : (
                          <BedsGrid>
                            {[...availableTransferBeds]
                              .sort((a, b) => a.number - b.number)
                              .map((bed) => {
                                const label = `К${bed.number}`
                                const isSelected = transferBed === bed.id

                                return (
                                  <BedBtn
                                    key={bed.id}
                                    type="button"
                                    $free={bed.isFree}
                                    $selected={isSelected}
                                    disabled={!bed.isFree}
                                    onClick={() =>
                                      setTransferBed((prev) => (prev === bed.id ? '' : bed.id))
                                    }
                                  >
                                    <BedStatusDot $free={bed.isFree} />
                                    <BedDouble size={22} />
                                    <BedBtnLabel>{label}</BedBtnLabel>

                                    {isSelected && (
                                      <BedSelectedMark>
                                        <CheckCircle2 size={14} />
                                      </BedSelectedMark>
                                    )}
                                  </BedBtn>
                                )
                              })}
                          </BedsGrid>
                        )}
                      </BedsSection>
                    )}
                  </SelectionCard>
                </Section>

                <Section>
                  <DetailsCard>
                    <DetailsSectionTitle>Детали перевода</DetailsSectionTitle>

                    <DetailsGrid>
                      <DetailsField>
                        <DetailsLabel>
                          <Clock size={14} />
                          Время перевода
                        </DetailsLabel>
                        <StyledInput
                          type="datetime-local"
                          value={transferDate}
                          onChange={(e) => setTransferDate(e.target.value)}
                        />
                      </DetailsField>

                      <DetailsField>
                        <DetailsLabel>
                          <FileText size={14} />
                          Причина перевода
                        </DetailsLabel>
                        <div style={{ minWidth: 0 }}>
                          <Select
                            inputId="transfer-reason-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            options={transferReasonOptions}
                            styles={selectStyles}
                            components={selectComponents}
                            isSearchable={false}
                            isClearable={false}
                            value={
                              transferReasonOptions.find(
                                (option) => option.value === transferReason
                              ) ?? null
                            }
                            onChange={(option) => setTransferReason(option?.value ?? '')}
                          />
                        </div>
                      </DetailsField>
                    </DetailsGrid>

                    <DetailsField>
                      <DetailsLabel>
                        Примечания <DetailsOptional>(необязательно)</DetailsOptional>
                      </DetailsLabel>
                      <StyledTextarea
                        value={transferNotes}
                        onChange={(e) => setTransferNotes(e.target.value)}
                        rows={3}
                        placeholder="Укажите дополнительные детали, если необходимо..."
                      />
                    </DetailsField>
                  </DetailsCard>
                </Section>
              </ModalContent>

              <ModalFooter>
                <CancelBtn type="button" onClick={handleCloseTransferModal}>
                  Отмена
                </CancelBtn>
                <ConfirmBtn
                  type="button"
                  onClick={handleTransferSubmit}
                  disabled={isConfirmDisabled}
                >
                  Подтвердить перемещение
                </ConfirmBtn>
              </ModalFooter>
            </ModalShell>
          </Overlay>,
          document.body
        )}

      {assignBedData &&
        createPortal(
          <Overlay onClick={(e) => e.target === e.currentTarget && handleCloseAssignModal()}>
            <ModalShell id="target">
              <ModalHeader>
                <ModalHeaderText>
                  <ModalRow>
                    <ModalIconWrap>
                      <UserPlus size={24} />
                    </ModalIconWrap>
                    <ModalTitle>Назначить пациента на койку</ModalTitle>
                  </ModalRow>
                  <ModalSubtitle>
                    Заполните данные для госпитализации в палату {assignBedData.room}, Койка К
                    {assignBedData.bedNumber}
                  </ModalSubtitle>
                </ModalHeaderText>
                <CloseBtn onClick={handleCloseAssignModal} aria-label="Закрыть">
                  <X size={20} />
                </CloseBtn>
              </ModalHeader>

              <ModalContent>
                <Section>
                  <SectionHeaderFlex>
                    <DetailsSectionTitle style={{ paddingBottom: 0, borderBottom: 'none' }}>
                      ДАННЫЕ ПАЦИЕНТА
                    </DetailsSectionTitle>
                    <NewPatientBtn type="button">
                      <Plus size={14} />
                      Новый пациент
                    </NewPatientBtn>
                  </SectionHeaderFlex>
                  <div style={{ minWidth: 0, marginTop: '12px' }}>
                    <Select
                      inputId="patient-search-select"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      placeholder="ФИО, номер истории или телефон..."
                      styles={selectStyles}
                      components={selectComponents}
                      isLoading={patientSearchLoading}
                      isSearchable={true}
                      isClearable={true}
                      onInputChange={(val, meta) => {
                        if (meta.action === 'input-change') {
                          setPatientSearchQuery(val)
                        }
                      }}
                      filterOption={() => true}
                      options={patientSearchResults.map((p) => ({
                        value: p.id,
                        label: `${p.numberCard ?? 'Без номера'} | ${p.firstName} ${p.lastName} ${p.middleName} (Возраст: ${p.age} | Пол: ${formatPatientGender(p.gender)}) ${p.phoneNumber ?? ''}`,
                        data: p
                      }))}
                      value={
                        selectedPatientForAssign
                          ? {
                              value: selectedPatientForAssign.id,
                              label: `${selectedPatientForAssign.firstName} ${selectedPatientForAssign.lastName} (Возраст: ${selectedPatientForAssign.age} | Пол: ${formatPatientGender(selectedPatientForAssign.gender)})`,
                              data: selectedPatientForAssign
                            }
                          : null
                      }
                      onChange={(option: any) => {
                        setSelectedPatientForAssign(option?.data || null)
                      }}
                      noOptionsMessage={() =>
                        patientSearchQuery ? 'Ничего не найдено' : 'Введите текст для поиска...'
                      }
                    />
                  </div>

                  {selectedPatientForAssign && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#ecfdf5',
                        borderRadius: '6px',
                        border: '1px solid #86efac',
                        fontSize: '13px'
                      }}
                    >
                      ✓ Выбран пациент: {selectedPatientForAssign.firstName}{' '}
                      {selectedPatientForAssign.lastName}
                    </div>
                  )}
                </Section>

                <Divider />

                <Section>
                  <DetailsSectionTitle>ДЕТАЛИ ГОСПИТАЛИЗАЦИИ</DetailsSectionTitle>
                  <DetailsGrid>
                    <DetailsField>
                      <DetailsLabel>Дата и время поступления</DetailsLabel>
                      <StyledInput
                        type="datetime-local"
                        value={assignDate}
                        onChange={(e) => setAssignDate(e.target.value)}
                      />
                    </DetailsField>
                    <DetailsField>
                      <DetailsLabel>Лечащий врач</DetailsLabel>
                      <div style={{ minWidth: 0 }}>
                        <Select
                          inputId="assign-doctor-select"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          options={doctorOptions}
                          styles={selectStyles}
                          components={selectComponents}
                          placeholder="Выберите врача..."
                          isLoading={doctorSearchLoading}
                          isSearchable={true}
                          filterOption={() => true}
                          onInputChange={(val, meta) => {
                            if (meta.action === 'input-change') {
                              setDoctorSearchQuery(val)
                            }
                          }}
                          value={doctorOptions.find((o) => o.value === assignDoctor) ?? null}
                          onChange={(option) => setAssignDoctor(option?.value ?? '')}
                          noOptionsMessage={() =>
                            doctorSearchQuery ? 'Врачи не найдены' : 'Введите имя врача...'
                          }
                        />
                      </div>
                    </DetailsField>
                  </DetailsGrid>

                  <DetailsField style={{ marginTop: 20 }}>
                    <DetailsLabel>Заметки / Особые отметки</DetailsLabel>
                    <StyledTextarea
                      rows={3}
                      placeholder="Укажите особенности (аллергии, режим, диета)..."
                      value={assignNotes}
                      onChange={(e) => setAssignNotes(e.target.value)}
                    />
                  </DetailsField>

                  <NotificationBox>
                    <CheckboxWrap>
                      <input
                        type="checkbox"
                        checked={assignNotify}
                        onChange={(e) => setAssignNotify(e.target.checked)}
                      />
                      Отправить уведомление пациенту
                    </CheckboxWrap>
                    <CheckboxHint>
                      Пациент получит SMS с информацией о номере палаты и лечащем враче.
                    </CheckboxHint>
                  </NotificationBox>
                </Section>
              </ModalContent>

              <ModalFooter style={{ justifyContent: 'space-between' }}>
                <FooterLeftInfo>
                  <div>
                    <LocationText>
                      <MapPin size={16} />
                      {assignBedData.floor} этаж, палата {assignBedData.room}, К
                      {assignBedData.bedNumber}
                    </LocationText>
                    {selectedPatientForAssign && (
                      <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
                        <div>
                          <strong>Пациент:</strong> {selectedPatientForAssign.firstName}{' '}
                          {selectedPatientForAssign.lastName}
                        </div>
                        <div>
                          <strong>Возраст:</strong> {selectedPatientForAssign.age} лет
                        </div>
                        <div>
                          <strong>Пол:</strong>{' '}
                          {formatPatientGender(selectedPatientForAssign.gender)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b' }}>Приоритет:</label>
                    <div style={{ minWidth: '200px' }}>
                      <Select
                        inputId="assign-priority-select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuPlacement="auto"
                        styles={selectStyles}
                        components={selectComponents}
                        isSearchable={false}
                        options={[1, 2, 3, 4, 5].map((level) => ({
                          value: level.toString(),
                          label: `${level} - ${PRIORITY_LABELS[level]}`
                        }))}
                        value={{
                          value: assignBedData.priority.toString(),
                          label: `${assignBedData.priority} - ${PRIORITY_LABELS[assignBedData.priority]}`
                        }}
                        onChange={(option: any) =>
                          setAssignBedData((prev) =>
                            prev ? { ...prev, priority: parseInt(option.value) } : null
                          )
                        }
                      />
                    </div>
                  </div>
                </FooterLeftInfo>
                <FooterRightActions>
                  <CancelBtn type="button" onClick={handleCloseAssignModal}>
                    Отмена
                  </CancelBtn>
                  <ConfirmBtn
                    type="button"
                    onClick={handleAssignSubmit}
                    disabled={!selectedPatientForAssign || !assignDoctor}
                  >
                    <Check size={16} />
                    Назначить пациента
                  </ConfirmBtn>
                </FooterRightActions>
              </ModalFooter>
            </ModalShell>
          </Overlay>,
          document.body
        )}
    </PageWrapper>
  )
}

export default WardAdmin
