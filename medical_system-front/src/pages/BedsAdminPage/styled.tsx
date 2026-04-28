import styled, { css, keyframes } from 'styled-components'

const FONT_STACK = `
  'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont,
  'Segoe UI', system-ui, sans-serif
`

export const GRADIENT_ACCENT = 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)'
export const GRADIENT_SHIMMER =
  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'
export const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const gradientText = (gradient: string) => css`
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const softCard = css`
  background: #ffffff;
  border: 1px solid rgba(191, 219, 254, 0.7);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.06),
    0 20px 40px rgba(15, 23, 42, 0.05);
`

const controlBase = css`
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  background: #ffffff;
  color: #0f172a;
  font-family: ${FONT_STACK};
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100vh;
  padding: 1px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f0f4ff, #f8faff);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);
  animation: ${fadeUp} 0.3s ease both;

  @media (max-width: 768px) {
    gap: 18px;
  }
`

export const StyledCard = styled.div`
  ${softCard};
  overflow: hidden;
  border-radius: 16px;
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

export const CardHeader = styled.div`
  padding: 20px 24px 18px;
  border-bottom: 1px solid rgba(238, 242, 247, 0.9);
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);
  position: relative;
  overflow: hidden;

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

  @media (max-width: 768px) {
    padding: 16px 18px 14px;
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`

export const CardContent = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 18px;
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 10px;

  @media (max-width: 768px) {
    padding: 0;
  }
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  ${gradientText('linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #6d28d9 75%, #2563eb 100%)')}
  filter: drop-shadow(0 1px 2px rgba(37, 99, 235, 0.18));

  @media (max-width: 1024px) {
    font-size: 24px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 19px;
  }
`

export const CardSubtitle = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  color: #94a3b8;
  letter-spacing: 0.015em;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    margin-right: 8px;
    margin-bottom: 2px;
    border-radius: 50%;
    vertical-align: middle;
    background: linear-gradient(135deg, #93c5fd, #818cf8);
    opacity: 0.7;
  }
`

export const TwoColLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.9fr);
  gap: 24px;
  align-items: start;

  > div {
    min-width: 0;
  }

  @media (max-width: 1180px) {
    grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.95fr);
    gap: 20px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const StatsBadgesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

export const StatBadge = styled.div`
  min-width: 0;
  padding: 16px 18px;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid rgba(191, 219, 254, 0.4);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
`

export const StatBadgeLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
`

export const StatBadgeValue = styled.div`
  margin-top: 8px;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
`

export const FilterBar = styled.div`
  ${softCard};
  display: grid;
  grid-template-columns: auto repeat(3, minmax(140px, 1fr)) auto;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 14px;
  }
`

export const FilterIcon = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  white-space: nowrap;

  @media (max-width: 1180px) {
    grid-column: 1 / -1;
    min-height: auto;
  }
`

export const FilterSelect = styled.select`
  ${controlBase};
  padding-right: 42px;
  cursor: pointer;
  appearance: none;
  background: #ffffff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right 14px center;
`

export const SearchInput = styled.input`
  ${controlBase};
  font-size: 13px;
`

export const ResetBtn = styled.button`
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  background: #ffffff;
  color: #374151;
  font-family: ${FONT_STACK};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: #2563eb;
    background: #f0f4ff;
    color: #1e40af;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

export const TableWrap = styled.div`
  ${softCard};
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 768px) {
    min-width: 760px;
  }
`

export const Thead = styled.thead`
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  border-bottom: 1px solid rgba(191, 219, 254, 0.5);
`

export const Th = styled.th`
  padding: 13px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  white-space: nowrap;
`

export const Tbody = styled.tbody``

export const Tr = styled.tr<{ $selected?: boolean }>`
  border-bottom: 1px solid #eef2f7;
  background: ${(p) => (p.$selected ? '#eff6ff' : 'transparent')};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: ${(p) => (p.$selected ? '#dbeafe' : '#f8fbff')};
  }

  &:last-child {
    border-bottom: none;
  }
`

export const Td = styled.td`
  padding: 14px 16px;
  vertical-align: middle;
  font-size: 14px;
  color: #374151;
`

export const TdBold = styled(Td)`
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
`

export const TdMuted = styled(Td)`
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
`

export const TypeBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid transparent;

  ${(p) => {
    if (p.$type === 'Реанимация') {
      return css`
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
        border-color: rgba(239, 68, 68, 0.25);
      `
    }

    if (p.$type === 'Изолятор') {
      return css`
        background: rgba(217, 119, 6, 0.1);
        color: #b45309;
        border-color: rgba(217, 119, 6, 0.25);
      `
    }

    return css`
      background: rgba(37, 99, 235, 0.1);
      color: #1e40af;
      border-color: rgba(37, 99, 235, 0.25);
    `
  }}
`

