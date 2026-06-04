import styled, { css, keyframes } from 'styled-components'

const FONT = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`


const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`


export const WardRoundRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: #f3f4f6;
  font-family: ${FONT};
  animation: ${fadeIn} 0.25s ease;
`


export const PatientHeader = styled.div`
  background: white;
  color: #0f172a;
  padding: 16px 24px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  top: 0;
  z-index: 30;

  @media (max-width: 900px) {
    flex-wrap: wrap;
    padding: 12px 16px;
    margin: 0;
    gap: 12px;
  }
`

export const PatientAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.4);

  @media (max-width: 640px) {
    width: 44px;
    height: 44px;
    font-size: 15px;
  }
`

export const PatientInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const PatientName = styled.div`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    font-size: 15px;
  }
`

export const PatientMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.4;
`

export const PatientMetaItem = styled.span`
  white-space: nowrap;

  strong {
    opacity: 0.6;
    font-weight: 500;
    margin-right: 3px;
  }
`

export const PatientBadge = styled.span<{ color?: 'blue' | 'green' | 'red' | 'orange' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${({ color }) => {
    switch (color) {
      case 'green': return '#dcfce7'
      case 'red': return '#fee2e2'
      case 'orange': return '#ffedd5'
      default: return '#dbeafe'
    }
  }};
  color: ${({ color }) => {
    switch (color) {
      case 'green': return '#166534'
      case 'red': return '#991b1b'
      case 'orange': return '#9a3412'
      default: return '#1e40af'
    }
  }};
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }
`

export const StartTimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.7;
  white-space: nowrap;

  svg { opacity: 0.6; }
`

export const HeaderBtn = styled.button<{ variant?: 'primary' | 'ghost' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: none;
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 8px rgba(59,130,246,0.35);
          &:hover { background: #2563eb; transform: translateY(-1px); }
        `
      case 'danger':
        return css`
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.25);
          &:hover { background: rgba(239,68,68,0.25); }
        `
      default:
        return css`
          background: #f1f5f9;
          color: #475569;
          border: 1px solid transparent;
          &:hover { background: #e2e8f0; color: #0f172a; }
        `
    }
  }}

  @media (max-width: 640px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`


export const PageBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`


export const LeftNav = styled.nav`
  width: 220px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 16px 0;

  @media (max-width: 1100px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding: 0;
    background: white;
  }
`

export const NavItem = styled.button<{ $active?: boolean; $done?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border: none;
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#1d4ed8' : '#374151')};
  font-family: ${FONT};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? '600' : '450')};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  position: relative;
  border-left: 3px solid ${({ $active }) => ($active ? '#1d4ed8' : 'transparent')};

  &:hover {
    background: #f8faff;
    color: #1d4ed8;
  }

  .nav-done-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ $done }) => ($done ? '#22c55e' : '#d1d5db')};
    margin-left: auto;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  @media (max-width: 1100px) {
    width: auto;
    border-left: none;
    border-bottom: 3px solid ${({ $active }) => ($active ? '#1d4ed8' : 'transparent')};
    padding: 12px 14px;
    white-space: nowrap;
    font-size: 12px;
    .nav-done-dot { display: none; }
  }
`


export const CenterForm = styled.div`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 20px 24px;
  scroll-behavior: smooth;

  @media (max-width: 640px) {
    padding: 16px;
  }
