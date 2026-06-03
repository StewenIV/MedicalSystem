import styled, { css, keyframes } from 'styled-components'
import Input from 'components/Input'

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
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`

const slideIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
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
  position: relative;

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
  font-family: ${FONT_STACK};
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.04em;
    line-height: 1.15;
    min-width: 0;
  
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
  
    @media (max-width: 1024px) {
      font-size: 24px;
    }
  
    @media (max-width: 768px) {
      font-size: 22px;
      line-height: 1.2;
    }
  
    @media (max-width: 480px) {
      font-size: 19px;
    }
`

export const CardSubtitle = styled.p`
 font-family: ${FONT_STACK};
     margin: 6px 0 0;
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
   
      @media (max-width: 768px) {
       padding-left: 0;
       font-size: 12px;
       line-height: 1.45;
     }
`

export const TwoColLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.9fr);
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
`

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
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
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 4px;
  }
`

export const ActionIconBtn = styled.button<{
  $danger?: boolean
  $userplus?: boolean
}>`
  padding: ${(p) => (p.$userplus ? '6px 6px 6px 8px' : '6px')};
  border-radius: 8px;
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
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.5)' : '#2563eb')};
    background: ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.1)' : '#eff6ff')};
  }

  @media (max-width: 640px) {
    width: 30px;
    height: 30px;
  }
`

export const PaginationRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid rgba(191, 219, 254, 0.5);
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  box-sizing: border-box;

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
  padding: 15px 20px;

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
  width: 100%;
  min-height: 1px;
  flex-shrink: 0;
  height: 1px;
  margin: 10px 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(147, 197, 253, 0.95) 50%,
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
  gap: 7px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;

  min-width: 0;
  padding: 10px 12px;

  border-radius: 12px;
  border: 1px solid rgba(191, 219, 254, 0.5);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);

  font-size: 13px;
  font-weight: 600;
  color: #374151;

  cursor: pointer;

  overflow: hidden;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  input[type='radio'] {
    flex-shrink: 0;
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
  outline: none;
  cursor: pointer;

  background: linear-gradient(
    to right,
    #97b8ff 0%,
    #2563eb var(--progress),
    #e2e8f0 var(--progress),
    #e2e8f0 100%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.32);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.32);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    border: none;
  }

  &:active::-webkit-slider-thumb {
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(37, 99, 235, 0.1);
  }

  &:active::-moz-range-thumb {
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(37, 99, 235, 0.1);
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

export const BedItem = styled.div<{ $extra?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $extra }) =>
    $extra ? 'auto minmax(0, 1fr) auto auto auto auto' : 'auto minmax(0, 1fr) auto auto auto'};
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(191, 219, 254, 0.45);
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);

  @media (max-width: 640px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 12px 8px;
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
  flex-shrink: 0;
`

export const BedInfo = styled.div`
  min-width: 0;

  @media (max-width: 640px) {
    flex: 1 1 calc(100% - 44px);
    min-width: 100px;
  }
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

  @media (max-width: 640px) {
    margin-left: 44px;
    margin-right: auto;
  }
`

export const BedDeleteBtn = styled.button`
  padding: 6px;
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

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${slideIn} 0.2s ease both;
`

export const ModalShell = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  max-height: calc(100vh - 80px);
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(15, 23, 42, 0.25),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (max-width: 480px) {
    max-height: calc(100vh - 32px);
    border-radius: 16px;
  }
`

// ─── Header ───────────────────────────────────────────────────────────────────

export const ModalHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 1px solid rgba(191, 219, 254, 0.4);
  background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  z-index: 10;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #db2777 100%);
  }

  @media (max-width: 480px) {
    padding: 18px 20px;
  }
`

export const ModalInfoPatient = styled.div`
  padding: 16px 20px 16px 24px; /* добавили место слева */
  background: #ffffff;
  border: 1px solid rgba(191, 219, 254, 0.6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0px; /* сдвинули внутрь */
    top: 8px;
    bottom: 0px;
    width: 4px;
    height: 80%;
    background: linear-gradient(180deg, #2563eb 0%, #7c3aed 100%);
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px 14px 20px;
  }
`

export const PatientAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid rgba(191, 219, 254, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #1e40af;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
`

export const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: #0f172a;
    background: #e2e8f0;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`

export const ModalIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(191, 219, 254, 0.8);
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`

export const ModalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`

export const ModalHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ModalTitle = styled.h2`
  font-family: ${FONT_STACK};
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.2;
  ${gradientText('linear-gradient(135deg, #0f172a 0%, #1e40af 100%)')}

  @media (max-width: 480px) {
    font-size: 19px;
  }
`

export const ModalSubtitle = styled.p`
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 12.5px;
  }
`

// ─── Scrollable content ───────────────────────────────────────────────────────

export const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #f8fafc;

  @media (max-width: 480px) {
    padding: 16px;
    gap: 20px;
  }
`

export const Section = styled.section``

export const LocationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: stretch;

  @media (min-width: 768px) {
    grid-template-columns: 1fr auto 1fr;
  }
`

export const LocationCard = styled.div<{ $new?: boolean; $filled?: boolean }>`
  background: ${(p) => (p.$filled ? 'linear-gradient(135deg, #f0f4ff, #f8faff)' : '#ffffff')};
  border-radius: 16px;
  border: ${(p) =>
    p.$filled
      ? '1px solid rgba(147, 197, 253, 0.6)'
      : p.$new
        ? '1.5px dashed #cbd5e1'
        : '1px solid #e2e8f0'};
  padding: 20px;
  box-shadow: ${(p) =>
    p.$filled ? '0 4px 12px rgba(37, 99, 235, 0.06)' : '0 1px 3px rgba(15, 23, 42, 0.04)'};
  transition: all 0.25s ease;

  @media (max-width: 480px) {
    padding: 16px;
  }
`

export const LocationCardLabel = styled.div<{ $accent?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => (p.$accent ? '#2563eb' : '#64748b')};
`

export const LocationFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const LocationField = styled.div<{ $highlighted?: boolean; $selected?: boolean }>`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid;
  transition: all 0.2s ease;

  ${(p) =>
    p.$selected
      ? css`
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        `
      : p.$highlighted
        ? css`
            background: #ffffff;
            border-color: #bfdbfe;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);
          `
        : css`
            background: rgba(248, 250, 252, 0.8);
            border-color: rgba(226, 232, 240, 0.8);
          `}

  &:last-child {
    grid-column: span 2;

    @media (min-width: 640px) {
      grid-column: span 1;
    }
  }
`

export const LocationFieldLabel = styled.div<{ $light?: boolean }>`
  font-size: 11.5px;
  font-weight: 600;
  color: ${(p) => (p.$light ? '#bfdbfe' : '#64748b')};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const LocationFieldValue = styled.div<{ $white?: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${(p) => (p.$white ? '#ffffff' : '#0f172a')};
`

export const ArrowWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;

  @media (min-width: 768px) {
    padding: 0;
  }
`

export const ArrowCircle = styled.div`
  width: 36px;
  height: 36px;
  background: #ffffff;
  border: 1px solid rgba(191, 219, 254, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  transform: rotate(90deg);

  @media (min-width: 768px) {
    transform: rotate(0);
  }
`

// ─── Selection section ────────────────────────────────────────────────────────

export const SelectionCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(191, 219, 254, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 14px;
    gap: 16px;
  }
`

export const SelectionTopRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

export const SelectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
`

export const FreeOnlyLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0f172a;
  }

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
    border-radius: 4px;
    cursor: pointer;
  }
