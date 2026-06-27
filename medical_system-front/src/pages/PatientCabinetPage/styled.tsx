import styled, { keyframes, css } from 'styled-components'
import Input from 'components/Input'

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
const GRADIENT_ACCENT = 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_SHIMMER =
  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'

const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'
const FONT_STACK = `
  'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont,
  'Segoe UI', system-ui, sans-serif
`
const gradientText = (gradient: string) => css`
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

// Design tokens
const C = {
  bg: '#F8FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border: 'rgba(15, 23, 42, 0.07)',
  borderMed: 'rgba(15, 23, 42, 0.12)',

  blue: '#2563EB',
  blueLight: '#EFF6FF',
  blueMid: '#DBEAFE',
  blueDark: '#1E3A8A',

  violet: '#7C3AED',
  violetLight: '#F5F3FF',

  emerald: '#059669',
  emeraldLight: '#ECFDF5',

  amber: '#D97706',
  amberLight: '#FFFBEB',

  red: '#DC2626',
  redLight: '#FEF2F2',

  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9'
}

const rise = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const popUp = keyframes`
  0%   { opacity: 0; transform: scale(0.96) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: ${FONT};
  color: ${C.slate900};
  animation: ${rise} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 48px;
  background: ${C.bg};
  min-height: 100vh;
`

// ─── HEADER ──────────────────────────────────────────────────────────────────

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  background: ${C.surface};
  border-radius: 16px;
  padding: 20px 28px;
  border: 1px solid ${C.border};
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.04),
    0 4px 16px rgba(15, 23, 42, 0.03);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${C.blue} 0%, ${C.violet} 100%);
  }
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const HeaderIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${C.blueLight};
  color: ${C.blue};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: ${C.slate900};
  letter-spacing: -0.02em;
  line-height: 1.2;
`

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${C.slate500};
  font-weight: 400;
`

export const WelcomeMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  min-width: 220px;

  z-index: 1;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
`

// ─── NAV TABS ────────────────────────────────────────────────────────────────

export const SubNavContainer = styled.nav`
  display: flex;
  gap: 2px;
  background: ${C.surface};
  border: 1px solid ${C.border};
  padding: 5px;
  border-radius: 13px;
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  &::-webkit-scrollbar {
    display: none;
  }
`

export const SubNavTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-weight: 550;
  font-family: ${FONT};
  color: ${({ $active }) => ($active ? C.blue : C.slate600)};
  background: ${({ $active }) => ($active ? C.blueLight : 'transparent')};
  border: none;
  border-radius: 9px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s ease;
  position: relative;

  &:hover {
    color: ${C.blue};
    background: ${({ $active }) => ($active ? C.blueLight : C.surfaceAlt)};
  }
`

export const TabBadge = styled.span`
  background: ${C.red};
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 99px;
  min-width: 16px;
  text-align: center;
  line-height: 1.6;
`

// ─── WELCOME BANNER ──────────────────────────────────────────────────────────

export const WelcomeBanner = styled.div`
  position: relative;
  overflow: hidden;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  padding: 24px 28px;

  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);

  border: 1px solid #e5e7eb;
  border-radius: 16px;

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);

  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 4px;
    border-radius: 0 4px 4px 0;

    background: ${GRADIENT_ACCENT};

    box-shadow: 2px 0 10px rgba(37, 99, 235, 0.25);

    transition:
      width 0.25s ease,
      box-shadow 0.25s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${GRADIENT_SHIMMER};
    background-size: 200% 100%;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  &:hover {
    box-shadow:
      0 2px 6px rgba(15, 23, 42, 0.06),
      0 10px 24px rgba(37, 99, 235, 0.08);
  }

  &:hover::before {
    width: 5px;
    box-shadow: 2px 0 16px rgba(37, 99, 235, 0.35);
  }

  &:hover::after {
    opacity: 1;
    animation: ${shimmer} 1.5s linear infinite;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 22px;
  }
`

export const WelcomeMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 14px;

  background: rgba(255, 255, 255, 0.8);

  border: 1px solid rgba(226, 232, 240, 0.8);

  border-radius: 10px;

  font-size: 13px;
  color: #64748b;

  backdrop-filter: blur(10px);

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`

