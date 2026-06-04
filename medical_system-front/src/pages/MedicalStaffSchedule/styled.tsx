import styled, { keyframes, css } from 'styled-components'


const FONT_STACK = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'
const GRADIENT_SHIMMER =
  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'

const shimmer = keyframes`
  0%   { background-position: -200% center }
  100% { background-position:  200% center }
`

const shimmerTop = keyframes`
  0%   { background-position: 100% 0%; }
  100% { background-position: -200% 0%; }
`

const gradientText = (gradient: string) => `
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

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

const modalIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const FONT = `'DM Sans', 'Inter', system-ui, sans-serif`
const GRADIENT_ACCENT = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_BUTTON = 'linear-gradient(135deg, #1e40af 0%, #6d28d9 100%)'
const GLASS_BG = 'rgba(255, 255, 255, 0.82)'
const SHADOW_SOFT = '0 8px 32px rgba(15, 23, 42, 0.05)'

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: ${FONT};
  color: #0f172a;
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding-bottom: 40px;

  .desktop-table {
    display: block;
  }
  .mobile-schedule {
    display: none;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 700px) {
    gap: 16px;

    .desktop-table {
      display: none !important;
    }
    .mobile-schedule {
      display: flex !important;
    }
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  border-radius: 18px;
  padding: 20px 24px 18px;
  border-bottom: 1px solid rgba(238, 242, 247, 0.9);
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 23, 42, 0.04);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: ${GRADIENT_ACCENT};
    box-shadow: 2px 0 8px rgba(37, 99, 235, 0.25);
    transition: box-shadow 0.25s ease, width 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${GRADIENT_SHIMMER};
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::before {
    width: 4px;
    box-shadow: 2px 0 14px rgba(37, 99, 235, 0.35);
  }

  &:hover::after {
    opacity: 1;
    animation: ${shimmer} 1.4s ease infinite;
  }

  @media (max-width: 600px) {
    padding: 16px 18px 14px;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const HeaderTitle = styled.h1`
  font-family: ${FONT_STACK};
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.15;
  min-width: 0;

  ${gradientText(`
    linear-gradient(
      135deg,
      #0f172a  0%,
      #1d4ed8 55%,
      #6d28d9 75%,
      #2563eb 100%
    )
  `)}

  filter: drop-shadow(0 1px 2px rgba(37, 99, 235, 0.18));
  transition: filter 0.25s ease, letter-spacing 0.25s ease;

  &:hover {
    filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.28));
    letter-spacing: -0.035em;
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`

export const HeaderSubtitle = styled.p`
  font-family: ${FONT_STACK};
  margin: 4px 0 0;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 400;
  color: #94a3b8;
  letter-spacing: 0.015em;
  line-height: 1.55;
  transition: color 0.2s ease;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #93c5fd, #818cf8);
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 2px;
    opacity: 0.7;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  ${Header}:hover & {
    color: #64748b;

    &::before {
      opacity: 1;
      transform: scale(1.3);
    }
  }

  @media (max-width: 600px) {
    padding-left: 0;
    font-size: 12px;
  }
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

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
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  padding: 8px 16px;
  min-width: 150px;
  text-align: center;
  letter-spacing: -0.02em;

  @media (max-width: 480px) {
    min-width: 120px;
    font-size: 13px;
    padding: 6px 12px;
  }
`

export const NavigationButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
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

export const Toolbar = styled.div`
  display: flex;
  gap: 16px;
  background: ${GLASS_BG};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 16px 24px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    padding: 14px 16px;
    gap: 12px;
  }
`

export const ToolbarLeft = styled.div`
  display: flex;
  gap: 12px;
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
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

export const ExportButton = styled.button<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 700;
  font-family: ${FONT};
  border-radius: 13px;
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

  @media (max-width: 480px) {
    padding: 9px 14px;
    font-size: 12px;
  }
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`

export const StatCard = styled.div<{ $color?: string }>`
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

 &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      color-mix(in srgb, ${({ $color }) => $color || GRADIENT_ACCENT} 20%, transparent) 0%,
      ${({ $color }) => $color || GRADIENT_ACCENT} 50%,
      color-mix(in srgb, ${({ $color }) => $color || GRADIENT_ACCENT} 20%, transparent) 100%
    );
    border-radius: 0 0 4px 4px;
    opacity: 0.85;
  }

  &:hover {
   box-shadow: 0 14px 36px rgba(15, 23, 42, 0.09);
    transform: translateY(-4px);
    border-color: #e2e8f0;
    
    &::before {
      height: 4px;
      opacity: 1;
    }

    &::after {
      opacity: 1;
      animation: ${shimmer} 1.4s ease infinite;
    }
  }