`

export const SelectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const SelectField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SelectLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
`

export const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13.5px;
  color: #111827;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition:
    border-color 0.14s,
    box-shadow 0.14s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`

// ─── Beds grid ────────────────────────────────────────────────────────────────

export const BedsSection = styled.div`
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  animation: ${slideIn} 0.2s ease both;
`

export const BedsLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
`

export const BedsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const BedBtn = styled.button<{ $free?: boolean; $selected?: boolean }>`
  position: relative;
  padding: 16px 12px;
  border-radius: 12px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  cursor: ${(p) => (p.$free ? 'pointer' : 'not-allowed')};

  ${(p) =>
    !p.$free
      ? css`
          background: #f8fafc;
          border-color: #e2e8f0;
          opacity: 0.65;
          color: #94a3b8;
        `
      : p.$selected
        ? css`
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-color: #3b82f6;
            box-shadow:
              0 0 0 2px #3b82f6,
              0 4px 12px rgba(59, 130, 246, 0.15);
            transform: scale(1.02);
            color: #1d4ed8;
          `
        : css`
            background: #ffffff;
            border-color: #cbd5e1;
            color: #334155;

            &:hover {
              border-color: #93c5fd;
              background: #f8fafc;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
            }
          `}
`

export const BedStatusDot = styled.div<{ $free?: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$free ? '#10b981' : '#ef4444')};
`

export const BedBtnLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
`

export const BedSelectedMark = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  background: #3b82f6;
  color: #fff;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  box-shadow: 0 1px 4px rgba(59, 130, 246, 0.4);
`

export const NoBedsBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 16px;
  color: #92400e;
  font-size: 13.5px;
  font-weight: 500;
`

// ─── Transfer details section ─────────────────────────────────────────────────

export const DetailsCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(191, 219, 254, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 14px;
    gap: 16px;
  }
`

export const DetailsSectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
`

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const DetailsField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const DetailsLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;

  svg {
    color: #64748b;
  }
`

export const DetailsOptional = styled.span`
  font-weight: 400;
  color: #94a3b8;
`

export const StyledInput = styled.input`
  height: 40px;
  padding: 0 14px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  border-radius: 10px;
  font-family: ${FONT_STACK};
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }
`
export const InputModal = styled(Input)`
  font-size: 15px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  border-radius: 11px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  background: #ffffff;

  &::placeholder {
    color: #d1d5db;
    opacity: 1;
  }
`

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  resize: vertical;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }
`

// ─── Footer ───────────────────────────────────────────────────────────────────

export const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #ffffff;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-shrink: 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.02);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 16px;
  }
`

export const CancelBtn = styled.button`
  padding: 10px 20px;
  font-family: ${FONT_STACK};
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 640px) {
    width: auto;
  }

  &:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }

  &:focus-visible {
    outline: 2px solid #94a3b8;
    outline-offset: 2px;
  }
`

export const ConfirmBtn = styled.button`
  padding: 10px 20px;
  font-family: ${FONT_STACK};
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 640px) {
    width: auto;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #94a3b8;
    box-shadow: none;
  }
`

export const SectionHeaderFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
`

export const NewPatientBtn = styled(AddBedBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 12px;

  @media (max-width: 480px) {
    width: 100%;
  }
`

export const NotificationBox = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed rgba(191, 219, 254, 0.8);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const CheckboxWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
    cursor: pointer;
    border-radius: 4px;
  }
`

export const CheckboxHint = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-left: 24px;
  line-height: 1.4;
`

export const FooterLeftInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #64748b;
  flex: 1;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }
`

export const FooterRightActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  @media (max-width: 640px) {
    width: 100%;
    flex-direction: column-reverse;

    > button {
      width: 100%;
    }
  }
`

export const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`
