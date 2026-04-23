import { useState, useEffect } from 'react'
import {
  Building2,
  Bed,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  BedDouble,
  BedSingle,
  Loader,
  Ellipsis,
  SlidersHorizontal,
  ChevronRight,
  Users,
  Settings,
  TriangleAlert,
  ArrowLeftRight,
  UserMinus,
  ChevronDown,
  Circle,
  CheckCircle2,
  HospitalIcon
} from 'lucide-react'

import { mockHospitalBeds, roomsConfig } from 'data/mockData'

import {
  Container,
  StyledCard,
  HeaderRow,
  HeaderLeft,
  Title,
  CardHeader,
  CardContent,
  InfoGrid,
  InfoItem,
  InfoText,
  InfoLabel,
  InfoValue,
  PageWrapper,
  Content,
  StatsRow,
  StatCard,
  StatLabel,
  StatValue,
  StatDelta,
  SectionHeader,
  SectionTitle,
  FilterRow,
  DeptFilter,
  FilterChip,
  ProgressBarWrap,
  ProgressPct,
  ProgressTrack,
  ProgressFill,
  FloorStats,
  FloorStatItem,
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
  WardAlertIcon,
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
  TagRow,
  Tag,
  DetailGrid,
  DetailField,
  DetailFieldLabel,
  DetailFieldValue,
  ActionRow,
  ActionBtn,
  RxSection,
  RxSectionHeader,
  RxGroup,
  RxGroupTitle,
  RxItem,
  RxItemLeft,
  RxStatusIcon,
  RxTime,
  WarningBlock,
  WarningText,
  CardSubtitle
} from './styled'

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

