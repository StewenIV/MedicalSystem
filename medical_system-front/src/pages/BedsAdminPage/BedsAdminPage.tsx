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
import { mockHospitalBeds, roomsConfig, type HospitalBed, mockPatients } from 'data/mockData'

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
type GenderType = 'Мужская' | 'Женская' | 'Смешанная (Mixed)'

interface Location {
  floor: number
  room: string
  bed: string
}

interface BedMock {
  id: string
  roomNumber: string
  bedNumber: number
  isFree: boolean
}

interface BedEntry {
  id: number
  name: string
  status: 'Занято' | 'Свободно'
  location?: Location
}

interface Room {
  id: string
  floor: number
  number: string
  type: RoomType
  gender: GenderType
  beds: BedEntry[]
  priority: number
}

interface SelectOption {
  value: string
  label: string
}

const PAGE_SIZE = 5

const doctorOptions: SelectOption[] = [
  { value: 'doc1', label: '👨‍⚕️ Иванов И.И.' },
  { value: 'doc2', label: '👩‍⚕️ Петрова А.С.' },
  { value: 'doc3', label: '👨‍⚕️ Сидоров В.В.' }
]

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Низкий',
  2: 'Средний',
  3: 'Средний',
  4: 'Высокий',
  5: 'Критичный'
}

const ROOM_TYPES: RoomType[] = ['Обычная', 'Реанимация', 'Изолятор']

const getRoomFloor = (roomNumber: string) => {
  const floor = parseInt(roomNumber.charAt(0), 10)
  return Number.isNaN(floor) ? 1 : floor
}

const getRoomType = (roomNumber: string, beds: HospitalBed[]): RoomType => {
  if (roomNumber.endsWith('-I')) return 'Изолятор'
  if (roomNumber.endsWith('-R') || beds.some((bed) => bed.status === 'urgent')) {
    return 'Реанимация'
  }

  return 'Обычная'
}

const getRoomGender = (roomNumber: string): GenderType => {
  const gender = roomsConfig[roomNumber]?.gender

  if (gender === 'male') return 'Мужская'
  if (gender === 'female') return 'Женская'

  return 'Смешанная (Mixed)'
}

const getRoomPriority = (beds: HospitalBed[]) => {
  if (beds.some((bed) => bed.status === 'urgent')) return 5
  if (beds.some((bed) => bed.status === 'attention')) return 4
  if (beds.some((bed) => bed.status === 'stable')) return 2
  return 1
}

const getBedDisplayStatus = (bed: HospitalBed) => {
  return bed.status === 'free' ? 'Свободно' : 'Занято'
}

const getBedDisplayName = (bed: HospitalBed) => {
  const patientName = [bed.patientLastName, bed.patientName].filter(Boolean).join(' ')
  return patientName || `Койко-место #${bed.bedNumber}`
}

