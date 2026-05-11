import styled, { css, keyframes, createGlobalStyle } from 'styled-components'

export const GRADIENT_ACCENT = 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)'
export const GRADIENT_SHIMMER =
  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'
export const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'

export const gradientText = (gradient: string) => css`
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const fadeUp = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

export const subtleFadeUp = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

export const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

export const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
`

export const attentionPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
`

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`

export const overlayFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

export const modalSlide = keyframes`
  from { opacity: 0; transform: translateY(32px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin: 0; background: #f7f8fa; }
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  border-radius: 12px;
  gap: 24px;
  animation: ${fadeUp} 0.3s ease both;
  background: linear-gradient(135deg, #f0f4ff, #f8faff);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);
  position: relative;
`

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${subtleFadeUp} 0.35s ease both;
`

// ─── Cards ────────────────────────────────────────────────────────────────────

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

export const SectionCard = styled(StyledCard)`
  margin: 0;
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

export const SectionCardHeader = styled(CardHeader)``

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Title = styled.h2`

  font-size: 28px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.15;
  ${gradientText('linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #6d28d9 75%, #2563eb 100%)')}
  filter: drop-shadow(0 1px 2px rgba(37, 99, 235, 0.18));
  transition:
    filter 0.25s ease,
    letter-spacing 0.25s ease;

  &:hover {
    filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.28));
    letter-spacing: -0.035em;
  }
`

export const CardSubtitle = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  font-weight: 400;
  color: #94a3b8;
  letter-spacing: 0.015em;

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
  }
`

export const CardContent = styled.div`
  padding: 24px;
`

// ─── Stats grid ───────────────────────────────────────────────────────────────

export const InfoGrid = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: clamp(12px, 2vw, 24px);

@media (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 500px) {
  grid-template-columns: 1fr;
}  
`

export const InfoItem = styled.div`
  width: 100%;
`

export const StatCard = styled.div<{ $accent?: boolean }>`
  background: ${(p) => (p.$accent ? '#111827' : 'linear-gradient(180deg, #ffffff 0%, #f4f9fd 100%)')};;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  border: 1px solid ${(p) => (p.$accent ? 'transparent' : 'rgba(191, 219, 254, 0.4)')};
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);
  cursor: pointer;
  

  &:hover {
    box-shadow:
      0 2px 4px rgba(15, 23, 42, 0.06),
      0 8px 20px rgba(37, 99, 235, 0.07);
    transform: translateY(-1px);
  }
`

