import styled, { keyframes, css } from 'styled-components'

const FONT = `'DM Sans', 'Inter', system-ui, sans-serif`
const FONT_STACK = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
const GRADIENT_ACCENT = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_BUTTON = 'linear-gradient(135deg, #1e40af 0%, #6d28d9 100%)'
const GLASS_BG = 'rgba(255, 255, 255, 0.88)'
const GRADIENT_SHIMMER = 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'

const shimmer = keyframes`
  0%   { background-position: -200% center }
  100% { background-position:  200% center }
`
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`
const rowIn = keyframes`
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
`
const drawerIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`
const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const modalIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`
const pulseWarn = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.72; }
`

const gradientText = (gradient: string) => `
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: ${FONT};
  color: #0f172a;
  animation: ${fadeIn} 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding-bottom: 48px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
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
    left: 0; top: 12px; bottom: 12px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: ${GRADIENT_ACCENT};
    box-shadow: 2px 0 8px rgba(37, 99, 235, 0.25);
    transition: width 0.2s ease, box-shadow 0.25s ease;
  }
  &:hover::before { width: 4px; box-shadow: 2px 0 14px rgba(37, 99, 235, 0.35); }

  &::after {
    content: '';
    position: absolute; inset: 0;
    background: ${GRADIENT_SHIMMER};
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  &:hover::after { opacity: 1; animation: ${shimmer} 1.4s ease infinite; }

  @media (max-width: 600px) {
    padding: 16px 18px 14px;
    flex-direction: column;
    align-items: flex-start;
  }
`

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const HeaderTitle = styled.h1`
  font-family: ${FONT_STACK};
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.15;
  ${gradientText('linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #6d28d9 75%, #2563eb 100%)')}
  filter: drop-shadow(0 1px 2px rgba(37, 99, 235, 0.18));
  transition: filter 0.25s ease;
  &:hover { filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.28)); }
  @media (max-width: 768px) { font-size: 22px; }
`

export const HeaderSubtitle = styled.p`
  font-family: ${FONT_STACK};
  margin: 0;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 400;
  color: #94a3b8;
  letter-spacing: 0.015em;
  line-height: 1.55;
  &::before {
    content: '';
    display: inline-block;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #93c5fd, #818cf8);
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 2px;
    opacity: 0.7;
  }
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
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
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: ${({ $color }) => $color || '#2563eb'};
    border-radius: 0 0 3px 3px;
    opacity: 0.85;
    transition: height 0.2s;
  }

  &:hover {
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.09);
    transform: translateY(-4px);
    border-color: #e2e8f0;
    &::before { height: 4px; opacity: 1; }
  }
`

export const StatIcon = styled.div<{ $bg?: string; $color?: string }>`
  width: 40px; height: 40px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || '#eff6ff'};
  display: flex; align-items: center; justify-content: center;
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

export const ControlBar = styled.div`
  display: flex;
  gap: 12px;
  background: ${GLASS_BG};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const ControlLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
  min-width: 220px;
  max-width: 340px;
`

export const ControlCenter = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  flex: 2;
  justify-content: center;
`

