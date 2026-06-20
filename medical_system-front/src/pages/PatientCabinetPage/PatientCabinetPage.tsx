import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { PatternFormat } from 'react-number-format'
import {
  Activity,
  FileText,
  Bell,
  User,
  Search,
  Download,
  Eye,
  Check,
  CheckCircle,
  Calendar,
  MapPin,
  Lock,
  Camera,
  X,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  Stethoscope,
  ClipboardList,
  LayoutDashboard,
  ScanLine,
  TestTube2,
  Wind,
  CheckCheck
} from 'lucide-react'

import { selectUserId, selectDisplayName } from 'features/App/selectors'
import { PatientCardDto } from 'api/patientsApi'
import { usePatientNotifications } from 'context/PatientNotificationsContext'
import {
  updatePatientContacts,
  updatePatientGeneralInfo,
  updatePatientOtherInfo,
  updatePatientWorkInfo,
  addPatientRelative,
  updatePatientRelative,
  changePatientPassword,
  fetchPatientDocuments,
  fetchPatientExams,
  fetchPatientProfile,
  deleteAccount
} from 'api/patientCabinetApi'
import { downloadFileFromServer } from 'api/filesApi'
import { getPhoneFormat } from 'utils/phoneFormat'
import {
  generalSchema,
  contactsSchema,
  otherSchema,
  workSchema,
  relativeSchema,
  changePasswordSchema
} from 'lib/validators/patientCabinet'

import Select, { components, DropdownIndicatorProps, StylesConfig } from 'react-select'

import {
  PageContainer,
  Header,
  HeaderLeft,
  HeaderIconBox,
  HeaderTitles,
  HeaderTitle,
  HeaderSubtitle,
  SubNavContainer,
  SubNavTab,
  TabBadge,
  WelcomeBanner,
  WelcomeText,
  WelcomeTitle,
  WelcomeSubtitle,
  WelcomeMeta,
  WelcomeMetaItem,
  StatsGrid,
  StatCard,
  StatHeader,
  StatIcon,
  StatLabel,
  StatValue,
  StatSub,
  DashboardRow,
  DashboardCard,
  CardHeader,
  CardTitle,
  CardLinkButton,
  SimpleList,
  SimpleItem,
  ItemLabel,
  ItemName,
  ItemDate,
  ProfileLayout,
  ProfileSidebarCard,
  ProfileAvatarWrapper,
  ProfileAvatar,
  ProfileAvatarPlaceholder,
  AvatarOverlay,
  ProfileSidebarInfo,
  ProfileSidebarName,
  ProfileSidebarRole,
  ProfileMainCard,
  SectionSubTitle,
  FieldsGrid,
  FieldWrapper,
  FieldLabel,
  FieldValueReadOnly,
  InputField,
  SaveButton,
  SecondaryButton,
  FilterBar,
  SearchInputWrapper,
  SearchInput,
  DropdownSelect,
  TableWrapper,
  Table,
  TableTh,
  TableRow,
  TableTd,
  StatusBadge,
  ActionButton,
  FlexActions,
  NoDataState,
  DocGrid,
  DocCard,
  DocHeader,
  DocIconBox,
  DocTitleBlock,
  DocNameText,
  DocMetaText,
  DocFooter,
  DocDateText,
  NotificationsContainer,
  NotificationHeaderRow,
  NotificationCard,
  NotifIconBox,
  NotifContent,
  NotifTitle,
  NotifText,
  NotifTimeBlock,
  MarkReadBtn,
  SeverityBadge,
  NotificationDetails,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseBtn,
  ModalBody,
  ModalFooter,
  InfoDetails,
  InfoRow,
  InfoKey,
  InfoVal
} from './styled'

interface ExamItem {
  id: string
  name: string
  date: string
  resultDate: string
  type: 'lab' | 'imaging' | 'functional' | 'other'
  status: 'ready' | 'processing'
  details?: string
  doctor?: string
  parameters?: { name: string; value: string; norm: string; unit: string }[]
}

interface SelectOption {
  value: string
  label: string
}

const RELATION_OPTIONS: SelectOption[] = [
  { value: 'Супруг(а)', label: 'Супруг(а)' },
  { value: 'Мать', label: 'Мать' },
  { value: 'Отец', label: 'Отец' },
  { value: 'Сын', label: 'Сын' },
  { value: 'Дочь', label: 'Дочь' },
  { value: 'Брат', label: 'Брат' },
  { value: 'Сестра', label: 'Сестра' },
  { value: 'Бабушка', label: 'Бабушка' },
  { value: 'Дедушка', label: 'Дедушка' },
  { value: 'Опекун', label: 'Опекун' },
  { value: 'Другое', label: 'Другое' }
]

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    borderRadius: '10px',
    borderColor: state.isFocused ? '#2563eb' : 'rgba(191,219,254,0.8)',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': { borderColor: state.isFocused ? '#2563eb' : '#9ca3af' }
  }),
  valueContainer: (base) => ({ ...base, padding: '0 8px 0 12px' }),
  placeholder: (base) => ({ ...base, color: '#94a3b8', fontSize: '14px' }),
  input: (base) => ({ ...base, color: '#111827', fontSize: '14px' }),
  singleValue: (base) => ({ ...base, color: '#111827', fontSize: '14px' }),
  indicatorsContainer: (base) => ({ ...base, paddingRight: '5px' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#2563eb' : '#64748b',
    padding: '2px',
    margin: '0 4px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: state.selectProps.menuIsOpen ? '#eaf1ff' : '#f8fafc',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { color: '#2563eb', backgroundColor: '#eaf1ff', borderColor: '#c7d2fe' },
    svg: { width: '14px', height: '14px' }
  }),
  menu: (base) => ({
    ...base,
    marginTop: '6px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 24px rgba(15,23,42,0.12)',
    overflow: 'hidden',
    zIndex: 20
  }),
  menuList: (base) => ({ ...base, padding: '6px' }),
  option: (base, state) => ({
    ...base,
    borderRadius: '7px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    transition: 'all 0.15s ease',
    ':active': { backgroundColor: state.isSelected ? '#2563eb' : '#dbeafe' }
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 })
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, false>) => (
  <components.DropdownIndicator {...props} />
)
const selectComponents = { DropdownIndicator, IndicatorSeparator: () => null }

interface DocItem {
  id: string
  name: string
  date: string
  type: 'выписка' | 'справка' | 'заключение' | 'направление'
  content?: string
  doctor?: string
  filePath?: string
}

interface NotificationItem {
  id: string
  type: 'medical' | 'consultation' | 'system'
  title: string
  text: string
  time: string
  read: boolean
  severity?: 'critical' | 'warning' | 'info'
  details?: string
}

interface PatientCabinetPageProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        color: '#9ca3af',
        fontSize: 14,
        gap: 8,
        height: '100%',
        minHeight: '200px'
      }}
    >
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        viewBox="0 0 24 24"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
      Загрузка данных...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Иконка типа исследования
const ExamTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const props = { size: 14 }
  switch (type) {
    case 'lab':
      return <TestTube2 {...props} />
    case 'imaging':
      return <ScanLine {...props} />
    case 'functional':
      return <Wind {...props} />
    default:
      return <ClipboardList {...props} />
  }
}

const ExamTypeLabel: Record<string, string> = {
  lab: 'Лабораторный анализ',
  imaging: 'КТ / Рентген',
  functional: 'Функциональное',
  other: 'Прочее'
}

const DocTypeColor: Record<string, { bg: string; color: string }> = {
  выписка: { bg: '#EFF6FF', color: '#2563EB' },
  заключение: { bg: '#F5F3FF', color: '#7C3AED' },
  направление: { bg: '#FFFBEB', color: '#D97706' },
  справка: { bg: '#ECFDF5', color: '#059669' }
}

const PatientCabinetPage: React.FC<PatientCabinetPageProps> = ({
  activeSection = 'patient-dashboard',
  onSectionChange = () => {}
}) => {
  const userId = useSelector(selectUserId)
  const displayName = useSelector(selectDisplayName)

  const activeTab = useMemo(() => {
    switch (activeSection) {
      case 'patient-dashboard':
        return 'dashboard'
      case 'patient-exams':
        return 'exams'
      case 'patient-docs':
        return 'docs'
      case 'patient-notifications':
        return 'notifications'
      case 'patient-profile':
        return 'profile'
      default:
        return 'dashboard'
    }
  }, [activeSection])

  const { notifications, unreadCount, markRead, markAllRead } = usePatientNotifications()

  const [loading, setLoading] = useState(false)
  const [patientData, setPatientData] = useState<Partial<PatientCardDto> | null>(null)

  // General Info
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('0')
  const [maritalStatus, setMaritalStatus] = useState('')

  // Contacts
  const [phoneMobile, setPhoneMobile] = useState('')
  const [phoneHome, setPhoneHome] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')

  // Other
  const [language, setLanguage] = useState('')
  const [nationality, setNationality] = useState('')

  // Work
  const [profession, setProfession] = useState('')
  const [organization, setOrganization] = useState('')
  const [workAddress, setWorkAddress] = useState('')

  // Relative
  const [relativeId, setRelativeId] = useState<string | null>(null)
  const [trustedName, setTrustedName] = useState('')
  const [trustedPhone, setTrustedPhone] = useState('')
  const [trustedRelation, setTrustedRelation] = useState('')
  const [otherRelatives, setOtherRelatives] = useState<{id: string; name: string; relation: string; phone: string}[]>([])
  const [profilePic, setProfilePic] = useState<string | null>(null)

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [examsSearch, setExamsSearch] = useState('')
  const [examsFilter, setExamsFilter] = useState('all')
  const [docsSearch, setDocsSearch] = useState('')
  const [docsFilter, setDocsFilter] = useState('all')
  const [notifFilter, setNotifFilter] = useState('all')

  const [viewingExam, setViewingExam] = useState<ExamItem | null>(null)
  const [viewingDoc, setViewingDoc] = useState<DocItem | null>(null)

  const printableRef = useRef<HTMLDivElement>(null)
  const [activePrintExam, setActivePrintExam] = useState<ExamItem | null>(null)
  const [activePrintDoc, setActivePrintDoc] = useState<DocItem | null>(null)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  const [examsList, setExamsList] = useState<ExamItem[]>([])
  const [docsList, setDocsList] = useState<DocItem[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (userId) {
          const data = await fetchPatientProfile()
          setPatientData(data)
          setFirstName(data.firstName || '')
          setLastName(data.lastName || '')
          setMiddleName(data.middleName || '')
          setDateOfBirth(
            data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : ''
          )
          setGender(data.gender === 'Female' ? '1' : '0')
          setMaritalStatus(data.maritalStatus || '')

          setPhoneMobile(data.contacts?.phoneMobile || '')
          setPhoneHome(data.contacts?.phoneHome || '')
          setEmail(data.contacts?.email || '')
          setAddress(data.contacts?.address || '')
          setCity(data.contacts?.city || '')
          setRegion(data.contacts?.region || '')
          setZip(data.contacts?.zip || '')
          setCountry(data.contacts?.country || 'Приднестровская Молдавская Республика')

          setLanguage(data.other?.language || 'Русский')
          setNationality(data.other?.nationality || 'Русский')

          setProfession(data.work?.profession || '')
          setOrganization(data.work?.organization || '')
          setWorkAddress(data.work?.address || '')

          if (data.relatives && data.relatives.length > 0) {
            setRelativeId(data.relatives[0].id)
            setTrustedName(data.relatives[0].name || '')
            setTrustedPhone(data.relatives[0].phone || '')
            setTrustedRelation(data.relatives[0].relation || '')
            setOtherRelatives(data.relatives.slice(1))
          } else {
            setRelativeId(null)
            setTrustedName('')
            setTrustedPhone('')
            setTrustedRelation('')
            setOtherRelatives([])
          }

          try {
            const exams = await fetchPatientExams()
            setExamsList(
              exams.map((e) => ({
                id: e.id,
                name: e.name,
                date: e.date,
                resultDate: e.resultDate,
                type: e.type,
                status: e.status,
                doctor: e.doctor || '',
                details: e.details || '',
                parameters: e.parameters
              }))
            )
          } catch (e) {
            console.error('Failed to fetch patient exams', e)
          }

          try {
            const docs = await fetchPatientDocuments()
            setDocsList(
              docs.map((d) => ({
                id: d.id,
                name: d.name,
                date: d.date || '',
                type: (d.documentType || 'справка') as DocItem['type'],
                doctor: d.doctorName || '',
                content: d.content || '',
                filePath: d.filePath || ''
              }))
            )
          } catch (e) {
            console.error('Failed to fetch patient documents', e)
          }
        } else {
          setPatientData(null)
          setFirstName('')
          setLastName('')
          setMiddleName('')
          setDateOfBirth('')
          setGender('0')
          setMaritalStatus('')

          setPhoneMobile('')
          setPhoneHome('')
          setEmail('')
          setAddress('')
          setCity('')
          setRegion('')
          setZip('')
          setCountry('Приднестровская Молдавская Республика')

          setLanguage('Русский')
          setNationality('Русский')

          setProfession('')
          setOrganization('')
          setWorkAddress('')

          setRelativeId(null)
          setTrustedName('')
          setTrustedPhone('')
          setTrustedRelation('')
        }
      } catch (err) {
        console.error('Failed to load patient card', err)
        setPatientData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const patientFullName = useMemo(() => {
    if (!patientData) return 'Пациент'
    return `${patientData.lastName || ''} ${patientData.firstName || ''} ${patientData.middleName || ''}`.trim()
  }, [patientData])

  const patientShortName = useMemo(() => {
    if (!patientData) return 'Пациент'
    return `${patientData.firstName || ''} ${patientData.middleName || ''}`.trim()
  }, [patientData])

  const filteredExams = useMemo(
    () =>
      examsList.filter(
        (e) =>
          e.name.toLowerCase().includes(examsSearch.toLowerCase()) &&
          (examsFilter === 'all' || e.type === examsFilter)
      ),
    [examsList, examsSearch, examsFilter]
  )

  const filteredDocs = useMemo(
    () =>
      docsList.filter(
        (d) =>
          d.name.toLowerCase().includes(docsSearch.toLowerCase()) &&
          (docsFilter === 'all' || d.type === docsFilter)
      ),
    [docsList, docsSearch, docsFilter]
  )

  const filteredNotifs = useMemo(
    () =>
      notifications.filter((n) => {
        if (notifFilter === 'unread') return !n.read
        if (notifFilter === 'all') return true
        return n.type === notifFilter
      }),
    [notifications, notifFilter]
  )

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    const generalResult = generalSchema.safeParse({
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      maritalStatus
    })
    const contactsResult = contactsSchema.safeParse({
      phoneMobile,
      phoneHome,
      email,
      address,
      city,
      region,
      zip,
      country
    })
    const otherResult = otherSchema.safeParse({ language, nationality })
    const workResult = workSchema.safeParse({ profession, organization, address: workAddress })

    let relativeResult = null
    if (trustedName || trustedPhone || trustedRelation) {
      relativeResult = relativeSchema.safeParse({
        name: trustedName,
        phone: trustedPhone,
        relation: trustedRelation
      })
    }

    const errors: Record<string, string> = {}
    if (!generalResult.success)
      generalResult.error.errors.forEach((err) => {
        if (err.path[0]) errors[`general_${err.path[0]}`] = err.message
      })
    if (!contactsResult.success)
      contactsResult.error.errors.forEach((err) => {
        if (err.path[0]) errors[`contacts_${err.path[0]}`] = err.message
      })
    if (!otherResult.success)
      otherResult.error.errors.forEach((err) => {
        if (err.path[0]) errors[`other_${err.path[0]}`] = err.message
      })
    if (!workResult.success)
      workResult.error.errors.forEach((err) => {
        if (err.path[0]) errors[`work_${err.path[0]}`] = err.message
      })
    if (relativeResult && !relativeResult.success)
      relativeResult.error.errors.forEach((err) => {
        if (err.path[0]) errors[`relative_${err.path[0]}`] = err.message
      })

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors)
      toast.error('Пожалуйста, исправьте ошибки заполнения формы')
      return
    }

    setProfileErrors({})
    setLoading(true)
    try {
      await updatePatientGeneralInfo(generalResult.data!)
      await updatePatientContacts(contactsResult.data!)
      await updatePatientOtherInfo(otherResult.data!)
      await updatePatientWorkInfo(workResult.data!)

      if (relativeResult) {
        if (relativeId) {
          await updatePatientRelative(relativeId, relativeResult.data!)
        } else {
          await addPatientRelative(relativeResult.data!)
        }
      }

      toast.success('Профиль успешно обновлён')

      if (userId) {
        const data = await fetchPatientProfile()
        setPatientData(data)
      }
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось сохранить профиль')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = changePasswordSchema.safeParse({ oldPassword, newPassword, confirmPassword })
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0]] = err.message
      })
      setPasswordErrors(errors)
      return
    }

    setPasswordErrors({})
    setLoading(true)
    try {
      await changePatientPassword({ oldPassword, newPassword, confirmPassword })
      toast.success('Пароль успешно изменён')
      setIsPasswordModalOpen(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось сменить пароль')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      await deleteAccount()
      toast.success('Аккаунт успешно удален')
      localStorage.removeItem('token')
      localStorage.removeItem('patient_unread_notif_count')
      window.location.href = '/auth'
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось удалить аккаунт')
      setLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  const handleMarkAsRead = (id: string) => {
    markRead(id)
  }

  const handleMarkAllAsRead = () => {
    markAllRead()
    toast.success('Все уведомления прочитаны')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const MAX_AVATAR_SIZE = 15 * 1024 * 1024
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Размер файла превышает лимит (15 МБ)')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePic(reader.result as string)
      toast.success('Фото обновлено')
    }
    reader.readAsDataURL(file)
  }

  const generatePdf = async (node: HTMLElement, filename: string) => {
    try {
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pw / canvas.width, ph / canvas.height)
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        (pw - canvas.width * ratio) / 2,
        20,
        canvas.width * ratio,
        canvas.height * ratio
      )
      pdf.save(filename)
      toast.success('Файл скачан')
    } catch {
      toast.error('Не удалось создать PDF')
    }
  }

  const downloadExamPdf = async (exam: ExamItem) => {
    setActivePrintExam(exam)
    setPdfGenerating(true)
    toast.info('Формирование документа…')
    setTimeout(async () => {
      if (printableRef.current) {
        await generatePdf(
          printableRef.current,
          `Анализ_${exam.name.replace(/ /g, '_')}_${exam.date}.pdf`
        )
      }
      setPdfGenerating(false)
      setActivePrintExam(null)
    }, 300)
  }

  const downloadDocPdf = async (doc: DocItem) => {
    setActivePrintDoc(doc)
    setPdfGenerating(true)
    toast.info('Формирование документа…')
    setTimeout(async () => {
      if (printableRef.current) {
        await generatePdf(
          printableRef.current,
          `Документ_${doc.name.replace(/ /g, '_')}_${doc.date}.pdf`
        )
      }
      setPdfGenerating(false)
      setActivePrintDoc(null)
    }, 300)
  }

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <HeaderLeft>
            <HeaderIconBox>
              <Stethoscope size={20} />
            </HeaderIconBox>
            <HeaderTitles>
              <HeaderTitle>Личный кабинет</HeaderTitle>
              <HeaderSubtitle>Загрузка данных профиля...</HeaderSubtitle>
            </HeaderTitles>
          </HeaderLeft>
        </Header>
        <LoadingSpinner />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <HeaderIconBox>
            <Stethoscope size={20} />
          </HeaderIconBox>
          <HeaderTitles>
            <HeaderTitle>Личный кабинет</HeaderTitle>
            <HeaderSubtitle>Результаты анализов, документы и управление профилем</HeaderSubtitle>
          </HeaderTitles>
        </HeaderLeft>
        <WelcomeMeta>
          <span>
            Медкарта: <strong>{patientData?.medcardNum || '—'}</strong>
          </span>
          <span>
            Последний вход:{' '}
            {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </WelcomeMeta>
      </Header>

      {activeTab === 'dashboard' && (
        <>
          <WelcomeBanner>
            <WelcomeText>
              <WelcomeTitle>Добро пожаловать, {patientShortName}</WelcomeTitle>
              <WelcomeSubtitle>
                Ваш лечащий врач — <strong>{patientData?.doctorName || 'Смирнов А.А.'}</strong>
                ,&nbsp;
                {patientData?.departmentName || 'Пульмонологическое отделение'}
              </WelcomeSubtitle>
            </WelcomeText>
            <WelcomeMeta>
              <WelcomeMetaItem>
                Статус:
                <strong>{patientData?.statusText || 'Наблюдение'}</strong>
              </WelcomeMetaItem>

              <WelcomeMetaItem>
                Обновлено:
                <strong>{patientData?.lastUpdated || '15.05.2026'}</strong>
              </WelcomeMetaItem>
            </WelcomeMeta>
          </WelcomeBanner>

          <StatsGrid>
            <StatCard $color="#2563EB" $bg="#EFF6FF">
              <StatHeader>
                <StatLabel>Готовых анализов</StatLabel>
                <StatIcon $bg="#EFF6FF" $color="#2563EB">
                  <Activity size={17} />
                </StatIcon>
              </StatHeader>
              <StatValue>{examsList.filter((e) => e.status === 'ready').length}</StatValue>
              <StatSub>Из {examsList.length} исследований</StatSub>
            </StatCard>

            <StatCard $color="#059669" $bg="#ECFDF5">
              <StatHeader>
                <StatLabel>Документов</StatLabel>
                <StatIcon $bg="#ECFDF5" $color="#059669">
                  <FileText size={17} />
                </StatIcon>
              </StatHeader>
              <StatValue>{docsList.length}</StatValue>
              <StatSub>Выписки, справки, заключения</StatSub>
            </StatCard>

            <StatCard
              $color="#D97706"
              $bg="#FFFBEB"
              style={{ cursor: 'pointer' }}
              onClick={() => onSectionChange('patient-notifications')}
            >
              <StatHeader>
                <StatLabel>Непрочитанных</StatLabel>
                <StatIcon $bg="#FFFBEB" $color="#D97706">
                  <Bell size={17} />
                </StatIcon>
              </StatHeader>
              <StatValue>{unreadCount}</StatValue>
              <StatSub>Нажмите, чтобы просмотреть</StatSub>
            </StatCard>

            <StatCard $color="#7C3AED" $bg="#F5F3FF">
              <StatHeader>
                <StatLabel>Статус лечения</StatLabel>
                <StatIcon $bg="#F5F3FF" $color="#7C3AED">
                  <CheckCircle size={17} />
                </StatIcon>
              </StatHeader>
              <StatValue style={{ fontSize: '15px', marginTop: 4, lineHeight: 1.35 }}>
                {patientData?.statusText || 'Амбулаторно'}
              </StatValue>
              <StatSub>Отделение пульмонологии</StatSub>
            </StatCard>
          </StatsGrid>

          <DashboardRow>
            <DashboardCard>
              <CardHeader>
                <CardTitle>
                  <Activity size={15} /> Последние обследования
                </CardTitle>
                <CardLinkButton onClick={() => onSectionChange('patient-exams')}>
                  Все <ChevronRight size={13} />
                </CardLinkButton>
              </CardHeader>
              <SimpleList>
                {examsList.slice(0, 4).map((exam) => (
                  <SimpleItem key={exam.id}>
                    <ItemLabel>
                      <ItemName>{exam.name}</ItemName>
                      <ItemDate>
                        {exam.date} · {exam.doctor}
                      </ItemDate>
                    </ItemLabel>
                    <StatusBadge $status={exam.status}>
                      {exam.status === 'ready' ? 'Готово' : 'В работе'}
                    </StatusBadge>
                  </SimpleItem>
                ))}
              </SimpleList>
            </DashboardCard>

            <DashboardCard>
              <CardHeader>
                <CardTitle>
                  <FileText size={15} /> Последние документы
                </CardTitle>
                <CardLinkButton onClick={() => onSectionChange('patient-docs')}>
                  Все <ChevronRight size={13} />
                </CardLinkButton>
              </CardHeader>
              <SimpleList>
                {docsList.slice(0, 4).map((doc) => {
                  const colors = DocTypeColor[doc.type] || { bg: '#F1F5F9', color: '#475569' }
                  return (
                    <SimpleItem key={doc.id}>
                      <ItemLabel>
                        <ItemName>{doc.name}</ItemName>
                        <ItemDate>
                          {doc.date} · {doc.type}
                        </ItemDate>
                      </ItemLabel>
                      <ActionButton $primary onClick={() => setViewingDoc(doc)}>
                        <Eye size={13} /> Открыть
                      </ActionButton>
                    </SimpleItem>
                  )
                })}
              </SimpleList>
            </DashboardCard>
          </DashboardRow>
        </>
      )}

      {activeTab === 'exams' && (
        <>
          <FilterBar>
            <SearchInputWrapper>
              <Search size={15} />
              <SearchInput
                placeholder="Поиск по названию исследования…"
                value={examsSearch}
                onChange={(e) => setExamsSearch(e.target.value)}
              />
            </SearchInputWrapper>
            <DropdownSelect value={examsFilter} onChange={(e) => setExamsFilter(e.target.value)}>
              <option value="all">Все типы</option>
              <option value="lab">Лабораторные</option>
              <option value="imaging">КТ и Рентген</option>
              <option value="functional">Спирометрия</option>
            </DropdownSelect>
          </FilterBar>

          <TableWrapper>
            {filteredExams.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <TableTh>Исследование</TableTh>
                    <TableTh>Тип</TableTh>
                    <TableTh>Проведено</TableTh>
                    <TableTh>Результат</TableTh>
                    <TableTh>Статус</TableTh>
                    <TableTh style={{ textAlign: 'right' }}>Действия</TableTh>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableTd>
                        <div style={{ fontWeight: 650, color: '#1E293B', fontSize: '13.5px' }}>
                          {exam.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: 2 }}>
                          {exam.doctor}
                        </div>
                      </TableTd>
                      <TableTd>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: '#64748B',
                            background: '#F1F5F9',
                            padding: '3px 8px',
                            borderRadius: 6
                          }}
                        >
                          <ExamTypeIcon type={exam.type} />
                          {ExamTypeLabel[exam.type]}
                        </span>
                      </TableTd>
                      <TableTd style={{ color: '#475569' }}>{exam.date}</TableTd>
                      <TableTd style={{ color: '#475569' }}>{exam.resultDate}</TableTd>
                      <TableTd>
                        <StatusBadge $status={exam.status}>
                          {exam.status === 'ready' ? 'Готово' : 'В работе'}
                        </StatusBadge>
                      </TableTd>
                      <TableTd>
                        <FlexActions style={{ justifyContent: 'flex-end' }}>
                          <ActionButton $primary onClick={() => setViewingExam(exam)}>
                            <Eye size={13} /> Просмотр
                          </ActionButton>
                          {exam.status === 'ready' && (
                            <ActionButton
                              onClick={() => downloadExamPdf(exam)}
                              disabled={pdfGenerating}
                            >
                              <Download size={13} /> PDF
                            </ActionButton>
                          )}
                        </FlexActions>
                      </TableTd>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoDataState>
                <Activity size={40} />
                <p>Обследования по заданным критериям не найдены</p>
              </NoDataState>
            )}
          </TableWrapper>
        </>
      )}

      {activeTab === 'docs' && (
        <>
          <FilterBar>
            <SearchInputWrapper>
              <Search size={15} />
              <SearchInput
                placeholder="Поиск по названию документа…"
                value={docsSearch}
                onChange={(e) => setDocsSearch(e.target.value)}
              />
            </SearchInputWrapper>
            <DropdownSelect value={docsFilter} onChange={(e) => setDocsFilter(e.target.value)}>
              <option value="all">Все типы</option>
              <option value="выписка">Выписки</option>
              <option value="заключение">Заключения</option>
              <option value="направление">Направления</option>
              <option value="справка">Справки</option>
            </DropdownSelect>
          </FilterBar>

          {filteredDocs.length > 0 ? (
            <DocGrid>
              {filteredDocs.map((doc) => {
                const colors = DocTypeColor[doc.type] || { bg: '#F1F5F9', color: '#475569' }
                return (
                  <DocCard key={doc.id}>
                    <DocHeader>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: colors.bg,
                          color: colors.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <FileText size={22} />
                      </div>
                      <DocTitleBlock>
                        <DocNameText title={doc.name}>{doc.name}</DocNameText>
                        <span
                          style={{
                            display: 'inline-flex',
                            width: 'fit-content',
                            fontSize: '12px',
                            fontWeight: 650,
                            color: colors.color,
                            background: colors.bg,
                            padding: '4px 10px',
                            borderRadius: 4,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {doc.type}
                        </span>
                      </DocTitleBlock>
                    </DocHeader>
                    <div
                      style={{
                        fontSize: '14.5px',
                        color: '#64748B',
                        lineHeight: 1.55,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {doc.content}
                    </div>
                    <DocFooter>
                      <DocDateText>
                        <Calendar size={12} />
                        {doc.date}
                      </DocDateText>
                      <FlexActions>
                        <ActionButton $primary onClick={() => setViewingDoc(doc)}>
                          <Eye size={13} /> Открыть
                        </ActionButton>
                        <ActionButton
                          onClick={() => {
                            if (doc.filePath) {
                              downloadFileFromServer(doc.name, doc.filePath)
                            } else {
                              downloadDocPdf(doc)
                            }
                          }}
                          disabled={pdfGenerating}
                        >
                          <Download size={13} />
                        </ActionButton>
                      </FlexActions>
                    </DocFooter>
                  </DocCard>
                )
              })}
            </DocGrid>
          ) : (
            <NoDataState>
              <FileText size={40} />
              <p>Документы не найдены</p>
            </NoDataState>
          )}
        </>
      )}

      {/* ── NOTIFICATIONS ─────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <NotificationsContainer>
          <NotificationHeaderRow>
            <DropdownSelect value={notifFilter} onChange={(e) => setNotifFilter(e.target.value)}>
              <option value="all">Все уведомления</option>
              <option value="unread">Непрочитанные</option>
              <option value="medical">Результаты и документы</option>
              <option value="consultation">Консультации</option>
              <option value="system">Системные</option>
            </DropdownSelect>
            {unreadCount > 0 && (
              <SecondaryButton onClick={handleMarkAllAsRead}>
                <CheckCheck size={14} style={{ marginRight: 7 }} />
                Прочитать все
              </SecondaryButton>
            )}
          </NotificationHeaderRow>

          {filteredNotifs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filteredNotifs.map((n) => (
                <NotificationCard
                  key={n.id}
                  $read={n.read}
                  $severity={n.severity}
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                >
                  <NotifIconBox $type={n.type} $severity={n.severity}>
                    {n.type === 'medical' && <Activity size={22} />}
                    {n.type === 'consultation' && <Calendar size={22} />}
                    {n.type === 'system' && <Bell size={22} />}
                  </NotifIconBox>
                  <NotifContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {n.severity && (
                        <SeverityBadge $severity={n.severity}>
                          {n.severity === 'critical'
                            ? 'Критично'
                            : n.severity === 'warning'
                              ? 'Внимание'
                              : 'Инфо'}
                        </SeverityBadge>
                      )}
                      <NotifTitle>{n.title}</NotifTitle>
                    </div>
                    <NotifText>{n.text}</NotifText>
                    {n.details && (
                      <NotificationDetails $severity={n.severity}>
                        <strong>Детали:</strong> {n.details}
                      </NotificationDetails>
                    )}
                    <NotifTimeBlock>
                      <span>
                        {n.time
                          ? new Date(n.time).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : ''}
                      </span>
                      {!n.read && (
                        <span
                          style={{
                            color:
                              n.severity === 'critical'
                                ? '#dc2626'
                                : n.severity === 'warning'
                                  ? '#d97706'
                                  : '#2563EB',
                            fontWeight: 700
                          }}
                        >
                          · Новое
                        </span>
                      )}
                    </NotifTimeBlock>
                  </NotifContent>
                  {!n.read && (
                    <MarkReadBtn
                      title="Отметить как прочитанное"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(n.id)
                      }}
                    >
                      <Check size={20} />
                    </MarkReadBtn>
                  )}
                </NotificationCard>
              ))}
            </div>
          ) : (
            <NoDataState>
              <Bell size={40} />
              <p>Уведомлений нет</p>
            </NoDataState>
          )}
        </NotificationsContainer>
      )}

      {/* ── PROFILE ───────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <ProfileLayout>
          <ProfileSidebarCard>
            <ProfileAvatarWrapper
              onClick={() => fileInputRef.current?.click()}
              title="Сменить фото"
            >
              {profilePic ? (
                <ProfileAvatar src={profilePic} alt="Аватар" />
              ) : (
                <ProfileAvatarPlaceholder>
                  {patientData?.firstName?.[0] || 'П'}
                  {patientData?.lastName?.[0] || ''}
                </ProfileAvatarPlaceholder>
              )}
              <AvatarOverlay>
                <Camera size={18} />
                <span>Сменить фото</span>
              </AvatarOverlay>
            </ProfileAvatarWrapper>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <ProfileSidebarInfo>
              <ProfileSidebarName>{patientFullName}</ProfileSidebarName>
              <ProfileSidebarRole>
                Пациент · {patientData?.departmentName || 'Пульмонология'}
              </ProfileSidebarRole>
            </ProfileSidebarInfo>

            <div
              style={{
                width: '100%',
                borderTop: '1px solid rgba(15,23,42,0.07)',
                paddingTop: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px'
                }}
              >
                Реквизиты
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#475569',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5
                }}
              >
                <span>
                  Медкарта:{' '}
                  <strong style={{ color: '#1E293B' }}>{patientData?.medcardNum || '—'}</strong>
                </span>
                <span>
                  Статус:{' '}
                  <strong style={{ color: '#2563EB' }}>{patientData?.statusText || '—'}</strong>
                </span>
              </div>
            </div>

            <SecondaryButton
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <Lock size={14} style={{ marginRight: 7 }} />
              Сменить пароль
            </SecondaryButton>

            <SecondaryButton
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px', color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <User size={14} style={{ marginRight: 7 }} />
              Удалить аккаунт
            </SecondaryButton>

            <div
              style={{ width: '100%', borderTop: '1px solid rgba(15,23,42,0.07)', paddingTop: 14 }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 7,
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Служебная медкарта и история обходов скрыты в целях конфиденциальности.</span>
              </div>
            </div>
          </ProfileSidebarCard>

          <ProfileMainCard>
            <form
              onSubmit={handleSaveProfile}
              style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionSubTitle>
                  <User size={13} />
                  1. Основные данные
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>Фамилия</FieldLabel>
                    <InputField value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    {profileErrors.general_lastName && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.general_lastName}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Имя</FieldLabel>
                    <InputField value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    {profileErrors.general_firstName && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.general_firstName}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Отчество</FieldLabel>
                    <InputField
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Дата рождения</FieldLabel>
                    <InputField
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    {profileErrors.general_dateOfBirth && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.general_dateOfBirth}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Пол</FieldLabel>
                    <Select
                      options={[
                        { value: '0', label: 'Мужской' },
                        { value: '1', label: 'Женский' }
                      ]}
                      value={
                        [
                          { value: '0', label: 'Мужской' },
                          { value: '1', label: 'Женский' }
                        ].find((o) => o.value === gender) || null
                      }
                      onChange={(option) => setGender(option ? option.value : '0')}
                      placeholder="Выберите..."
                      styles={selectStyles}
                      components={selectComponents}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Сем. положение</FieldLabel>
                    <Select
                      options={[
                        { value: 'Холост/Не замужем', label: 'Холост/Не замужем' },
                        { value: 'Женат/Замужем', label: 'Женат/Замужем' },
                        { value: 'В разводе', label: 'В разводе' },
                        { value: 'Вдовец/Вдова', label: 'Вдовец/Вдова' }
                      ]}
                      value={
                        [
                          { value: 'Холост/Не замужем', label: 'Холост/Не замужем' },
                          { value: 'Женат/Замужем', label: 'Женат/Замужем' },
                          { value: 'В разводе', label: 'В разводе' },
                          { value: 'Вдовец/Вдова', label: 'Вдовец/Вдова' }
                        ].find((o) => o.value === maritalStatus) || null
                      }
                      onChange={(option) => setMaritalStatus(option ? option.value : '')}
                      placeholder="Выберите..."
                      styles={selectStyles}
                      components={selectComponents}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      isClearable
                    />
                  </FieldWrapper>
                </FieldsGrid>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionSubTitle>
                  <MapPin size={13} />
                  2. Контакты
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>Страна</FieldLabel>
                    <InputField value={country} onChange={(e) => setCountry(e.target.value)} />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Область / Регион</FieldLabel>
                    <InputField value={region} onChange={(e) => setRegion(e.target.value)} />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Город</FieldLabel>
                    <InputField value={city} onChange={(e) => setCity(e.target.value)} />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Индекс</FieldLabel>
                    <InputField value={zip} onChange={(e) => setZip(e.target.value)} />
                  </FieldWrapper>
                  <FieldWrapper style={{ gridColumn: 'span 2' }}>
                    <FieldLabel>Адрес (Улица, Дом, Квартира)</FieldLabel>
                    <InputField value={address} onChange={(e) => setAddress(e.target.value)} />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Мобильный телефон</FieldLabel>
                    <PatternFormat
                      format={getPhoneFormat(phoneMobile)}
                      allowEmptyFormatting
                      mask="_"
                      value={phoneMobile}
                      onValueChange={(values) =>
                        setPhoneMobile(values.value ? values.formattedValue : '')
                      }
                      customInput={InputField}
                    />
                    {profileErrors.contacts_phoneMobile && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.contacts_phoneMobile}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Домашний телефон</FieldLabel>
                    <PatternFormat
                      format={getPhoneFormat(phoneHome)}
                      allowEmptyFormatting
                      mask="_"
                      value={phoneHome}
                      onValueChange={(values) =>
                        setPhoneHome(values.value ? values.formattedValue : '')
                      }
                      customInput={InputField}
                    />
                    {profileErrors.contacts_phoneHome && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.contacts_phoneHome}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Email</FieldLabel>
                    <InputField
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="example@mail.ru"
                    />
                    {profileErrors.contacts_email && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.contacts_email}
                      </div>
                    )}
                  </FieldWrapper>
                </FieldsGrid>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionSubTitle>
                  <Activity size={13} />
                  3. Прочее
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>Язык</FieldLabel>
                    <InputField value={language} onChange={(e) => setLanguage(e.target.value)} />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Национальность</FieldLabel>
                    <InputField
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    />
                  </FieldWrapper>
                </FieldsGrid>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionSubTitle>
                  <Activity size={13} />
                  4. Работа
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>Профессия</FieldLabel>
                    <InputField
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Организация</FieldLabel>
                    <InputField
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper style={{ gridColumn: 'span 2' }}>
                    <FieldLabel>Рабочий адрес</FieldLabel>
                    <InputField
                      value={workAddress}
                      onChange={(e) => setWorkAddress(e.target.value)}
                    />
                  </FieldWrapper>
                </FieldsGrid>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionSubTitle>
                  <UserCheck size={13} />
                  5. Родственники / Доверенное лицо
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>ФИО</FieldLabel>
                    <InputField
                      placeholder="Полное имя"
                      value={trustedName}
                      onChange={(e) => setTrustedName(e.target.value)}
                    />
                    {profileErrors.relative_name && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.relative_name}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Степень родства</FieldLabel>
                    <Select
                      options={RELATION_OPTIONS}
                      value={RELATION_OPTIONS.find((o) => o.value === trustedRelation) || null}
                      onChange={(option) => setTrustedRelation(option ? option.value : '')}
                      placeholder="Выберите..."
                      styles={selectStyles}
                      components={selectComponents}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      isClearable
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Телефон</FieldLabel>
                    <PatternFormat
                      format={getPhoneFormat(trustedPhone)}
                      allowEmptyFormatting
                      mask="_"
                      value={trustedPhone}
                      onValueChange={(values) =>
                        setTrustedPhone(values.value ? values.formattedValue : '')
                      }
                      customInput={InputField}
                    />
                    {profileErrors.relative_phone && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {profileErrors.relative_phone}
                      </div>
                    )}
                  </FieldWrapper>
                </FieldsGrid>

                {otherRelatives.length > 0 && (
                  <div style={{ marginTop: 12, padding: 16, backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12 }}>
                      Дополнительные доверенные лица (добавлены врачом):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {otherRelatives.map(rel => (
                        <div key={rel.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, fontSize: 14, color: '#1e293b' }}>
                          <div><span style={{color: '#64748b', fontSize: 12, display: 'block'}}>ФИО</span>{rel.name}</div>
                          <div><span style={{color: '#64748b', fontSize: 12, display: 'block'}}>Степень родства</span>{rel.relation}</div>
                          <div><span style={{color: '#64748b', fontSize: 12, display: 'block'}}>Телефон</span>{rel.phone}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <SaveButton type="submit">Сохранить изменения</SaveButton>
            </form>
          </ProfileMainCard>
        </ProfileLayout>
      )}

      {/* ── MODAL: EXAM ────────────────────────────────────── */}
      {viewingExam && (
        <ModalOverlay onClick={() => setViewingExam(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ExamTypeIcon type={viewingExam.type} />
                </div>
                <ModalTitle>{viewingExam.name}</ModalTitle>
              </div>
              <CloseBtn onClick={() => setViewingExam(null)}>
                <X size={15} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              <div
                style={{
                  fontSize: '12.5px',
                  color: '#64748B',
                  display: 'flex',
                  gap: 14,
                  flexWrap: 'wrap'
                }}
              >
                <span>
                  Дата: <strong style={{ color: '#475569' }}>{viewingExam.date}</strong>
                </span>
                <span>
                  Врач: <strong style={{ color: '#475569' }}>{viewingExam.doctor}</strong>
                </span>
                <StatusBadge $status={viewingExam.status}>
                  {viewingExam.status === 'ready' ? 'Готово' : 'В работе'}
                </StatusBadge>
              </div>

              {viewingExam.parameters && viewingExam.parameters.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      marginBottom: 8
                    }}
                  >
                    Показатели
                  </div>
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <TableTh style={{ padding: '9px 14px' }}>Параметр</TableTh>
                          <TableTh style={{ padding: '9px 14px', textAlign: 'center' }}>
                            Результат
                          </TableTh>
                          <TableTh style={{ padding: '9px 14px', textAlign: 'center' }}>
                            Норма
                          </TableTh>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingExam.parameters.map((p, i) => (
                          <TableRow key={i}>
                            <TableTd style={{ padding: '9px 14px', fontSize: '12.5px' }}>
                              {p.name}
                            </TableTd>
                            <TableTd
                              style={{
                                padding: '9px 14px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                color: '#1E293B',
                                textAlign: 'center'
                              }}
                            >
                              {p.value} {p.unit}
                            </TableTd>
                            <TableTd
                              style={{
                                padding: '9px 14px',
                                fontSize: '12.5px',
                                color: '#64748B',
                                textAlign: 'center'
                              }}
                            >
                              {p.norm}
                            </TableTd>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  </TableWrapper>
                </div>
              )}

              {viewingExam.details && (
                <div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      marginBottom: 8
                    }}
                  >
                    Заключение
                  </div>
                  <div
                    style={{
                      fontSize: '13.5px',
                      color: '#334155',
                      background: '#F8FAFC',
                      padding: '14px 16px',
                      borderRadius: 10,
                      border: '1px solid rgba(15,23,42,0.07)',
                      lineHeight: 1.6
                    }}
                  >
                    {viewingExam.details}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={() => setViewingExam(null)}>Закрыть</SecondaryButton>
              {viewingExam.status === 'ready' && (
                <SaveButton
                  onClick={() => {
                    downloadExamPdf(viewingExam)
                    setViewingExam(null)
                  }}
                >
                  <Download size={14} style={{ marginRight: 6 }} />
                  Скачать PDF
                </SaveButton>
              )}
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── MODAL: DOC ─────────────────────────────────────── */}
      {viewingDoc && (
        <ModalOverlay onClick={() => setViewingDoc(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: DocTypeColor[viewingDoc.type]?.bg || '#F1F5F9',
                    color: DocTypeColor[viewingDoc.type]?.color || '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText size={16} />
                </div>
                <ModalTitle>{viewingDoc.name}</ModalTitle>
              </div>
              <CloseBtn onClick={() => setViewingDoc(null)}>
                <X size={15} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              <div
                style={{
                  fontSize: '12.5px',
                  color: '#64748B',
                  display: 'flex',
                  gap: 14,
                  flexWrap: 'wrap'
                }}
              >
                <span>
                  Дата: <strong style={{ color: '#475569' }}>{viewingDoc.date}</strong>
                </span>
                <span>
                  Врач: <strong style={{ color: '#475569' }}>{viewingDoc.doctor}</strong>
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 650,
                    padding: '2px 7px',
                    borderRadius: 5,
                    background: DocTypeColor[viewingDoc.type]?.bg || '#F1F5F9',
                    color: DocTypeColor[viewingDoc.type]?.color || '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px'
                  }}
                >
                  {viewingDoc.type}
                </span>
              </div>
              {viewingDoc.filePath ? (
                <iframe
                  src={`${process.env.REACT_APP_API_URL ?? ''}/api/files/download/${encodeURIComponent(viewingDoc.filePath)}`}
                  title={viewingDoc.name}
                  style={{
                    width: '100%',
                    height: 500,
                    border: 'none',
                    borderRadius: 8,
                    marginTop: 10
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '13.5px',
                    color: '#334155',
                    background: '#F8FAFC',
                    padding: '18px 20px',
                    borderRadius: 10,
                    border: '1px solid rgba(15,23,42,0.07)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    marginTop: 10
                  }}
                >
                  {viewingDoc.content}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={() => setViewingDoc(null)}>Закрыть</SecondaryButton>
              <SaveButton
                onClick={() => {
                  if (viewingDoc.filePath) {
                    downloadFileFromServer(viewingDoc.name, viewingDoc.filePath)
                  } else {
                    downloadDocPdf(viewingDoc)
                  }
                  setViewingDoc(null)
                }}
              >
                <Download size={14} style={{ marginRight: 6 }} />
                Скачать документ
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── MODAL: PASSWORD ─────────────────────────────────── */}
      {isPasswordModalOpen && (
        <ModalOverlay onClick={() => setIsPasswordModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handlePasswordChange}>
              <ModalHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: '#F5F3FF',
                      color: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Lock size={15} />
                  </div>
                  <ModalTitle>Смена пароля</ModalTitle>
                </div>
                <CloseBtn type="button" onClick={() => setIsPasswordModalOpen(false)}>
                  <X size={15} />
                </CloseBtn>
              </ModalHeader>
              <ModalBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <FieldWrapper>
                    <FieldLabel>Текущий пароль</FieldLabel>
                    <InputField
                      type="password"
                      placeholder="Введите текущий пароль"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    {passwordErrors.oldPassword && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {passwordErrors.oldPassword}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Новый пароль</FieldLabel>
                    <InputField
                      type="password"
                      placeholder="Придумайте надёжный пароль"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {passwordErrors.newPassword && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {passwordErrors.newPassword}
                      </div>
                    )}
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Подтверждение пароля</FieldLabel>
                    <InputField
                      type="password"
                      placeholder="Повторите новый пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordErrors.confirmPassword && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                        {passwordErrors.confirmPassword}
                      </div>
                    )}
                  </FieldWrapper>
                </div>
              </ModalBody>
              <ModalFooter>
                <SecondaryButton type="button" onClick={() => setIsPasswordModalOpen(false)}>
                  Отмена
                </SecondaryButton>
                <SaveButton type="submit">Изменить пароль</SaveButton>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {isDeleteModalOpen && (
        <ModalOverlay onClick={() => setIsDeleteModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <ModalHeader>
              <ModalTitle style={{ color: '#ef4444' }}>Удаление аккаунта</ModalTitle>
              <CloseBtn type="button" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <div style={{ padding: '24px 24px 0 24px' }}>
              <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.5 }}>
                Вы уверены, что хотите полностью удалить свой аккаунт? Это действие необратимо.
                Все ваши данные будут стерты.
              </p>
            </div>
            <ModalFooter style={{ marginTop: 24 }}>
              <SecondaryButton type="button" onClick={() => setIsDeleteModalOpen(false)}>
                Отмена
              </SecondaryButton>
              <SaveButton
                type="button"
                onClick={handleDeleteAccount}
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
              >
                Да, удалить
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── HIDDEN PDF AREA ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: 0,
          height: 0,
          overflow: 'hidden'
        }}
      >
        {activePrintExam && (
          <div
            ref={printableRef}
            style={{
              width: 600,
              padding: 40,
              fontFamily: "'Inter', system-ui, sans-serif",
              color: '#0F172A',
              background: '#fff',
              boxSizing: 'border-box'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #2563EB',
                paddingBottom: 20,
                marginBottom: 24
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 18, color: '#1E3A8A', fontWeight: 800 }}>
                  ОБЛАСТНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА
                </h2>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
                  Пульмонологическое отделение
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: '#64748B' }}>
                <div>Медкарта: {patientData?.medcardNum || '—'}</div>
                <div>Дата: {activePrintExam.resultDate}</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 12,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 6
                }}
              >
                Результаты исследования
              </div>
              <h3 style={{ margin: 0, fontSize: 18, color: '#0F172A', fontWeight: 700 }}>
                {activePrintExam.name}
              </h3>
            </div>
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: 14,
                marginBottom: 22,
                fontSize: 13
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <strong>Пациент:</strong> {patientFullName}
                </div>
                <div>
                  <strong>Дата рождения:</strong>{' '}
                  {patientData?.dateOfBirth
                    ? new Date(patientData.dateOfBirth).toLocaleDateString('ru-RU')
                    : '15.03.1985'}
                </div>
                <div>
                  <strong>Пол:</strong> {patientData?.gender || 'Мужской'}
                </div>
                <div>
                  <strong>Врач:</strong> {activePrintExam.doctor}
                </div>
              </div>
            </div>
            {activePrintExam.parameters && activePrintExam.parameters.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    marginBottom: 8
                  }}
                >
                  Показатели
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9' }}>
                      <th
                        style={{
                          border: '1px solid #E2E8F0',
                          padding: '7px 10px',
                          textAlign: 'left'
                        }}
                      >
                        Параметр
                      </th>
                      <th
                        style={{
                          border: '1px solid #E2E8F0',
                          padding: '7px 10px',
                          textAlign: 'center'
                        }}
                      >
                        Результат
                      </th>
                      <th
                        style={{
                          border: '1px solid #E2E8F0',
                          padding: '7px 10px',
                          textAlign: 'center'
                        }}
                      >
                        Норма
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePrintExam.parameters.map((p, i) => (
                      <tr key={i}>
                        <td style={{ border: '1px solid #E2E8F0', padding: '7px 10px' }}>
                          {p.name}
                        </td>
                        <td
                          style={{
                            border: '1px solid #E2E8F0',
                            padding: '7px 10px',
                            textAlign: 'center',
                            fontWeight: 700
                          }}
                        >
                          {p.value} {p.unit}
                        </td>
                        <td
                          style={{
                            border: '1px solid #E2E8F0',
                            padding: '7px 10px',
                            textAlign: 'center',
                            color: '#64748B'
                          }}
                        >
                          {p.norm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ marginBottom: 40 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  marginBottom: 8
                }}
              >
                Заключение
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#334155',
                  lineHeight: 1.6,
                  padding: 14,
                  background: '#F8FAFC',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0'
                }}
              >
                {activePrintExam.details}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 50,
                fontSize: 12,
                color: '#475569'
              }}
            >
              <div>
                <div>Лечащий врач: ____________________</div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>
                  подпись / расшифровка
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    border: '2px dashed #2563EB',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB',
                    fontWeight: 800,
                    fontSize: 10,
                    transform: 'rotate(-10deg)',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: 4
                  }}
                >
                  М.П. ГУ БЦГБ
                </div>
              </div>
            </div>
          </div>
        )}

        {activePrintDoc && (
          <div
            ref={printableRef}
            style={{
              width: 600,
              padding: 40,
              fontFamily: "'Inter', system-ui, sans-serif",
              color: '#0F172A',
              background: '#fff',
              boxSizing: 'border-box'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #059669',
                paddingBottom: 20,
                marginBottom: 24
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 18, color: '#064E3B', fontWeight: 800 }}>
                  ОБЛАСТНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА
                </h2>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
                  Пульмонологическое отделение
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: '#64748B' }}>
                <div>Медкарта: {patientData?.medcardNum || '—'}</div>
                <div>Дата: {activePrintDoc.date}</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <div
                style={{
                  fontSize: 12,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 6
                }}
              >
                {activePrintDoc.type}
              </div>
              <h3 style={{ margin: 0, fontSize: 18, color: '#0F172A', fontWeight: 700 }}>
                {activePrintDoc.name}
              </h3>
            </div>
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: 14,
                marginBottom: 26,
                fontSize: 13
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <strong>Пациент:</strong> {patientFullName}
                </div>
                <div>
                  <strong>Дата рождения:</strong>{' '}
                  {patientData?.dateOfBirth
                    ? new Date(patientData.dateOfBirth).toLocaleDateString('ru-RU')
                    : '15.03.1985'}
                </div>
                <div>
                  <strong>Пол:</strong> {patientData?.gender || 'Мужской'}
                </div>
                <div>
                  <strong>Врач:</strong> {activePrintDoc.doctor}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: '#1E293B',
                lineHeight: 1.7,
                textAlign: 'justify',
                whiteSpace: 'pre-wrap',
                marginBottom: 50
              }}
            >
              {activePrintDoc.content}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#475569'
              }}
            >
              <div>
                <div>Лечащий врач: ____________________</div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>
                  {activePrintDoc.doctor}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    border: '2px dashed #059669',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    fontWeight: 800,
                    fontSize: 10,
                    transform: 'rotate(-5deg)',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: 4
                  }}
                >
                  М.П. ГУ БЦГБ
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default PatientCabinetPage
