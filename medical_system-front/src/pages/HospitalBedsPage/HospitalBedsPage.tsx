import { useState, useEffect, useCallback } from 'react'
import {
  BedDouble,
  BedSingle,
  Bed,
  Ellipsis,
  HospitalIcon,
  TriangleAlert,
  Settings,
  Users,
  CheckCircle2,
  Circle,
  ChevronDown,
  X,
  ArrowLeftRight,
  UserMinus,
  AlertCircle,
  Package,
  ClipboardList,
  BookOpen,
  Clock
} from 'lucide-react'

import { mockHospitalBeds, roomsConfig } from 'data/mockData'

import {
  PageWrapper,
  Container,
  StyledCard,
  CardHeader,
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
  ProgressTrack,
  ProgressFill,
  ProgressPct,
  Content,
  SectionHeader,
  SectionTitle,
  FilterRow,
  FilterChip,
  FloorSection,
  FloorHeader,
  FloorTitleBlock,
  FloorNumber,
  FloorTitleText,
  FloorStatsMini,
  FloorStatMini,
  FloorStatMiniLabel,
  FloorStatMiniValue,
  FloorBody,
  WardGrid,
  WardCard,
  WardCardTop,
  WardName,
  WardMeta,
  WardAlertIcon,
  BedsRow,
  BedChip,
  AlertsSection,
  AlertsLabel,
  AlertsRow,
  AlertPill,
  AlertNum,
  FloorStats,
  FloorStatItem,
  FloorStatLabel,
  FloorStatValue,
  FloorStatSub,
  ManageBtn,
  DrawerOverlay,
  Drawer,
  DrawerHeader,
  DrawerPatientRow,
  DrawerAvatar,
  DrawerPatientName,
  DrawerPatientSub,
  DrawerCloseBtn,
  StatusBanner,
  DrawerBody,
  DrawerSection,
  DrawerSectionTitle,
  DrawerSectionBody,
  AttentionBlock,
  AttentionHeader,
  AttentionText,
  RxRow,
  RxCheck,
  RxInfo,
  RxName,
  RxDrug,
  RxTimeTag,
  StockGrid,
  StockItem,
  StockName,
  StockQty,
  StockUnit,
  LogItem,
  LogDot,
  LogText,
  LogTime,
  DrawerFooter,
  DrawerBtn
} from './styled'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HospitalWorkplaceProps {
  onNavigate: (screen: string) => void
  onLogout: () => void
  userRole:
    | 'admin'
    | 'chief-doctor'
    | 'doctor'
    | 'head-nurse'
    | 'nurse'
    | 'patient'
    | 'laboratory'
    | null
}

// ─── Animated counter hook ────────────────────────────────────────────────────

function useAnimationProgress(targetPct: number) {
  const [displayPct, setDisplayPct] = useState(0)

  const animateValue = useCallback((start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setDisplayPct(Math.floor(progress * (end - start) + start))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    animateValue(0, targetPct, 1000)
  }, [targetPct, animateValue])
  const handleHover = () => animateValue(0, targetPct, 800)
  return { displayPct, handleHover }
}

// ─── Stat sub-components (each with animated counter) ─────────────────────────