export const ControlRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
`

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
`

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px 0 38px;
  border-radius: 12px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  background: #ffffff;
  font-size: 13.5px;
  font-family: ${FONT};
  color: #0f172a;
  transition: all 0.2s ease;
  box-sizing: border-box;
  outline: none;

  &::placeholder { color: #94a3b8; }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

export const SearchIcon = styled.div`
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

export const FilterLabel = styled.label`
  font-weight: 700;
  font-size: 12px;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`

export const FilterSelect = styled.select`
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 13px;
  font-family: ${FONT};
  color: #334155;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.08); }
`

export const FilterInput = styled.input`
  height: 36px;
  width: 90px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 13px;
  font-family: ${FONT};
  color: #334155;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.08); }
  &::placeholder { color: #94a3b8; }
`

export const FilterDateInput = styled.input`
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 13px;
  font-family: ${FONT};
  color: #334155;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.08); }
`

export const FilterToggle = styled.button<{ $active?: boolean }>`
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1.5px solid ${({ $active }) => $active ? '#2563eb' : '#e2e8f0'};
  background: ${({ $active }) => $active ? '#eff6ff' : '#ffffff'};
  color: ${({ $active }) => $active ? '#1d4ed8' : '#64748b'};
  font-size: 12.5px;
  font-weight: ${({ $active }) => $active ? '700' : '500'};
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    border-color: #2563eb;
    background: #eff6ff;
    color: #1d4ed8;
  }
`

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 22px;
  font-size: 13.5px;
  font-weight: 700;
  font-family: ${FONT};
  border-radius: 13px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  background: ${GRADIENT_ACCENT};
  color: white;
  letter-spacing: 0.1px;
  box-shadow: 0 4px 18px rgba(37, 99, 235, 0.32), inset 0 1px 0 rgba(255,255,255,0.18);
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.42), inset 0 1px 0 rgba(255,255,255,0.18);
    background: ${GRADIENT_BUTTON};
  }
  &:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2); }
`

export const ExportButton = styled.button<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  font-family: ${FONT};
  border-radius: 11px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  transition: all 0.2s;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    border-color: #2563eb;
    color: #1d4ed8;
    background: #eff6ff;
  }
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
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
`

export const TableScrollWrapper = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar { height: 5px; }
  &::-webkit-scrollbar-track { background: #f8fafc; margin: 0 24px; border-radius: 99px; }
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
  font-family: ${FONT};

  thead th {
    padding: 0;
    text-align: left;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    position: sticky;
    top: 0;
    z-index: 3;
  }

  tbody tr {
    animation: ${rowIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
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

export const Th = styled.th<{ $align?: 'left' | 'center' | 'right'; $minWidth?: string }>`
  padding: 14px 16px !important;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-align: ${({ $align }) => $align || 'left'} !important;
  background: rgba(248, 250, 252, 0.97) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  white-space: nowrap;
  min-width: ${({ $minWidth }) => $minWidth || 'auto'};
  user-select: none;
`

export const Td = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  padding: 14px 16px !important;
  text-align: ${({ $align }) => $align || 'left'};
  vertical-align: middle;
  border-top: 1px solid rgba(241, 245, 249, 0.8);
  color: #334155;
  font-size: 13px;
`

export const Tr = styled.tr<{ $status?: 'norm' | 'low' | 'empty' }>`
  cursor: pointer;
  transition: all 0.18s ease;

  background: ${({ $status }) => {
    if ($status === 'empty') return 'rgba(255, 241, 242, 0.5)'
    if ($status === 'low') return 'rgba(255, 251, 235, 0.5)'
    return '#ffffff'
  }};

  &:hover {
    background: ${({ $status }) => {
      if ($status === 'empty') return 'rgba(255, 228, 230, 0.7)'
      if ($status === 'low') return 'rgba(254, 243, 199, 0.7)'
      return '#f8faff'
    }};
    td { border-color: rgba(199, 210, 254, 0.5); }
  }

  &:hover td:first-child {
    box-shadow: inset 3px 0 0 ${({ $status }) => {
      if ($status === 'empty') return '#ef4444'
      if ($status === 'low') return '#f59e0b'
      return '#2563eb'
    }};
  }
`

export const DrugName = styled.div`
  font-weight: 700;
  font-size: 13.5px;
  color: #0f172a;
  line-height: 1.3;
  letter-spacing: -0.01em;
`

export const DrugCategory = styled.div`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 2px;
`

export const BalanceCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
`

export const BalanceValue = styled.span<{ $status: 'norm' | 'low' | 'empty' }>`
  font-weight: 800;
  font-size: 15px;
  color: ${({ $status }) => {
    if ($status === 'empty') return '#ef4444'
    if ($status === 'low') return '#f59e0b'
    return '#0f172a'
  }};
`

export const BalanceUnit = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 3px;
`

export const BalanceBar = styled.div`
  height: 4px;
  border-radius: 99px;
  background: #f1f5f9;
  overflow: hidden;
  width: 100%;
`

export const BalanceFill = styled.div<{ $pct: number; $status: 'norm' | 'low' | 'empty' }>`
  height: 100%;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  border-radius: 99px;
  background: ${({ $status }) => {
    if ($status === 'empty') return '#ef4444'
    if ($status === 'low') return '#f59e0b'
    return 'linear-gradient(90deg, #2563eb, #7c3aed)'
  }};
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`

export const StatusBadge = styled.span<{ $status: 'norm' | 'low' | 'empty' }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
  white-space: nowrap;

  ${({ $status }) => {
    if ($status === 'empty') return css`
      background: #fef2f2; color: #dc2626;
      border: 1px solid rgba(252, 165, 165, 0.6);
      animation: ${pulseWarn} 2.5s ease-in-out infinite;
    `
    if ($status === 'low') return css`
      background: #fffbeb; color: #d97706;
      border: 1px solid rgba(253, 211, 77, 0.7);
      animation: ${pulseWarn} 3s ease-in-out infinite;
    `
    return css`
      background: #f0fdf4; color: #16a34a;
      border: 1px solid rgba(134, 239, 172, 0.6);
    `
  }}
