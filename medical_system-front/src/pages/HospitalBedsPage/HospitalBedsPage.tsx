import { useState } from 'react'
import {
  Building2,
  Bed,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
} from 'lucide-react'

import { mockHospitalBeds, mockTreatments } from 'data/mockData'

import {
  PageWrapper,
  TwoPanel,
  LeftPanel,
  PanelCard,
  PanelCardHeader,
  PanelCardHeaderLeft,
  PanelCardTitle,
  PanelCardBody,
  BedGrid,
  BedCard,
  BedCardTop,
  BedCardTopLeft,
  BedLabel,
  BadgeStable,
  BadgeAttention,
  BadgeUrgent,
  BadgeFree,
  PatientRow,
  PatientAvatar,
  PatientInfo,
  PatientName,
  PatientAge,
  DiagnosisText,
  FreeBedPlaceholder,
  FreeBedText,
  Legend,
  LegendItem,
  LegendDot,
  RightPanel,
  TreatmentCard,
  TreatmentCardHeader,
  TreatmentCardTitle,
  PatientInfoBlock,
  PatientInfoRow,
  PatientAvatarBlue,
  PatientFullName,
  PatientLocation,
  PatientDiagnosis,
  TreatmentsBody,
  TreatmentsHeader,
  TreatmentsTitle,
  AddTreatmentIconBtn,
  TreatmentsList,
  TreatmentItem,
  TreatmentItemInner,
  TreatmentItemLeft,
  TreatmentNameRow,
  TreatmentName,
  TreatmentTime,
  TreatmentDoneBtn,
  AddTreatmentFooter,
  AddTreatmentBtn,
  EmptyState,
  EmptyStateText,
} from './styled'


interface HospitalWorkplaceProps {
  onNavigate: (screen: string) => void
  onLogout:   () => void
  userRole:
    | 'admin' | 'chief-doctor' | 'doctor'
    | 'head-nurse' | 'nurse' | 'patient' | 'laboratory' | null
}


const getInitials = (name?: string | null) =>
  name?.split(' ').map(n => n[0]).join('') ?? ''

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'stable':    return <BadgeStable>Стабилен</BadgeStable>
    case 'attention': return <BadgeAttention>Требует внимания</BadgeAttention>
    case 'urgent':    return <BadgeUrgent>Срочно</BadgeUrgent>
    case 'free':      return <BadgeFree>Свободно</BadgeFree>
    default:          return null
  }
}