export const StatLabel = styled.div<{ $light?: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${(p) => (p.$light ? 'rgba(255,255,255,0.6)' : '#94a3b8')};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const StatValue = styled.div<{ $light?: boolean; $color?: string; $delta?: string }>`
  margin: ${(p) => (p.$delta ? '2px 0' : 'auto 0')};
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${(p) => (p.$light ? '#fff' : p.$color || '#111827')};
  font-variant-numeric: tabular-nums;
`

export const StatDelta = styled.div<{ $positive?: boolean; $light?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${(p) =>
    p.$light ? (p.$positive ? '#86efac' : '#fca5a5') : p.$positive ? '#16a34a' : '#dc2626'};
`

export const ProgressBarWrap = styled.div`
  margin-top: 4px;
`

export const ProgressPct = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
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
  background: #fff;
  border-radius: 3px;
  transform-origin: left;
  transform: scaleX(${(p) => p.$pct / 100});
  transition: transform 0.05s linear;
`

// ─── Section header ───────────────────────────────────────────────────────────

export const SectionHeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
`

export const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.035em;
  ${gradientText(GRADIENT_TITLE)}
`

export const FloorTabs = styled.div`
  display: flex;
  gap: 6px;
`

export const FloorTab = styled.button<{ $active?: boolean }>`
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
  border: 1.5px solid ${(p) => (p.$active ? '#1e40af' : '#e5e7eb')};
  background: ${(p) => (p.$active ? '#1e40af' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#6b7280')};
  cursor: pointer;
  transition: all 0.14s;

  &:hover {
    border-color: #1e40af;
    color: ${(p) => (p.$active ? '#fff' : '#1e40af')};
  }
`

export const FloorContent = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

// ─── Floor stats bar ──────────────────────────────────────────────────────────

export const FloorStatsBar = styled.div`
  display: grid;
  grid-template-columns: 1.2fr repeat(3, 1fr) auto;
  gap: 16px;
  align-items: stretch;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`

export const FloorStat = styled.div<
  { $firstblock?: boolean }>
  `
  display: flex;
  flex-direction: column;
  justify-content: ${(p) => (p.$firstblock ? 'center' : 'flex-start')};
  gap: 6px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  border: 1px solid rgba(191, 219, 254, 0.4);
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: rgba(191, 219, 254, 0.8);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);
    transform: translateY(-2px);
  }
`

export const FloorStatInnerRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #3b82f6;

  svg {
    align-self: center;
  }
`

export const FloorStatLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #64748b;
`

export const FloorStatValue = styled.div<{ $color?: string; $large?: boolean }>`
  font-size: ${(p) => (p.$large ? '32px' : '26px')};
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${(p) => p.$color || '#0f172a'};
  font-variant-numeric: tabular-nums;
  line-height: 1;
`

export const FloorStatSub = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
`

export const ManageBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(191, 219, 254, 0.8);
  background: #fff;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
  min-height: 48px;

  &:hover {
    border-color: #2563eb;
    background: #eff6ff;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 1200px) {
    grid-column: 1 / -1;
    height: auto;
  }
`

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const AlertsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AlertsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #dc2626;
`

export const AlertsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

export const AlertPill = styled.button<{ $gray?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.14s;
  border: 1px solid ${(p) => (p.$gray ? '#e5e7eb' : '#fecaca')};
  background: ${(p) => (p.$gray ? '#f9fafb' : '#fff5f5')};
  color: ${(p) => (p.$gray ? '#6b7280' : '#dc2626')};

  &:hover {
    border-color: ${(p) => (p.$gray ? '#9ca3af' : '#f87171')};
    background: ${(p) => (p.$gray ? '#f3f4f6' : '#fee2e2')};
  }
`

export const AlertNum = styled.span<{ $gray?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  background: ${(p) => (p.$gray ? '#e5e7eb' : '#fee2e2')};
  color: ${(p) => (p.$gray ? '#374151' : '#dc2626')};
  flex-shrink: 0;
`

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 16px;
  align-items: start;
`

export const WardGrid = styled.div`
 display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`

export const WardCard = styled.div<{
  $urgent?: boolean
  $attention?: boolean
  $selected?: boolean
}>`
  background: #fff;
  border: 1.5px solid ${(p) => (p.$urgent ? '#fca5a5' : p.$attention ? '#fde68a' : '#ebebeb')};
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
  position: relative;

  ${(p) =>
    p.$urgent &&
    css`
      animation: ${pulse} 2s infinite;
    `}
  ${(p) =>
    p.$attention &&
    css`
      animation: ${attentionPulse} 2.5s infinite;
    `}

  &:hover {
    border-color: ${(p) => (p.$urgent ? '#f87171' : p.$attention ? '#fbbf24' : '#d1d5db')};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    transform: translateY(-1px);
  }

  ${(p) =>
    p.$selected &&
    css`
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
    `}
`

export const WardCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const WardName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
`

export const WardMeta = styled.div`
  font-size: 13px;
  color: #9ca3af;
  margin-top: 2px;
`

export const StatusBadge = styled.div<{ $urgent?: boolean; $attention?: boolean }>`
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${(p) => (p.$urgent ? '#fee2e2' : p.$attention ? '#fef3c7' : '#f0fdf4')};
  color: ${(p) => (p.$urgent ? '#dc2626' : p.$attention ? '#d97706' : '#16a34a')};
  display: flex;
  align-items: center;
  gap: 4px;
`

export const BedsRow = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`

export const BedChip = styled.div<{ $s: 'free' | 'stable' | 'attention' | 'urgent' | string }>`
  padding: 4px 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1.5px solid;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    transform 0.12s,
    box-shadow 0.12s;
  position: relative;

  color: ${(p) =>
    p.$s === 'free'
      ? '#9ca3af'
      : p.$s === 'urgent'
        ? '#dc2626'
        : p.$s === 'attention'
          ? '#d97706'
          : '#16a34a'};

  border-color: ${(p) =>
    p.$s === 'free'
      ? '#e5e7eb'
      : p.$s === 'urgent'
        ? '#fca5a5'
        : p.$s === 'attention'
          ? '#fde68a'
          : '#bbf7d0'};

  background: ${(p) =>
    p.$s === 'free'
      ? '#f9fafb'
      : p.$s === 'urgent'
        ? '#fff5f5'
        : p.$s === 'attention'
          ? '#fffbeb'
          : '#f0fdf4'};

  ${(p) =>
    p.$s === 'urgent' &&
    css`
      animation: ${pulse} 2s infinite;
    `}
  ${(p) =>
    p.$s === 'attention' &&
    css`
      animation: ${attentionPulse} 2.5s infinite;
    `}

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

// ─── Detail panel ─────────────────────────────────────────────────────────────

export const DetailPanel = styled.div`
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  overflow: hidden;
  position: sticky;
  top: 24px;
  animation: ${slideIn} 0.25s ease both;
`

export const DetailHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%);
`

export const DetailTitle = styled.div`
  font-size: 16.25px;
  font-weight: 700;
  color: #374151;
`

export const DetailId = styled.div`
  font-size: 13.75px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
`

export const PatientBlock = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
`

export const PatientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

export const PatientAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
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
  font-size: 13.75px;
  color: #9ca3af;
  margin-top: 2px;
`

export const UrgentBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #fef2f2, #fff5f5);
  border: 1.5px solid #fca5a5;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #dc2626;
  animation: ${pulse} 2s infinite;
`

export const AttentionBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #fffbeb, #fef9e7);
  border: 1.5px solid #fde68a;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #d97706;
  animation: ${attentionPulse} 2.5s infinite;
`

export const DoctorNoteBlock = styled.div`
  background: #f8faff;
  border: 1px solid #dbeafe;
  border-left: 3px solid #2563eb;
  border-radius: 0 8px 8px 0;
  padding: 10px 12px;
  margin-bottom: 8px;
`

export const RowsDoctorBlock = styled.div`
  display: flex;
  justify-content: start;
`

export const DoctorNoteLabel = styled.div`
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #2563eb;
  margin-bottom: 4px;
`

export const DoctorNoteText = styled.div`
  font-size: 12.5px;
  color: #374151;
  line-height: 1.5;
`

export const SectionDivider = styled.div`
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 10px 16px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`

// ─── Prescription list ────────────────────────────────────────────────────────

export const RxItem = styled.div<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 16px;
  background: ${(p) => (p.$done ? '#f9fafb' : '#fff')};
  transition: background 0.12s;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`

export const RxLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const RxDot = styled.div<{ $done?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid ${(p) => (p.$done ? '#d1d5db' : '#6366f1')};
  background: ${(p) => (p.$done ? '#f3f4f6' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const RxName = styled.div<{ $done?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => (p.$done ? '#9ca3af' : '#374151')};
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
`

export const RxDose = styled.div`
  font-size: 11.5px;
  color: #9ca3af;
`

export const RxTime = styled.div`
  font-size: 12.5px;
  font-weight: 600;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
`

// ─── Meds & Log (sidebar) ─────────────────────────────────────────────────────

export const MedsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 0 16px 12px;
`

export const MedCard = styled.div`
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 8px 10px;
`

export const MedName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`

export const MedQty = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
`

export const LogEntry = styled.div`
  margin: 0 16px 14px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 10px 12px;
`

export const LogWho = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`

export const LogAction = styled.div`
  font-size: 11.5px;
  color: #6b7280;
  margin-top: 2px;
`

export const LogMeta = styled.div`
  font-size: 11.5px;
  color: #9ca3af;
  margin-top: 4px;
  display: flex;
  gap: 10px;
`

// ─── Modal ────────────────────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: ${overlayFade} 0.2s ease both;
  border-radius: 12px;
`

export const Modal = styled.div`
  background: #fff;
  width: 100%;
  border-radius: 20px;
  max-width: 640px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow:
    0 24px 80px rgba(15, 23, 42, 0.2),
    0 8px 32px rgba(37, 99, 235, 0.1);
  animation: ${modalSlide} 0.3s ease both;
  position: sticky;
  top: 50vh;
  transform: translateY(-50%);
  margin: 0 auto;

  /* 1. Увеличиваем общую ширину области скролла, чтобы было место для маневра */
  &::-webkit-scrollbar {
    width: 15px; 
  }

  /* 2. Дорожка остается прозрачной */
  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 12px 0;
  }

  /* 3. Магия смещения ползунка */
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    /* Это свойство заставляет фон не заходить под border */
    background-clip: padding-box; 
    
    /* Делаем прозрачную рамку справа — она и создаст визуальный отступ от края */
    border: 4px solid transparent; 
    /* Можно добавить небольшой отступ и слева, чтобы отделить от контента */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }
`

export const ModalHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f8faff 0%, #fff 60%);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1;
`

export const ModalClose = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.14s;
  color: #6b7280;
  font-size: 16px;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`

export const ModalSection = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
`

export const ModalSectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const RxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ModalRxItem = styled.div<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${(p) => (p.$done ? '#f9fafb' : '#fafbff')};
  border: 1px solid ${(p) => (p.$done ? '#f3f4f6' : '#e0e7ff')};
`

export const ModalRxName = styled.div<{ $done?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => (p.$done ? '#9ca3af' : '#374151')};
  flex: 1;
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
`

export const ModalRxDose = styled.div`
  font-size: 11.5px;
  color: #9ca3af;
  min-width: 48px;
`

export const ModalRxTime = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  min-width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
`

export const ModalMedsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`

export const ModalMedCard = styled.div`
  background: #f8faff;
  border: 1px solid #e0e7ff;
  border-radius: 10px;
  padding: 10px 12px;
`

export const ModalMedName = styled.div`
  font-size: 12.5px;
  font-weight: 700;
  color: #1e40af;
`

export const ModalMedQty = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
`

export const ModalLogEntry = styled.div`
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  padding: 12px 14px;
`
