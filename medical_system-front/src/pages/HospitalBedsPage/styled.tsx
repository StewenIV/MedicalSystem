import styled, { css } from 'styled-components'


type BedStatus = 'stable' | 'attention' | 'urgent' | 'free' | string

const statusColors: Record<string, { border: string; bg: string }> = {
  stable:    { border: '#22c55e', bg: '#f0fdf4' },
  attention: { border: '#eab308', bg: '#fefce8' },
  urgent:    { border: '#ef4444', bg: '#fef2f2' },
  free:      { border: '#d1d5db', bg: '#f9fafb' },
}

const avatarColors: Record<string, string> = {
  stable:    '#16a34a',
  attention: '#ca8a04',
  urgent:    '#dc2626',
}


export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`

export const TwoPanel = styled.div`
  display: flex;
`


export const LeftPanel = styled.div`
  flex: 1;
  padding: 24px;
`

export const PanelCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`

export const PanelCardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const PanelCardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const PanelCardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`

export const PanelCardBody = styled.div`
  padding: 24px;
`

export const BedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`

export const BedCard = styled.div<{ $status: BedStatus; $selected: boolean }>`
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${p => (statusColors[p.$status] ?? statusColors.free).border};
  background:  ${p => (statusColors[p.$status] ?? statusColors.free).bg};
  cursor: pointer;
  transition: box-shadow 0.15s, outline 0.1s;
  outline: ${p => (p.$selected ? '2px solid #3b82f6' : 'none')};
  outline-offset: 2px;

  &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
`

export const BedCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`

export const BedCardTopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const BedLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`

const badgeBase = css`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
`

export const BadgeStable = styled.span`
  ${badgeBase}
  background: #dcfce7;
  color: #166534;
`

export const BadgeAttention = styled.span`
  ${badgeBase}
  background: #fef9c3;
  color: #854d0e;
`

export const BadgeUrgent = styled.span`
  ${badgeBase}
  background: #fee2e2;
  color: #991b1b;
`

export const BadgeFree = styled.span`
  ${badgeBase}
  background: #f3f4f6;
  color: #1f2937;
`


export const PatientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

export const PatientAvatar = styled.div<{ $status: BedStatus }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  flex-shrink: 0;
  background: ${p => avatarColors[p.$status] ?? '#6b7280'};
`

export const PatientInfo = styled.div`
  flex: 1;
`

export const PatientName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #111827;
`

export const PatientAge = styled.p`
  margin: 0;
  font-size: 13px;
  color: #4b5563;
`

export const DiagnosisText = styled.p`
  margin: 8px 0 0;
  font-size: 13px;
  color: #374151;
`

export const FreeBedPlaceholder = styled.div`
  text-align: center;
  padding: 24px 0;
`

export const FreeBedText = styled.p`
  margin: 0;
  color: #9ca3af;
  font-style: italic;
`

export const Legend = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 13px;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
`

export const LegendDot = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${p => p.$color};
`


export const RightPanel = styled.div`
  width: 384px;
  padding: 24px 24px 24px 0;
`

export const TreatmentCard = styled(PanelCard)`
  height: 100%;
`

export const TreatmentCardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`

export const TreatmentCardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`

export const PatientInfoBlock = styled.div`
  padding: 16px;
  background: #eff6ff;
  border-bottom: 1px solid #e5e7eb;
`

export const PatientInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

export const PatientAvatarBlue = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  flex-shrink: 0;
`

export const PatientFullName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`

export const PatientLocation = styled.p`
  margin: 0;
  font-size: 13px;
  color: #4b5563;
`

export const PatientDiagnosis = styled.p`
  margin: 0;
  font-size: 13px;
  color: #374151;
`


export const TreatmentsBody = styled.div`
  padding: 16px;
`

export const TreatmentsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

export const TreatmentsTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #111827;
`

export const AddTreatmentIconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2563eb;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;

  &:hover { color: #1d4ed8; }
`

export const TreatmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const TreatmentItem = styled.div<{ $completed: boolean }>`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${p => (p.$completed ? '#bbf7d0' : '#e5e7eb')};
  background:  ${p => (p.$completed ? '#f0fdf4' : '#ffffff')};
`

export const TreatmentItemInner = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

export const TreatmentItemLeft = styled.div`
  flex: 1;
`

export const TreatmentNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const TreatmentName = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #111827;
`

export const TreatmentTime = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #4b5563;
`

export const TreatmentDoneBtn = styled.button`
  padding: 4px 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover { background: #1d4ed8; }
`

export const AddTreatmentFooter = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`

export const AddTreatmentBtn = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #1d4ed8; }
`

export const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
`

export const EmptyStateText = styled.p`
  margin: 12px 0 0;
  font-size: 14px;
  color: #6b7280;
`