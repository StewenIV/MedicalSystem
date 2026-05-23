import styled, { css, keyframes } from 'styled-components'
import { AppButton } from 'components/Button'


const FONT_STACK = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

const GRADIENT_ACCENT = 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'

const controlBase = `
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &::placeholder { color: #94a3b8; }
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`
const GRADIENT_SHIMMER =
  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'

const shimmer = keyframes`
  0%   { background-position: -200% center }
  100% { background-position:  200% center }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const gradientText = (gradient: string) => `
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`

export const PatientCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  color: #0f172a;
  animation: ${fadeIn} 0.4s ease-out;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
`

export const PatientHeader = styled.div`
  display: flex;
  background: #ffffff;
  padding: 32px;
  border-radius: 24px;
  box-shadow:
    0 10px 30px -5px rgba(0, 0, 0, 0.05),
    0 4px 10px -5px rgba(0, 0, 0, 0.02);
  gap: 32px;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow:
      0 15px 35px -5px rgba(0, 0, 0, 0.08),
      0 5px 15px -5px rgba(0, 0, 0, 0.03);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 20px;
    gap: 20px;
    text-align: left;
  }
`

export const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  flex-shrink: 0;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05) rotate(5deg);
    color: #3b82f6;
  }
`

export const HeaderMain = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`

export const PatientName = styled.h1`
  margin: 0;
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Demographics = styled.div`
  display: flex;
  gap: 16px;
  color: #475569;
  font-size: clamp(13px, 3vw, 15px);
  align-items: center;
  font-weight: 500;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }

  span.dot {
    color: #cbd5e1;
  }
`

export const HeaderInfoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 20px;
  }
`

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .label {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .value {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;

    @media (max-width: 768px) {
      font-size: 14px;
    }

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }
`

export const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  background: ${({ $status }) =>
    $status === 'hospitalized'
      ? '#dcfce7'
      : $status === 'outpatient'
        ? '#e0f2fe'
        : $status === 'discharged'
          ? '#f1f5f9'
          : '#fef3c7'};
  color: ${({ $status }) =>
    $status === 'hospitalized'
      ? '#166534'
      : $status === 'outpatient'
        ? '#1e40af'
        : $status === 'discharged'
          ? '#475569'
          : '#92400e'};
  border: 1px solid
    ${({ $status }) =>
      $status === 'hospitalized'
        ? '#bbf7d0'
        : $status === 'outpatient'
          ? '#bfdbfe'
          : $status === 'discharged'
            ? '#e2e8f0'
            : '#fde68a'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.95);
  }
`

export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0px;
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }
`

export const TabButton = styled.button<{ $active?: boolean }>`
  padding: 14px 20px;
  background: transparent;
  border: none;
  color: ${({ $active }) => ($active ? '#2563eb' : '#64748b')};
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  font-size: clamp(13px, 3vw, 15px);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #2563eb;
    border-radius: 3px 3px 0 0;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #2563eb;
    background: #f8fafc;
    border-radius: 8px 8px 0 0;
  }

  &:active {
    transform: scale(0.98);
  }
`

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeIn} 0.4s ease-out;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
`

export const SectionCard = styled.div<{ $span?: number }>`
  grid-column: span ${({ $span }) => $span || 1};

  @media (max-width: 1024px) {
    grid-column: span 1;
  }

  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  transition: box-shadow 0.2s ease;
  overflow-x: auto;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  font-size: 14px;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 768px) {
    padding: 22px 20px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 18px 16px;
    border-radius: 16px;
    font-size: 13px;
  }

  /* ── Заголовок карточки: title + кнопки всегда на одной строке ── */
  > h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    gap: 8px;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 16px;
    min-width: 0;

    .actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      align-items: center;
    }

    @media (max-width: 768px) {
      font-size: 16px;
    }

    @media (max-width: 480px) {
      font-size: 15px;
      padding-bottom: 12px;
    }
  }

  /* ── Адаптивный font-size для списков и параграфов внутри карточек ── */
  ul, ol {
    margin: 0;
    color: #1e293b;

    @media (max-width: 480px) {
      padding-left: 16px;
      font-size: 13px;
    }
  }

  li {
    @media (max-width: 480px) {
      font-size: 13px;
    }
  }
`