export function HospitalWorkplace({ onNavigate, onLogout, userRole }: HospitalWorkplaceProps) {
  const [selectedBedId,      setSelectedBedId]      = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState('Терапевтическое отделение')

  const selectedBed = mockHospitalBeds.find(bed => bed.id === selectedBedId)

  return (
    <PageWrapper>

      <TwoPanel>

        <LeftPanel>
          <PanelCard>

            <PanelCardHeader>
              <PanelCardHeaderLeft>
                <Building2 size={20} color="#4b5563" />
                <PanelCardTitle>Палатный фонд</PanelCardTitle>
              </PanelCardHeaderLeft>
            </PanelCardHeader>

            <PanelCardBody>

              <BedGrid>
                {mockHospitalBeds.map(bed => (
                  <BedCard
                    key={bed.id}
                    $status={bed.status}
                    $selected={selectedBedId === bed.id}
                    onClick={() => setSelectedBedId(bed.id)}
                  >
                    <BedCardTop>
                      <BedCardTopLeft>
                        <Bed size={20} color="#4b5563" />
                        <BedLabel>Палата {bed.roomNumber} / Койка {bed.bedNumber}</BedLabel>
                      </BedCardTopLeft>
                      <StatusBadge status={bed.status} />
                    </BedCardTop>

                    {bed.status !== 'free' ? (
                      <div>
                        <PatientRow>
                          <PatientAvatar $status={bed.status}>
                            {getInitials(bed.patientName)}
                          </PatientAvatar>
                          <PatientInfo>
                            <PatientName>{bed.patientName}</PatientName>
                            <PatientAge>{bed.patientAge} лет</PatientAge>
                          </PatientInfo>
                        </PatientRow>
                        <DiagnosisText>{bed.diagnosis}</DiagnosisText>
                      </div>
                    ) : (
                      <FreeBedPlaceholder>
                        <FreeBedText>Свободная койка</FreeBedText>
                      </FreeBedPlaceholder>
                    )}
                  </BedCard>
                ))}
              </BedGrid>

              <Legend>
                <LegendItem><LegendDot $color="#22c55e" /><span>Стабилен</span></LegendItem>
                <LegendItem><LegendDot $color="#eab308" /><span>Требует внимания</span></LegendItem>
                <LegendItem><LegendDot $color="#ef4444" /><span>Срочно</span></LegendItem>
                <LegendItem><LegendDot $color="#d1d5db" /><span>Свободно</span></LegendItem>
              </Legend>

            </PanelCardBody>
          </PanelCard>
        </LeftPanel>

        <RightPanel>
          <TreatmentCard>

            <TreatmentCardHeader>
              <TreatmentCardTitle>Электронный лист назначений</TreatmentCardTitle>
            </TreatmentCardHeader>

            {selectedBed && selectedBed.status !== 'free' ? (
              <div>

                <PatientInfoBlock>
                  <PatientInfoRow>
                    <PatientAvatarBlue>{getInitials(selectedBed.patientName)}</PatientAvatarBlue>
                    <div>
                      <PatientFullName>{selectedBed.patientName}</PatientFullName>
                      <PatientLocation>
                        Палата {selectedBed.roomNumber}, Койка {selectedBed.bedNumber}
                      </PatientLocation>
                    </div>
                  </PatientInfoRow>
                  <PatientDiagnosis>{selectedBed.diagnosis}</PatientDiagnosis>
                </PatientInfoBlock>

                <TreatmentsBody>
                  <TreatmentsHeader>
                    <TreatmentsTitle>Назначения на сегодня</TreatmentsTitle>
                    {userRole === 'doctor' && (
                      <AddTreatmentIconBtn><Plus size={20} /></AddTreatmentIconBtn>
                    )}
                  </TreatmentsHeader>

                  <TreatmentsList>
                    {mockTreatments.map(t => (
                      <TreatmentItem key={t.id} $completed={t.status === 'completed'}>
                        <TreatmentItemInner>
                          <TreatmentItemLeft>
                            <TreatmentNameRow>
                              {t.status === 'completed'
                                ? <CheckCircle size={16} color="#16a34a" />
                                : <Clock       size={16} color="#9ca3af" />
                              }
                              <TreatmentName>{t.name}</TreatmentName>
                            </TreatmentNameRow>
                            <TreatmentTime>{t.time}</TreatmentTime>
                          </TreatmentItemLeft>

                          {userRole === 'nurse' && t.status === 'pending' && (
                            <TreatmentDoneBtn>Выполнено</TreatmentDoneBtn>
                          )}
                        </TreatmentItemInner>
                      </TreatmentItem>
                    ))}
                  </TreatmentsList>

                  {userRole === 'doctor' && (
                    <AddTreatmentFooter>
                      <AddTreatmentBtn>Добавить назначение</AddTreatmentBtn>
                    </AddTreatmentFooter>
                  )}
                </TreatmentsBody>

              </div>
            ) : (
              <EmptyState>
                <AlertCircle size={48} color="#d1d5db" />
                <EmptyStateText>
                  {selectedBed?.status === 'free'
                    ? 'Койка свободна'
                    : 'Выберите койку для просмотра листа назначений'}
                </EmptyStateText>
              </EmptyState>
            )}

          </TreatmentCard>
        </RightPanel>

      </TwoPanel>
    </PageWrapper>
  )
}