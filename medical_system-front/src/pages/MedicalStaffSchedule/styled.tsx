import styled, { keyframes, css } from 'styled-components'

// ─── Animations ────────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88); }
  60%  { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`

const rowSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  50%       { box-shadow: 0 0 16px 4px rgba(59, 130, 246, 0.12); }
`

// ─── Color tokens ────────────────────────────────────────────────────────────────
const FONT = `'DM Sans', 'Inter', system-ui, sans-serif`
const GRADIENT_ACCENT = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_BUTTON = 'linear-gradient(135deg, #1e40af 0%, #6d28d9 100%)'
const GLASS_BG = 'rgba(255, 255, 255, 0.82)'
const SHADOW_SOFT = '0 8px 32px rgba(15, 23, 42, 0.05)'
const SHADOW_HOVER = '0 16px 48px rgba(15, 23, 42, 0.10)'

// ─── Page wrapper ──────────────────────────────────────────────────────────────
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  font-family: ${FONT};
  color: #0f172a;
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding-bottom: 40px;
`

// ─── Header ───────────────────────────────────────────────────────────────────
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  background: ${GLASS_BG};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 32px 40px;
  border-radius: 28px;
  border: 1px solid rgba(226, 232, 240, 0.7);
  box-shadow: ${SHADOW_SOFT}, inset 0 1px 0 rgba(255, 255, 255, 1);
  position: relative;
  overflow: hidden;
  transition: all 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: ${GRADIENT_ACCENT};
    border-radius: 0 4px 4px 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  &:hover {
    box-shadow: ${SHADOW_HOVER}, inset 0 1px 0 rgba(255, 255, 255, 1);
  }
`

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const HeaderTitle = styled.h1`
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.03em;
`

export const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

// ─── Month navigator ───────────────────────────────────────────────────────────
export const MonthYearSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 5px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
    border-color: #c7d2fe;
  }
`

export const MonthDisplay = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  padding: 8px 20px;
  min-width: 170px;
  text-align: center;
  letter-spacing: -0.02em;
`

export const NavigationButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
    transform: scale(1.08);
  }

  &:active {
    background: #e2e8f0;
    transform: scale(0.93);
  }
`

// ─── Toolbar ─────────────────────────────────────────────────────────────────────
export const Toolbar = styled.div`
  display: flex;
  gap: 16px;
  background: ${GLASS_BG};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 18px 28px;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`

export const ToolbarLeft = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
`

export const ToolbarRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const FilterLabel = styled.label`
  font-weight: 700;
  font-size: 13px;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

export const ExportButton = styled.button<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 22px;
  font-size: 13px;
  font-weight: 700;
  font-family: ${FONT};
  border-radius: 14px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  background: ${GRADIENT_ACCENT};
  color: white;
  letter-spacing: 0.1px;
  box-shadow: 0 4px 18px rgba(37, 99, 235, 0.32), inset 0 1px 0 rgba(255,255,255,0.18);
  opacity: ${({ disabled }) => (disabled ? 0.65 : 1)};
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.42), inset 0 1px 0 rgba(255,255,255,0.18);
    background: ${GRADIENT_BUTTON};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  }
`

// ─── Stats grid ────────────────────────────────────────────────────────────────
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 20px;
`

export const StatCard = styled.div<{ $color?: string }>`
  background: #ffffff;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${({ $color }) => $color || GRADIENT_ACCENT};
    border-radius: 0 0 4px 4px;
    opacity: 0.85;
  }

  &:hover {
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.09);
    transform: translateY(-5px);
    border-color: #e2e8f0;
  }
`

export const StatIcon = styled.div<{ $bg?: string; $color?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || '#eff6ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || '#2563eb'};
  margin-bottom: 6px;
`

export const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.9px;
`

export const StatValue = styled.div`
  font-size: 34px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.04em;
  line-height: 1;
`

export const StatSub = styled.div`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 2px;
`

// ─── Premium table container ────────────────────────────────────────────────────
export const TableWrapper = styled.div`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 28px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow:
    0 4px 6px rgba(15, 23, 42, 0.02),
    0 12px 40px rgba(15, 23, 42, 0.06),
    0 40px 80px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  /* Right fade scroll hint */
  &::after {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 80px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.98) 100%);
    backdrop-filter: blur(4px);
    pointer-events: none;
    z-index: 6;
    border-radius: 0 28px 28px 0;
  }