export const OpenSheetBtn = styled(AppButton)`
  width: 100%;
  max-width: 340px;
  margin-top: 12px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  &:hover {
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
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

  @media (max-width: 768px) {
    padding: 16px 18px 14px;
  }

  @media (max-width: 480px) {
    padding: 14px 14px 12px;
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


export const GridRow = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 2}, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: clamp(12px, 3vw, 14px);
  min-width: 600px;

  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    font-weight: 700;
    color: #475569;
    background: #f8fafc;
    text-transform: uppercase;
    font-size: clamp(10px, 2.5vw, 12px);
    letter-spacing: 0.5px;

    &:first-child {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }

  tr {
    transition: all 0.2s ease;
  }

  tbody tr:hover {
    background-color: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  }

  td {
    color: #334155;
    vertical-align: middle;
  }
`

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 600;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  border: 1px solid transparent;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  ${({ $variant, disabled }) => {
    if (disabled) {
      return `
        background: #f1f5f9;
        color: #94a3b8;
      `
    }
    switch ($variant) {
      case 'ghost':
        return `
          background: transparent;
          color: #64748b;
          padding: 8px;
          &:hover {
            background: #f1f5f9;
            color: #0f172a;
          }
          &:active {
            background: #e2e8f0;
          }
        `
      case 'danger':
        return `
          background: transparent;
          color: #ef4444;
          padding: 8px;
          &:hover {
            background: #fef2f2;
            color: #dc2626;
          }
          &:active {
            background: #fee2e2;
          }
        `
      default:
        return `
          background: #ebf5ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          &:hover {
            background: #dbeafe;
            color: #1d4ed8;
            border-color: #93c5fd;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -2px rgba(37, 99, 235, 0.1);
          }
          &:active {
            transform: translateY(0);
            box-shadow: none;
          }
        `
    }
  }}
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 24px;
  overflow-y: auto;
  animation: fadeIn 0.2s ease-out;

  @media (max-width: 640px) {
    padding: 16px;
  }
`

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100dvh - 48px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  @media (max-width: 640px) {
    max-height: calc(100dvh - 32px);
  }
`

export const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 10;
  border-radius: 24px 24px 0 0;

  h2 {
    margin: 0;
    font-size: 23px;
    font-weight: 900;
    color: #0f172a;

    @media (max-width: 480px) {
      font-size: 19px;
    }
  }
`

export const CloseButton = styled.button`
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

export const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
`

export const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
  border-radius: 0 0 24px 24px;
`

// Form Components
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`

export const Input = styled.input`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: clamp(14px, 3.5vw, 15px);
  color: #0f172a;
  transition: all 0.2s ease;
  background: #ffffff;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`

export const Badge = styled.span<{ $color?: string; $bg?: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ $bg }) => $bg || '#f1f5f9'};
  color: ${({ $color }) => $color || '#475569'};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

export const SearchPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: ${FONT_STACK};
  animation: ${fadeIn} 0.35s ease-out;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

export const SearchCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(191, 219, 254, 0.7);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.06),
    0 20px 40px rgba(15, 23, 42, 0.05);
  border-radius: 20px;
  overflow: hidden;
`

export const SearchCardHeader = styled.div`
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