`

export const OperationBadge = styled.span<{ $type: 'receipt' | 'writeoff' | 'adjustment' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;

  ${({ $type }) => {
    if ($type === 'receipt') return css`
      background: #f0fdf4; color: #16a34a;
      border: 1px solid rgba(134, 239, 172, 0.5);
    `
    if ($type === 'writeoff') return css`
      background: #fef2f2; color: #dc2626;
      border: 1px solid rgba(252, 165, 165, 0.5);
    `
    return css`
      background: #eff6ff; color: #2563eb;
      border: 1px solid rgba(147, 197, 253, 0.5);
    `
  }}
`

export const DateCell = styled.span`
  font-size: 12.5px;
  color: #64748b;
  white-space: nowrap;
`

export const NullCell = styled.span`
  font-size: 12px;
  color: #cbd5e1;
`

export const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  flex-wrap: wrap;
  gap: 12px;
`

export const PaginationInfo = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const PageBtn = styled.button<{ $active?: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => $active ? '#2563eb' : '#e2e8f0'};
  background: ${({ $active }) => $active ? '#2563eb' : '#ffffff'};
  color: ${({ $active }) => $active ? '#ffffff' : '#475569'};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
  font-family: ${FONT};
  &:hover:not(:disabled) {
    border-color: #2563eb;
    background: ${({ $active }) => $active ? '#1d4ed8' : '#eff6ff'};
    color: ${({ $active }) => $active ? '#ffffff' : '#2563eb'};
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const PageSizeSelect = styled.select`
  height: 34px;
  padding: 0 8px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 13px;
  font-family: ${FONT};
  color: #334155;
  cursor: pointer;
  outline: none;
`

export const NoData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 14px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`

export const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  z-index: 100;
  animation: ${overlayIn} 0.25s ease forwards;
  backdrop-filter: blur(2px);
`

export const DrawerPanel = styled.div`
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 540px;
  max-width: 95vw;
  background: #ffffff;
  box-shadow: -8px 0 40px rgba(15, 23, 42, 0.15);
  z-index: 101;
  display: flex;
  flex-direction: column;
  animation: ${drawerIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  border-radius: 18px 0 0 18px;
  overflow: hidden;
`

export const DrawerHeader = styled.div`
  padding: 22px 24px 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  flex-shrink: 0;
`

export const DrawerTitle = styled.h2`
  font-family: ${FONT_STACK};
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.25;
`

export const DrawerSubtitle = styled.p`
  font-size: 12.5px;
  color: #94a3b8;
  margin: 4px 0 0;
  font-weight: 500;
`

export const DrawerCloseBtn = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  width: 36px; height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.18s;
  flex-shrink: 0;
  &:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
`

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  padding: 0 24px;
  flex-shrink: 0;
  background: #fafbff;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`

export const TabBtn = styled.button<{ $active?: boolean }>`
  padding: 13px 16px;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '700' : '500'};
  font-family: ${FONT};
  color: ${({ $active }) => $active ? '#2563eb' : '#64748b'};
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 7px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2.5px;
    background: #2563eb;
    border-radius: 2px 2px 0 0;
    transform: scaleX(${({ $active }) => $active ? '1' : '0'});
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: left;
  }

  &:hover { color: #2563eb; }
`

export const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: #f8fafc; border-radius: 99px; }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #bfdbfe, #ddd6fe);
    border-radius: 99px;
  }
`

export const OverviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 4px;
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const InfoCard = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 14px 16px;
`

export const InfoCardLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 5px;
`

export const InfoCardValue = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
`

export const InfoCardSub = styled.div`
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 2px;
`

export const DescriptionBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 13.5px;
  line-height: 1.6;
  color: #475569;
  border: 1px solid #f1f5f9;
`

export const DrawerBalanceBar = styled.div`
  height: 8px;
  border-radius: 99px;
  background: #f1f5f9;
  overflow: hidden;
  margin-top: 8px;
`

export const DrawerBalanceFill = styled.div<{ $pct: number; $status: 'norm' | 'low' | 'empty' }>`
  height: 100%;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  border-radius: 99px;
  background: ${({ $status }) => {
    if ($status === 'empty') return '#ef4444'
    if ($status === 'low') return 'linear-gradient(90deg, #f59e0b, #f97316)'
    return 'linear-gradient(90deg, #2563eb, #7c3aed)'
  }};
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
`

export const WarningAlert = styled.div<{ $level: 'warning' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid;

  ${({ $level }) => $level === 'error' ? css`
    background: #fef2f2;
    color: #dc2626;
    border-color: rgba(252, 165, 165, 0.7);
  ` : css`
    background: #fffbeb;
    color: #d97706;
    border-color: rgba(253, 211, 77, 0.7);
  `}
`