`

export const StatIcon = styled.div<{ $bg?: string; $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || '#eff6ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || '#2563eb'};
  margin-bottom: 4px;
`

export const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.9px;
`

export const StatValue = styled.div`
  font-size: 32px;
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

export const TableWrapper = styled.div`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow:
    0 4px 6px rgba(15, 23, 42, 0.02),
    0 12px 40px rgba(15, 23, 42, 0.06),
    0 40px 80px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 60px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 100%);
    pointer-events: none;
    z-index: 5; 
    border-radius: 0 24px 24px 0;
  }
`

export const TableScrollWrapper = styled.div`
  overflow-x: auto;
  /* clip so that hover effects on ShiftBadge don't escape outside the scroll area */
  overflow-y: visible;

  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
    margin: 0 24px;
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
  min-width: 900px;

  thead th {
    padding: 0;
    text-align: center;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    position: sticky;
    top: 0;
    z-index: 3;
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
  z-index: 10 !important;
  text-align: left !important;
  padding: 16px 20px !important;
  min-width: 220px;
  border-right: 1px solid rgba(226, 232, 240, 0.5) !important;
  font-weight: 700;
  color: #475569;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background: rgba(248, 250, 252, 0.97) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  box-shadow: 2px 0 12px rgba(15,23,42,0.06);
`

export const EmployeeCardRow = styled.tr`
  & td {
    background: #ffffff;
    border-top: 1px solid rgba(226, 232, 240, 0.45);
    border-bottom: 1px solid rgba(226, 232, 240, 0.45);
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }

  & td:first-child {
    border-left: 1px solid rgba(226, 232, 240, 0.45);
    border-radius: 14px 0 0 14px;
  }
  & td:last-child {
    border-right: 1px solid rgba(226, 232, 240, 0.45);
    border-radius: 0 14px 14px 0;
  }

  &:hover td {
    background: #f8faff;
    border-color: rgba(199, 210, 254, 0.6);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
  }
`

// Gap between rows — a spacer "ghost" row
export const RowSpacer = styled.tr`
  height: 5px;
  & td {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    height: 5px;
  }
`

export const StickyNameColumn = styled.td`
  position: sticky;
  left: 0;
  /* IMPORTANT: z-index must be higher than ShiftBadge hover z-index so that
     the badge highlight slides under the name column when scrolling */
  z-index: 4;
  padding: 14px 20px !important;
  min-width: 220px;
  border-right: 1px solid rgba(226, 232, 240, 0.4) !important;
  border-radius: 14px 0 0 14px !important;
  background: #ffffff;
  transition: background 0.2s ease;
  box-shadow: 2px 0 12px rgba(15,23,42,0.05);

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
  font-size: 13.5px;
  color: #0f172a;
  line-height: 1.3;
  letter-spacing: -0.015em;
`

export const Position = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.1px;
`

// ─── Day header ────────────────────────────────────────────────────────────────
export const DayHeader = styled.div<{ $isWeekend?: boolean; $isToday?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 3px;
  transition: all 0.2s;

  .day-num {
    font-size: 13px;
    font-weight: 800;
    color: ${({ $isToday, $isWeekend }) =>
    $isToday ? '#2563eb' : $isWeekend ? '#ef4444' : '#1e293b'};
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: ${({ $isToday, $isWeekend }) =>
    $isToday ? '#eff6ff' : $isWeekend ? 'rgba(239,68,68,0.06)' : 'transparent'};
    border: ${({ $isToday }) =>
    $isToday ? '1.5px solid #3b82f6' : '1.5px solid transparent'};
    box-shadow: ${({ $isToday }) =>
    $isToday ? '0 2px 10px rgba(59, 130, 246, 0.25)' : 'none'};
    transition: all 0.2s;
  }

  .day-short {
    font-size: 9px;
    font-weight: 700;
    color: ${({ $isWeekend }) => ($isWeekend ? '#fca5a5' : '#cbd5e1')};
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
`

// ─── Glassmorphism thead th wrapper ───────────────────────────────────────────
export const TheadGlass = styled.thead`
  & th {
    background: rgba(248, 250, 252, 0.97) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
  }
`