const HospitalProgress = ({ targetPct }: { targetPct: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(targetPct)

  return (
    <StatCard $accent onMouseEnter={handleHover}>
      <Ellipsis size={20} color="#ffffff" />
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

const BedsProgress = ({ targetPct }: { targetPct: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(targetPct)

  return (
    <StatCard onMouseEnter={handleHover}>
      <Bed size={20} color="#2563eb" />
      <StatLabel>Всего коек</StatLabel>
      <StatValue>{displayPct}</StatValue>
    </StatCard>
  )
}

const OccupiedBedsProgress = ({ targetPct }: { targetPct: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(targetPct)

  return (
    <StatCard onMouseEnter={handleHover}>
      <BedDouble size={20} color="#eb2525" />
      <StatLabel>Занято</StatLabel>
      <StatValue $color="#eb2525">{displayPct}</StatValue>
      <StatDelta $positive>+2 за сегодня</StatDelta>
    </StatCard>
  )
}

const FreeBedsProgress = ({ targetPct }: { targetPct: number }) => {
  const { displayPct, handleHover } = useAnimationProgress(targetPct)

  return (
    <StatCard onMouseEnter={handleHover}>
      <BedSingle size={20} color="#188f18" />
      <StatLabel>Свободно</StatLabel>
      <StatValue $color="#16a34a">{displayPct}</StatValue>
      <StatDelta>−5% от вчера</StatDelta>
    </StatCard>
  )
}

const useAnimationProgress = (targetPct: number) => {
  const [displayPct, setDisplayPct] = useState(0)

  const animateValue = (start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp

      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const current = Math.floor(progress * (end - start) + start)

      setDisplayPct(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  useEffect(() => {
    animateValue(0, targetPct, 1000)
  }, [targetPct])

  const handleHover = () => {
    animateValue(0, targetPct, 800)
  }

  return { displayPct, handleHover }
}

const rooms = Object.values(
  mockHospitalBeds.reduce(
    (acc, bed) => {
      if (!acc[bed.roomNumber]) {
        acc[bed.roomNumber] = {
          id: bed.roomNumber,
          name: `Палата ${bed.roomNumber}`,
          gender: roomsConfig[bed.roomNumber]?.gender === 'male' ? 'М' : 'Ж',
          beds: []
        }
      }

      acc[bed.roomNumber].beds.push(bed)
      return acc
    },
    {} as Record<
      string,
      {
        id: string
        name: string
        gender: string
        beds: typeof mockHospitalBeds
      }
    >
  )
)

export function HospitalWorkplace({ onNavigate, onLogout, userRole }: HospitalWorkplaceProps) {
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null)
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState('Пульмонология')
  const [activeFloor, setActiveFloor] = useState<number | null>(null)

  const [rxGroups, setRxGroups] = useState([
    {
      id: 'g1',
      title: 'Утро',
      expanded: true,
      items: [
        { id: 'i1', name: 'Аспирин', time: '08:00', done: true },
        { id: 'i2', name: 'Капельница', time: '09:00', done: false }
      ]
    }
  ])

  const toggleGroup = (id: string) => {
    setRxGroups((prev) => prev.map((g) => (g.id === id ? { ...g, expanded: !g.expanded } : g)))
  }

  const mapBedStatus = (status: string): 'alert' | 'occupied' | 'empty' => {
    if (status === 'free') return 'empty'
    if (status === 'occupied') return 'occupied'
    if (status === 'alert') return 'alert'

    return 'occupied'
  }

  const floors = Array.from(
    new Set(mockHospitalBeds.map((bed) => parseInt(bed.roomNumber.charAt(0))))
  ).sort((a, b) => a - b)

  // Фильтруем кровати по выбранному этажу
  const filteredBeds = activeFloor
    ? mockHospitalBeds.filter((bed) => parseInt(bed.roomNumber.charAt(0)) === activeFloor)
    : mockHospitalBeds

  const selectedBed = mockHospitalBeds.find((bed) => bed.id === selectedBedId)
  console.log('Selected bed:', selectedBedId, selectedBed)

  const totalBedsonOnFloor = filteredBeds.length
  const freeBedsOnFloor = filteredBeds.filter((bed) => bed.status === 'free').length

  const totalBeds = mockHospitalBeds.length
  const occupiedBeds = mockHospitalBeds.filter((bed) => bed.status !== 'free').length
  const freeBeds = mockHospitalBeds.filter((bed) => bed.status === 'free').length
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(0) : '0'

  const freeMaleBeds = filteredBeds.filter((bed) => {
    const isFree = bed.status === 'free'
    const isMaleRoom = roomsConfig[bed.roomNumber]?.gender === 'male'

    return isFree && isMaleRoom
  }).length

  const freeFemaleBeds = filteredBeds.filter((bed) => {
    return bed.status === 'free' && roomsConfig[bed.roomNumber]?.gender === 'female'
  }).length

  return (
    <PageWrapper>
      <Container>
        <StyledCard>
          <CardHeader>
            <HeaderRow>
              <HeaderLeft>
                <HospitalIcon size={32} color="#2563eb" />
                <Title>Палатный фонд</Title>
              </HeaderLeft>
              <CardSubtitle>Управление палатами</CardSubtitle>
            </HeaderRow>
          </CardHeader>

          <CardContent>
            <InfoGrid>
              <InfoItem>
                <BedsProgress targetPct={totalBeds} />
              </InfoItem>

              <InfoItem>
                <OccupiedBedsProgress targetPct={occupiedBeds} />
              </InfoItem>

              <InfoItem>
                <FreeBedsProgress targetPct={freeBeds} />
              </InfoItem>

              <InfoItem>
                <HospitalProgress targetPct={parseInt(occupancyRate)} />
              </InfoItem>
            </InfoGrid>
          </CardContent>
        </StyledCard>
      </Container>

      <Content>
        <SectionHeader>
          <SectionTitle>Управление палатами</SectionTitle>
          <FilterRow>
            {floors.map((f) => (
              <FilterChip key={f} $active={activeFloor === f} onClick={() => setActiveFloor(f)}>
                {f} этаж
              </FilterChip>
            ))}
          </FilterRow>
        </SectionHeader>

        <FloorStats>
          <FloorStatItem>
            <FloorStatLabel>На этаже</FloorStatLabel>
            <FloorStatValue $large style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={22} style={{ color: '#9ca3af' }} />
              {totalBedsonOnFloor} палат
            </FloorStatValue>
          </FloorStatItem>

          <FloorStatItem>
            <FloorStatLabel>Свободно мест</FloorStatLabel>
            <FloorStatValue $color="#16a34a">{freeBedsOnFloor}</FloorStatValue>
            <FloorStatSub>из {totalBedsonOnFloor} на этаже</FloorStatSub>
          </FloorStatItem>

          <FloorStatItem>
            <FloorStatLabel>Мужские места</FloorStatLabel>
            <FloorStatValue>{freeMaleBeds}</FloorStatValue>
          </FloorStatItem>

          <FloorStatItem>
            <FloorStatLabel>Женские места</FloorStatLabel>
            <FloorStatValue>{freeFemaleBeds}</FloorStatValue>
          </FloorStatItem>

          <ManageBtn>
            <Settings size={14} />
            Управление отделением
          </ManageBtn>
        </FloorStats>

        {/* Problem alerts */}
        <AlertsSection>
          <AlertsLabel>
            <TriangleAlert size={13} />
            Проблемные участки
          </AlertsLabel>
          <AlertsRow>
            <AlertPill>
              <AlertNum>104</AlertNum>
              Не обошла медсестра
            </AlertPill>
            <AlertPill>
              <AlertNum>102</AlertNum>
              Критическое состояние
            </AlertPill>
            <AlertPill $variant="gray">
              <AlertNum $variant="gray">106</AlertNum>
              Просрочены назначения
            </AlertPill>
          </AlertsRow>
        </AlertsSection>

        <TwoCol>
          <WardGrid>
            {rooms.map((room) => {
              const hasOccupiedBeds = room.beds.some((b) => b.status !== 'free')
              const isSelected = selectedWard === room.id

              return (
                <WardCard
                  key={room.id}
                  $alert={hasOccupiedBeds}
                  onClick={() => setSelectedWard(room.id)}
                  style={
                    isSelected
                      ? { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.12)' }
                      : {}
                  }
                >
                  <WardCardTop>
                    <div>
                      <WardName>{room.name}</WardName>
                    </div>
                    {hasOccupiedBeds && (
                      <WardAlertIcon>
                        <TriangleAlert size={15} />
                      </WardAlertIcon>
                    )}
                  </WardCardTop>

                  <BedsRow>
                    {room.beds.map((bed: (typeof room.beds)[number]) => (
                      <BedChip 
                        key={bed.id} 
                        $status={mapBedStatus(bed.status)}
                        onClick={() => setSelectedBedId(bed.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <svg
                          width="14"
                          height="14"
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
                        {bed.id.toUpperCase()}
                      </BedChip>
                    ))}
                  </BedsRow>
                </WardCard>
              )
            })}
          </WardGrid>

          {/* Detail panel */}
          <DetailPanel>
            <DetailHeader>
              <DetailTitle>Детали объекта</DetailTitle>
              <DetailId>ID: b102-1</DetailId>
            </DetailHeader>

            {selectedBed ? (
              <>
                <PatientBlock>
                  <PatientRow>
                    <PatientAvatar>
                      {selectedBed?.patientName} {selectedBed?.patientLastName}
                    </PatientAvatar>
                    <div>
                      <PatientName>
                        {selectedBed?.patientName} {selectedBed?.patientLastName}{' '}
                        {selectedBed?.patientMiddleName}
                      </PatientName>
                      <PatientMeta>
                        ID: {selectedBed?.patientId} · {selectedBed?.patientAge} лет
                      </PatientMeta>
                    </div>
                  </PatientRow>
                  <TagRow>
                    <Tag $color="gray">Планово</Tag>
                    <Tag $color="red">Острый инфаркт</Tag>
                  </TagRow>
                </PatientBlock>

                <DetailGrid>
                  <DetailField>
                    <DetailFieldLabel>Поступил</DetailFieldLabel>
                    <DetailFieldValue>12.05.2024</DetailFieldValue>
                  </DetailField>
                  <DetailField>
                    <DetailFieldLabel>Лечащий врач</DetailFieldLabel>
                    <DetailFieldValue>Д-р Петров П.</DetailFieldValue>
                  </DetailField>
                </DetailGrid>

                <ActionRow>
                  <ActionBtn>
                    <ArrowLeftRight size={13} />
                    Переместить
                  </ActionBtn>
                  <ActionBtn>
                    <UserMinus size={13} />
                    Выписать
                  </ActionBtn>
                </ActionRow>

                <RxSection>
                  <RxSectionHeader>
                    <Clock size={14} style={{ color: '#6366f1' }} />
                    Лист назначений
                  </RxSectionHeader>

                  {rxGroups.map((group) => (
                    <RxGroup key={group.id}>
                      <RxGroupTitle onClick={() => toggleGroup(group.id)}>
                        <span>{group.title}</span>
                        <ChevronDown
                          size={14}
                          style={{
                            transform: group.expanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </RxGroupTitle>

                      {group.expanded &&
                        group.items.map((item) => (
                          <RxItem key={item.id} $done={item.done}>
                            <RxItemLeft>
                              <RxStatusIcon $done={item.done}>
                                {item.done ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                              </RxStatusIcon>
                              {item.name}
                            </RxItemLeft>
                            <RxTime>{item.time}</RxTime>
                          </RxItem>
                        ))}
                    </RxGroup>
                  ))}
                </RxSection>

                <WarningBlock>
                  <TriangleAlert
                    size={14}
                    style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }}
                  />
                  <WarningText>
                    <strong>Требуется внимание</strong>
                    Результаты ЭКГ задерживаются. Уточнить в лаборатории.
                  </WarningText>
                </WarningBlock>
              </>
            ) : (
              <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                Выберите палату для просмотра деталей
              </div>
            )}
          </DetailPanel>
        </TwoCol>
      </Content>
    </PageWrapper>
  )
}
