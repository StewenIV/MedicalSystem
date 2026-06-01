import { useState, useEffect, useRef } from 'react'

import {
  GlobalStyle,
  PageWrapper,
  Container,
  StyledCard,
  SectionCard,
  CardHeader,
  CardTitle,
  SectionCardHeader,
  HeaderRow,
  HeaderLeft,
  Title,
  CardSubtitle,
  CardContent,
  InfoGrid,
  InfoItem,
  StatCard,
  StatLabel,
  StatValue,
  StatDelta,
  ProgressBarWrap,
  ProgressPct,
  ProgressTrack,
  ProgressFill,
  SectionHeaderInner,
  SectionTitle,
  FloorTabs,
  FloorTab,
  FloorContent,
  FloorStatsBar,
  FloorStat,
  FloorStatInnerRow,
  FloorStatLabel,
  FloorStatValue,
  FloorStatSub,
  ManageBtn,
  AlertsSection,
  AlertsLabel,
  AlertsRow,
  AlertPill,
  AlertNum,
  TwoCol,
  WardGrid,
  WardCard,
  WardCardTop,
  WardName,
  WardMeta,
  StatusBadge,
  BedsRow,
  BedChip,
  DetailPanel,
  DetailHeader,
  DetailTitle,
  DetailId,
  PatientBlock,
  PatientRow,
  PatientAvatar,
  PatientName,
  PatientMeta,
  UrgentBanner,
  AttentionBanner,
  DoctorNoteBlock,
  RowsDoctorBlock,
  DoctorNoteLabel,
  DoctorNoteText,
  SectionDivider,
  RxItem,
  RxLeft,
  RxDot,
  RxName,
  RxDose,
  RxTime,
  MedsGrid,
  MedCard,
  MedName,
  MedQty,
  LogEntry,
  LogWho,
  LogAction,
  LogMeta,
  Overlay,
  Modal,
  ModalHeader,
  ModalClose,
  ModalSection,
  ModalSectionTitle,
  RxList,
  ModalRxItem,
  ModalRxName,
  ModalRxDose,
  ModalRxTime,
  ModalMedsGrid,
  ModalMedCard,
  ModalMedName,
  ModalMedQty,
  ModalLogEntry
} from './styled'

import { Icon } from 'pages/img/imageBedsPage'
import { toast } from 'react-toastify'
import {
  fetchBeds,
  fetchRooms,
  fetchRoomsConfig,
  fetchFloors,
  fetchAlerts,
  fetchPatientDetails,
  togglePrescription,
  type BedDto,
  type RoomsConfigDto,
  type PatientDetailDto,
  type BedStatsDto,
} from 'api/bedsApi'

function useCounter(target: number, duration = 1000) {
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null) //id тек аним

  const animate = (start: number, end: number, dur: number) => {
    if (raf.current) cancelAnimationFrame(raf.current)
    let startTs: number | null = null

    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / dur, 1)
      setValue(Math.floor(progress * (end - start) + start))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    animate(0, target, duration)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [target])

  return { value, replay: () => animate(0, target, Math.round(duration * 0.8)) }
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

function AnimatedStatCard({
  icon,
  label,
  targetValue,
  color,
  delta,
  deltaPositive
}: {
  icon: React.ReactNode
  label: string
  targetValue: number
  color?: string
  delta?: string
  deltaPositive?: boolean
}) {
  const { value, replay } = useCounter(targetValue, 1000)

  return (
    <StatCard onMouseEnter={replay}>
      <div style={{ color: color || '#2563eb' }}>{icon}</div>
      <StatLabel>{label}</StatLabel>
      <StatValue $color={color} $delta={delta}>
        {value}
      </StatValue>
      {delta && <StatDelta $positive={deltaPositive}>{delta}</StatDelta>}
    </StatCard>
  )
}

function AnimatedAccentCard({ targetPct }: { targetPct: number }) {
  const { value, replay } = useCounter(targetPct, 1000)

  return (
    <StatCard $accent onMouseEnter={replay}>
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
      <StatLabel $light>Загрузка фонда</StatLabel>
      <ProgressBarWrap>
        <ProgressPct>{value}%</ProgressPct>
        <ProgressTrack>
          <ProgressFill $pct={value} />
        </ProgressTrack>
      </ProgressBarWrap>
    </StatCard>
  )
}