`


export const RightPanel = styled.aside`
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1280px) {
    width: 240px;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`


export const FormBlock = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.2s ease;
  scroll-margin-top: 20px;
`

export const FormBlockHeader = styled.div`
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafbfc;

  .block-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1d4ed8;
    flex-shrink: 0;
  }

  .block-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.01em;
    flex: 1;
  }

  .block-auto-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 20px;
    background: #dcfce7;
    color: #166534;
    letter-spacing: 0.03em;
  }
`

export const FormBlockBody = styled.div`
  padding: 16px 18px;

  @media (max-width: 640px) {
    padding: 12px 14px;
  }
`


export const ParamCard = styled.div`
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  background: #fafbfc;
  transition: border-color 0.15s;

  &:last-child { margin-bottom: 0; }
  &:hover { border-color: #e2e8f0; }

  .param-label {
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
`


export const PillGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Pill = styled.button<{ $active?: boolean; $color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' }>`
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid;
  font-family: ${FONT};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.4;

  ${({ $active, $color }) => {
    const c = $color ?? 'blue'
    const colorMap: Record<string, { bg: string; text: string; border: string; activeBg: string; activeText: string; activeBorder: string }> = {
      blue: {
        bg: 'white', text: '#64748b', border: '#e2e8f0',
        activeBg: '#eff6ff', activeText: '#1d4ed8', activeBorder: '#93c5fd',
      },
      green: {
        bg: 'white', text: '#64748b', border: '#e2e8f0',
        activeBg: '#f0fdf4', activeText: '#166534', activeBorder: '#86efac',
      },
      red: {
        bg: 'white', text: '#64748b', border: '#e2e8f0',
        activeBg: '#fef2f2', activeText: '#991b1b', activeBorder: '#fca5a5',
      },
      orange: {
        bg: 'white', text: '#64748b', border: '#e2e8f0',
        activeBg: '#fff7ed', activeText: '#9a3412', activeBorder: '#fdba74',
      },
      purple: {
        bg: 'white', text: '#64748b', border: '#e2e8f0',
        activeBg: '#f5f3ff', activeText: '#5b21b6', activeBorder: '#c4b5fd',
      },
    }
    const m = colorMap[c]
    return $active
      ? css`
          background: ${m.activeBg};
          color: ${m.activeText};
          border-color: ${m.activeBorder};
          box-shadow: 0 0 0 2px ${m.activeBorder}44;
        `
      : css`
          background: ${m.bg};
          color: ${m.text};
          border-color: ${m.border};
          &:hover {
            border-color: #cbd5e1;
            color: #374151;
          }
        `
  }}
`


export const CheckBtn = styled.button<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1.5px solid ${({ $checked }) => ($checked ? '#93c5fd' : '#e2e8f0')};
  background: ${({ $checked }) => ($checked ? '#eff6ff' : 'white')};
  color: ${({ $checked }) => ($checked ? '#1d4ed8' : '#64748b')};
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  .check-box {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1.5px solid ${({ $checked }) => ($checked ? '#3b82f6' : '#cbd5e1')};
    background: ${({ $checked }) => ($checked ? '#3b82f6' : 'white')};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  &:hover {
    border-color: #bfdbfe;
    background: #f8faff;
  }
`


export const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  font-family: ${FONT};
  font-size: 13px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  background: white;

  &:focus {
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.2);
  }

  &::placeholder { color: #94a3b8; }
`

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  font-family: ${FONT};
  font-size: 13px;
  color: #1e293b;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  line-height: 1.5;
  background: white;

  &:focus {
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.2);
  }

  &::placeholder { color: #94a3b8; }
`

export const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  display: block;
  margin-bottom: 5px;
  letter-spacing: 0.01em;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`


export const AutoText = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  background: #f0f9ff;
  border: 1.5px solid #bae6fd;
  color: #0369a1;
  font-size: 13px;
  line-height: 1.6;
  margin-top: 8px;

  .auto-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.6;
    display: block;
    margin-bottom: 4px;
  }
`


export const VitalCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: white;
  border: 1.5px solid #f1f5f9;
`

export const VitalValue = styled.div<{ $alert?: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ $alert }) => ($alert ? '#dc2626' : '#1e293b')};
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  animation: ${({ $alert }) => ($alert ? css`${pulse} 2s infinite` : 'none')};
`

export const VitalUnit = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 3px;
`


export const PrescTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 8px 10px;
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
  }

  td {
    padding: 10px;
    vertical-align: middle;
    border-bottom: 1px solid #f8fafc;
    color: #334155;
  }

  tbody tr:hover { background: #fafbff; }
  tbody tr:last-child td { border-bottom: none; }
`

export const ActionSelect = styled.div`
  display: flex;
  gap: 4px;
`

export const ActionPill = styled.button<{ $active?: boolean; $color?: string }>`
  padding: 3px 9px;
  border-radius: 6px;
  border: 1.5px solid ${({ $active, $color }) =>
    $active ? ($color ?? '#93c5fd') : '#e2e8f0'};
  background: ${({ $active, $color }) =>
    $active ? ($color ? `${$color}22` : '#eff6ff') : 'white'};
  color: ${({ $active, $color }) =>
    $active ? ($color ?? '#1d4ed8') : '#94a3b8'};
  font-family: ${FONT};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.12s;
`


export const ProcedureRow = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  margin-bottom: 6px;
  background: ${({ $status }) => ($status === 'done' ? '#f0fdf4' : '#fffbeb')};

  .proc-icon {
    font-size: 16px;
  }

  .proc-info {
    flex: 1;
    min-width: 0;
  }

  .proc-name {
    font-size: 13px;
    font-weight: 500;
    color: #1e293b;
  }

  .proc-date {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .proc-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    ${({ $status }) =>
      $status === 'done'
        ? 'background:#dcfce7; color:#166534;'
        : 'background:#fef3c7; color:#92400e;'}
  }
`


export const LabResultCard = styled.div<{ $criticality?: 'green' | 'yellow' | 'red' }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $criticality }) => {
    switch ($criticality) {
      case 'red': return '#fecaca'
      case 'yellow': return '#fde68a'
      default: return '#bbf7d0'
    }
  }};
  background: ${({ $criticality }) => {
    switch ($criticality) {
      case 'red': return '#fef2f2'
      case 'yellow': return '#fffbeb'
      default: return '#f0fdf4'
    }
  }};
  margin-bottom: 6px;

  .lab-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 4px;
    flex-shrink: 0;
    background: ${({ $criticality }) => {
      switch ($criticality) {
        case 'red': return '#ef4444'
        case 'yellow': return '#f59e0b'
        default: return '#22c55e'
      }
    }};
  }

  .lab-body { flex: 1; }
  .lab-type { font-size: 13px; font-weight: 600; color: #1e293b; }
  .lab-date { font-size: 11px; color: #94a3b8; margin-top: 1px; }
  .lab-status {
    font-size: 12px;
    color: ${({ $criticality }) => {
      switch ($criticality) {
        case 'red': return '#dc2626'
        case 'yellow': return '#d97706'
        default: return '#16a34a'
      }
    }};
    margin-top: 3px;
    font-weight: 500;
  }
`


export const MedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  margin-bottom: 6px;

  .med-name { font-size: 13px; font-weight: 600; color: #1e293b; }
  .med-dose { font-size: 12px; color: #64748b; }
  .med-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3b82f6;
    flex-shrink: 0;
  }
`


export const ConclusionBox = styled.div`
  position: relative;
`

export const AutoGenBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid #93c5fd;
  background: #eff6ff;
  color: #1d4ed8;
  font-family: ${FONT};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 10px;

  &:hover {
    background: #dbeafe;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59,130,246,0.2);
  }
`


export const BottomBar = styled.div`
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.04);

  @media (max-width: 640px) {
    padding: 10px 16px;
    flex-wrap: wrap;
    gap: 8px;
  }
`

export const BottomBtn = styled.button<{ variant?: 'primary' | 'success' | 'ghost' | 'outline' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 9px;
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  white-space: nowrap;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: #1d4ed8;
          color: white;
          box-shadow: 0 2px 10px rgba(29,78,216,0.3);
          &:hover { background: #1e40af; transform: translateY(-1px); }
        `
      case 'success':
        return css`
          background: #16a34a;
          color: white;
          box-shadow: 0 2px 10px rgba(22,163,74,0.3);
          &:hover { background: #15803d; transform: translateY(-1px); }
        `
      case 'outline':
        return css`
          background: white;
          color: #374151;
          border: 1.5px solid #e2e8f0;
          &:hover { border-color: #93c5fd; color: #1d4ed8; background: #f8faff; }
        `
      default:
        return css`
          background: #f8fafc;
          color: #64748b;
          border: 1.5px solid #e2e8f0;
          &:hover { background: #f1f5f9; color: #374151; }
        `
    }
  }}

  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`


export const RightWidget = styled.div`
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  overflow: hidden;

  .rw-header {
    padding: 10px 12px;
    background: #f8fafc;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-bottom: 1px solid #f1f5f9;
  }

  .rw-body {
    padding: 10px 12px;
  }
`

export const HistoryEntry = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;

  &:last-child { border-bottom: none; }

  .he-date {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 3px;
  }

  .he-text {
    font-size: 12px;
    color: #334155;
    line-height: 1.4;
  }
`


export const QuickAction = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #374151;
  font-family: ${FONT};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;

  &:hover {
    border-color: #93c5fd;
    color: #1d4ed8;
    background: #f8faff;
  }

  svg { opacity: 0.6; flex-shrink: 0; }
`


export const ToastOverlay = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease;
`

export const Toast = styled.div<{ $type?: 'success' | 'info' | 'error' }>`
  padding: 12px 20px;
  border-radius: 10px;
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);

  background: ${({ $type }) => {
    switch ($type) {
      case 'success': return '#16a34a'
      case 'error': return '#dc2626'
      default: return '#1d4ed8'
    }
  }};
`


export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  animation: ${fadeIn} 0.15s ease;
`

export const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 480px;
  max-width: calc(100vw - 32px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);

  .modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
  }
`

export const DynamicsToggle = styled.div`
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
`

export const DynamicsBtn = styled.button<{ $active?: boolean; $color?: 'green' | 'gray' | 'red' }>`
  flex: 1;
  padding: 9px 4px;
  border: none;
  font-family: ${FONT};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  ${({ $active, $color }) => {
    const map: Record<string, { bg: string; text: string }> = {
      green: { bg: '#dcfce7', text: '#166534' },
      gray: { bg: '#f1f5f9', text: '#475569' },
      red: { bg: '#fee2e2', text: '#991b1b' },
    }
    const m = map[$color ?? 'gray']
    return $active
      ? css`background: ${m.bg}; color: ${m.text};`
      : css`background: transparent; color: #94a3b8; &:hover { background: #f1f5f9; color: #374151; }`
  }}
`


export const TempSparkline = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 36px;
`

export const SparkBar = styled.div<{ $height: number; $highlight?: boolean }>`
  width: 8px;
  height: ${({ $height }) => $height}px;
  border-radius: 2px 2px 0 0;
  background: ${({ $highlight }) => ($highlight ? '#3b82f6' : '#bfdbfe')};
  transition: height 0.3s;
`


export const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 12px 0;
`


export const SubSection = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin: 14px 0 8px;

  &:first-child { margin-top: 0; }
`