// ─── Day column header (non-name) ──────────────────────────────────────────────
export const DayTh = styled.th<{ $isWeekend?: boolean }>`
  background: ${({ $isWeekend }) =>
    $isWeekend
      ? 'rgba(254, 226, 226, 0.3) !important'
      : 'rgba(248, 250, 252, 0.97) !important'};
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
  padding: 6px 4px !important;
  min-width: 52px;
  max-width: 52px;
  border-right: 1px solid rgba(241, 245, 249, 0.7) !important;
  border-radius: 0 !important;
  /* z-index must be lower than StickyNameColumn */
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: background 0.15s ease;

  background: ${({ $type, $isWeekend }) => {
    if ($isWeekend) return 'rgba(254, 242, 242, 0.18)'
    switch ($type) {
      case 'day': return 'rgba(239, 246, 255, 0.22)'
      case 'night': return 'rgba(245, 243, 255, 0.22)'
      case 'day-off': return 'rgba(255, 241, 242, 0.22)'
      default: return 'transparent'
    }
  }};

  &:hover {
    background: rgba(226, 232, 240, 0.3);
  }
`

export const ShiftBadge = styled.div<{ $type: 'day' | 'night' | 'day-off' }>`
  /* z-index intentionally NOT set to a high value so it stays below StickyNameColumn */
  z-index: 1;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 5px 2px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 12px;
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${popIn} 0.3s ease-out both;
  cursor: pointer;
  position: relative;

  &:hover {
    /* Scale within the cell — clipping handled by table overflow */
    transform: scale(1.12) translateY(-2px);
    z-index: 2;
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
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255,255,255,0.8);
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
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.28), inset 0 1px 0 rgba(255,255,255,0.8);
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
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.22), inset 0 1px 0 rgba(255,255,255,0.8);
            border-color: #fca5a5;
            background: linear-gradient(145deg, #fee2e2, #fecaca);
          }
        `
    }
  }}

  .badge-icon {
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 2px;
    letter-spacing: -0.01em;
  }

  .badge-hrs {
    font-size: 9.5px;
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
export const LegendBar = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
  padding: 12px 22px;
  background: rgba(248, 250, 252, 0.8);
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  flex-wrap: wrap;
  border-radius: 0 0 24px 24px;
`

export const LegendItem = styled.div<{ $type: 'day' | 'night' | 'day-off' }>`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;

  &::before {
    content: '';
    width: 13px;
    height: 13px;
    border-radius: 5px;
    border: 1.5px solid;
    ${({ $type }) => {
    switch ($type) {
      case 'day': return 'background: linear-gradient(135deg, #eff6ff, #dbeafe); border-color: #93c5fd;'
      case 'night': return 'background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-color: #c4b5fd;'
      case 'day-off': return 'background: linear-gradient(135deg, #fff1f2, #fee2e2); border-color: #fca5a5;'
    }
  }}
  }
`

// ─── No data ────────────────────────────────────────────────────────────────────
export const NoDataState = styled.div`
  padding: 60px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

  svg {
    opacity: 0.25;
    color: #94a3b8;
  }
`

// ─── Modal ────────────────────────────────────────────────────────────────────

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${overlayIn} 0.2s ease;
`

export const ShiftModal = styled.div`
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 4px 6px rgba(15, 23, 42, 0.04),
    0 20px 60px rgba(15, 23, 42, 0.18),
    0 0 0 1px rgba(226, 232, 240, 0.8);
  animation: ${modalIn} 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 22px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
`

export const ModalTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
`

export const ModalSubtitle = styled.div`
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
`

export const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ModalTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

export const ModalTypeBtn = styled.button<{ $type: string; $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 13.5px;
  font-weight: 700;
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: 2px solid;

  ${({ $type, $active }) => {
    const styles = {
      day: {
        bg: $active ? '#dbeafe' : '#f8fafc',
        border: $active ? '#3b82f6' : '#e2e8f0',
        color: $active ? '#1d4ed8' : '#475569',
        shadow: $active ? '0 4px 14px rgba(59,130,246,0.22)' : 'none'
      },
      night: {
        bg: $active ? '#ede9fe' : '#f8fafc',
        border: $active ? '#8b5cf6' : '#e2e8f0',
        color: $active ? '#5b21b6' : '#475569',
        shadow: $active ? '0 4px 14px rgba(139,92,246,0.22)' : 'none'
      },
      'day-off': {
        bg: $active ? '#fee2e2' : '#f8fafc',
        border: $active ? '#ef4444' : '#e2e8f0',
        color: $active ? '#b91c1c' : '#475569',
        shadow: $active ? '0 4px 14px rgba(239,68,68,0.18)' : 'none'
      },
      empty: {
        bg: $active ? '#f1f5f9' : '#f8fafc',
        border: $active ? '#94a3b8' : '#e2e8f0',
        color: $active ? '#334155' : '#475569',
        shadow: 'none'
      }
    }
    const s = styles[$type as keyof typeof styles] || styles.empty
    return css`
      background: ${s.bg};
      border-color: ${s.border};
      color: ${s.color};
      box-shadow: ${s.shadow};
    `
  }}

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.97);
  }

  &:active {
    transform: translateY(0);
  }
`

export const ModalHoursRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`

export const ModalHoursLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  flex: 1;
`

export const ModalHoursInput = styled.input`
  width: 64px;
  padding: 6px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  font-family: ${FONT};
  text-align: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  /* Hide number spinner */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
`

export const ModalFooter = styled.div`
  display: flex;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
`

export const ModalCancelBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 18px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  font-family: ${FONT};
  cursor: pointer;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #334155;
  }