export const WelcomeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1;
`

export const WelcomeTitle = styled.h2`
  margin: 0;

  font-family: ${FONT_STACK};
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.04em;

  ${gradientText(GRADIENT_TITLE)}

  filter: drop-shadow(
    0 1px 2px rgba(15, 23, 42, 0.08)
  );

  transition:
    filter 0.25s ease,
    letter-spacing 0.25s ease;

  ${WelcomeBanner}:hover & {
    letter-spacing: -0.035em;

    filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.18));
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`

export const WelcomeSubtitle = styled.p`
  font-family: ${FONT_STACK};
  margin: 6px 0 0;
  padding-left: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.015em;
  line-height: 1.6;
  max-width: 650px;
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

  ${WelcomeBanner}:hover & {
    color: #64748b;

    &::before {
      opacity: 1;
      transform: scale(1.3);
    }
  }

  @media (max-width: 768px) {
    padding-left: 0;
    font-size: 12px;
    line-height: 1.45;
  }
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
`

export const StatCard = styled.div<{ $color: string; $bg: string }>`
  background: ${C.surface};
  border-radius: 14px;
  padding: 18px 20px;
  border: 1px solid ${C.border};
  display: flex;
  flex-direction: column;
  cursor: default;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $color }) => $color};
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
    border-color: ${C.borderMed};
    &::before {
      opacity: 1;
    }
  }
`

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

export const StatIcon = styled.div<{ $bg: string; $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

export const StatLabel = styled.div`
  font-size: 12px;
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
  margin-bottom: 10px;
`

export const StatSub = styled.div`
  font-size: 12px;
  color: ${C.slate400};
  font-weight: 450;
  margin-top: -4px;
`

// ─── DASHBOARD CARDS ─────────────────────────────────────────────────────────

export const DashboardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const DashboardCard = styled.div`
  position: relative;
  overflow: hidden;

  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);

  border: 1px solid #e2e8f0;
  border-radius: 18px;

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.05);

  display: flex;
  flex-direction: column;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;

    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 45%);

    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);

    box-shadow:
      0 4px 12px rgba(15, 23, 42, 0.06),
      0 18px 35px rgba(37, 99, 235, 0.08);
  }
`

export const CardHeader = styled.div`
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 18px 22px;

  background: linear-gradient(135deg, #f8faff 0%, #ffffff 65%, #eef4ff 100%);

  border-bottom: 1px solid #eef2f7;

  &::before {
    content: '';

    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;

    width: 3px;

    background: ${GRADIENT_ACCENT};

    border-radius: 0 3px 3px 0;
  }
`

export const CardTitle = styled.h3`
  margin: 0;

  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 16px;
  font-weight: 800;

  letter-spacing: -0.025em;

  color: #0f172a;

  svg {
    color: #2563eb;
    flex-shrink: 0;
  }
`

export const CardLinkButton = styled.button`
  height: 34px;

  padding: 0 12px;

  border-radius: 10px;

  border: 1px solid #dbeafe;

  background: linear-gradient(180deg, #ffffff, #f8fbff);

  color: #2563eb;

  font-size: 12px;
  font-weight: 700;

  display: flex;
  align-items: center;
  gap: 6px;

  transition: all 0.2s ease;

  &:hover {
    background: #eff6ff;

    transform: translateX(2px);

    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }
`

export const SimpleList = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
`

export const SimpleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 16px;

  border-radius: 14px;

  background: linear-gradient(180deg, #ffffff, #fafcff);

  border: 1px solid #eef2f7;

  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);

    border-color: #dbeafe;

    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`

export const ItemLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const ItemName = styled.span`
  font-size: 14px;
  font-weight: 700;

  color: #0f172a;

  letter-spacing: -0.02em;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemDate = styled.span`
  font-size: 12px;

  color: #94a3b8;

  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #93c5fd;
  }
`

export const ProfileLayout = styled.div`
  display: grid;
  grid-template-columns: 264px 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const ProfileSidebarCard = styled.aside`
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.05);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
  height: fit-content;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 45%);
    pointer-events: none;
  }

  &:hover {
    box-shadow:
      0 4px 12px rgba(15, 23, 42, 0.06),
      0 18px 35px rgba(37, 99, 235, 0.08);
  }
