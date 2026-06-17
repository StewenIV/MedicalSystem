import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
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
import { fetchPatientCard, PatientCardDto } from 'api/patientsApi'

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

interface DocItem {
  id: string
  name: string
  date: string
  type: 'выписка' | 'справка' | 'заключение' | 'направление'
  content?: string
  doctor?: string
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

  const [loading, setLoading] = useState(false)
  const [patientData, setPatientData] = useState<Partial<PatientCardDto> | null>(null)

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [trustedName, setTrustedName] = useState('')
  const [trustedPhone, setTrustedPhone] = useState('')
  const [trustedRelation, setTrustedRelation] = useState('')
  const [profilePic, setProfilePic] = useState<string | null>(null)

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
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

  const fallbackPatient: Partial<PatientCardDto> = {
    id: 'P001',
    lastName: 'Иванов',
    firstName: 'Петр',
    middleName: 'Сергеевич',
    dateOfBirth: '1985-03-15',
    gender: 'Мужской',
    medcardNum: 'МК-10293',
    historyNum: 'ИБ-2026-45',
    statusText: 'Активное наблюдение',
    doctorName: 'Смирнов А.А.',
    departmentName: 'Пульмонологическое отделение',
    contacts: {
      phoneMobile: '+7 (999) 123-45-67',
      email: 'i.petrov@example.com',
      address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
      city: 'Москва',
      country: 'Россия'
    },
    relatives: [
      { id: 'R1', name: 'Петрова Мария Ивановна', relation: 'Супруга', phone: '+7 (999) 765-43-21' }
    ]
  }

  const [examsList] = useState<ExamItem[]>([
    {
      id: 'EX01',
      name: 'Общий анализ крови (ОАК)',
      date: '12.05.2026',
      resultDate: '13.05.2026',
      type: 'lab',
      status: 'ready',
      doctor: 'Смирнов А.А.',
      details:
        'Лейкоциты в норме, незначительное повышение СОЭ до 18 мм/ч (норма до 15). Остальные показатели в пределах референсных значений. Картина характерна для разрешающегося воспалительного процесса.',
      parameters: [
        { name: 'Эритроциты (RBC)', value: '4.8 × 10¹²', norm: '4.0 – 5.1 × 10¹²', unit: '/л' },
        { name: 'Гемоглобин (HGB)', value: '145', norm: '130 – 160', unit: 'г/л' },
        { name: 'Лейкоциты (WBC)', value: '6.4 × 10⁹', norm: '4.0 – 9.0 × 10⁹', unit: '/л' },
        { name: 'Тромбоциты (PLT)', value: '250 × 10⁹', norm: '180 – 320 × 10⁹', unit: '/л' },
        { name: 'СОЭ (ESR)', value: '18', norm: '2 – 15', unit: 'мм/ч' }
      ]
    },
    {
      id: 'EX02',
      name: 'Биохимический анализ крови',
      date: '12.05.2026',
      resultDate: '13.05.2026',
      type: 'lab',
      status: 'ready',
      doctor: 'Смирнов А.А.',
      details:
        'Показатели печёночных ферментов (АЛТ, АСТ) и билирубина в пределах нормы. Функция почек не нарушена. Уровень глюкозы нормальный.',
      parameters: [
        { name: 'АЛТ', value: '24', norm: 'до 41', unit: 'Ед/л' },
        { name: 'АСТ', value: '28', norm: 'до 37', unit: 'Ед/л' },
        { name: 'Билирубин общий', value: '14.2', norm: '3.4 – 20.5', unit: 'мкмоль/л' },
        { name: 'Креатинин', value: '88', norm: '62 – 106', unit: 'мкмоль/л' },
        { name: 'Глюкоза', value: '5.2', norm: '4.1 – 5.9', unit: 'ммоль/л' }
      ]
    },
    {
      id: 'EX03',
      name: 'КТ органов грудной клетки',
      date: '10.05.2026',
      resultDate: '11.05.2026',
      type: 'imaging',
      status: 'ready',
      doctor: 'Орлова Е.В.',
      details:
        'Лёгкие расправлены. Справа в нижней доле — участки инфильтрации малой интенсивности с нечёткими контурами, характерные для разрешающейся пневмонии. Плевральные полости свободны. Средостение не смещено. Заключение: картина разрешающейся правосторонней пневмонии.'
    },
    {
      id: 'EX04',
      name: 'Спирометрия (ФВД)',
      date: '08.05.2026',
      resultDate: '08.05.2026',
      type: 'functional',
      status: 'ready',
      doctor: 'Смирнов А.А.',
      details:
        'Проходимость дыхательных путей умеренно снижена. Проба с бронхолитиком (сальбутамол 400 мкг) положительная — прирост ОФВ1 составил 14% (260 мл). Рекомендован контроль через 2 недели.',
      parameters: [
        { name: 'ЖЕЛ (VC)', value: '86%', norm: '>80%', unit: '' },
        { name: 'ФЖЕЛ (FVC)', value: '82%', norm: '>80%', unit: '' },
        { name: 'ОФВ1 (FEV1)', value: '74%', norm: '>80%', unit: '' },
        { name: 'Индекс Тиффно', value: '72%', norm: '>70%', unit: '' }
      ]
    },
    {
      id: 'EX05',
      name: 'Рентгенография лёгких (2 проекции)',
      date: '02.05.2026',
      resultDate: '02.05.2026',
      type: 'imaging',
      status: 'ready',
      doctor: 'Орлова Е.В.',
      details:
        'Справа в нижней доле — инфильтративное затенение средней интенсивности. Корни структурны, не расширены. Купола диафрагмы чёткие. Синусы свободны. Заключение: правосторонняя нижнедолевая пневмония.'
    },
    {
      id: 'EX06',
      name: 'Бакпосев мокроты на флору',
      date: '15.05.2026',
      resultDate: '—',
      type: 'lab',
      status: 'processing',
      doctor: 'Козлова Н.И.',
      details: 'Исследование находится в работе лаборатории. Ожидаемая дата готовности: 18.05.2026.'
    }
  ])