`

export const TableScrollWrapper = styled.div`
  overflow-x: auto;
  padding-bottom: 0;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
    margin: 0 28px;
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #bfdbfe, #ddd6fe);
    border-radius: 99px;
    &:hover { background: linear-gradient(90deg, #93c5fd, #c4b5fd); }
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 1100px;

  thead th {
    padding: 0;
    text-align: center;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    position: sticky;
    top: 0;
    z-index: 2;
  }

  /* Each tbody tr is a "card row" */
  tbody tr {
    animation: ${rowSlideIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* Stagger row animations */
  tbody tr:nth-child(1)  { animation-delay: 0.03s; }
  tbody tr:nth-child(2)  { animation-delay: 0.06s; }
  tbody tr:nth-child(3)  { animation-delay: 0.09s; }
  tbody tr:nth-child(4)  { animation-delay: 0.12s; }
  tbody tr:nth-child(5)  { animation-delay: 0.15s; }
  tbody tr:nth-child(6)  { animation-delay: 0.18s; }
  tbody tr:nth-child(7)  { animation-delay: 0.21s; }
  tbody tr:nth-child(8)  { animation-delay: 0.24s; }
  tbody tr:nth-child(9)  { animation-delay: 0.27s; }
  tbody tr:nth-child(10) { animation-delay: 0.30s; }

  td { padding: 0; }
`

// ─── Glassmorphism sticky header ───────────────────────────────────────────────
export const NameColumnHeader = styled.th`
  position: sticky !important;
  left: 0;
  z-index: 7 !important;
  text-align: left !important;
  padding: 18px 24px !important;
  min-width: 260px;
  border-right: 1px solid rgba(226, 232, 240, 0.5) !important;
  font-weight: 700;
  color: #475569;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background: rgba(248, 250, 252, 0.85) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
`

// ─── Employee "card" row — achieved with td styling & tr spacing ───────────────
// Each row is visually a card via padding + background. We simulate
// card separation using a margin trick with a transparent "gap" row via CSS.

export const EmployeeCardRow = styled.tr`
  /* Card-like row: rounded corners achieved via first/last td border-radius */
  & td {
    background: #ffffff;
    border-top: 1px solid rgba(226, 232, 240, 0.45);
    border-bottom: 1px solid rgba(226, 232, 240, 0.45);
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }

  /* First td gets left rounding */
  & td:first-child {
    border-left: 1px solid rgba(226, 232, 240, 0.45);
    border-radius: 16px 0 0 16px;
  }

  /* Last td gets right rounding */
  & td:last-child {
    border-right: 1px solid rgba(226, 232, 240, 0.45);
    border-radius: 0 16px 16px 0;
  }

  /* Spacer effect: use outline trick via a separate gap row trick via margin */
  & + & td {
    /* top margin via transparent border — can't do margin on tr, do it via padding-top */
  }

  &:hover td {
    background: #f8faff;
    border-color: rgba(199, 210, 254, 0.6);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
  }
`

// Gap between rows — a spacer "ghost" row
export const RowSpacer = styled.tr`
  height: 6px;
  & td {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    height: 6px;
  }
`

// ─── Sticky name column (card left side) ──────────────────────────────────────
export const StickyNameColumn = styled.td`
  position: sticky;
  left: 0;
  z-index: 3;
  padding: 14px 22px !important;
  min-width: 260px;
  border-right: 1px solid rgba(226, 232, 240, 0.4) !important;
  border-radius: 16px 0 0 16px !important;
  background: #ffffff;
  transition: background 0.2s ease;

  tr:hover & {
    background: #f8faff;
  }
`

export const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const EmployeeName = styled.span`
  font-weight: 750;
  font-size: 14px;
  color: #0f172a;
  line-height: 1.3;
  letter-spacing: -0.015em;
`

export const Position = styled.span`
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.1px;
`

// ─── Day header ────────────────────────────────────────────────────────────────
export const DayHeader = styled.div<{ $isWeekend?: boolean; $isToday?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 4px;
  transition: all 0.2s;

  .day-num {
    font-size: 14px;
    font-weight: 800;
    color: ${({ $isToday, $isWeekend }) =>
      $isToday ? '#2563eb' : $isWeekend ? '#ef4444' : '#1e293b'};
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background: ${({ $isToday, $isWeekend }) =>
      $isToday ? '#eff6ff' : $isWeekend ? 'rgba(239,68,68,0.06)' : 'transparent'};
    border: ${({ $isToday }) =>
      $isToday ? '1.5px solid #3b82f6' : '1.5px solid transparent'};
    box-shadow: ${({ $isToday }) =>
      $isToday ? '0 2px 10px rgba(59, 130, 246, 0.25)' : 'none'};
    transition: all 0.2s;
  }

  .day-short {
    font-size: 9.5px;
    font-weight: 700;
    color: ${({ $isWeekend }) => ($isWeekend ? '#fca5a5' : '#cbd5e1')};
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
`

// ─── Glassmorphism thead th wrapper ───────────────────────────────────────────
export const TheadGlass = styled.thead`
  & th {
    background: rgba(248, 250, 252, 0.75) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
  }
`

// ─── Day column header (non-name) ──────────────────────────────────────────────
export const DayTh = styled.th<{ $isWeekend?: boolean }>`
  background: ${({ $isWeekend }) =>
    $isWeekend
      ? 'rgba(254, 226, 226, 0.3) !important'
      : 'rgba(248, 250, 252, 0.75) !important'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`

// ─── Shift cells ──────────────────────────────────────────────────────────────
export const ShiftCell = styled.td<{
  $type: 'day' | 'night' | 'day-off' | 'empty'
  $isWeekend?: boolean
}>`
  text-align: center;
  vertical-align: middle;
  padding: 8px 5px !important;
  min-width: 58px;
  max-width: 58px;
  border-right: 1px solid rgba(241, 245, 249, 0.7) !important;
  border-radius: 0 !important;
  position: relative;
  transition: background 0.2s ease;

  background: ${({ $type, $isWeekend }) => {
    if ($isWeekend) return 'rgba(254, 242, 242, 0.18)'
    switch ($type) {
      case 'day':     return 'rgba(239, 246, 255, 0.22)'
      case 'night':   return 'rgba(245, 243, 255, 0.22)'
      case 'day-off': return 'rgba(255, 241, 242, 0.22)'
      default:        return 'transparent'
    }
  }};
`

export const ShiftBadge = styled.div<{ $type: 'day' | 'night' | 'day-off' }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 3px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 12px;
  width: 100%;
  height: 46px;
  box-sizing: border-box;
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${popIn} 0.3s ease-out both;
  cursor: default;
  position: relative;

  &:hover {
    transform: scale(1.18) translateY(-3px);
    z-index: 10;
    position: relative;
  }

  ${({ $type }) => {
    switch ($type) {
      case 'day':
        return css`
          background: linear-gradient(145deg, #eff6ff, #dbeafe);
          color: #1d4ed8;
          border: 1px solid rgba(147, 197, 253, 0.7);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.8);
          &:hover {
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.28), 0 0 0 3px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.8);
            border-color: #93c5fd;
            background: linear-gradient(145deg, #dbeafe, #bfdbfe);
          }
        `
      case 'night':
        return css`
          background: linear-gradient(145deg, #f5f3ff, #ede9fe);
          color: #5b21b6;
          border: 1px solid rgba(196, 181, 253, 0.7);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.8);
          &:hover {
            box-shadow: 0 8px 24px rgba(139, 92, 246, 0.28), 0 0 0 3px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.8);
            border-color: #c4b5fd;
            background: linear-gradient(145deg, #ede9fe, #ddd6fe);
          }
        `
      case 'day-off':
        return css`
          background: linear-gradient(145deg, #fff1f2, #fee2e2);
          color: #b91c1c;
          border: 1px solid rgba(252, 165, 165, 0.6);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255,255,255,0.8);
          &:hover {
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.22), 0 0 0 3px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
            border-color: #fca5a5;
            background: linear-gradient(145deg, #fee2e2, #fecaca);
          }
        `
    }
  }}

  .badge-icon {
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 3px;
    letter-spacing: -0.01em;
  }

  .badge-hrs {
    font-size: 10px;
    opacity: 0.75;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
`

export const EmptyCell = styled.span`
  color: #e8edf2;
  font-size: 16px;
  font-weight: 300;
  user-select: none;
`

// ─── Legend ────────────────────────────────────────────────────────────────────
export const LegendBar = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 14px 24px;
  background: rgba(248, 250, 252, 0.8);
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  flex-wrap: wrap;
  border-radius: 0 0 28px 28px;
`

export const LegendItem = styled.div<{ $type: 'day' | 'night' | 'day-off' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: #64748b;

  &::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 6px;
    border: 1.5px solid;
    ${({ $type }) => {
      switch ($type) {
        case 'day':     return 'background: linear-gradient(135deg, #eff6ff, #dbeafe); border-color: #93c5fd;'
        case 'night':   return 'background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-color: #c4b5fd;'
        case 'day-off': return 'background: linear-gradient(135deg, #fff1f2, #fee2e2); border-color: #fca5a5;'
      }
    }}
  }
`

// ─── No data ────────────────────────────────────────────────────────────────────
export const NoDataState = styled.div`
  padding: 80px;
  text-align: center;
  color: #94a3b8;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  svg {
    opacity: 0.25;
    color: #94a3b8;
  }
`