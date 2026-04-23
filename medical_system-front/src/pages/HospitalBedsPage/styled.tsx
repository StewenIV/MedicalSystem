import styled, { css, keyframes } from 'styled-components'

type BedStatus = 'stable' | 'attention' | 'urgent' | 'free' | string

const statusColors: Record<string, { border: string; bg: string }> = {
  stable: { border: '#22c55e', bg: '#f0fdf4' },
  attention: { border: '#eab308', bg: '#fefce8' },
  urgent: { border: '#ef4444', bg: '#fef2f2' },
  free: { border: '#d1d5db', bg: '#f9fafb' }
}

const avatarColors: Record<string, string> = {
  stable: '#16a34a',
  attention: '#ca8a04',
  urgent: '#dc2626'
}

const FONT_STACK = `
  'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont,
  'Segoe UI', system-ui, sans-serif
`

const FONT = `'Geist', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'
const GRADIENT_ACCENT = 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_SHIMMER =
  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'

const shimmer = keyframes`
  0%   { background-position: -200% center }
  100% { background-position:  200% center }
`

const subtleFadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px) }
  to   { opacity: 1; transform: translateY(0)   }
`

const gradientText = (gradient: string) => css`
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const PageWrapper = styled.div`
  display: flex;
  border-radius: 12px;
  flex-direction: column;
  min-height: 100vh;
  background: #f7f8fa;
  font-family: ${FONT};
  animation: ${fadeUp} 0.3s ease both;
`

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${subtleFadeUp} 0.35s ease both;
`

export const StyledCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(191, 219, 254, 0.7);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.06),
    0 20px 40px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  transition:
    box-shadow 0.25s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow:
      0 2px 4px rgba(15, 23, 42, 0.06),
      0 8px 24px rgba(37, 99, 235, 0.08),
      0 24px 48px rgba(15, 23, 42, 0.07);
    transform: translateY(-1px);
  }
`

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
`

export const Title = styled.h2`
  font-family: ${FONT_STACK};
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.15;

  ${gradientText(`
    linear-gradient(
      135deg,
      #0f172a  0%,
      #1d4ed8 45%,
      #6d28d9 75%,
      #2563eb 100%
    )
  `)}

  filter: drop-shadow(0 1px 2px rgba(37, 99, 235, 0.18));

  transition:
    filter 0.25s ease,
    letter-spacing 0.25s ease;

  &:hover {
    filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.28));
    letter-spacing: -0.035em;
  }
`

export const CardContent = styled.div`
  padding: 24px;
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

export const InfoText = styled.div``

export const InfoLabel = styled.div`
  font-family: ${FONT_STACK};
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.4;
  transition: color 0.2s ease;

  &::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 1px;
    background: linear-gradient(90deg, #bfdbfe, transparent);
    vertical-align: middle;
    margin-right: 6px;
    margin-bottom: 1px;
    opacity: 0.8;
    transition: width 0.2s ease;
  }

  ${InfoItem}:hover & {
    color: #64748b;
    &::before {
      width: 5px;
    }
  }

  @media (max-width: 768px) {
    &::before {
      display: none;
    }
  }
`

export const InfoValue = styled.div`
  font-family: ${FONT_STACK};
  font-size: 25px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.3;
  transition:
    color 0.2s ease,
    letter-spacing 0.2s ease;

  font-variant-numeric: tabular-nums;

  ${InfoItem}:hover & {
    color: #1e40af;
    letter-spacing: -0.02em;
  }

  &::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 1px;
    background: transparent;
    vertical-align: middle;
    margin-right: 6px;
    margin-bottom: 1px;
  }

  @media (max-width: 768px) {
    &::before {
      display: none;
    }
  }
`

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  margin-top: 16px;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow:
      0 2px 4px rgba(15, 23, 42, 0.06),
      0 8px 20px rgba(37, 99, 235, 0.07);
  }
`