`

export const ProfileAvatarWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid ${C.surface};
  box-shadow:
    0 0 0 2px ${C.borderMed},
    0 4px 12px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  cursor: pointer;

  &:hover .avatar-overlay {
    opacity: 1;
  }
`

export const ProfileAvatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const ProfileAvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${C.blueLight} 0%, ${C.violetLight} 100%);
  color: ${C.blue};
  font-size: 30px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.02em;
`

export const AvatarOverlay = styled.div.attrs({ className: 'avatar-overlay' })`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: white;
  font-size: 11px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.18s ease;
`

export const ProfileSidebarInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const ProfileSidebarName = styled.h4`
  font-size: 15.5px;
  font-weight: 700;
  color: ${C.slate900};
  margin: 0;
  line-height: 1.3;
`

export const ProfileSidebarRole = styled.span`
  font-size: 12px;
  color: ${C.slate400};
  font-weight: 500;
`

export const ProfileMainCard = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.05);
  padding: 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 45%);
    pointer-events: none;
  }

  &:hover {
    box-shadow:
      0 4px 12px rgba(15, 23, 42, 0.06),
      0 18px 35px rgba(37, 99, 235, 0.08);
  }
`

export const SectionSubTitle = styled.h4`
  font-size: 12px;
  font-weight: 700;
  color: ${C.slate500};
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 7px;
`

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${C.slate500};
`

export const FieldValueReadOnly = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${C.slate700};
  background: ${C.bg};
  padding: 10px 13px;
  border-radius: 9px;
  border: 1px solid ${C.border};
  line-height: 1.4;
`

export const InputField = styled.input`
  font-size: 14px;
  font-weight: 500;
  color: ${C.slate900};
  font-family: ${FONT};
  background: ${C.surface};
  padding: 10px 13px;
  border-radius: 9px;
  border: 1px solid ${C.borderMed};
  transition: all 0.15s ease;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: ${C.slate400};
  }

  &:focus {
    outline: none;
    border-color: ${C.blue};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.09);
  }
`

export const PasswordInputField = styled(Input)`
  font-size: 14px;
  font-weight: 500;
  color: ${C.slate900};
  font-family: ${FONT};
  background: ${C.surface};
  border-radius: 9px;
  border: 1px solid ${C.borderMed};
  transition: all 0.15s ease;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: ${C.slate400};
  }

  &:focus {
    outline: none;
    border-color: ${C.blue};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.09);
  }
`

export const SaveButton = styled.button`
  display: flex;
  justify-self: end;
  background: ${C.blue};
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.18s ease;
  letter-spacing: -0.01em;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`

export const SecondaryButton = styled.button`
  background: ${C.surface};
  color: ${C.slate700};
  border: 1px solid ${C.borderMed};
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 550;
  font-family: ${FONT};
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: ${C.surfaceAlt};
    border-color: ${C.slate300};
    color: ${C.slate900};
  }
`

// ─── FILTER BAR ──────────────────────────────────────────────────────────────

export const FilterBar = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.05);
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  align-items: center;
  flex-wrap: wrap;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 45%);
    pointer-events: none;
  }
`

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 11px;
    color: ${C.slate400};
    pointer-events: none;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 9px 12px 9px 36px;
  font-size: 13.5px;
  font-weight: 450;
  font-family: ${FONT};
  border: 1px solid ${C.borderMed};
  border-radius: 9px;
  background: ${C.bg};
  color: ${C.slate900};
  outline: none;
  transition: all 0.15s ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${C.slate400};
  }

  &:focus {
    border-color: ${C.blue};
    background: ${C.surface};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  }
`

export const DropdownSelect = styled.select`
  padding: 9px 13px;
  font-size: 13.5px;
  font-weight: 500;
  font-family: ${FONT};
  border: 1px solid ${C.borderMed};
  border-radius: 9px;
  background: ${C.bg};
  color: ${C.slate700};
  outline: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:focus {
    border-color: ${C.blue};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
    background: ${C.surface};
  }
`

// ─── TABLE ───────────────────────────────────────────────────────────────────