`

export const ModalSaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 18px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  font-family: ${FONT};
  cursor: pointer;
  border: none;
  background: ${GRADIENT_ACCENT};
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.32);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex: 2;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.42);
    background: ${GRADIENT_BUTTON};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  }
`

// ─── Mobile cards ──────────────────────────────────────────────────────────────

export const MobileEmployeeCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.09);
  }
`

export const MobileCardHeader = styled.div`
  padding: 14px 18px 12px;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  position: sticky;
  left: 0;
`

export const MobileCardName = styled.div`
  font-size: 14px;
  font-weight: 750;
  color: #0f172a;
  letter-spacing: -0.015em;
  line-height: 1.3;
`

export const MobileCardPosition = styled.div`
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 2px;
`

export const MobileScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 6px;
  padding: 12px 14px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #bfdbfe, #ddd6fe);
    border-radius: 99px;
  }
`

export const MobileDayChip = styled.button<{
  $type: string
  $isWeekend?: boolean
  $isToday?: boolean
}>`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 44px;
  padding: 8px 4px;
  border-radius: 12px;
  border: 1.5px solid;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: ${FONT};
  background: none;

  .mobile-shift-icon {
    font-size: 10px;
    display: flex;
    align-items: center;
    color: inherit;
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.94);
  }

  ${({ $type, $isWeekend, $isToday }) => {
    if ($type === 'day') return css`
      background: linear-gradient(145deg, #eff6ff, #dbeafe);
      border-color: ${$isToday ? '#3b82f6' : 'rgba(147,197,253,0.7)'};
      color: #1d4ed8;
      box-shadow: ${$isToday ? '0 0 0 2px rgba(59,130,246,0.3)' : '0 2px 6px rgba(59,130,246,0.1)'};
    `
    if ($type === 'night') return css`
      background: linear-gradient(145deg, #f5f3ff, #ede9fe);
      border-color: ${$isToday ? '#8b5cf6' : 'rgba(196,181,253,0.7)'};
      color: #5b21b6;
      box-shadow: ${$isToday ? '0 0 0 2px rgba(139,92,246,0.3)' : '0 2px 6px rgba(139,92,246,0.1)'};
    `
    if ($type === 'day-off') return css`
      background: linear-gradient(145deg, #fff1f2, #fee2e2);
      border-color: ${$isToday ? '#ef4444' : 'rgba(252,165,165,0.6)'};
      color: #b91c1c;
      box-shadow: ${$isToday ? '0 0 0 2px rgba(239,68,68,0.25)' : '0 2px 6px rgba(239,68,68,0.08)'};
    `
    // empty
    return css`
      background: ${$isWeekend ? 'rgba(254,242,242,0.3)' : '#f8fafc'};
      border-color: ${$isToday ? '#3b82f6' : ($isWeekend ? 'rgba(252,165,165,0.4)' : '#e8edf2')};
      color: ${$isWeekend ? '#fca5a5' : '#cbd5e1'};
      box-shadow: ${$isToday ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none'};
    `
  }}

  &:hover {
    transform: translateY(-2px) scale(1.04);
    filter: brightness(0.96);
  }
`

export const MobileDayLabel = styled.span<{ $isWeekend?: boolean; $isToday?: boolean }>`
  font-size: 8.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: ${({ $isWeekend, $isToday }) =>
    $isToday ? '#3b82f6' : $isWeekend ? '#fca5a5' : '#94a3b8'};
`

export const MobileDayNum = styled.span<{ $isWeekend?: boolean; $isToday?: boolean }>`
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ $isWeekend, $isToday }) =>
    $isToday ? '#2563eb' : $isWeekend ? '#ef4444' : '#1e293b'};
`