export const CardHeader = styled.div`
  padding: 18px 24px 16px;
  border-bottom: 1px solid rgba(238, 242, 247, 0.9);
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);
  border-radius: 12px 12px 0 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    background: ${GRADIENT_ACCENT};
    border-radius: 0 3px 3px 0;
    box-shadow: 2px 0 8px rgba(37, 99, 235, 0.25);
    transition:
      box-shadow 0.25s ease,
      width 0.2s ease;
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
`

export const CardTitle = styled.h3`
  font-family: ${FONT_STACK};
  margin: 0;
  padding-left: 10px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.2;

  ${gradientText(GRADIENT_TITLE)}

  filter: drop-shadow(0 1px 1px rgba(15, 23, 42, 0.08));

  transition:
    filter 0.25s ease,
    letter-spacing 0.25s ease;

  ${CardHeader}:hover & {
    filter: drop-shadow(0 2px 6px rgba(37, 99, 235, 0.2));
    letter-spacing: -0.03em;
  }
`

export const CardSubtitle = styled.p`
  font-family: ${FONT_STACK};
  margin: 6px 0 0;
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
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  ${CardHeader}:hover & {
    color: #64748b;

    &::before {
      opacity: 1;
      transform: scale(1.3);
    }
  }
`

export const CardBody = styled.div<{ $noPadding?: boolean }>`
  padding: ${(p) => (p.$noPadding ? '16px' : '24px')};
  display: flex;
  flex-direction: column;
  gap: 25px;
  flex: 1;
`

export const FieldLabel = styled.label`
  font-family: ${FONT_STACK};
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
  transition: color 0.2s ease;
`

export const FieldLabelIcon = styled.label`
  font-family: ${FONT_STACK};
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 12px;
  transition: color 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #475569;
    svg {
      transform: scale(1.1);
    }
  }
`

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 1.2fr;
  gap: 12px;
`

export const StatCard = styled.div<{ $accent?: boolean }>`
  background: ${(p) => (p.$accent ? '#111827' : '#ffffff')};
  border: 1px solid ${(p) => (p.$accent ? 'transparent' : '#ebebeb')};
  border-radius: 12px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);
  &:hover {
    box-shadow:
      0 2px 4px rgba(15, 23, 42, 0.06),
      0 8px 20px rgba(37, 99, 235, 0.07);
  }

  justify-content: flex-start;
`

export const StatLabel = styled.div<{ $light?: boolean }>`
  font-family: ${FONT_STACK};
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.4;
  transition: color 0.2s ease;

  ${InfoItem}:hover & {
    color: #64748b;
    &::before {
      width: 5px;
    }
  }

  @media (max-width: 768px) {
    &::before {
      display: none;
    }
  }
`

export const StatValue = styled.div<{ $light?: boolean; $color?: string }>`
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${(p) => (p.$light ? '#fff' : p.$color || '#111827')};
  margin: 2px 0;
`

export const StatDelta = styled.div<{ $positive?: boolean; $light?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${(p) =>
    p.$light ? (p.$positive ? '#86efac' : '#fca5a5') : p.$positive ? '#16a34a' : '#dc2626'};
`

export const ProgressBarWrap = styled.div`
  margin-top: 8px;
`

export const ProgressTrack = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
`

export const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: 100%;
  background: #fff;
  border-radius: 3px;
  transform-origin: left;

  /* Текущее состояние от JS */
  transform: scaleX(${(p) => p.$pct / 100});

  /* Очень быстрый переход для плавности цифр */
  transition: transform 0.05s linear;
`