const buildRoomsFromBeds = (beds: HospitalBed[]): Room[] => {
  const grouped = beds.reduce<Record<string, HospitalBed[]>>((acc, bed) => {
    if (!acc[bed.roomNumber]) {
      acc[bed.roomNumber] = []
    }

    acc[bed.roomNumber].push(bed)
    return acc
  }, {})

  return Object.entries(grouped)
    .sort(([roomA], [roomB]) => roomA.localeCompare(roomB))
    .map(([roomNumber, roomBeds]) => ({
      id: roomNumber,
      floor: getRoomFloor(roomNumber),
      number: roomNumber,
      type: getRoomType(roomNumber, roomBeds),
      gender: getRoomGender(roomNumber),
      priority: getRoomPriority(roomBeds),
      beds: roomBeds
        .slice()
        .sort((a, b) => a.bedNumber - b.bedNumber)
        .map((bed) => ({
          id: bed.bedNumber,
          name: getBedDisplayName(bed),
          status: getBedDisplayStatus(bed),
          location: {
            floor: getRoomFloor(bed.roomNumber),
            room: bed.roomNumber,
            bed: bed.bedNumber.toString()
          }
        }))
    }))
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

const getAvailableFloorsFromBeds = (): number[] => {
  const floors = new Set(mockHospitalBeds.map((bed) => getRoomFloor(bed.roomNumber)))
  return Array.from(floors).sort((a, b) => a - b)
}

const getAvailableRoomsForFloor = (floor: number): string[] => {
  const rooms = new Set(
    mockHospitalBeds
      .filter((bed) => getRoomFloor(bed.roomNumber) === floor)
      .map((bed) => bed.roomNumber)
  )
  return Array.from(rooms).sort()
}

const getBedsForRoom = (roomNumber: string, showOnlyFree: boolean = true): BedMock[] => {
  let beds = mockHospitalBeds.filter((bed) => bed.roomNumber === roomNumber)

  if (showOnlyFree) {
    beds = beds.filter((bed) => bed.status === 'free')
  }

  return beds.map((bed) => ({
    id: bed.id,
    roomNumber: bed.roomNumber,
    bedNumber: bed.bedNumber,
    isFree: bed.status === 'free'
  }))
}

export function WardAdmin() {
  const initialRooms = useMemo(() => buildRoomsFromBeds(mockHospitalBeds), [])
  const initialSelectedRoom = initialRooms[0]

  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [floorFilter, setFloorFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(initialSelectedRoom?.id ?? '')

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<(typeof mockPatients)[0] | null>(null)
  const [selectedPatientLocation, setSelectedPatientLocation] = useState<Location | null>(null)

  const [showOnlyFree, setShowOnlyFree] = useState(true)
  const [transferFloor, setTransferFloor] = useState<number | ''>('')
  const [transferRoom, setTransferRoom] = useState<string>('')
  const [transferBed, setTransferBed] = useState<string>('')
  const [transferDate, setTransferDate] = useState<string>('')
  const [transferReason, setTransferReason] = useState<string>('')
  const [transferNotes, setTransferNotes] = useState<string>('')

  const [availableTransferRooms, setAvailableTransferRooms] = useState<string[]>([])
  const [availableTransferBeds, setAvailableTransferBeds] = useState<BedMock[]>([])

  const [assignBedData, setAssignBedData] = useState<{
    floor: number
    room: string
    bed: number
    priority: number
  } | null>(null)
  const [assignDate, setAssignDate] = useState<string>('')
  const [assignDoctor, setAssignDoctor] = useState<string>('')
  const [assignNotes, setAssignNotes] = useState<string>('')
  const [assignNotify, setAssignNotify] = useState<boolean>(true)
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>('')

  const floors = useMemo(() => {
    const nextFloors = Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b)
    return nextFloors.length > 0 ? nextFloors : [1]
  }, [rooms])

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
      { value: 'Женская', label: 'Женская' },
      { value: 'Смешанная (Mixed)', label: 'Смешанная (Mixed)' }
    ],
    []
  )

  const transferFloorOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: 'Выберите этаж...' },
      ...getAvailableFloorsFromBeds().map((floor) => ({
        value: floor.toString(),
        label: `${floor} этаж`
      }))
    ],
    []
  )

  const transferRoomOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: 'Выберите палату...' },
      ...availableTransferRooms.map((room) => ({ value: room, label: `Палата ${room}` }))
    ],
    [availableTransferRooms]
  )

  const transferReasonOptions: SelectOption[] = [
    { value: '', label: 'Выберите причину...' },
    { value: 'improvement', label: 'Улучшение состояния' },
    { value: 'deterioration', label: 'Ухудшение состояния (в реанимацию)' },
    { value: 'profile_change', label: 'Смена профиля лечения' },
    { value: 'conflict', label: 'Конфликт в палате' },
    { value: 'other', label: 'Другое' }
  ]

  const selectedRoom = rooms.find((room) => room.id === selectedId) ?? initialSelectedRoom

  const [editorNum, setEditorNum] = useState(selectedRoom?.number ?? '')
  const [editorFloor, setEditorFloor] = useState(selectedRoom?.floor ?? 1)
  const [editorType, setEditorType] = useState<RoomType>(selectedRoom?.type ?? 'Обычная')
  const [editorGender, setEditorGender] = useState<GenderType>(
    selectedRoom?.gender ?? 'Смешанная (Mixed)'
  )
  const [editorPriority, setEditorPriority] = useState(selectedRoom?.priority ?? 1)
  const [editorBeds, setEditorBeds] = useState<BedEntry[]>(selectedRoom?.beds ?? [])

  const loadRoom = (room: Room) => {
    setSelectedId(room.id)
    setEditorNum(room.number)
    setEditorFloor(room.floor)
    setEditorType(room.type)
    setEditorGender(room.gender)
    setEditorPriority(room.priority)
    setEditorBeds([...room.beds])
  }

  useEffect(() => {
    if (isTransferModalOpen) {
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      setTransferDate(now.toISOString().slice(0, 16))
    }
  }, [isTransferModalOpen])

  useEffect(() => {
    if (transferFloor !== '') {
      setAvailableTransferRooms(getAvailableRoomsForFloor(transferFloor as number))
      setTransferRoom('')
      setTransferBed('')
    } else {
      setAvailableTransferRooms([])
    }
  }, [transferFloor])

  useEffect(() => {
    if (transferRoom) {
      setAvailableTransferBeds(getBedsForRoom(transferRoom, showOnlyFree))
      setTransferBed('')
    } else {
      setAvailableTransferBeds([])
    }
  }, [transferRoom, showOnlyFree])

  const addBed = () => {
    const nextId = editorBeds.length > 0 ? Math.max(...editorBeds.map((bed) => bed.id)) + 1 : 1
    setEditorBeds((prev) => [
      ...prev,
      { id: nextId, name: `Койко-место #${nextId}`, status: 'Свободно' }
    ])
  }

  const removeBed = (id: number) => {
    setEditorBeds((prev) => prev.filter((bed) => bed.id !== id))
  }

  const saveRoom = () => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedId
          ? {
              ...room,
              number: editorNum,
              floor: editorFloor,
              type: editorType,
              gender: editorGender,
              priority: editorPriority,
              beds: editorBeds
            }
          : room
      )
    )

    alert('Изменения сохранены')
  }

  const resetEditor = () => {
    const room = rooms.find((item) => item.id === selectedId)
    if (room) {
      loadRoom(room)
    }
  }

  const deleteRoom = (id: string) => {
    if (!window.confirm('Удалить палату?')) return

    const nextRooms = rooms.filter((room) => room.id !== id)
    setRooms(nextRooms)

    if (id === selectedId) {
      const nextSelected = nextRooms[0]

      if (nextSelected) {
        loadRoom(nextSelected)
      } else {
        setSelectedId('')
        setEditorNum('')
        setEditorFloor(1)
        setEditorType('Обычная')
        setEditorGender('Смешанная (Mixed)')
        setEditorPriority(1)
        setEditorBeds([])
      }
    }
  }

  const handleOpenTransferModal = (patient: (typeof mockPatients)[0], location: Location) => {
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
    setAssignBedData({
      floor: room.floor,
      room: room.number,
      bed: bed.id,
      priority: room.priority
    })
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    setAssignDate(now.toISOString().slice(0, 16))
    setAssignDoctor('')
    setAssignNotes('')
    setAssignNotify(true)
    setPatientSearchQuery('')
  }

  const handleCloseAssignModal = () => {
    setAssignBedData(null)
  }


  const handleAssignSubmit = () => {
    alert('Пациент успешно назначен на койку!')
    handleCloseAssignModal()
  }

  const handleTransferSubmit = () => {
    const payload = {
      patientId: selectedPatient?.id,
      newLocation: {
        floor: transferFloor,
        room: transferRoom,
        bed: transferBed
      },
      details: {
        date: transferDate,
        reason: transferReason,
        notes: transferNotes
      }
    }
    alert('Пациент успешно перемещен')
    handleCloseTransferModal()
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
  const totalBeds = rooms.reduce((sum, room) => sum + room.beds.length, 0)

  const isConfirmDisabled = !transferFloor || !transferRoom || !transferBed || !transferReason
  const initials = selectedPatient?.firstName
    ? `${selectedPatient.firstName[0]}${selectedPatient.lastName?.[0] ?? ''}`
    : '—'

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
                      onClick={() => loadRoom(room)}
                    >
                      <TdMuted>{room.floor}</TdMuted>
                      <TdBold>{room.number}</TdBold>

                      <Td>
                        <TypeBadge $type={room.type}>{room.type}</TypeBadge>
                      </Td>

                      <Td>
                        <GenderCell>
                          {getGenderIcon(room.gender)}
                          {room.gender === 'Смешанная (Mixed)' ? 'Смешанная' : room.gender}
                        </GenderCell>
                      </Td>

                      <Td>
                        <BedCountCell>
                          <BedCountNum>{room.beds.length}</BedCountNum>
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
                          <ActionIconBtn title="Редактировать" onClick={() => loadRoom(room)}>
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
              editorBeds.map((bed) => (
                <BedItem key={bed.id} $extra={bed.status == 'Свободно'}>
                  <BedTag>К{bed.id}</BedTag>
                  <BedInfo>
                    <BedName>{bed.name}</BedName>
                    <BedId>ID: {bed.id}</BedId>
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
                    onClick={() => {
                      const mockPatient = mockPatients[0]
                      const mockLocation: Location = {
                        floor: bed.location?.floor ?? editorFloor,
                        room: bed.location?.room ?? editorNum,
                        bed: 'Койка ' + bed.id.toString()
                      }
                      handleOpenTransferModal(mockPatient, mockLocation)
                    }}
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

      {selectedPatient && selectedPatientLocation && createPortal(
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
                    {initials}
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
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                      {selectedPatient.id} · {selectedPatient.age} лет · пол:{' '}
                      {selectedPatient.gender}
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
                        <LocationFieldValue>{selectedPatientLocation.bed}</LocationFieldValue>
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
                        <LocationFieldValue>{transferRoom || '—'}</LocationFieldValue>
                      </LocationField>
                      <LocationField $selected={!!transferBed}>
                        <LocationFieldLabel $light={!!transferBed}>Койка</LocationFieldLabel>
                        <LocationFieldValue $white={!!transferBed}>
                          {transferBed || '—'}
                        </LocationFieldValue>
                      </LocationField>
                    </LocationFieldsGrid>
                  </LocationCard>
                </LocationRow>
              </Section>

              {/* Location selection */}
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
                    {/* Floor */}
                    <SelectField>
                      <SelectLabel>Этаж</SelectLabel>
                      <div style={{ minWidth: 0 }}>
                        <Select
                          inputId="transfer-floor-select"
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

                    {/* Room */}
                    <SelectField>
                      <SelectLabel>Палата</SelectLabel>
                      <div style={{ minWidth: 0 }}>
                        <Select
                          inputId="transfer-room-select"
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

                  {/* Available beds */}
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
                          {availableTransferBeds.map((bed) => {
                            const label = `Койка ${bed.bedNumber}`
                            const isSelected = transferBed === label

                            return (
                              <BedBtn
                                key={bed.id}
                                type="button"
                                $free={bed.isFree}
                                $selected={isSelected}
                                disabled={!bed.isFree}
                                onClick={() =>
                                  setTransferBed((prev) => (prev === label ? '' : label))
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

            {/* ── Footer ── */}
            <ModalFooter>
              <CancelBtn type="button" onClick={handleCloseTransferModal}>
                Отмена
              </CancelBtn>
              <ConfirmBtn type="button" onClick={handleTransferSubmit} disabled={isConfirmDisabled}>
                Подтвердить перемещение
              </ConfirmBtn>
            </ModalFooter>
          </ModalShell>
        </Overlay>,
        document.body
      )}

      {assignBedData && createPortal(
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
                  Заполните данные для госпитализации в палату {assignBedData.room}, Койка{' '}
                  {assignBedData.bed}
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
                <InputModal
                  icon={<Search size={18} color="#94a3b8" />}
                  placeholder="ФИО, номер истории или телефон..."
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                />
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
                        options={doctorOptions}
                        styles={selectStyles}
                        components={selectComponents}
                        placeholder="Выберите врача..."
                        isSearchable={true}
                        value={doctorOptions.find((o) => o.value === assignDoctor) ?? null}
                        onChange={(option) => setAssignDoctor(option?.value ?? '')}
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
                <LocationText>
                  <MapPin size={16} />
                  {assignBedData.floor} этаж, палата {assignBedData.room}, койка {assignBedData.bed}
                </LocationText>
                <PriorityBadge>Приоритет: {PRIORITY_LABELS[assignBedData.priority]}</PriorityBadge>
              </FooterLeftInfo>
              <FooterRightActions>
                <CancelBtn type="button" onClick={handleCloseAssignModal}>
                  Отмена
                </CancelBtn>
                <ConfirmBtn
                  type="button"
                  onClick={handleAssignSubmit}
                  disabled={!patientSearchQuery || !assignDoctor}
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