  const [docsList] = useState<DocItem[]>([
    {
      id: 'D01',
      name: 'Выписной эпикриз',
      date: '15.05.2026',
      type: 'выписка',
      doctor: 'Смирнов А.А.',
      content:
        'Пациент находился на стационарном лечении в пульмонологическом отделении с 01.05.2026 по 15.05.2026 с диагнозом: Внебольничная правосторонняя нижнедолевая пневмония средней степени тяжести.\n\nПроведено лечение: антибиотикотерапия (амоксициллин/клавуланат), ингаляции с бронхолитиками, дыхательная гимнастика по Бутейко.\n\nСостояние при выписке удовлетворительное. Температура нормальная, одышка купирована. Даны рекомендации по амбулаторному долечиванию.'
    },
    {
      id: 'D02',
      name: 'Направление к аллергологу',
      date: '16.05.2026',
      type: 'направление',
      doctor: 'Смирнов А.А.',
      content:
        'Направляется в городской аллергологический центр для консультации аллерголога-иммунолога и проведения кожных скарификационных проб.\n\nДиагноз направившего: Бронхиальная астма (под вопросом), сопутствующий аллергический ринит.'
    },
    {
      id: 'D03',
      name: 'Заключение пульмонолога по КТ',
      date: '11.05.2026',
      type: 'заключение',
      doctor: 'Смирнов А.А.',
      content:
        'На основании данных КТ органов грудной клетки от 10.05.2026 выявлены признаки разрешающейся правосторонней пневмонии.\n\nРекомендовано: продолжить поддерживающую терапию, провести повторную спирометрию через 2 недели, контрольная рентгенография через 1 месяц.'
    },
    {
      id: 'D04',
      name: 'Справка о временной нетрудоспособности',
      date: '15.05.2026',
      type: 'справка',
      doctor: 'Смирнов А.А.',
      content:
        'Настоящим удостоверяется, что пациент Иванов Петр Сергеевич находился на стационарном лечении в ГУ БЦГБ с 01.05.2026 по 15.05.2026.\n\nОсвобождение от физических нагрузок и профессиональной деятельности на указанный период.'
    }
  ])

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'N01',
      type: 'medical',
      severity: 'warning',
      title: 'Результаты спирометрии готовы',
      text: 'Результаты исследования функции внешнего дыхания от 08.05.2026 загружены и доступны во вкладке «Обследования».',
      details:
        'Обнаружено умеренное снижение показателей ФЖЕЛ до 74% от нормы. Рекомендуется повторить исследование через 14 дней.',
      time: '08.05.2026, 14:30',
      read: false
    },
    {
      id: 'N02',
      type: 'medical',
      severity: 'info',
      title: 'Новый документ: выписной эпикриз',
      text: 'Вам подготовлен выписной эпикриз от 15.05.2026. Скачайте его в разделе «Документы».',
      details:
        'В эпикризе содержатся рекомендации по дальнейшей схеме терапии, дыхательным упражнениям и ограничениям на физические нагрузки.',
      time: '15.05.2026, 10:15',
      read: false
    },
    {
      id: 'N03',
      type: 'consultation',
      severity: 'info',
      title: 'Назначена консультация врача',
      text: 'Онлайн-консультация лечащего врача Смирнова А.А. запланирована на 22.05.2026 в 11:00.',
      details:
        'Ссылка на подключение к телемедицинской платформе будет доступна за 10 минут до начала приёма.',
      time: '16.05.2026, 09:00',
      read: false
    },
    {
      id: 'N04',
      type: 'system',
      severity: 'critical',
      title: 'Статус лечения изменён',
      text: 'Статус изменён на: «Выписан с улучшением». Продолжение реабилитации амбулаторно.',
      details:
        'Внимание: пациент переведён на амбулаторный этап реабилитации. Необходимо строго соблюдать рекомендации лечащего врача и контролировать уровень сатурации кислорода.',
      time: '15.05.2026, 11:00',
      read: true
    },
    {
      id: 'N05',
      type: 'system',
      severity: 'info',
      title: 'Обновление системы завершено',
      text: 'Плановое обновление личного кабинета пациента успешно завершено.',
      time: '10.05.2026, 08:00',
      read: true
    }
  ])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (userId) {
          const data = await fetchPatientCard(userId)
          setPatientData(data)
          setPhone(data.contacts?.phoneMobile || '')
          setEmail(data.contacts?.email || '')
          setAddress(data.contacts?.address || '')
          if (data.relatives?.[0]) {
            setTrustedName(data.relatives[0].name || '')
            setTrustedPhone(data.relatives[0].phone || '')
            setTrustedRelation(data.relatives[0].relation || '')
          }
        } else {
          setPatientData(fallbackPatient)
          setPhone(fallbackPatient.contacts?.phoneMobile || '')
          setEmail(fallbackPatient.contacts?.email || '')
          setAddress(fallbackPatient.contacts?.address || '')
          if (fallbackPatient.relatives?.[0]) {
            setTrustedName(fallbackPatient.relatives[0].name || '')
            setTrustedPhone(fallbackPatient.relatives[0].phone || '')
            setTrustedRelation(fallbackPatient.relatives[0].relation || '')
          }
        }
      } catch {
        setPatientData(fallbackPatient)
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

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Профиль успешно обновлён')
    setPatientData((prev) => ({
      ...prev,
      contacts: { ...prev?.contacts, phoneMobile: phone, email, address },
      relatives: [{ id: 'R1', name: trustedName, phone: trustedPhone, relation: trustedRelation }]
    }))
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Заполните все поля')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }
    toast.success('Пароль успешно изменён')
    setIsPasswordModalOpen(false)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePic(reader.result as string)
      toast.success('Фото обновлено')
    }
    reader.readAsDataURL(file)
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success('Все уведомления прочитаны')
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

      {/* ── EXAMS ─────────────────────────────────────────── */}
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
                        <ActionButton onClick={() => downloadDocPdf(doc)} disabled={pdfGenerating}>
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
                      <span>{n.time}</span>
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
                  Персональные данные
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>ФИО</FieldLabel>
                    <FieldValueReadOnly>{patientFullName}</FieldValueReadOnly>
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Дата рождения</FieldLabel>
                    <FieldValueReadOnly>
                      {patientData?.dateOfBirth
                        ? new Date(patientData.dateOfBirth).toLocaleDateString('ru-RU')
                        : '15.03.1985'}
                    </FieldValueReadOnly>
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Пол</FieldLabel>
                    <FieldValueReadOnly>{patientData?.gender || 'Мужской'}</FieldValueReadOnly>
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>№ медицинской карты</FieldLabel>
                    <FieldValueReadOnly>{patientData?.medcardNum || 'МК-10293'}</FieldValueReadOnly>
                  </FieldWrapper>
                </FieldsGrid>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionSubTitle>
                  <MapPin size={13} />
                  Контакты
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>Мобильный телефон</FieldLabel>
                    <InputField
                      placeholder="+7 (999) 000-00-00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Электронная почта</FieldLabel>
                    <InputField
                      type="email"
                      placeholder="example@mail.ru"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper style={{ gridColumn: 'span 2' }}>
                    <FieldLabel>Адрес проживания</FieldLabel>
                    <InputField
                      placeholder="Индекс, город, улица, дом, квартира"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </FieldWrapper>
                </FieldsGrid>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionSubTitle>
                  <UserCheck size={13} />
                  Доверенное лицо
                </SectionSubTitle>
                <FieldsGrid>
                  <FieldWrapper>
                    <FieldLabel>ФИО</FieldLabel>
                    <InputField
                      placeholder="Полное имя"
                      value={trustedName}
                      onChange={(e) => setTrustedName(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Степень родства</FieldLabel>
                    <InputField
                      placeholder="Супруга, мать, сын…"
                      value={trustedRelation}
                      onChange={(e) => setTrustedRelation(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Телефон</FieldLabel>
                    <InputField
                      placeholder="+7 (999) 000-00-00"
                      value={trustedPhone}
                      onChange={(e) => setTrustedPhone(e.target.value)}
                    />
                  </FieldWrapper>
                </FieldsGrid>
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
              <div
                style={{
                  fontSize: '13.5px',
                  color: '#334155',
                  background: '#F8FAFC',
                  padding: '18px 20px',
                  borderRadius: 10,
                  border: '1px solid rgba(15,23,42,0.07)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {viewingDoc.content}
              </div>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={() => setViewingDoc(null)}>Закрыть</SecondaryButton>
              <SaveButton
                onClick={() => {
                  downloadDocPdf(viewingDoc)
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
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Новый пароль</FieldLabel>
                    <InputField
                      type="password"
                      placeholder="Придумайте надёжный пароль"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldLabel>Подтверждение пароля</FieldLabel>
                    <InputField
                      type="password"
                      placeholder="Повторите новый пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
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