const BedsProgressCard = ({ total }: { total: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(total)
  return (
    <StatCard onMouseEnter={handleHover}>
      <Bed size={20} color="#2563eb" />
      <StatLabel>Всего коек</StatLabel>
      <StatValue>{displayPct}</StatValue>
    </StatCard>
  )
}

const OccupiedCard = ({ count }: { count: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(count)
  return (
    <StatCard onMouseEnter={handleHover}>
      <BedDouble size={20} color="#eb2525" />
      <StatLabel>Занято</StatLabel>
      <StatValue $color="#eb2525">{displayPct}</StatValue>
      <StatDelta $positive>+2 за сегодня</StatDelta>
    </StatCard>
  )
}

const FreeCard = ({ count }: { count: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(count)
  return (
    <StatCard onMouseEnter={handleHover}>
      <BedSingle size={20} color="#188f18" />
      <StatLabel>Свободно</StatLabel>
      <StatValue $color="#16a34a">{displayPct}</StatValue>
      <StatDelta>−5% от вчера</StatDelta>
    </StatCard>
  )
}

const OccupancyCard = ({ pct }: { pct: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(pct)
  return (
    <StatCard $accent onMouseEnter={handleHover}>
      <Ellipsis size={20} color="#fff" />
      <StatLabel $light>Загрузка фонда</StatLabel>
      <ProgressBarWrap>
        <ProgressPct>{displayPct}%</ProgressPct>
        <ProgressTrack>
          <ProgressFill $pct={displayPct} />
        </ProgressTrack>
      </ProgressBarWrap>
    </StatCard>
  )
}

// ─── Floor counter — also animated ────────────────────────────────────────────

const AnimatedNum = ({ value, color }: { value: number; color?: string }) => {
  const { displayPct, handleHover } = useAnimationProgress(value)
  return (
    <FloorStatMiniValue $color={color} onMouseEnter={handleHover}>
      {displayPct}
    </FloorStatMiniValue>
  )
}

// ─── Rooms grouped by floor ───────────────────────────────────────────────────

const roomsByFloor = Object.values(
  mockHospitalBeds.reduce(
    (acc, bed) => {
      const floorNum = parseInt(bed.roomNumber.charAt(0))
      if (!acc[bed.roomNumber]) {
        acc[bed.roomNumber] = {
          id: bed.roomNumber,
          name: `Палата ${bed.roomNumber}`,
          floor: floorNum,
          gender: roomsConfig[bed.roomNumber]?.gender === 'male' ? 'Мужская' : 'Женская',
          beds: []
        }
      }
      acc[bed.roomNumber].beds.push(bed)
      return acc
    },
    {} as Record<
      string,
      { id: string; name: string; floor: number; gender: string; beds: typeof mockHospitalBeds }
    >
  )
)

const floors = Array.from(new Set(roomsByFloor.map((r) => r.floor))).sort((a, b) => a - b)

// ─── Bed status mapper ────────────────────────────────────────────────────────

function mapStatus(s: string): 'occupied' | 'empty' | 'alert' | 'urgent' {
  if (s === 'free') return 'empty'
  if (s === 'stable') return 'occupied'
  if (s === 'attention') return 'alert'
  if (s === 'urgent') return 'urgent'
  return 'empty'
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function getStatusLabel(status: string) {
  if (status === 'urgent') return '🔴 Срочно — требуется немедленное внимание'
  if (status === 'attention') return '⚠️ Требует внимания'
  if (status === 'stable') return '✅ Стабильное состояние'
  return '—'
}

function getDrawerStatus(status: string): 'stable' | 'attention' | 'urgent' | 'free' {
  if (status === 'urgent') return 'urgent'
  if (status === 'attention') return 'attention'
  if (status === 'stable') return 'stable'
  return 'free'
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HospitalWorkplace({ onNavigate, onLogout, userRole }: HospitalWorkplaceProps) {
  const [activeFloor, setActiveFloor] = useState<number | null>(null)
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set(floors))

  const totalBeds = mockHospitalBeds.length
  const occupiedBeds = mockHospitalBeds.filter((b) => b.status !== 'free').length
  const freeBeds = mockHospitalBeds.filter((b) => b.status === 'free').length
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

  const filteredRooms = activeFloor
    ? roomsByFloor.filter((r) => r.floor === activeFloor)
    : roomsByFloor

  const selectedBed = mockHospitalBeds.find((b) => b.id === selectedBedId)

  const handleBedClick = (bedId: string) => {
    setSelectedBedId(bedId)
    setDrawerOpen(true)
  }

  const toggleFloor = (f: number) => {
    setExpandedFloors((prev) => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  // Problem alerts — rooms where any bed is urgent/attention
  const urgentRooms = roomsByFloor.filter((r) => r.beds.some((b) => b.status === 'urgent'))
  const alertRooms = roomsByFloor.filter((r) => r.beds.some((b) => b.status === 'attention'))

  return (
    <PageWrapper>
      {/* ── Top stats card ── */}
      <Container style={{ padding: '24px' }}>
        <StyledCard>
          <CardHeader>
            <HeaderRow>
              <HeaderLeft>
                <HospitalIcon size={32} color="#2563eb" />
                <Title>Палатный фонд</Title>
              </HeaderLeft>
              <CardSubtitle>Управление палатами и пациентами</CardSubtitle>
            </HeaderRow>
          </CardHeader>

          <CardContent>
            <InfoGrid>
              <InfoItem>
                <BedsProgressCard total={totalBeds} />
              </InfoItem>
              <InfoItem>
                <OccupiedCard count={occupiedBeds} />
              </InfoItem>
              <InfoItem>
                <FreeCard count={freeBeds} />
              </InfoItem>
              <InfoItem>
                <OccupancyCard pct={occupancyPct} />
              </InfoItem>
            </InfoGrid>
          </CardContent>
        </StyledCard>
      </Container>

      {/* ── Bottom section ── */}
      <Content>
        {/* Section header + floor filter */}
        <SectionHeader>
          <SectionTitle>Управление палатами</SectionTitle>
          <FilterRow>
            <FilterChip $active={activeFloor === null} onClick={() => setActiveFloor(null)}>
              Все этажи
            </FilterChip>
            {floors.map((f) => (
              <FilterChip key={f} $active={activeFloor === f} onClick={() => setActiveFloor(f)}>
                {f} этаж
              </FilterChip>
            ))}
          </FilterRow>
        </SectionHeader>

        {/* Summary bar */}
        <FloorStats>
          <FloorStatItem>
            <FloorStatLabel>На этаже</FloorStatLabel>
            <FloorStatValue $large style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={20} style={{ color: '#9ca3af' }} />
              {filteredRooms.flatMap((r) => r.beds).length} палат
            </FloorStatValue>
          </FloorStatItem>
          <FloorStatItem>
            <FloorStatLabel>Свободно мест</FloorStatLabel>
            <FloorStatValue $color="#16a34a">
              {filteredRooms.flatMap((r) => r.beds).filter((b) => b.status === 'free').length}
            </FloorStatValue>
            <FloorStatSub>из {filteredRooms.flatMap((r) => r.beds).length}</FloorStatSub>
          </FloorStatItem>
          <FloorStatItem>
            <FloorStatLabel>Мужские свободно</FloorStatLabel>
            <FloorStatValue>
              {
                filteredRooms
                  .filter((r) => r.gender === 'Мужская')
                  .flatMap((r) => r.beds)
                  .filter((b) => b.status === 'free').length
              }
            </FloorStatValue>
          </FloorStatItem>
          <FloorStatItem>
            <FloorStatLabel>Женские свободно</FloorStatLabel>
            <FloorStatValue>
              {
                filteredRooms
                  .filter((r) => r.gender === 'Женская')
                  .flatMap((r) => r.beds)
                  .filter((b) => b.status === 'free').length
              }
            </FloorStatValue>
          </FloorStatItem>
          <ManageBtn>
            <Settings size={14} />
            Управление отделением
          </ManageBtn>
        </FloorStats>

        {/* Problem alerts */}
        {(urgentRooms.length > 0 || alertRooms.length > 0) && (
          <AlertsSection>
            <AlertsLabel>
              <TriangleAlert size={13} /> Проблемные участки
            </AlertsLabel>
            <AlertsRow>
              {urgentRooms.map((r) => (
                <AlertPill key={r.id}>
                  <AlertNum>{r.id}</AlertNum>
                  Срочно
                </AlertPill>
              ))}
              {alertRooms
                .filter((r) => !urgentRooms.includes(r))
                .map((r) => (
                  <AlertPill key={r.id} $variant="gray">
                    <AlertNum $variant="gray">{r.id}</AlertNum>
                    Требует внимания
                  </AlertPill>
                ))}
            </AlertsRow>
          </AlertsSection>
        )}

        {/* Floors */}
        {(activeFloor ? [activeFloor] : floors).map((f) => {
          const floorRooms = filteredRooms.filter((r) => r.floor === f)
          const floorBeds = floorRooms.flatMap((r) => r.beds)
          const floorFree = floorBeds.filter((b) => b.status === 'free').length
          const floorTotal = floorBeds.length
          const isExpanded = expandedFloors.has(f)

          return (
            <FloorSection key={f}>
              <FloorHeader onClick={() => toggleFloor(f)}>
                <FloorTitleBlock>
                  <FloorNumber>{f}</FloorNumber>
                  <div>
                    <FloorTitleText>{f} этаж — Палатный отдел</FloorTitleText>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                      {floorRooms.length} палат · {floorTotal} коек
                    </div>
                  </div>
                </FloorTitleBlock>

                <FloorStatsMini>
                  <FloorStatMini>
                    <FloorStatMiniLabel>Всего</FloorStatMiniLabel>
                    <AnimatedNum value={floorTotal} />
                  </FloorStatMini>
                  <FloorStatMini>
                    <FloorStatMiniLabel>Свободно</FloorStatMiniLabel>
                    <AnimatedNum value={floorFree} color="#16a34a" />
                  </FloorStatMini>
                  <ChevronDown
                    size={16}
                    style={{
                      color: '#9ca3af',
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </FloorStatsMini>
              </FloorHeader>

              {isExpanded && (
                <FloorBody>
                  <WardGrid>
                    {floorRooms.map((room) => {
                      const hasUrgent = room.beds.some((b) => b.status === 'urgent')
                      const hasAlert = room.beds.some((b) => b.status === 'attention')
                      return (
                        <WardCard key={room.id} $urgent={hasUrgent} $alert={hasAlert && !hasUrgent}>
                          <WardCardTop>
                            <div>
                              <WardName>{room.name}</WardName>
                              <WardMeta>{room.gender}</WardMeta>
                            </div>
                            {(hasUrgent || hasAlert) && (
                              <WardAlertIcon>
                                <TriangleAlert size={15} />
                              </WardAlertIcon>
                            )}
                          </WardCardTop>

                          <BedsRow>
                            {room.beds.map((bed) => (
                              <BedChip
                                key={bed.id}
                                $status={mapStatus(bed.status) as 'occupied' | 'empty' | 'alert'}
                                onClick={() => handleBedClick(bed.id)}
                                title={bed.patientName || 'Свободно'}
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                >
                                  <path d="M3 11V3" />
                                  <path d="M21 11V3" />
                                  <path d="M3 7h6a2 2 0 0 1 2 2v2H3V7Z" />
                                  <path d="M21 7h-6a2 2 0 0 0-2 2v2h8V7Z" />
                                  <path d="M1 11h22v4H1z" />
                                  <path d="M3 15v4" />
                                  <path d="M21 15v4" />
                                </svg>
                                К{bed.bedNumber || bed.id.slice(-1)}
                              </BedChip>
                            ))}
                          </BedsRow>
                        </WardCard>
                      )
                    })}
                  </WardGrid>
                </FloorBody>
              )}
            </FloorSection>
          )
        })}
      </Content>

      {/* ── Patient drawer ── */}
      <DrawerOverlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />

      <Drawer $open={drawerOpen}>
        <DrawerHeader style={{ position: 'relative' }}>
          <DrawerPatientRow>
            <DrawerAvatar>
              {selectedBed?.patientName?.[0]}
              {selectedBed?.patientLastName?.[0]}
            </DrawerAvatar>
            <div>
              <DrawerPatientName>
                {selectedBed?.patientLastName} {selectedBed?.patientName}{' '}
                {selectedBed?.patientMiddleName}
              </DrawerPatientName>
              <DrawerPatientSub>
                ID: {selectedBed?.patientId} · {selectedBed?.patientAge} лет · Палата{' '}
                {selectedBed?.roomNumber}
              </DrawerPatientSub>
            </div>
          </DrawerPatientRow>

          <StatusBanner $status={getDrawerStatus(selectedBed?.status || 'free')}>
            {selectedBed?.status === 'urgent' && <AlertCircle size={16} />}
            {selectedBed?.status === 'attention' && <TriangleAlert size={16} />}
            {selectedBed?.status === 'stable' && <CheckCircle2 size={16} />}
            {getStatusLabel(selectedBed?.status || 'free')}
          </StatusBanner>

          <DrawerCloseBtn onClick={() => setDrawerOpen(false)}>
            <X size={15} />
          </DrawerCloseBtn>
        </DrawerHeader>

        <DrawerBody>
          {/* Diagnosis */}
          <DrawerSection>
            <DrawerSectionTitle>
              <ClipboardList size={14} /> Диагноз
            </DrawerSectionTitle>
            <DrawerSectionBody>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                {selectedBed?.diagnosis || 'Не указан'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                Поступил: {selectedBed?.admissionDate || '—'} · Лечащий врач:{' '}
                {selectedBed?.doctorName || '—'}
              </div>
            </DrawerSectionBody>
          </DrawerSection>

          {/* Attention block for critical cases */}
          {(selectedBed?.status === 'urgent' || selectedBed?.status === 'attention') && (
            <AttentionBlock>
              <AttentionHeader>
                <TriangleAlert size={13} /> На что обратить внимание
              </AttentionHeader>
              <AttentionText>
                {selectedBed?.attentionNote ||
                  'Требуется дополнительный контроль состояния пациента.'}
              </AttentionText>
            </AttentionBlock>
          )}

          {/* Prescriptions */}
          {selectedBed?.prescriptions && selectedBed.prescriptions.length > 0 && (
            <DrawerSection>
              <DrawerSectionTitle>
                <ClipboardList size={14} /> Назначения
              </DrawerSectionTitle>
              <DrawerSectionBody>
                {selectedBed.prescriptions.map((rx) => (
                  <RxRow key={rx.id} $done={rx.done}>
                    <RxCheck $done={rx.done}>
                      {rx.done ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    </RxCheck>
                    <RxInfo>
                      <RxName $done={rx.done}>{rx.name}</RxName>
                    </RxInfo>
                    <RxTimeTag>{rx.time}</RxTimeTag>
                  </RxRow>
                ))}
              </DrawerSectionBody>
            </DrawerSection>
          )}

          {/* Medications */}
          {selectedBed?.medications && selectedBed.medications.length > 0 && (
            <DrawerSection>
              <DrawerSectionTitle>
                <Package size={14} /> Медикаменты
              </DrawerSectionTitle>
              <DrawerSectionBody>
                <StockGrid>
                  {selectedBed.medications.map((m) => (
                    <StockItem key={m.id} $low={m.low}>
                      <StockName>{m.name}</StockName>
                      <StockQty $low={m.low}>
                        {m.quantity}
                        <StockUnit>{m.unit}</StockUnit>
                      </StockQty>
                    </StockItem>
                  ))}
                </StockGrid>
              </DrawerSectionBody>
            </DrawerSection>
          )}

          {/* Action log */}
          {selectedBed?.actionLog && selectedBed.actionLog.length > 0 && (
            <DrawerSection>
              <DrawerSectionTitle>
                <BookOpen size={14} /> Журнал действий
              </DrawerSectionTitle>
              <DrawerSectionBody>
                {selectedBed.actionLog.map((l) => (
                  <LogItem key={l.id}>
                    <LogDot />
                    <LogText>
                      <strong>{l.performer}</strong> — {l.action} ({l.medication}, {l.quantity})
                    </LogText>
                    <LogTime>{l.time}</LogTime>
                  </LogItem>
                ))}
              </DrawerSectionBody>
            </DrawerSection>
          )}
        </DrawerBody>

        <DrawerFooter>
          <DrawerBtn>
            <ArrowLeftRight size={13} />
            Переместить
          </DrawerBtn>
          <DrawerBtn>
            <UserMinus size={13} />
            Выписать
          </DrawerBtn>
          <DrawerBtn $primary>Сохранить</DrawerBtn>
        </DrawerFooter>
      </Drawer>
    </PageWrapper>
  )
}
