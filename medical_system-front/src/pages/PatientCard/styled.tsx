import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
`

export const PatientName = styled.h1`
  margin: 0;
  font-size: 28px;
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
  font-size: 15px;
  align-items: center;
  font-weight: 500;

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
  }

  .value {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
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
  font-size: 15px;
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

export const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: box-shadow 0.2s ease;
  overflow-x: auto;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  }

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 16px;

    .actions {
      display: flex;
      gap: 8px;
    }
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
  font-size: 14px;
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
    font-size: 12px;
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
  font-size: 14px;
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
`

export const Input = styled.input`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 15px;
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