function pluralize(count: number, forms: [string, string, string]) {
  const rule = new Intl.PluralRules('ru-RU').select(count)

  switch (rule) {
    case 'one':
      return forms[0]
    case 'few':
      return forms[1]
    default:
      return forms[2]
  }
}

function AnimatedFloorStat({
  target,
  color,
  large,
  trigger
}: {
  target: number
  color?: string
  large?: boolean
  trigger: number
}) {
  const { value, replay } = useCounter(target, 900)

  useEffect(() => {
    replay()
  },[trigger])

  return (
    <FloorStatValue
      $color={color}
      $large={large}
      style={{ cursor: 'default' }}
    >
      {value}
    </FloorStatValue>
  )
}

function PatientDetailPanel({ bed }: { bed: BedDto | null }) {
  const [completedPrescriptions, setCompletedPrescriptions] = useState<Set<string>>(new Set())
  const [details, setDetails] = useState<PatientDetailDto | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Загрузка деталей пациента при смене койки
  useEffect(() => {
    setDetails(null)
    setCompletedPrescriptions(new Set())
    if (!bed?.patientId) return
    setDetailsLoading(true)
    fetchPatientDetails(bed.patientId)
      .then((data) => {
        setDetails(data)
        const doneIds = new Set<string>(
          data.prescriptions.filter((rx) => rx.done).map((rx) => String(rx.id))
        )
        setCompletedPrescriptions(doneIds)
      })
      .catch((err) => {
        setDetails(null)
        toast.error(err.message || 'Ошибка загрузки данных пациента')
      })
      .finally(() => setDetailsLoading(false))
  }, [bed?.patientId])

  if (!bed) {
    return (
      <DetailPanel>
        <DetailHeader>
          <DetailTitle>Детали объекта</DetailTitle>
          <DetailId>—</DetailId>
        </DetailHeader>
        <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          Выберите койку для просмотра
        </div>
      </DetailPanel>
    )
  }


  const handleRxToggle = (rxId: string | number) => {
    const idStr = String(rxId)
    const newDone = !completedPrescriptions.has(idStr)
    setCompletedPrescriptions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(idStr)) {
        newSet.delete(idStr)
      } else {
        newSet.add(idStr)
      }
      return newSet
    })
    // Отправка на сервер
    if (bed.patientId) {
      togglePrescription(bed.patientId, idStr, newDone)
        .then(() => {
          fetchPatientDetails(bed.patientId!).then(setDetails).catch(console.error)
        })
        .catch((err) => {
          toast.error(err.message || 'Ошибка при обновлении назначения')
          // Откат при ошибке
          setCompletedPrescriptions((prev) => {
            const newSet = new Set(prev)
            if (newDone) newSet.delete(idStr)
            else newSet.add(idStr)
            return newSet
          })
        })
    }
  }
  
  const initials = bed.patientName ? `${bed.patientName[0]}${bed.patientLastName?.[0] ?? ''}` : '—'

  return (
    <DetailPanel key={bed.id}>
      <DetailHeader>
        <DetailTitle>Палата {bed.roomNumber}</DetailTitle>
        <DetailId>Койка {bed.bedNumber}</DetailId>
      </DetailHeader>

      {bed.status === 'free' ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🛏</div>
          Койка свободна
        </div>
      ) : (
        <>
          <PatientBlock>
            <PatientRow>
              <PatientAvatar>{initials}</PatientAvatar>
              <div>
                <PatientName>
                  {bed.patientLastName} {bed.patientName} {bed.patientMiddleName}
                </PatientName>
                <PatientMeta>
                  {bed.patientAge} лет
                  {bed.admissionDate && ` · Поступил(а): ${new Date(bed.admissionDate).toLocaleDateString('ru-RU')}`}
                </PatientMeta>
                {bed.doctorName && (
                  <PatientMeta style={{ marginTop: 2 }}>
                    Лечащий врач: {bed.doctorName}
                  </PatientMeta>
                )}
              </div>
            </PatientRow>

            {bed.status === 'urgent' && (
              <UrgentBanner>
                <Icon.Alert size={15} color="#dc2626" />
                КРИТИЧЕСКОЕ СОСТОЯНИЕ
              </UrgentBanner>
            )}

            {bed.status === 'attention' && (
              <AttentionBanner>
                <Icon.Alert size={15} color="#d97706" />
                ТРЕБУЕТ ВНИМАНИЯ
              </AttentionBanner>
            )}

            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              {bed.diagnosis}
            </div>

            {detailsLoading && <LoadingSpinner />}

            {!detailsLoading && details && (
              <DoctorNoteBlock>
                <RowsDoctorBlock>
                  <Icon.ClipBoard size={14} style={{ marginRight: 4, color: '#2563eb' }} />
                  <DoctorNoteLabel> Указание врача медсестре</DoctorNoteLabel>
                </RowsDoctorBlock>
                <DoctorNoteText>{details.doctorNote}</DoctorNoteText>
              </DoctorNoteBlock>
            )}
          </PatientBlock>

          {!detailsLoading && details && (
            <>
              <SectionDivider>
                <Icon.Pill /> Назначения
              </SectionDivider>

              {details.prescriptions.map((rx) => (
                <RxItem
                  key={rx.id}
                  $done={completedPrescriptions.has(String(rx.id))}
                  onClick={() => handleRxToggle(rx.id)}
                >
                  <RxLeft>
                    <RxDot $done={completedPrescriptions.has(String(rx.id))}>
                      {completedPrescriptions.has(String(rx.id)) && <Icon.Check size={8} />}
                    </RxDot>
                    <div>
                      <RxName $done={completedPrescriptions.has(String(rx.id))}>{rx.name}</RxName>
                      <RxDose>{rx.dose}</RxDose>
                    </div>
                  </RxLeft>
                  <RxTime>{rx.time}</RxTime>
                </RxItem>
              ))}

              <SectionDivider>
                <Icon.FillBox /> Медикаменты
              </SectionDivider>

              <MedsGrid>
                {details.meds.map((m, i) => (
                    <MedCard key={i}>
                      <MedName>{m.name}</MedName>
                      <MedQty>{m.qty}</MedQty>
                    </MedCard>
                  ))}
              </MedsGrid>

              <SectionDivider>
                <Icon.Log /> Журнал
              </SectionDivider>

              <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8 }}>
                {details.log.map((entry, i) => (
                  <LogEntry key={i}>
                    <LogWho>{entry.who}</LogWho>
                    <LogAction>{entry.action}</LogAction>
                    <LogMeta>
                      <span>🕐{entry.time}</span>
                      {entry.amount && <span>Списано: {entry.amount}</span>}
                    </LogMeta>
                  </LogEntry>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </DetailPanel>
  )
}

function PatientModal({ bed, onClose }: { bed: BedDto | null; onClose: () => void }) {
  const [completedPrescriptions, setCompletedPrescriptions] = useState<Set<string>>(new Set())
  const [details, setDetails] = useState<PatientDetailDto | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Загрузка деталей пациента при открытии модала
  useEffect(() => {
    setDetails(null)
    setCompletedPrescriptions(new Set())
    if (!bed?.patientId) return
    setDetailsLoading(true)
    fetchPatientDetails(bed.patientId)
      .then((data) => {
        setDetails(data)
        const doneIds = new Set<string>(
          data.prescriptions.filter((rx) => rx.done).map((rx) => String(rx.id))
        )
        setCompletedPrescriptions(doneIds)
      })
      .catch((err) => {
        setDetails(null)
        toast.error(err.message || 'Ошибка загрузки данных пациента')
      })
      .finally(() => setDetailsLoading(false))
  }, [bed?.patientId])

  if (!bed) return null

  const handleRxToggle = (rxId: string | number) => {
    const idStr = String(rxId)
    const newDone = !completedPrescriptions.has(idStr)
    setCompletedPrescriptions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(idStr)) {
        newSet.delete(idStr)
      } else {
        newSet.add(idStr)
      }
      return newSet
    })
    if (bed.patientId) {
      togglePrescription(bed.patientId, idStr, newDone)
        .then(() => {
          // Refetch patient details to update medicine balances dynamically
          fetchPatientDetails(bed.patientId!).then(setDetails).catch(console.error)
        })
        .catch((err) => {
          toast.error(err.message || 'Ошибка при обновлении назначения')
          setCompletedPrescriptions((prev) => {
            const newSet = new Set(prev)
            if (newDone) newSet.delete(idStr)
            else newSet.add(idStr)
            return newSet
          })
        })
    }
  }
  const initials = bed.patientName ? `${bed.patientName[0]}${bed.patientLastName?.[0] ?? ''}` : '—'

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <ModalHeader>
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
                {bed.patientLastName} {bed.patientName} {bed.patientMiddleName}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                {bed.patientAge} лет · Палата {bed.roomNumber}, Койка {bed.bedNumber}
                {bed.admissionDate && ` · Поступил(а): ${new Date(bed.admissionDate).toLocaleDateString('ru-RU')}`}
              </div>
              {bed.doctorName && (
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                  Лечащий врач: {bed.doctorName}
                </div>
              )}
            </div>
          </div>
          <ModalClose onClick={onClose}>
            <Icon.Close />
          </ModalClose>
        </ModalHeader>

        <ModalSection>
          {bed.status === 'urgent' && (
            <UrgentBanner style={{ marginBottom: 10 }}>
              <Icon.Alert size={16} color="#dc2626" />
              КРИТИЧЕСКОЕ СОСТОЯНИЕ — СРОЧНОЕ ВМЕШАТЕЛЬСТВО
            </UrgentBanner>
          )}
          {bed.status === 'attention' && (
            <AttentionBanner style={{ marginBottom: 10 }}>
              <Icon.Alert size={16} color="#d97706" />
              ТРЕБУЕТ ВНИМАНИЯ МЕДИЦИНСКОГО ПЕРСОНАЛА
            </AttentionBanner>
          )}
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
            {bed.diagnosis}
          </div>
          {detailsLoading && <LoadingSpinner />}
          {!detailsLoading && details && (
            <DoctorNoteBlock>
              <DoctorNoteLabel>⚕ Указание врача медсестре</DoctorNoteLabel>
              <DoctorNoteText style={{ fontSize: 13 }}>{details.doctorNote}</DoctorNoteText>
            </DoctorNoteBlock>
          )}
        </ModalSection>

        {!detailsLoading && details && (
          <>
            <ModalSection>
              <ModalSectionTitle>
                <Icon.Pill /> Лист назначений
              </ModalSectionTitle>
              <RxList>
                {details.prescriptions.map((rx) => (
                  <ModalRxItem
                    key={rx.id}
                    $done={completedPrescriptions.has(String(rx.id))}
                    onClick={() => handleRxToggle(rx.id)}
                  >
                    <RxDot
                      $done={completedPrescriptions.has(String(rx.id))}
                      style={{ width: 18, height: 18 }}
                    >
                      {completedPrescriptions.has(String(rx.id)) && <Icon.Check />}
                    </RxDot>
                    <ModalRxName $done={completedPrescriptions.has(String(rx.id))}>
                      {rx.name}
                    </ModalRxName>
                    <ModalRxDose>{rx.dose}</ModalRxDose>
                    <ModalRxTime>{rx.time}</ModalRxTime>
                  </ModalRxItem>
                ))}
              </RxList>
            </ModalSection>

            <ModalSection>
              <ModalSectionTitle>
                <Icon.FillBox /> Остатки медикаментов
              </ModalSectionTitle>
              <ModalMedsGrid>
                {details.meds.map((m, i) => (
                    <ModalMedCard key={i}>
                      <ModalMedName>{m.name}</ModalMedName>
                      <ModalMedQty>{m.qty}</ModalMedQty>
                    </ModalMedCard>
                  ))}
              </ModalMedsGrid>
            </ModalSection>

            <ModalSection style={{ borderBottom: 'none' }}>
              <ModalSectionTitle>
                <Icon.Log /> Журнал выполнения
              </ModalSectionTitle>
              <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8 }}>
                {details.log.map((entry, i) => (
                <ModalLogEntry key={i}>
                  <LogWho style={{ fontSize: 13 }}>{entry.who}</LogWho>
                  <LogAction style={{ fontSize: 12 }}>{entry.action}</LogAction>
                  <LogMeta>
                    <span>🕐 {entry.time}</span>
                    {entry.amount && <span>Списано: {entry.amount}</span>}
                  </LogMeta>
                </ModalLogEntry>
              ))}
              </div>
            </ModalSection>
          </>
        )}
      </Modal>
    </Overlay>
  )
}

