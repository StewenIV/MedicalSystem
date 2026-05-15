import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Helmet } from 'react-helmet'
import {
  User,
  Edit,
  Plus,
  Trash2,
  FileText,
  Download,
  Eye,
  Activity,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckSquare,
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react'

import { mockPatients, mockHospitalBeds } from 'data/mockData'
import {
  PatientCardContainer,
  PatientHeader,
  Avatar,
  HeaderMain,
  PatientName,
  Demographics,
  HeaderInfoGrid,
  InfoItem,
  StatusBadge,
  TabsContainer,
  TabButton,
  ContentArea,
  SectionCard,
  GridRow,
  Table,
  TableWrapper,
  ActionButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  SearchPageWrapper,
  SearchCard,
  SearchCardHeader,
  SearchCardTitle,
  SearchCardSubtitle,
  SearchFilterBar,
  FilterLabel,
  SearchFilterInput,
  SearchFilterSelect,
  SearchResetBtn,
  SearchTableWrap,
  SearchTable,
  SearchThead,
  SearchTh,
  SearchTr,
  SearchTd,
  SearchTdBold,
  SearchTdMuted,
  PatientAvatar,
  PatientNameCell,
  StatusPill,
  SearchPaginationRow,
  SearchPaginationInfo,
  SearchPaginationBtns,
  SearchPageBtn,
  SearchEmptyState,
  SearchResultsCount
} from './styled'



const PAGE_SIZE = 8

const getPatientRoom = (patientId: string): string => {
  const bed = mockHospitalBeds.find((b) => b.patientId === patientId)
  return bed ? `Палата ${bed.roomNumber}` : '—'
}

const getInitials = (firstName: string, lastName: string) => {
  return `${(lastName?.[0] || '')}${(firstName?.[0] || '')}`.toUpperCase()
}

const getUniqueDoctors = (): string[] => {
  const set = new Set(mockPatients.map((p) => p.doctor).filter(Boolean))
  return Array.from(set).sort()
}

const getUniqueDepartments = (): string[] => {
  const set = new Set(mockPatients.map((p) => p.department).filter(Boolean))
  return Array.from(set).sort()
}

const getUniqueRooms = (): string[] => {
  const set = new Set(
    mockHospitalBeds
      .filter((b) => b.patientId)
      .map((b) => b.roomNumber)
  )
  return Array.from(set).sort()
}

interface PatientSearchPanelProps {
  onSelectPatient: (id: string) => void
  initialQuery?: string
}

const PatientSearchPanel: React.FC<PatientSearchPanelProps> = ({
  onSelectPatient,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [doctor, setDoctor] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [room, setRoom] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setQuery(initialQuery)
    setPage(1)
  }, [initialQuery])

  const doctors = useMemo(getUniqueDoctors, [])
  const departments = useMemo(getUniqueDepartments, [])
  const rooms = useMemo(getUniqueRooms, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return mockPatients.filter((p) => {
      const fullName = `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase()
      if (q && !fullName.includes(q) && !p.id.toLowerCase().includes(q) && !p.medcardNum?.toLowerCase().includes(q)) return false
      if (doctor && p.doctor !== doctor) return false
      if (department && p.department !== department) return false
      if (status && p.status !== status) return false
      if (room) {
        const bed = mockHospitalBeds.find((b) => b.patientId === p.id && b.roomNumber === room)
        if (!bed) return false
      }
      return true
    })
  }, [query, doctor, department, status, room])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetFilters = () => {
    setQuery('')
    setDoctor('')
    setDepartment('')
    setStatus('')
    setRoom('')
    setPage(1)
  }

  const hasFilters = query || doctor || department || status || room

  const handlePageChange = (p: number) => {
    setPage(p)
    // scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPageBtns = () => {
    const btns = []
    for (let i = 1; i <= totalPages; i++) {
      btns.push(
        <SearchPageBtn
          key={i}
          $active={i === safePage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </SearchPageBtn>
      )
    }
    return btns
  }

  return (
    <SearchPageWrapper>
      <SearchCard>
        <SearchCardHeader>
          <SearchCardTitle>Поиск пациентов</SearchCardTitle>
          <SearchCardSubtitle>
            Найдите пациента по ФИО, лечащему врачу, отделению или палате
          </SearchCardSubtitle>
        </SearchCardHeader>

        <SearchFilterBar>
          <FilterLabel>
            <SlidersHorizontal size={13} />
            Фильтры:
          </FilterLabel>

          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none'
              }}
            />
            <SearchFilterInput
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="ФИО, ID или номер карты..."
              style={{ paddingLeft: 36 }}
            />
          </div>

          <SearchFilterSelect
            value={doctor}
            onChange={(e) => { setDoctor(e.target.value); setPage(1) }}
          >
            <option value="">Все врачи</option>
            {doctors.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </SearchFilterSelect>

          <SearchFilterSelect
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1) }}
          >
            <option value="">Все отделения</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </SearchFilterSelect>

          <SearchFilterSelect
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          >
            <option value="">Все статусы</option>
            <option value="hospitalized">Госпитализирован</option>
            <option value="outpatient">Амбулаторно</option>
            <option value="discharged">Выписан</option>
          </SearchFilterSelect>

          <SearchFilterSelect
            value={room}
            onChange={(e) => { setRoom(e.target.value); setPage(1) }}
          >
            <option value="">Все палаты</option>
            {rooms.map((r) => (
              <option key={r} value={r}>Палата {r}</option>
            ))}
          </SearchFilterSelect>

          <SearchResetBtn onClick={resetFilters} disabled={!hasFilters as any}>
            <RotateCcw size={13} />
            Сбросить
          </SearchResetBtn>
        </SearchFilterBar>

        {filtered.length > 0 && (
          <SearchResultsCount>
            Найдено: <strong>{filtered.length}</strong> пациент{filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}
          </SearchResultsCount>
        )}

        <SearchTableWrap>
          <SearchTable>
            <SearchThead>
              <tr>
                <SearchTh>Пациент</SearchTh>
                <SearchTh>Возраст / Пол</SearchTh>
                <SearchTh>Отделение</SearchTh>
                <SearchTh>Лечащий врач</SearchTh>
                <SearchTh>Палата</SearchTh>
                <SearchTh>Статус</SearchTh>
                <SearchTh>Номер карты</SearchTh>
              </tr>
            </SearchThead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <SearchEmptyState>
                      <Users size={48} />
                      <p>Пациенты не найдены</p>
                      <span>Попробуйте изменить параметры поиска или сбросить фильтры</span>
                    </SearchEmptyState>
                  </td>
                </tr>
              ) : (
                paged.map((patient) => (
                  <SearchTr key={patient.id} onClick={() => onSelectPatient(patient.id)}>
                    <SearchTdBold>
                      <PatientNameCell>
                        <PatientAvatar>
                          {getInitials(patient.firstName, patient.lastName)}
                        </PatientAvatar>
                        <div>
                          <div>{patient.lastName} {patient.firstName}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginTop: 2 }}>
                            {patient.middleName}
                          </div>
                        </div>
                      </PatientNameCell>
                    </SearchTdBold>
                    <SearchTd>{patient.age} лет, {patient.gender === 'Мужской' ? 'М' : 'Ж'}</SearchTd>
                    <SearchTd>{patient.department}</SearchTd>
                    <SearchTd>{patient.doctor}</SearchTd>
                    <SearchTdMuted>{getPatientRoom(patient.id)}</SearchTdMuted>
                    <SearchTd>
                      <StatusPill $status={patient.status}>{patient.statusText}</StatusPill>
                    </SearchTd>
                    <SearchTdMuted>{patient.medcardNum}</SearchTdMuted>
                  </SearchTr>
                ))
              )}
            </tbody>
          </SearchTable>
        </SearchTableWrap>

        {totalPages > 1 && (
          <SearchPaginationRow>
            <SearchPaginationInfo>
              Страница {safePage} из {totalPages} · Записей {filtered.length}
            </SearchPaginationInfo>
            <SearchPaginationBtns>
              <SearchPageBtn
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
              >
                <ChevronLeft size={14} />
              </SearchPageBtn>
              {renderPageBtns()}
              <SearchPageBtn
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
              >
                <ChevronRight size={14} />
              </SearchPageBtn>
            </SearchPaginationBtns>
          </SearchPaginationRow>
        )}
      </SearchCard>
    </SearchPageWrapper>
  )
}

// ─── PatientCard ───────────────────────────────────────────────────────────────

interface PatientCardPageProps {
  patientId?: string
  initialSearchQuery?: string
  onSelectPatient?: (id: string) => void
}

interface PatientCardProps {
  patientId?: string
}

enum TabsEnum {
  Overview = 'Обзор',
  PersonalData = 'Персональные данные',
  MedicalInfo = 'Медицинская информация',
  Prescriptions = 'Назначения',
  Tests = 'Анализы',
  VitalSigns = 'Показатели',
  History = 'История',
  Vaccination = 'Вакцинация',
  Documents = 'Документы'
}

const PatientCard: React.FC<PatientCardProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState<string>(TabsEnum.Overview)
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null)

  const initialPatient = patientId ? mockPatients.find((p) => p.id === patientId) : null
  const [localPatient, setLocalPatient] = useState<any>(initialPatient)

  useEffect(() => {
    setLocalPatient(patientId ? mockPatients.find((p) => p.id === patientId) : null)
  }, [patientId])

  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: string; data: any }>({
    isOpen: false,
    type: '',
    data: null
  })
  const [formData, setFormData] = useState<any>({})

  const openModal = (type: string, data: any = null) => {
    setModalConfig({ isOpen: true, type, data })
    setFormData(data || {})
  }

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', data: null })
    setFormData({})
  }

  const handleSave = () => {
    if (!localPatient) return
    let updatedData = { ...localPatient }
    const { type, data } = modalConfig

    if (type === 'EDIT_BASIC') {
      Object.assign(updatedData, formData)
    } else if (type.startsWith('EDIT_NESTED_')) {
      const section = type.replace('EDIT_NESTED_', '')
      updatedData[section] = { ...(updatedData[section] || {}), ...formData }
    } else if (type.startsWith('ADD_LIST_')) {
      const listName = type.replace('ADD_LIST_', '')
      updatedData[listName] = [...(updatedData[listName] || []), formData]
    } else if (type.startsWith('EDIT_LIST_')) {
      const listName = type.replace('EDIT_LIST_', '')
      updatedData[listName] = [...updatedData[listName]]
      updatedData[listName][data.index] = formData
    } else if (type.startsWith('DELETE_LIST_')) {
      const listName = type.replace('DELETE_LIST_', '')
      updatedData[listName] = updatedData[listName].filter((_: any, i: number) => i !== data.index)
    } else if (type.startsWith('ADD_STR_')) {
      const listName = type.replace('ADD_STR_', '')
      updatedData[listName] = [...(updatedData[listName] || []), formData.value]
    }

    setLocalPatient(updatedData)
    closeModal()
  }

  const handleQuickAction = (actionType: string, data?: any) => {
    if (!localPatient) return
    let updatedData = { ...localPatient }
    if (actionType === 'ADD_MED_FROM_PRESCRIPTION') {
      const newMed = { name: data.drug, dose: data.dose, form: data.form, regimen: data.regimen }
      updatedData.currentMeds = [...(updatedData.currentMeds || []), newMed]
    }
    setLocalPatient(updatedData)
  }

  const modalDefs: Record<
    string,
    { title: string; fields?: { name: string; label: string; type?: string }[]; text?: string }
  > = {
    EDIT_BASIC: {
      title: 'Основные данные',
      fields: [
        { name: 'lastName', label: 'Фамилия' },
        { name: 'firstName', label: 'Имя' },
        { name: 'middleName', label: 'Отчество' },
        { name: 'dateOfBirth', label: 'Дата рождения', type: 'date' },
        { name: 'gender', label: 'Пол' }
      ]
    },
    EDIT_NESTED_passport: {
      title: 'Паспорт',
      fields: [
        { name: 'seriesNumber', label: 'Серия и номер' },
        { name: 'issuedBy', label: 'Кем выдан' },
        { name: 'dateIssued', label: 'Дата выдачи', type: 'date' }
      ]
    },
    EDIT_NESTED_contacts: {
      title: 'Контакты',
      fields: [
        { name: 'country', label: 'Страна' },
        { name: 'region', label: 'Регион' },
        { name: 'city', label: 'Город' },
        { name: 'address', label: 'Адрес' },
        { name: 'phone', label: 'Телефон' },
        { name: 'email', label: 'Email' }
      ]
    },
    EDIT_NESTED_other: {
      title: 'Прочее',
      fields: [
        { name: 'language', label: 'Язык' },
        { name: 'nationality', label: 'Национальность' },
        { name: 'dateOfDeath', label: 'Дата смерти', type: 'date' },
        { name: 'causeOfDeath', label: 'Причина смерти' }
      ]
    },
    EDIT_NESTED_work: {
      title: 'Работа',
      fields: [
        { name: 'profession', label: 'Профессия' },
        { name: 'organization', label: 'Организация' },
        { name: 'address', label: 'Адрес работы' }
      ]
    },
    EDIT_NESTED_vitals: {
      title: 'Внести показатели',
      fields: [
        { name: 'temp', label: 'Температура' },
        { name: 'bp', label: 'АД' },
        { name: 'hr', label: 'ЧСС' },
        { name: 'resp', label: 'Дыхание' },
        { name: 'spo2', label: 'SpO2' },
        { name: 'bmi', label: 'ИМТ' }
      ]
    },

    ADD_LIST_relatives: {
      title: 'Добавить родственника',
      fields: [
        { name: 'name', label: 'ФИО' },
        { name: 'relation', label: 'Кем приходится' },
        { name: 'phone', label: 'Телефон' }
      ]
    },
    EDIT_LIST_relatives: {
      title: 'Редактировать родственника',
      fields: [
        { name: 'name', label: 'ФИО' },
        { name: 'relation', label: 'Кем приходится' },
        { name: 'phone', label: 'Телефон' }
      ]
    },
    DELETE_LIST_relatives: { title: 'Удалить родственника', text: 'Удалить эту запись?' },

    ADD_LIST_allergies: {
      title: 'Добавить аллергию',
      fields: [
        { name: 'name', label: 'Название' },
        { name: 'reaction', label: 'Реакция' },
        { name: 'date', label: 'Дата', type: 'date' },
        { name: 'comment', label: 'Комментарий' }
      ]
    },
    EDIT_LIST_allergies: {
      title: 'Редактировать аллергию',
      fields: [
        { name: 'name', label: 'Название' },
        { name: 'reaction', label: 'Реакция' },
        { name: 'date', label: 'Дата', type: 'date' },
        { name: 'comment', label: 'Комментарий' }
      ]
    },
    DELETE_LIST_allergies: { title: 'Удалить аллергию', text: 'Удалить эту запись?' },

    ADD_LIST_currentMeds: {
      title: 'Добавить лекарство',
      fields: [
        { name: 'name', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма' },
        { name: 'regimen', label: 'Режим приема' }
      ]
    },
    EDIT_LIST_currentMeds: {
      title: 'Редактировать лекарство',
      fields: [
        { name: 'name', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма' },
        { name: 'regimen', label: 'Режим приема' }
      ]
    },
    DELETE_LIST_currentMeds: { title: 'Удалить лекарство', text: 'Удалить эту запись?' },

    ADD_STR_operations: {
      title: 'Добавить операцию',
      fields: [{ name: 'value', label: 'Описание операции' }]
    },
    ADD_STR_medicalProblems: {
      title: 'Добавить проблему',
      fields: [{ name: 'value', label: 'Описание проблемы' }]
    },

    ADD_LIST_prescriptions: {
      title: 'Новое назначение',
      fields: [
        { name: 'drug', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма' },
        { name: 'route', label: 'Путь' },
        { name: 'regimen', label: 'Режим' },
        { name: 'doctor', label: 'Врач' }
      ]
    },
    EDIT_LIST_prescriptions: {
      title: 'Редактировать назначение',
      fields: [
        { name: 'drug', label: 'Препарат' },
        { name: 'dose', label: 'Дозировка' },
        { name: 'form', label: 'Форма' },
        { name: 'route', label: 'Путь' },
        { name: 'regimen', label: 'Режим' },
        { name: 'doctor', label: 'Врач' }
      ]
    },
    DELETE_LIST_prescriptions: { title: 'Удалить назначение', text: 'Удалить это назначение?' },

    ADD_LIST_labs: {
      title: 'Назначить анализ',
      fields: [
        { name: 'type', label: 'Тип анализа' },
        { name: 'date', label: 'Дата', type: 'date' },
        { name: 'lab', label: 'Лаборатория' },
        { name: 'doctor', label: 'Врач' }
      ]
    },

    ADD_LIST_vaccines: {
      title: 'Внести вакцину',
      fields: [
        { name: 'name', label: 'Вакцина' },
        { name: 'disease', label: 'От чего' },
        { name: 'date', label: 'Дата', type: 'date' },
        { name: 'manufacturer', label: 'Производитель' }
      ]
    },

    ADD_LIST_documents: {
      title: 'Загрузить документ',
      fields: [
        { name: 'name', label: 'Название' },
        { name: 'date', label: 'Дата', type: 'date' }
      ]
    }
  }

  const renderModal = () => {
    if (!modalConfig.isOpen) return null
    const def = modalDefs[modalConfig.type] || { title: 'Просмотр', text: 'Детали отсутствуют' }
    const isDelete = modalConfig.type.startsWith('DELETE_')
    const isView = modalConfig.type.startsWith('VIEW_')

    return createPortal(
      <ModalOverlay onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <h2>{def.title}</h2>
            <CloseButton onClick={closeModal}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            {isDelete && <p style={{ fontSize: 15, color: '#334155' }}>{def.text}</p>}
            {isView && (
              <div style={{ display: 'grid', gap: 15 }}>
                {Object.entries(modalConfig.data || {})
                  .filter(([k]) => k !== 'index')
                  .map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        gap: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      <strong style={{ color: '#475569', textTransform: 'capitalize' }}>
                        {k}:
                      </strong>
                      {String(v)}
                    </div>
                  ))}
              </div>
            )}
            {!isDelete &&
              !isView &&
              def.fields?.map((f) => (
                <FormGroup key={f.name}>
                  <Label>{f.label}</Label>
                  <Input
                    value={formData[f.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    type={f.type || 'text'}
                    placeholder={`Введите ${f.label.toLowerCase()}...`}
                  />
                </FormGroup>
              ))}
          </ModalBody>
          <ModalFooter>
            <ActionButton $variant="ghost" onClick={closeModal}>
              Закрыть
            </ActionButton>
            {!isView && (
              <ActionButton $variant={isDelete ? 'danger' : 'primary'} onClick={handleSave}>
                {isDelete ? 'Удалить' : 'Сохранить'}
              </ActionButton>
            )}
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>,
      document.body
    )
  }

  const getStatusColor = (statusText?: string) => {
    if (!statusText) return { bg: '#f1f5f9', text: '#475569' }
    const text = statusText.toLowerCase()
    if (text.includes('зелен') || text.includes('зелён') || text.includes('норма'))
      return { bg: '#dcfce7', text: '#166534' }
    if (text.includes('желт') || text.includes('жёлт') || text.includes('вниман'))
      return { bg: '#fef08a', text: '#854d0e' }
    if (text.includes('красн') || text.includes('критич')) return { bg: '#fee2e2', text: '#991b1b' }
    return { bg: '#f1f5f9', text: '#475569' }
  }

  const renderTabContent = () => {
    if (!localPatient) return null

    switch (activeTab) {
      case 'Обзор':
        return (
          <GridRow $cols={3}>
            <SectionCard>
              <h3>Основная информация</h3>
              <InfoItem>
                <span className="label">ФИО</span>
                <span className="value">
                  {localPatient.lastName} {localPatient.firstName} {localPatient.middleName}
                </span>
              </InfoItem>
              <InfoItem style={{ marginTop: 8 }}>
                <span className="label">Возраст / Пол</span>
                <span className="value">
                  {localPatient.age} лет, {localPatient.gender}
                </span>
              </InfoItem>
              <InfoItem style={{ marginTop: 8 }}>
                <span className="label">Контакты</span>
                <span className="value">{localPatient.contacts?.phone || 'Не указано'}</span>
              </InfoItem>
            </SectionCard>
            <SectionCard>
              <h3>Активные проблемы</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#1e293b' }}>
                {localPatient.activeProblems?.map((prob: string, i: number) => (
                  <li key={i}>{prob}</li>
                )) || <span style={{ color: '#94a3b8' }}>Нет активных проблем</span>}
              </ul>
            </SectionCard>
            <SectionCard>
              <h3>Активные назначения</h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#1e293b' }}>
                {localPatient.prescriptions?.slice(0, 3).map((pr: any, i: number) => (
                  <li key={i}>
                    <strong>{pr.drug}</strong> — {pr.dose} ({pr.regimen})
                  </li>
                )) || <span style={{ color: '#94a3b8' }}>Нет активных назначений</span>}
              </ul>
            </SectionCard>
            <SectionCard>
              <h3>Последние показатели</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <InfoItem>
                  <span className="label">Температура</span>
                  <span className="value">{localPatient.vitals?.temp || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">АД</span>
                  <span className="value">{localPatient.vitals?.bp || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">ЧСС</span>
                  <span className="value">{localPatient.vitals?.hr || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">SpO2</span>
                  <span className="value">{localPatient.vitals?.spo2 || '—'}</span>
                </InfoItem>
              </div>
            </SectionCard>
            <SectionCard style={{ gridColumn: 'span 2' }}>
              <h3>Последние анализы</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {localPatient.labs?.slice(0, 3).map((lab: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: 6
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertCircle size={16} color={getStatusColor(lab.statusText).text} />
                      <span style={{ fontWeight: 500 }}>{lab.type}</span>
                      <span style={{ color: '#64748b', fontSize: 13 }}>({lab.date})</span>
                    </div>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: getStatusColor(lab.statusText).bg,
                        color: getStatusColor(lab.statusText).text
                      }}
                    >
                      {lab.statusText || 'Статус не указан'}
                    </span>
                  </div>
                )) || <span style={{ color: '#94a3b8' }}>Нет данных об анализах</span>}
              </div>
            </SectionCard>
          </GridRow>
        )
      case 'Персональные данные':
        return (
          <GridRow $cols={2}>
            <SectionCard>
              <h3>
                1. Основные данные{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() =>
                    openModal('EDIT_BASIC', {
                      lastName: localPatient.lastName,
                      firstName: localPatient.firstName,
                      middleName: localPatient.middleName,
                      dateOfBirth: localPatient.dateOfBirth,
                      gender: localPatient.gender
                    })
                  }
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">ФИО</span>
                  <span className="value">
                    {localPatient.lastName} {localPatient.firstName} {localPatient.middleName}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Дата рождения</span>
                  <span className="value">{localPatient.dateOfBirth}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Пол</span>
                  <span className="value">{localPatient.gender}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Сем. положение</span>
                  <span className="value">{localPatient.maritalStatus || 'Не указано'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                2. Паспорт{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_passport', localPatient.passport)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Серия и номер</span>
                  <span className="value">
                    {localPatient.passport?.seriesNumber || 'Не указано'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Кем выдан</span>
                  <span className="value">{localPatient.passport?.issuedBy || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Дата выдачи</span>
                  <span className="value">{localPatient.passport?.dateIssued || 'Не указано'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                3. Контакты{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_contacts', localPatient.contacts)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Страна</span>
                  <span className="value">
                    {localPatient.contacts?.country || 'Республика Беларусь'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Область/Город</span>
                  <span className="value">
                    {localPatient.contacts?.region || 'Не указано'},{' '}
                    {localPatient.contacts?.city || 'Не указано'}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Адрес (Индекс)</span>
                  <span className="value">
                    {localPatient.contacts?.address || 'Не указано'} (
                    {localPatient.contacts?.zip || '000000'})
                  </span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Телефоны</span>
                  <span className="value">{localPatient.contacts?.phone || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Email</span>
                  <span className="value">{localPatient.contacts?.email || 'Не указано'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                4. Прочее{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_other', localPatient.other)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Язык</span>
                  <span className="value">{localPatient.other?.language || 'Русский'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Национальность</span>
                  <span className="value">{localPatient.other?.nationality || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Дата смерти</span>
                  <span className="value">{localPatient.other?.dateOfDeath || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Причина смерти</span>
                  <span className="value">{localPatient.other?.causeOfDeath || '—'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard>
              <h3>
                5. Родственники{' '}
                <ActionButton onClick={() => openModal('ADD_LIST_relatives')}>
                  <Plus size={14} /> Добавить
                </ActionButton>
              </h3>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Кем приходится</th>
                      <th>Телефон</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPatient.relatives?.map((rel: any, i: number) => (
                      <tr key={i}>
                        <td>{rel.name}</td>
                        <td>{rel.relation}</td>
                        <td>{rel.phone}</td>
                        <td>
                          <ActionButton
                            $variant="ghost"
                            onClick={() => openModal('EDIT_LIST_relatives', { ...rel, index: i })}
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            $variant="danger"
                            onClick={() => openModal('DELETE_LIST_relatives', { index: i })}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8' }}>
                          Нет данных
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableWrapper>
            </SectionCard>
            <SectionCard>
              <h3>
                6. Работа{' '}
                <ActionButton
                  $variant="ghost"
                  onClick={() => openModal('EDIT_NESTED_work', localPatient.work)}
                >
                  <Edit size={14} />
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Профессия</span>
                  <span className="value">{localPatient.work?.profession || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Организация</span>
                  <span className="value">{localPatient.work?.organization || 'Не указано'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Адрес работы</span>
                  <span className="value">{localPatient.work?.address || 'Не указано'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
          </GridRow>
        )
      case 'Медицинская информация':
        return (
          <ContentArea>
            <SectionCard>
              <h3>
                Аллергии{' '}
                <ActionButton onClick={() => openModal('ADD_LIST_allergies')}>
                  <Plus size={14} /> Добавить
                </ActionButton>
              </h3>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Реакция</th>
                      <th>Дата выявления</th>
                      <th>Комментарий</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPatient.allergies?.map((alg: any, i: number) => (
                      <tr key={i}>
                        <td>{alg.name}</td>
                        <td>{alg.reaction}</td>
                        <td>{alg.date}</td>
                        <td>{alg.comment || '—'}</td>
                        <td>
                          <ActionButton
                            $variant="ghost"
                            onClick={() => openModal('EDIT_LIST_allergies', { ...alg, index: i })}
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            $variant="danger"
                            onClick={() => openModal('DELETE_LIST_allergies', { index: i })}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>
                          Аллергии не зафиксированы
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableWrapper>
            </SectionCard>
            <SectionCard>
              <h3>
                Текущие лекарства{' '}
                <ActionButton onClick={() => openModal('ADD_LIST_currentMeds')}>
                  <Plus size={14} /> Добавить
                </ActionButton>
              </h3>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Препарат</th>
                      <th>Дозировка</th>
                      <th>Форма</th>
                      <th>Режим приема</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPatient.currentMeds?.map((med: any, i: number) => (
                      <tr key={i}>
                        <td>
                          <strong>{med.name}</strong>
                        </td>
                        <td>{med.dose}</td>
                        <td>{med.form}</td>
                        <td>{med.regimen}</td>
                        <td>
                          <ActionButton
                            $variant="ghost"
                            onClick={() => openModal('EDIT_LIST_currentMeds', { ...med, index: i })}
                          >
                            <Edit size={14} />
                          </ActionButton>
                          <ActionButton
                            $variant="danger"
                            onClick={() => openModal('DELETE_LIST_currentMeds', { index: i })}
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>
                          Нет текущих лекарств
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TableWrapper>
            </SectionCard>
            <GridRow>
              <SectionCard>
                <h3>
                  Операции{' '}
                  <ActionButton onClick={() => openModal('ADD_STR_operations')}>
                    <Plus size={14} />
                  </ActionButton>
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#334155' }}>
                  {localPatient.operations?.map((op: string, i: number) => (
                    <li key={i}>{op}</li>
                  )) || (
                    <li style={{ color: '#94a3b8', listStyleType: 'none', marginLeft: -20 }}>
                      Нет данных
                    </li>
                  )}
                </ul>
              </SectionCard>
              <SectionCard>
                <h3>
                  Медицинские проблемы{' '}
                  <ActionButton onClick={() => openModal('ADD_STR_medicalProblems')}>
                    <Plus size={14} />
                  </ActionButton>
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#334155' }}>
                  {localPatient.medicalProblems?.map((prob: string, i: number) => (
                    <li key={i}>{prob}</li>
                  )) || (
                    <li style={{ color: '#94a3b8', listStyleType: 'none', marginLeft: -20 }}>
                      Нет данных
                    </li>
                  )}
                </ul>
              </SectionCard>
            </GridRow>
          </ContentArea>
        )
      case 'Назначения':
        return (
          <SectionCard>
            <h3>
              Текущие назначения{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_prescriptions')}>
                <Plus size={14} /> Новое назначение
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Начало</th>
                    <th>Окончание</th>
                    <th>Препарат</th>
                    <th>Дозировка</th>
                    <th>Форма</th>
                    <th>Путь</th>
                    <th>Режим</th>
                    <th>Комментарий</th>
                    <th>Врач</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.prescriptions?.map((pr: any, i: number) => (
                    <tr key={i}>
                      <td>{pr.dateStart || '01.10.2023'}</td>
                      <td>{pr.dateEnd || '10.10.2023'}</td>
                      <td>
                        <strong>{pr.drug}</strong>
                      </td>
                      <td>{pr.dose}</td>
                      <td>{pr.form}</td>
                      <td>{pr.route}</td>
                      <td>{pr.regimen}</td>
                      <td>{pr.comment || '—'}</td>
                      <td>{pr.doctor}</td>
                      <td>
                        <ActionButton
                          $variant="ghost"
                          title="Добавить в текущие лекарства"
                          onClick={() => handleQuickAction('ADD_MED_FROM_PRESCRIPTION', pr)}
                        >
                          <CheckSquare size={14} />
                        </ActionButton>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => openModal('EDIT_LIST_prescriptions', { ...pr, index: i })}
                        >
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton
                          $variant="danger"
                          onClick={() => openModal('DELETE_LIST_prescriptions', { index: i })}
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      case 'Анализы':
        return (
          <SectionCard>
            <h3>
              Результаты анализов{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_labs')}>
                <Plus size={14} /> Назначить
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Тип анализа</th>
                    <th>Лаборатория</th>
                    <th>Врач</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.labs?.map((lab: any, i: number) => (
                    <tr key={i}>
                      <td>{lab.date}</td>
                      <td>{lab.type}</td>
                      <td>{lab.lab || 'Основная лаборатория'}</td>
                      <td>{lab.doctor}</td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: getStatusColor(lab.statusText).bg,
                            color: getStatusColor(lab.statusText).text
                          }}
                        >
                          {lab.statusText || 'Не указан'}
                        </span>
                      </td>
                      <td>
                        <ActionButton $variant="ghost" onClick={() => openModal('VIEW_LAB', lab)}>
                          <Eye size={14} />
                        </ActionButton>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => alert('Скачивание результатов анализа...')}
                        >
                          <Download size={14} />
                        </ActionButton>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      case 'Показатели':
        return (
          <ContentArea>
            <SectionCard>
              <h3>
                Последние значения{' '}
                <ActionButton onClick={() => openModal('EDIT_NESTED_vitals', localPatient.vitals)}>
                  <Plus size={14} /> Внести
                </ActionButton>
              </h3>
              <HeaderInfoGrid style={{ borderTop: 'none', paddingTop: 0 }}>
                <InfoItem>
                  <span className="label">Температура</span>
                  <span className="value">{localPatient.vitals?.temp || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">АД</span>
                  <span className="value">{localPatient.vitals?.bp || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">ЧСС</span>
                  <span className="value">{localPatient.vitals?.hr || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Дыхание</span>
                  <span className="value">{localPatient.vitals?.resp || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">SpO2</span>
                  <span className="value">{localPatient.vitals?.spo2 || '—'}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">ИМТ</span>
                  <span className="value">{localPatient.vitals?.bmi || '—'}</span>
                </InfoItem>
              </HeaderInfoGrid>
            </SectionCard>
            <SectionCard style={{ minHeight: 300 }}>
              <h3>Графики показателей</h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 200,
                  color: '#94a3b8',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 8
                }}
              >
                <Activity size={32} style={{ marginRight: 8 }} /> Место для рендера графиков
                (Recharts / Chart.js)
              </div>
            </SectionCard>
          </ContentArea>
        )
      case 'История':
        return (
          <SectionCard>
            <h3>История обращений и записей</h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Дата/Время</th>
                    <th>Тип</th>
                    <th>Врач</th>
                    <th>Краткое заключение</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.history?.map((h: any, i: number) => (
                    <React.Fragment key={i}>
                      <tr
                        onClick={() => setExpandedHistory(expandedHistory === i ? null : i)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: expandedHistory === i ? '#f8fafc' : 'transparent'
                        }}
                      >
                        <td>
                          {expandedHistory === i ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </td>
                        <td>{h.dateTime}</td>
                        <td>{h.type}</td>
                        <td>{h.doctor}</td>
                        <td>{h.conclusion}</td>
                        <td>
                          <ActionButton
                            $variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              openModal('VIEW_HISTORY', h)
                            }}
                          >
                            <Eye size={14} />
                          </ActionButton>
                        </td>
                      </tr>
                      {expandedHistory === i && (
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                          <td colSpan={6} style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
                              <div>
                                <strong style={{ color: '#475569' }}>Жалобы:</strong>{' '}
                                {h.complaints || 'Нет данных'}
                              </div>
                              <div>
                                <strong style={{ color: '#475569' }}>Объективные данные:</strong>{' '}
                                {h.objective || 'Нет данных'}
                              </div>
                              <div>
                                <strong style={{ color: '#475569' }}>Заключение:</strong>{' '}
                                {h.conclusion || 'Нет данных'}
                              </div>
                              <div>
                                <strong style={{ color: '#475569' }}>
                                  Назначения/Рекомендации:
                                </strong>{' '}
                                {h.recommendations || 'Нет данных'}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )) || (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      case 'Вакцинация':
        return (
          <SectionCard>
            <h3>
              Карта вакцинации{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_vaccines')}>
                <Plus size={14} /> Внести
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Вакцина</th>
                    <th>От чего</th>
                    <th>Дата</th>
                    <th>Срок действия</th>
                    <th>Производитель</th>
                    <th>Серия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.vaccines?.map((v: any, i: number) => (
                    <tr key={i}>
                      <td>{v.name}</td>
                      <td>{v.disease}</td>
                      <td>{v.date}</td>
                      <td>{v.validity || 'Бессрочно'}</td>
                      <td>{v.manufacturer}</td>
                      <td>{v.series}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет данных
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      case 'Документы':
        return (
          <SectionCard>
            <h3>
              Медицинские документы{' '}
              <ActionButton onClick={() => openModal('ADD_LIST_documents')}>
                <Plus size={14} /> Загрузить
              </ActionButton>
            </h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Документ</th>
                    <th>Дата добавления</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {localPatient.documents?.map((d: any, i: number) => (
                    <tr key={i}>
                      <td>
                        <FileText size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />{' '}
                        {d.name}
                      </td>
                      <td>{d.date}</td>
                      <td>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => openModal('VIEW_DOCUMENT', d)}
                        >
                          <Eye size={14} />
                        </ActionButton>
                        <ActionButton
                          $variant="ghost"
                          onClick={() => alert('Скачивание документа...')}
                        >
                          <Download size={14} />
                        </ActionButton>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Нет документов
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionCard>
        )
      default:
        return null
    }
  }

  if (!patientId || !localPatient) return null

  return (
    <>
      <Helmet>
        <title>
          Карточка пациента - {localPatient.lastName} {localPatient.firstName}
        </title>
      </Helmet>

      <PatientCardContainer>
        <PatientHeader>
          <Avatar>
            <User size={40} />
          </Avatar>
          <HeaderMain>
            <PatientName>
              {localPatient.lastName} {localPatient.firstName} {localPatient.middleName}
            </PatientName>
            <Demographics>
              <span>
                Дата рождения: {localPatient.dateOfBirth} ({localPatient.age} лет)
              </span>
              <span>•</span>
              <span>Пол: {localPatient.gender}</span>
            </Demographics>

            <HeaderInfoGrid>
              <InfoItem>
                <span className="label">Номер медкарты</span>
                <span className="value">{localPatient.medcardNum}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">История болезни</span>
                <span className="value">{localPatient.historyNum}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">ID Пациента</span>
                <span className="value">{localPatient.id}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Статус</span>
                <StatusBadge $status={localPatient.status as any}>
                  {localPatient.statusText}
                </StatusBadge>
              </InfoItem>
            </HeaderInfoGrid>

            <HeaderInfoGrid style={{ marginTop: 0 }}>
              <InfoItem>
                <span className="label">Лечащий врач</span>
                <span className="value">{localPatient.doctor}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Отделение</span>
                <span className="value">{localPatient.department}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Учреждение</span>
                <span className="value">{localPatient.institution || 'ГУ БЦГБ'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Обновлено</span>
                <span className="value" style={{ color: '#64748b' }}>
                  {localPatient.lastUpdated || new Date().toLocaleDateString('ru-RU')}
                </span>
              </InfoItem>
            </HeaderInfoGrid>
          </HeaderMain>
        </PatientHeader>

        <TabsContainer>
          {Object.values(TabsEnum).map((tab) => (
            <TabButton key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </TabButton>
          ))}
        </TabsContainer>

        {renderTabContent()}
      </PatientCardContainer>

      {renderModal()}
    </>
  )
}

// ─── PatientCardPageWrapper ────────────────────────────────────────────────────
// This is the main page component. It combines the search panel with the card.

const PatientCardPageWrapper: React.FC<PatientCardPageProps> = ({
  patientId: externalPatientId,
  initialSearchQuery = '',
  onSelectPatient: externalOnSelect
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(externalPatientId)

  useEffect(() => {
    setSelectedPatientId(externalPatientId)
  }, [externalPatientId])

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id)
    externalOnSelect?.(id)
  }

  const handleBackToSearch = () => {
    setSelectedPatientId(undefined)
    externalOnSelect?.('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Helmet>
        <title>Пациенты</title>
      </Helmet>

      {/* Always show the search panel */}
      <PatientSearchPanel
        onSelectPatient={handleSelectPatient}
        initialQuery={initialSearchQuery}
      />

      {/* Show the patient card if a patient is selected */}
      {selectedPatientId && (
        <div>
          {/* Back button */}
          <button
            onClick={handleBackToSearch}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid rgba(191, 219, 254, 0.8)',
              background: '#ffffff',
              color: '#374151',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#1e40af'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = '#ffffff'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#374151'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(191, 219, 254, 0.8)'
            }}
          >
            <ChevronLeft size={16} />
            Вернуться к поиску
          </button>

          <PatientCard patientId={selectedPatientId} />
        </div>
      )}
    </div>
  )
}

export { PatientSearchPanel, PatientCard }
export default PatientCardPageWrapper