export const TableWrapper = styled.div`
  position: relative;
  overflow-x: auto;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.05);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 45%);
    pointer-events: none;
  }

  &:hover {
    box-shadow:
      0 4px 12px rgba(15, 23, 42, 0.06),
      0 18px 35px rgba(37, 99, 235, 0.08);
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  text-align: left;
`

export const TableTh = styled.th`
  padding: 12px 18px;
  background: ${C.bg};
  border-bottom: 1px solid ${C.border};
  color: ${C.slate500};
  font-weight: 600;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`

export const TableRow = styled.tr`
  border-bottom: 1px solid ${C.border};
  transition: background 0.12s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${C.bg};
  }
`

export const TableTd = styled.td`
  padding: 14px 18px;
  color: ${C.slate700};
  font-weight: 500;
  vertical-align: middle;
`

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 650;
  padding: 4px 9px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case 'assigned':
        return css`
          background: ${C.amberLight};
          color: ${C.amber};
          &::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
            display: inline-block;
          }
        `
      case 'ready':
      case 'completed':
        return css`
          background: ${C.emeraldLight};
          color: ${C.emerald};
          &::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
            display: inline-block;
          }
        `
      case 'processing':
      case 'active':
        return css`
          background: ${C.blueLight};
          color: ${C.blue};
          &::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
            display: inline-block;
            animation: ${pulse} 1.4s ease infinite;
          }
        `
      case 'cancelled':
        return css`
          background: ${C.redLight};
          color: ${C.red};
          &::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
            display: inline-block;
          }
        `
      default:
        return css`
          background: ${C.surfaceAlt};
          color: ${C.slate500};
          &::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
            display: inline-block;
          }
        `
    }
  }}
`

export const ActionButton = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => ($primary ? C.blueLight : 'transparent')};
  color: ${({ $primary }) => ($primary ? C.blue : C.slate500)};
  border: ${({ $primary }) => ($primary ? `1px solid ${C.blueMid}` : 'none')};
  padding: 6px 11px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: ${FONT};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.14s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $primary }) => ($primary ? C.blueMid : C.surfaceAlt)};
    color: ${({ $primary }) => ($primary ? '#1D4ED8' : C.slate800)};
  }
`

export const FlexActions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`

export const NoDataState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 56px 40px;
  text-align: center;
  color: ${C.slate400};
  font-size: 14px;
  font-weight: 450;

  svg {
    opacity: 0.35;
  }
`

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

export const DocGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
`

export const DocCard = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: default;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 45%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 4px 12px rgba(15, 23, 42, 0.06),
      0 18px 35px rgba(37, 99, 235, 0.08);
  }
`

export const DocHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const DocIconBox = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: ${C.redLight};
  color: ${C.red};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const DocTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`

export const DocNameText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${C.slate800};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const DocMetaText = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  font-size: 10.5px;
  font-weight: 650;
  color: ${C.red};
  background: ${C.redLight};
  padding: 2px 7px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const DocFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${C.border};
  padding-top: 10px;
  margin-top: auto;
`

export const DocDateText = styled.span`
  font-size: 14px;
  color: ${C.slate400};
  font-weight: 450;
  display: flex;
  align-items: center;
  gap: 5px;
`

export const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const NotificationHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`

export const NotificationCard = styled.div<{
  $read: boolean
  $severity?: 'critical' | 'warning' | 'info'
}>`
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: ${({ $read }) => ($read ? 'default' : 'pointer')};
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.05);

  background: ${({ $read, $severity }) => {
    if ($read) return 'linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)'
    if ($severity === 'critical') return '#fef2f2'
    if ($severity === 'warning') return '#fffbeb'
    return '#eff6ff'
  }};
  border: 1px solid
    ${({ $read, $severity }) => {
      if ($read) return '#e2e8f0'
      if ($severity === 'critical') return '#fca5a5'
      if ($severity === 'warning') return '#fcd34d'
      return '#93c5fd'
    }};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 45%);
    pointer-events: none;
  }

  ${({ $read, $severity }) =>
    !$read &&
    css`
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        bottom: 10px;
        width: 3px;
        border-radius: 0 3px 3px 0;
        background: ${$severity === 'critical'
          ? '#dc2626'
          : $severity === 'warning'
            ? '#d97706'
            : C.blue};
      }
    `}

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 4px 12px rgba(15, 23, 42, 0.06),
      0 18px 35px rgba(37, 99, 235, 0.08);
    border-color: ${({ $read, $severity }) => {
      if ($read) return C.borderMed
      if ($severity === 'critical') return '#FC8181'
      if ($severity === 'warning') return '#F6AD55'
      return '#BFDBFE'
    }};
    background: ${({ $read, $severity }) => {
      if ($read) return 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)'
      if ($severity === 'critical') return '#FFF0F0'
      if ($severity === 'warning') return '#FFFBEB'
      return '#EFF6FF'
    }};
  }