export const ActionButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`

export const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 11px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  font-size: 13px;
  font-weight: 700;
  font-family: ${FONT};
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #2563eb; color: #1d4ed8; background: #eff6ff; }
`

export const DeleteBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 11px;
  border: 1.5px solid #fca5a5;
  background: #fef2f2;
  font-size: 13px;
  font-weight: 700;
  font-family: ${FONT};
  color: #dc2626;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #ef4444; background: #fee2e2; color: #b91c1c; }
`

export const FormGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 1}, 1fr);
  gap: 16px;
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const FormInput = styled.input`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  font-size: 14px;
  font-family: ${FONT};
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  width: 100%;
  &::placeholder { color: #94a3b8; }
  &:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08); }
  &:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
`

export const FormSelect = styled.select`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  font-size: 14px;
  font-family: ${FONT};
  color: #0f172a;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  &:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08); }
`

export const FormTextArea = styled.textarea`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  font-size: 14px;
  font-family: ${FONT};
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
  resize: vertical;
  min-height: 80px;
  width: 100%;
  box-sizing: border-box;
  &::placeholder { color: #94a3b8; }
  &:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08); }
`

export const AutoFillInfo = styled.div`
  background: #f0fdf4;
  border: 1px solid rgba(134, 239, 172, 0.5);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12.5px;
  color: #16a34a;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ErrorAlert = styled.div`
  background: #fef2f2;
  border: 1.5px solid #fca5a5;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: #dc2626;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`

export const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  border: none;
  background: ${GRADIENT_ACCENT};
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(37, 99, 235, 0.38); background: ${GRADIENT_BUTTON}; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`

export const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #94a3b8; color: #334155; background: #f8fafc; }
`

export const PatientSearchWrapper = styled.div`
  position: relative;
`

export const PatientDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0; right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
`

export const PatientOption = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
  &:hover { background: #eff6ff; }

  &:not(:last-child) { border-bottom: 1px solid #f1f5f9; }
`

export const PatientOptionName = styled.div`
  font-weight: 600;
  color: #0f172a;
`

export const PatientOptionInfo = styled.div`
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 2px;
`

export const HistorySearch = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
`

export const HistoryTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12.5px;
  font-family: ${FONT};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
`

export const HTh = styled.th<{ $align?: string }>`
  padding: 10px 12px;
  background: #f8fafc;
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  text-align: ${({ $align }) => $align || 'left'};
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
`

export const HTd = styled.td<{ $align?: string }>`
  padding: 10px 12px;
  text-align: ${({ $align }) => $align || 'left'};
  border-top: 1px solid #f8fafc;
  color: #334155;
  vertical-align: middle;
`

export const HTr = styled.tr<{ $type?: 'receipt' | 'writeoff' | 'adjustment' }>`
  background: #ffffff;
  transition: background 0.15s;

  &:hover {
    background: ${({ $type }) => {
      if ($type === 'receipt') return '#f0fdf4'
      if ($type === 'writeoff') return '#fef2f2'
      return '#eff6ff'
    }};
  }
`

export const HistoryPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  flex-wrap: wrap;
  gap: 8px;
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${overlayIn} 0.2s ease forwards;
  backdrop-filter: blur(4px);
`

export const Modal = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.2);
  max-width: 520px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${modalIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`

export const ModalHeader = styled.div`
  padding: 22px 24px 18px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`

export const ModalTitle = styled.h3`
  font-family: ${FONT_STACK};
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.03em;
`

export const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ModalFooter = styled.div`
  padding: 16px 24px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  border-top: 1px solid #f1f5f9;
`

export const ConfirmDeleteText = styled.p`
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
`

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 11px;
  border: none;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4); }
`

export const ArchiveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 11px;
  border: 1.5px solid #fca5a5;
  background: #fef2f2;
  color: #dc2626;
  font-size: 13px;
  font-weight: 700;
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #fee2e2; border-color: #ef4444; }
`

export const CloseBtn = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  width: 34px; height: 34px;
  border-radius: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.18s;
  flex-shrink: 0;
  &:hover { background: #f1f5f9; color: #334155; }
`

export const DrawerFormFooter = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 4px;
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
  padding-top: 16px;
`