export const ProgressPct = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
`

// ─── Section header ───────────────────────────────────────────────────────────

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const SectionTitle = styled.h2`
  color: #111827;
  letter-spacing: -0.03em;
  margin: 0;
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
`

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FilterChip = styled.button<{ $active?: boolean }>`
  padding: 5px 14px;
  border-radius: 20px;
  font-family: ${FONT};
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid ${(p) => (p.$active ? '#111827' : '#e5e7eb')};
  background: ${(p) => (p.$active ? '#111827' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#6b7280')};
  cursor: pointer;
  transition: all 0.14s;
  &:hover {
    border-color: #111827;
    color: ${(p) => (p.$active ? '#fff' : '#111827')};
  }
`

export const DeptFilter = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  font-family: ${FONT};
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.14s;
  &:hover {
    border-color: #9ca3af;
  }
`

export const FloorStats = styled.div`
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 32px;
`

export const FloorStatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:first-child {
    border-right: 1px solid #f3f4f6;
    padding-right: 24px;
  }
`

export const FloorStatLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
`

export const FloorStatValue = styled.div<{ $color?: string; $large?: boolean }>`
  font-size: ${(p) => (p.$large ? '26px' : '18px')};
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${(p) => p.$color || '#111827'};
`

export const FloorStatSub = styled.div`
  font-size: 11.5px;
  color: #6b7280;
  margin-top: 1px;
`

export const ManageBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.14s;
  &:hover {
    border-color: #9ca3af;
    background: #f9fafb;
  }
`

// ─── Problem alerts ───────────────────────────────────────────────────────────

export const AlertsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AlertsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #dc2626;
`

export const AlertsRow = styled.div`
  display: flex;
  gap: 8px;
`

export const AlertPill = styled.button<{ $variant?: 'red' | 'gray' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: ${FONT};
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.14s;
  border: 1px solid ${(p) => (p.$variant === 'gray' ? '#e5e7eb' : '#fecaca')};
  background: ${(p) => (p.$variant === 'gray' ? '#f9fafb' : '#fff5f5')};
  color: ${(p) => (p.$variant === 'gray' ? '#6b7280' : '#dc2626')};

  &:hover {
    border-color: ${(p) => (p.$variant === 'gray' ? '#9ca3af' : '#f87171')};
    background: ${(p) => (p.$variant === 'gray' ? '#f3f4f6' : '#fee2e2')};
  }
`

export const AlertNum = styled.span<{ $variant?: 'red' | 'gray' }>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: ${(p) => (p.$variant === 'gray' ? '#e5e7eb' : '#fee2e2')};
  color: ${(p) => (p.$variant === 'gray' ? '#374151' : '#dc2626')};
  flex-shrink: 0;
`

// ─── Two-column layout ────────────────────────────────────────────────────────

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;
`

// ─── Ward grid ────────────────────────────────────────────────────────────────

export const WardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`

export const WardCard = styled.div<{ $alert?: boolean; $urgent?: boolean }>`
  background: #fff;
  border: 1.5px solid ${(p) => (p.$urgent ? '#fca5a5' : p.$alert ? '#fecaca' : '#ebebeb')};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  position: relative;

  &:hover {
    border-color: ${(p) => (p.$urgent ? '#f87171' : p.$alert ? '#f87171' : '#d1d5db')};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }
`

export const WardCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
`

export const WardName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
`

export const WardMeta = styled.div`
  font-size: 11.5px;
  color: #9ca3af;
  margin-bottom: 12px;
`

export const WardAlertIcon = styled.div`
  color: #f59e0b;
  line-height: 0;
`

export const BedsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

export const BedChip = styled.div<{ $status: 'occupied' | 'empty' | 'alert' | 'urgent' }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1.5px solid;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${(p) => {
    if (p.$status === 'empty') return '#6b7280'
    if (p.$status === 'alert') return '#d97706'
    if (p.$status === 'urgent') return '#dc2626'
    return '#16a34a'
  }};
  border-color: ${(p) => {
    if (p.$status === 'empty') return '#e5e7eb'
    if (p.$status === 'alert') return '#fcd34d'
    if (p.$status === 'urgent') return '#fecaca'
    return '#bbf7d0'
  }};
  background: ${(p) => {
    if (p.$status === 'empty') return '#f9fafb'
    if (p.$status === 'alert') return '#fef3c7'
    if (p.$status === 'urgent') return '#fff5f5'
    return '#f0fdf4'
  }};
  transition: transform 0.12s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`

// ─── Detail panel ─────────────────────────────────────────────────────────────

export const DetailPanel = styled.div`
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  overflow: hidden;
  position: sticky;
  top: 80px;
`

export const DetailHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const DetailTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`

export const DetailId = styled.div`
  font-size: 11.5px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
`

export const PatientBlock = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
`

export const PatientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`

export const PatientAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #4338ca;
  flex-shrink: 0;
`

export const PatientName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
`

export const PatientMeta = styled.div`
  font-size: 11.5px;
  color: #9ca3af;
  margin-top: 1px;
`

export const TagRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

export const Tag = styled.span<{ $color?: 'blue' | 'red' | 'gray' }>`
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  ${(p) => {
    if (p.$color === 'red') return 'background:#fee2e2;color:#991b1b;'
    if (p.$color === 'blue') return 'background:#dbeafe;color:#1e40af;'
    return 'background:#f3f4f6;color:#374151;'
  }}
`

export const DetailGrid = styled.div`
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  border-bottom: 1px solid #f3f4f6;
`

export const DetailField = styled.div``

export const DetailFieldLabel = styled.div`
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 3px;
`

export const DetailFieldValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`

export const ActionRow = styled.div`
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-bottom: 1px solid #f3f4f6;
`

export const ActionBtn = styled.button<{ $variant?: 'outline' | 'ghost' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: ${FONT};
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.14s;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  &:hover {
    border-color: #9ca3af;
    background: #f9fafb;
  }
`

// ─── Prescription sheet ───────────────────────────────────────────────────────

export const RxSection = styled.div`
  padding: 14px 16px;
`

export const RxSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`

export const RxGroup = styled.div`
  margin-bottom: 10px;
`

export const RxGroupTitle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 7px;
  border: none;
  background: #f9fafb;
  font-family: ${FONT};
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.14s;
  &:hover {
    background: #f3f4f6;
  }

  svg {
    opacity: 0.5;
  }
`

export const RxItem = styled.div<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 7px;
  color: ${(p) => (p.$done ? '#9ca3af' : '#374151')};
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
  font-size: 12.5px;
  transition: background 0.12s;
  &:hover {
    background: #f9fafb;
  }
`

export const RxItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const RxTime = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  min-width: 36px;
  text-align: right;
`

export const RxStatusIcon = styled.div<{ $done?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${(p) => (p.$done ? '#d1d5db' : '#e5e7eb')};
  color: ${(p) => (p.$done ? '#9ca3af' : '#d1d5db')};
  flex-shrink: 0;
`

// ─── Warning block ────────────────────────────────────────────────────────────

export const WarningBlock = styled.div`
  margin: 0 16px 16px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  display: flex;
  gap: 8px;
`

export const WarningText = styled.div`
  font-size: 12px;
  color: #92400e;
  line-height: 1.5;
  flex: 1;

  strong {
    display: block;
    font-weight: 600;
    margin-bottom: 2px;
  }
`

// ─── Drawer (Боковая панель с деталями пациента) ──────────────────────────

export const DrawerOverlay = styled.div<{ $open?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
  z-index: 99;
`

export const Drawer = styled.div<{ $open?: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow-y: auto;
  transform: translateX(${(p) => (p.$open ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    width: 100%;
  }
`

export const DrawerHeader = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);
  position: sticky;
  top: 0;
  z-index: 10;
`

export const DrawerPatientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

export const DrawerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #4338ca;
  flex-shrink: 0;
  font-family: ${FONT_STACK};
`

export const DrawerPatientName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
`

export const DrawerPatientSub = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
`

export const DrawerCloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.14s;

  &:hover {
    border-color: #9ca3af;
    background: #f9fafb;
  }
`

export const StatusBanner = styled.div<{ $status?: 'stable' | 'attention' | 'urgent' | 'free' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 10px;

  ${(p) => {
    if (p.$status === 'urgent')
      return 'background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;'
    if (p.$status === 'attention')
      return 'background: #fefce8; border: 1px solid #fde68a; color: #78350f;'
    if (p.$status === 'stable')
      return 'background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;'
    return 'background: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;'
  }}
`

export const DrawerBody = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const DrawerSection = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 20px;
  }
`

export const DrawerSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`

export const DrawerSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AttentionBlock = styled.div`
  margin: 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`

export const AttentionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #991b1b;
  margin-bottom: 4px;
`

export const AttentionText = styled.div`
  font-size: 11.5px;
  color: #7c2d12;
  line-height: 1.5;
`

export const RxRow = styled.div<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  background: ${(p) => (p.$done ? '#f9fafb' : '#ffffff')};
  color: ${(p) => (p.$done ? '#9ca3af' : '#374151')};
  transition: background 0.12s;

  &:hover {
    background: #f9fafb;
  }
`

export const RxCheck = styled.button<{ $done?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid ${(p) => (p.$done ? '#d1d5db' : '#e5e7eb')};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => (p.$done ? '#9ca3af' : '#d1d5db')};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.14s;

  &:hover {
    border-color: #9ca3af;
  }
`

export const RxInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const RxName = styled.div<{ $done?: boolean }>`
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
`

export const RxDrug = styled.div`
  font-size: 11px;
  color: #9ca3af;
`

export const RxTimeTag = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  min-width: 40px;
  text-align: right;
`

export const StockGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

export const StockItem = styled.div<{ $low?: boolean }>`
  padding: 12px 10px;
  border-radius: 8px;
  background: ${(p) => (p.$low ? '#fff5f5' : '#f9fafb')};
  border: 1px solid ${(p) => (p.$low ? '#fecaca' : '#e5e7eb')};
  transition: all 0.12s;

  &:hover {
    border-color: ${(p) => (p.$low ? '#f87171' : '#9ca3af')};
  }
`

export const StockName = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`

export const StockQty = styled.div<{ $low?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => (p.$low ? '#dc2626' : '#111827')};
  line-height: 1;
`

export const StockUnit = styled.span`
  font-size: 11px;
  color: #9ca3af;
  margin-left: 4px;
  font-weight: 500;
`

export const LogItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`

export const LogDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  margin-top: 5px;
  flex-shrink: 0;
`

export const LogText = styled.div`
  flex: 1;
  font-size: 12px;
  color: #374151;
  line-height: 1.5;

  strong {
    font-weight: 600;
  }
`

export const LogTime = styled.div`
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
  margin-left: 8px;
`

export const DrawerFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  position: sticky;
  bottom: 0;
  background: #fff;
`

export const DrawerBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  font-family: ${FONT};
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${(p) => (p.$primary ? 'transparent' : '#e5e7eb')};
  background: ${(p) => (p.$primary ? '#111827' : '#fff')};
  color: ${(p) => (p.$primary ? '#fff' : '#374151')};
  cursor: pointer;
  transition: all 0.14s;

  &:hover {
    ${(p) =>
      p.$primary
        ? 'background: #1f2937; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
        : 'border-color: #9ca3af; background: #f9fafb;'}
  }
`

// ─── Floor sections ───────────────────────────────────────────────────────────

export const FloorSection = styled.div`
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  }
`

export const FloorHeader = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%, #e8f2ff 100%);
  }
`

export const FloorTitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
`

export const FloorNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
`

export const FloorTitleText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
`

export const FloorStatsMini = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`

export const FloorStatMini = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`

export const FloorStatMiniLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
`

export const FloorStatMiniValue = styled.div<{ $color?: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => p.$color || '#111827'};
  letter-spacing: -0.02em;
`

export const FloorBody = styled.div`
  padding: 16px 20px;
  background: #ffffff;
`