export const SearchCardTitle = styled.h2`
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

export const SearchCardSubtitle = styled.p`
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
    
      ${SearchCardHeader}:hover & {
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

export const SearchFilterBar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(238, 242, 247, 0.9);
  background: #fafbff;

  @media (max-width: 1280px) {
    grid-template-columns: auto repeat(2, 1fr) auto;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const FilterLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  white-space: nowrap;
  min-height: 40px;

  @media (max-width: 1280px) {
    grid-column: 1 / -1;
    min-height: auto;
  }

  @media (max-width: 600px) {
    grid-column: 1;
  }
`

export const SearchFilterInput = styled.input`
  ${controlBase}
`

export const SearchFilterSelect = styled.select`
  ${controlBase}
  padding-right: 42px;
  cursor: pointer;
  appearance: none;
  background: #ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 14px center;
`

export const SearchResetBtn = styled.button`
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  background: #ffffff;
  color: #374151;
  font-family: ${FONT_STACK};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: #2563eb;
    background: #f0f4ff;
    color: #1e40af;
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
  }
`

export const SearchTableWrap = styled.div`
  --scroll-hint-opacity: 0;
  position: relative;
  width: calc(100% - 40px);
  max-width: calc(100% - 40px);
  margin: 18px auto 20px;
  overflow: hidden;
  border: 1px solid rgba(191, 219, 254, 0.78);
  border-radius: 18px;
  background:
    linear-gradient(#ffffff, #ffffff) padding-box,
    linear-gradient(135deg, rgba(147, 197, 253, 0.7), rgba(221, 214, 254, 0.65), rgba(226, 232, 240, 0.9)) border-box;
  box-shadow:
    0 16px 36px rgba(15, 23, 42, 0.08),
    0 4px 12px rgba(37, 99, 235, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 42px;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0));
    z-index: 2;
  }

  @media (max-width: 768px) {
    width: calc(100% - 24px);
    max-width: calc(100% - 24px);
    margin: 14px auto 16px;
    border-radius: 14px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 132px;
    pointer-events: none;
    border-radius: 0 17px 17px 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.08) 18%,
      rgba(219, 234, 254, 0.18) 40%,
      rgba(196, 218, 254, 0.38) 72%,
      rgba(147, 197, 253, 0.46) 100%
    );
    backdrop-filter: blur(8px) saturate(1.35);
    -webkit-backdrop-filter: blur(8px) saturate(1.35);
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.04) 12%,
      rgba(0, 0, 0, 0.28) 34%,
      rgba(0, 0, 0, 0.72) 66%,
      #000000 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.04) 12%,
      rgba(0, 0, 0, 0.28) 34%,
      rgba(0, 0, 0, 0.72) 66%,
      #000000 100%
    );
    opacity: 0;
    z-index: 3;
    transition: opacity 0.16s ease-out, transform 0.24s ease;
    transform: translateX(8px);
  }

  /* Скрываем когда доскроллили до конца */
  &.is-scrollable::after {
    opacity: var(--scroll-hint-opacity);
    transform: translateX(0);
  }

  &.is-scrolled-end::after {
    opacity: 0;
    transform: translateX(8px);
  }

  @media (max-width: 768px) {
    &::after {
      width: 88px;
      border-radius: 0 13px 13px 0;
    }
  }

`

export const SearchTableViewport = styled.div`
  position: relative;
  z-index: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: inherit;

  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: rgba(241, 245, 249, 0.8); border-radius: 999px; }
  &::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 999px; &:hover { background: #93c5fd; } }
`

export const SearchTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  font-size: 14px;
  min-width: 700px;

  @media (max-width: 900px) {
    font-size: 13px;
  }
`

export const SearchThead = styled.thead`
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  border-bottom: 1px solid rgba(191, 219, 254, 0.5);
`

export const SearchTh = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  white-space: nowrap;
`

export const SearchTr = styled.tr`
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;

  &:not(:last-child) td {
    border-bottom: 1px solid #eef2f7;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.06);

    td {
      background: #f0f7ff;
    }
  }
`

export const SearchTd = styled.td`
  padding: 14px 16px;
  vertical-align: middle;
  color: #374151;

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`

export const SearchTdBold = styled(SearchTd)`
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
`

export const SearchTdMuted = styled(SearchTd)`
  color: #94a3b8;
  font-size: 13px;
`

export const PatientAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
  color: #3b82f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
`

export const PatientNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const StatusPill = styled.span<{ $status?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case 'hospitalized':
        return 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;'
      case 'outpatient':
        return 'background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe;'
      case 'discharged':
        return 'background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;'
      default:
        return 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;'
    }
  }}
`

export const SearchPaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid rgba(191, 219, 254, 0.5);
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const SearchPaginationInfo = styled.div`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`

export const SearchPaginationBtns = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

export const SearchPageBtn = styled.button<{ $active?: boolean }>`
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #1e40af;
    background: ${(p) => (p.$active ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : '#eff6ff')};
    color: ${(p) => (p.$active ? '#ffffff' : '#1e40af')};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`

export const SearchEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  gap: 12px;
  color: #94a3b8;

  svg {
    opacity: 0.35;
  }

  p {
    font-size: 15px;
    font-weight: 500;
    margin: 0;
    color: #94a3b8;
  }

  span {
    font-size: 13px;
    color: #cbd5e1;
  }
`

export const SearchResultsCount = styled.div`
  padding: 10px 20px 0;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;

  strong {
    color: #1e40af;
  }
`