interface HospitalWorkplaceProps {
  onNavigate?: (screen: string) => void
  onLogout?: () => void
  userRole?:
    | 'admin'
    | 'chief-doctor'
    | 'doctor'
    | 'head-nurse'
    | 'nurse'
    | 'patient'
    | 'laboratory'
    | null
}

export function HospitalWorkplace({ onNavigate, onLogout, userRole }: HospitalWorkplaceProps) {
const [triggers, setTriggers] = useState({
  total: 0,
  free: 0,
  male: 0,
  female: 0
})
  const [activeFloor, setActiveFloor] = useState<number | null>(null)
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null)
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const [modalBedId, setModalBedId] = useState<string | null>(null)

  // ── Данные с сервера ──────────────────────────────────────────────────────
  const [allBeds, setAllBeds] = useState<BedDto[]>([])
  const [floors, setFloors] = useState<number[]>([])
  const [roomsConfig, setRoomsConfig] = useState<RoomsConfigDto>({})
  const [urgentBeds, setUrgentBeds] = useState<BedDto[]>([])
  const [attentionBeds, setAttentionBeds] = useState<BedDto[]>([])
  const [stats, setStats] = useState<BedStatsDto | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  // ── Начальная загрузка ─────────────────────────────────────────────────────
  useEffect(() => {
    setPageLoading(true)
    Promise.all([
      fetchBeds(),
      fetchFloors(),
      fetchRoomsConfig(),
      fetchAlerts(),
    ])
      .then(([bedsResp, floorsResp, configResp, alertsResp]) => {
        setAllBeds(bedsResp.beds)
        setStats(bedsResp.stats)
        setFloors(floorsResp.floors)
        setRoomsConfig(configResp)
        setUrgentBeds(alertsResp.urgent)
        setAttentionBeds(alertsResp.attention)
      })
      .catch((err) => toast.error(err.message || 'Ошибка загрузки данных'))
      .finally(() => setPageLoading(false))
  }, [])

  const totalBeds = allBeds.length
  const occupiedBeds = allBeds.filter((b) => b.status !== 'free').length
  const freeBeds = allBeds.filter((b) => b.status === 'free').length
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

  const filteredBeds = activeFloor
    ? allBeds.filter((b) => parseInt(b.roomNumber.charAt(0)) === activeFloor)
    : allBeds

  const rooms = Object.values(
    allBeds.reduce(
      (acc, bed) => {
        if (!acc[bed.roomNumber]) {
          acc[bed.roomNumber] = {
            id: bed.roomNumber,
            name: `Палата ${bed.roomNumber}`,
            beds: [] as BedDto[]
          }
        }
        acc[bed.roomNumber].beds.push(bed)
        return acc
      },
      {} as Record<string, { id: string; name: string; beds: BedDto[] }>
    )
  ).filter((room) => !activeFloor || parseInt(room.id.charAt(0)) === activeFloor)

  const totalOnFloor = filteredBeds.length
  const freeOnFloor = filteredBeds.filter((b) => b.status === 'free').length
  const freeMale = filteredBeds.filter(
    (b) => b.status === 'free' && roomsConfig[b.roomNumber]?.gender === 'male'
  ).length
  const femaleFree = filteredBeds.filter(
    (b) => b.status === 'free' && roomsConfig[b.roomNumber]?.gender === 'female'
  ).length

  const selectedBed = allBeds.find((b) => b.id === selectedBedId) ?? null
  const modalBed = allBeds.find((b) => b.id === modalBedId) ?? null

  const getRoomUrgency = (room: { beds: BedDto[] }): 'urgent' | 'attention' | 'normal' => {
    if (room.beds.some((b) => b.status === 'urgent')) return 'urgent'
    if (room.beds.some((b) => b.status === 'attention')) return 'attention'
    return 'normal'
  }

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Container>
          <StyledCard>
            <CardHeader>
              <HeaderRow>
                <HeaderLeft>
                  <Icon.Hospital />
                  <Title>Палатный фонд</Title>
                </HeaderLeft>
                <CardSubtitle>Управление палатами и мониторинг пациентов</CardSubtitle>
              </HeaderRow>
            </CardHeader>

            <CardContent>
              {pageLoading ? (
                <LoadingSpinner />
              ) : (
                <InfoGrid>
                  <InfoItem>
                    <AnimatedStatCard
                      icon={<Icon.Bed />}
                      label="Всего коек"
                      targetValue={totalBeds}
                      color="#2563eb"
                    />
                  </InfoItem>
                  <InfoItem>
                    <AnimatedStatCard
                      icon={<Icon.BedDouble />}
                      label="Занято"
                      targetValue={occupiedBeds}
                      color="#eb2525"
                      delta={stats?.occupancyDelta ? `${stats.occupancyDelta > 0 ? '+' : ''}${stats.occupancyDelta} за сегодня` : '0 за сегодня'}
                      deltaPositive={stats ? stats.occupancyDelta >= 0 : true}
                    />
                  </InfoItem>
                  <InfoItem>
                    <AnimatedStatCard
                      icon={<Icon.BedSingle />}
                      label="Свободно"
                      targetValue={freeBeds}
                      color="#16a34a"
                      delta={stats?.freeDeltaPct ? `${stats.freeDeltaPct > 0 ? '+' : ''}${stats.freeDeltaPct}% от вчера` : '0% от вчера'}
                      deltaPositive={stats ? stats.freeDeltaPct >= 0 : true}
                    />
                  </InfoItem>
                  <InfoItem>
                    <AnimatedAccentCard targetPct={occupancyPct} />
                  </InfoItem>
                </InfoGrid>
              )}
            </CardContent>
          </StyledCard>
        </Container>

        <SectionCard>
          <SectionCardHeader>
            <SectionHeaderInner>
              <HeaderLeft>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M3 15h18M9 3v18" />
                </svg>
                <CardTitle>Управление палатами</CardTitle>
              </div>
              </HeaderLeft>
              <FloorTabs>
                <FloorTab $active={activeFloor === null} onClick={() => setActiveFloor(null)}>
                  Все
                </FloorTab>
                {floors.map((f) => (
                  <FloorTab key={f} $active={activeFloor === f} onClick={() => setActiveFloor(f)}>
                    {f} этаж
                  </FloorTab>
                ))}
              </FloorTabs>
            </SectionHeaderInner>
          </SectionCardHeader>

          <FloorContent>
            <FloorStatsBar>
              <FloorStat $firstblock = {true} onMouseEnter={() => setTriggers(prev => ({ ...prev, total: prev.total + 1 }))}>
                <FloorStatInnerRow>
                  <Icon.Users />
                  <AnimatedFloorStat target={totalOnFloor} large trigger={triggers.total} />
                  <FloorStatSub>
                    {pluralize(totalOnFloor, ['койка', 'койки', 'коек'])}
                  </FloorStatSub>
                </FloorStatInnerRow>
              </FloorStat>

              <FloorStat onMouseEnter={() => setTriggers(prev => ({ ...prev, free: prev.free + 1 }))}>
                <FloorStatLabel>Свободно</FloorStatLabel>
                <FloorStatInnerRow>
                  <AnimatedFloorStat target={freeOnFloor} color="#16a34a" trigger={triggers.free} />
                </FloorStatInnerRow>
                <FloorStatSub>из {totalOnFloor} {activeFloor ? 'на этаже' : 'в отделении'}</FloorStatSub>
              </FloorStat>

              <FloorStat onMouseEnter={() => setTriggers(prev => ({ ...prev, male: prev.male + 1 }))}>
                <FloorStatLabel>Муж. свободно</FloorStatLabel>
                <FloorStatInnerRow>
                  <AnimatedFloorStat target={freeMale} trigger={triggers.male} />
                </FloorStatInnerRow>
              </FloorStat>

              <FloorStat onMouseEnter={() => setTriggers(prev => ({ ...prev, female: prev.female + 1 }))}>
                <FloorStatLabel>Жен. свободно</FloorStatLabel>
                <FloorStatInnerRow>
                  <AnimatedFloorStat target={femaleFree} trigger={triggers.female} />
                </FloorStatInnerRow>
              </FloorStat>

              <ManageBtn>
                <Icon.Settings />
                Управление отделением
              </ManageBtn>
            </FloorStatsBar>

            {(urgentBeds.length > 0 || attentionBeds.length > 0) && (
              <AlertsSection>
                <AlertsLabel>
                  <Icon.Alert size={13} color="#dc2626" />
                  Проблемные участки
                </AlertsLabel>
                <AlertsRow>
                  {urgentBeds.map((b) => (
                    <AlertPill key={b.id} onClick={() => setModalBedId(b.id)}>
                      <AlertNum>{b.roomNumber}</AlertNum>
                      Критическое — {b.patientLastName} {b.patientName?.[0]}.
                    </AlertPill>
                  ))}
                  {attentionBeds.map((b) => (
                    <AlertPill key={b.id} $attention onClick={() => setModalBedId(b.id)}>
                      <AlertNum $attention>{b.roomNumber}</AlertNum>
                      Внимание — {b.patientLastName} {b.patientName?.[0]}.
                    </AlertPill>
                  ))}
                </AlertsRow>
              </AlertsSection>
            )}

            <TwoCol>
              <WardGrid>
                {rooms.map((room) => {
                  const urgency = getRoomUrgency(room)
                  const gender = roomsConfig[room.id]?.gender

                  return (
                    <WardCard
                      key={room.id}
                      $urgent={urgency === 'urgent'}
                      $attention={urgency === 'attention'}
                      $selected={selectedWard === room.id}
                      onClick={() => setSelectedWard(room.id)}
                    >
                      <WardCardTop>
                        <div>
                          <WardName>{room.name}</WardName>
                          <WardMeta>
                            {gender === 'male'
                              ? '♂ Мужская'
                              : gender === 'female'
                                ? '♀ Женская'
                                : 'Общая'}
                            {' · '}
                            {room.beds.filter((b) => b.status !== 'free').length}/{room.beds.length}{' '}
                            занято
                          </WardMeta>
                        </div>

                        {urgency !== 'normal' && (
                          <StatusBadge
                            $urgent={urgency === 'urgent'}
                            $attention={urgency === 'attention'}
                          >
                            <Icon.Alert size={10} />
                            {urgency === 'urgent' ? 'Критично' : 'Внимание'}
                          </StatusBadge>
                        )}
                      </WardCardTop>

                      <BedsRow>
                        {room.beds.sort((a, b) => a.bedNumber - b.bedNumber).map((bed) => (
                          <BedChip
                            key={bed.id}
                            $s={bed.status}
                            title={
                              bed.patientLastName
                                ? `${bed.patientLastName} ${bed.patientName}`
                                : 'Свободна'
                            }
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedBedId(bed.id)
                              setSelectedWard(room.id)
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              if (bed.status !== 'free') setModalBedId(bed.id)
                            }}
                          >
                            <Icon.BedIcon />
                            Палата {bed.bedNumber}
                          </BedChip>
                        ))}
                      </BedsRow>
                    </WardCard>
                  )
                })}
              </WardGrid>

              <PatientDetailPanel bed={selectedBed} />
            </TwoCol>

            <div style={{ fontSize: 11.5, color: '#9ca3af', textAlign: 'center', paddingTop: 4 }}>
              Клик по койке — детали в панели · Двойной клик — полная карта пациента
            </div>
          </FloorContent>
        </SectionCard>

        {/* Full patient modal */}
        {modalBed && <PatientModal bed={modalBed} onClose={() => setModalBedId(null)} />}
      </PageWrapper>
    </>
  )
}