`

export const NotifIconBox = styled.div<{
  $type?: string
  $severity?: 'critical' | 'warning' | 'info'
}>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ $severity, $type }) => {
    const sev = $severity || ($type === 'system' ? 'info' : 'info')
    switch (sev) {
      case 'critical':
        return css`
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
        `
      case 'warning':
        return css`
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        `
      default:
        return css`
          background: #dbeafe;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        `
    }
  }}
`

export const SeverityBadge = styled.span<{ $severity: 'critical' | 'warning' | 'info' }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 8px;
  width: fit-content;

  ${({ $severity }) => {
    switch ($severity) {
      case 'critical':
        return css`
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        `
      case 'warning':
        return css`
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        `
      default:
        return css`
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        `
    }
  }}
`

export const NotificationDetails = styled.div<{ $severity?: 'critical' | 'warning' | 'info' }>`
  font-size: 14px;
  color: ${C.slate600};
  margin-top: 10px;
  padding: 12px 16px;
  background: ${({ $severity }) => {
    if ($severity === 'critical') return '#FFF5F5'
    if ($severity === 'warning') return '#FFFDF0'
    return '#F8FAFC'
  }};
  border-radius: 6px;
  border-left: 3px solid
    ${({ $severity }) => {
      if ($severity === 'critical') return '#FC8181'
      if ($severity === 'warning') return '#F6AD55'
      return '#CBD5E1'
    }};
  line-height: 1.5;

  strong {
    color: ${C.slate800};
    font-weight: 600;
  }
`

export const NotifContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`

export const NotifTitle = styled.div`
  font-size: 16px;
  font-weight: 650;
  color: ${C.slate800};
  line-height: 1.35;
`

export const NotifText = styled.div`
  font-size: 14.5px;
  color: ${C.slate600};
  line-height: 1.5;
`

export const NotifTimeBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: ${C.slate400};
  font-weight: 500;
  margin-top: 2px;
`

export const MarkReadBtn = styled.button`
  background: transparent;
  border: none;
  color: ${C.slate400};
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.14s ease;
  flex-shrink: 0;

  &:hover {
    background: ${C.blueLight};
    color: ${C.blue};
  }
`

// ─── MODAL ───────────────────────────────────────────────────────────────────

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${rise} 0.18s ease-out;
  padding: 16px;
`

export const ModalContent = styled.div`
  background: ${C.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 540px;
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.18),
    0 0 0 1px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  max-height: 88vh;
  overflow: hidden;
  animation: ${popUp} 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
`

export const ModalHeader = styled.div`
  padding: 18px 22px;
  border-bottom: 1px solid ${C.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 15.5px;
  font-weight: 700;
  color: ${C.slate900};
`

export const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: ${C.slate400};
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.14s ease;

  &:hover {
    background: ${C.surfaceAlt};
    color: ${C.slate800};
  }
`

export const ModalBody = styled.div`
  padding: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ModalFooter = styled.div`
  padding: 14px 22px;
  border-top: 1px solid ${C.border};
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: ${C.bg};
  flex-shrink: 0;
`

export const InfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${C.bg};
  padding: 14px;
  border-radius: 10px;
  border: 1px solid ${C.border};
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  font-size: 13.5px;
`

export const InfoKey = styled.span`
  color: ${C.slate500};
  font-weight: 500;
`

export const InfoVal = styled.span`
  color: ${C.slate800};
  font-weight: 650;
  text-align: right;
`