export const GenderCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export const BedCountCell = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

export const BedCountNum = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: #0f172a;
  letter-spacing: -0.03em;
`

export const BedCountUnit = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
`

export const PriorityWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`

export const PriorityBar = styled.div<{ $filled: boolean }>`
  width: 6px;
  height: 18px;
  border-radius: 999px;
  background: ${(p) =>
    p.$filled ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : 'rgba(191, 219, 254, 0.35)'};
  box-shadow: ${(p) => (p.$filled ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none')};
`

export const ActionCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

export const ActionIconBtn = styled.button<{ $danger?: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(191, 219, 254, 0.8)')};
  background: ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.06)' : '#ffffff')};
  color: ${(p) => (p.$danger ? '#dc2626' : '#2563eb')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.5)' : '#2563eb')};
    background: ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.1)' : '#eff6ff')};
  }
`

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid rgba(191, 219, 254, 0.5);
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const PaginationInfo = styled.div`
  font-size: 12px;
  color: #94a3b8;
`

export const PaginationBtns = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`

export const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 9px;
  border: 1px solid ${(p) => (p.$active ? '#1e40af' : 'rgba(191, 219, 254, 0.8)')};
  background: ${(p) =>
    p.$active ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : '#ffffff'};
  color: ${(p) => (p.$active ? '#ffffff' : '#374151')};
  font-family: ${FONT_STACK};
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 700 : 600)};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #1e40af;
    background: ${(p) =>
      p.$active ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : '#eff6ff'};
    color: ${(p) => (p.$active ? '#ffffff' : '#1e40af')};
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`

export const EditorPanel = styled.div`
  ${softCard};
  position: sticky;
  top: 24px;
  border-radius: 16px;
  padding: 22px;

  @media (max-width: 1024px) {
    position: static;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`

export const EditorTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.035em;
  ${gradientText(GRADIENT_TITLE)}
`

export const EditorSubtitle = styled.p`
  margin: 6px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #94a3b8;
`

export const Divider = styled.div`
  height: 1px;
  margin: 20px 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(191, 219, 254, 0.55) 50%,
    transparent 100%
  );
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

export const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  ${(p) =>
    p.$fullWidth &&
    css`
      grid-column: 1 / -1;
    `}
`

export const FormLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
`

export const FormInput = styled.input`
  ${controlBase};
`

export const FormSelect = styled.select`
  ${controlBase};
  padding-right: 42px;
  cursor: pointer;
  appearance: none;
  background: #ffffff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right 14px center;
`

export const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(191, 219, 254, 0.5);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;

  input[type='radio'] {
    margin: 0;
    accent-color: #2563eb;
  }
`

export const SliderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const SliderLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
`

export const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  background: linear-gradient(135deg, #eff6ff, #f8faff);
  border: 1px solid rgba(191, 219, 254, 0.6);
  color: #1e40af;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`

export const PriorityLevelLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
`

export const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  margin-top: 10px;
  appearance: none;
  border-radius: 999px;
  background: linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.32);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.32);
  }
`

export const BedsMgmtHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const BedsMgmtTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`

export const AddBedBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(37, 99, 235, 0.28);
  background: rgba(37, 99, 235, 0.06);
  color: #2563eb;
  font-family: ${FONT_STACK};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.1);
    transform: translateY(-1px);
  }
`

export const BedsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 2px;
`

export const EmptyBedsState = styled.div`
  padding: 18px 14px;
  border-radius: 12px;
  border: 1px dashed rgba(191, 219, 254, 0.8);
  background: linear-gradient(180deg, #fbfdff 0%, #f8fbff 100%);
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
  color: #94a3b8;
`

export const BedItem = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(191, 219, 254, 0.45);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);

  @media (max-width: 520px) {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
`

export const BedTag = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.28);
`

export const BedInfo = styled.div`
  min-width: 0;
`

export const BedName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`

export const BedId = styled.div`
  margin-top: 2px;
  font-size: 11px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
`

export const BedStatus = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
  white-space: nowrap;

  @media (max-width: 520px) {
    grid-column: 2 / 3;
  }
`

export const BedDeleteBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.28);
  background: rgba(239, 68, 68, 0.05);
  color: #dc2626;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: rgba(239, 68, 68, 0.5);
    background: rgba(239, 68, 68, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 520px) {
    grid-row: 1 / span 2;
    grid-column: 3 / 4;
  }
`

export const EditorFooter = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 42px;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const SaveBtn = styled.button`
  height: 42px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${FONT_STACK};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
  }
`

export const ResetEditorBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  background: #ffffff;
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #2563eb;
    background: #eff6ff;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`
