import styled, { keyframes, css } from 'styled-components'
import { Activity } from 'lucide-react'


const FONT_STACK = `
  'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont,
  'Segoe UI', system-ui, sans-serif
`
export const gradientText = (gradient: string) => css`
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`
const FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
const GRADIENT_ACCENT = 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'
const GRADIENT_SHIMMER = 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`

const shimmer = keyframes`
  0%   { background-position: -200% center }
  100% { background-position:  200% center }
`

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: ${FONT};
  color: #0f172a;
  animation: ${fadeIn} 0.4s ease-out;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-bottom: 40px;
`

export const CardHeader = styled.div`
  padding: 18px 24px 16px;
  border-bottom: 1px solid rgba(238, 242, 247, 0.9);
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.07);
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
    transition: all 0.2s ease;
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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`

export const StatCard = styled.div<{ $color: string; $bg: string }>`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  display: flex;
  flex-direction: column;
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
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
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    border-color: rgba(15, 23, 42, 0.12);
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

export const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.9px;
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

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 850;
  color: #0f172a;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-top: 8px;
  margin-bottom: 6px;
`

export const StatSub = styled.div`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`

export const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
  
  svg {
    position: absolute;
    left: 12px;
    color: #94a3b8;
    pointer-events: none;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px 0 38px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`

export const DropdownSelect = styled.select`
  height: 40px;
  padding: 0 32px 0 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  min-width: 160px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`

export const ResultDropdownSelect = styled(DropdownSelect)`
  width: 100%;
  height: 36px;
`

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  width: 100%;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  min-width: 800px;
`

export const TableTh = styled.th`
  padding: 14px 16px;
  font-weight: 700;
  color: #475569;
  background: #f8fafc;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  user-select: none;

  &.sortable {
    cursor: pointer;
    &:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
  }
`

export const TableRow = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8fafc;
  }
`

export const TableTd = styled.td`
  padding: 14px 16px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  white-space: nowrap;
`

export const StatusPill = styled.span<{ $status: string }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 650;
  
  ${({ $status }) => {
    switch ($status) {
      case 'Завершено':
        return css`
          background-color: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        `
      case 'В работе':
        return css`
          background-color: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        `
      case 'Назначено':
      default:
        return css`
          background-color: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        `
    }
  }}
`

export const ActionButton = styled.button<{ $variant?: 'primary' | 'ghost' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  ${({ $variant }) => {
    switch ($variant) {
      case 'ghost':
        return css`
          background: transparent;
          color: #64748b;
          &:hover {
            background: #f1f5f9;
            color: #0f172a;
          }
          &:active {
            background: #e2e8f0;
          }
        `
      case 'danger':
        return css`
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
          &:hover {
            background: #fee2e2;
            color: #dc2626;
            border-color: #fca5a5;
          }
        `
      case 'primary':
      default:
        return css`
          background: #2563eb;
          color: #ffffff;
          &:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -2px rgba(37, 99, 235, 0.15);
          }
          &:active {
            transform: translateY(0);
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`

export const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  flex-wrap: wrap;
  gap: 12px;
`

export const PaginationInfo = styled.div`
  font-size: 13px;
  color: #64748b;
`

export const PaginationBtns = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`

export const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? '#2563eb' : '#e2e8f0')};
  background: ${({ $active }) => ($active ? '#2563eb' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#475569')};
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#2563eb' : '#f8fafc')};
    border-color: ${({ $active }) => ($active ? '#2563eb' : '#cbd5e1')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
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
`

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: calc(100vh - 48px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-radius: 20px 20px 0 0;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
  }
`

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #0f172a;
    background: #e2e8f0;
  }
`

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
`

export const PatientInfoBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }
`

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #334155;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 8px;
`

export const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`

export const ResultFieldCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;
  background: #ffffff;

  &:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  }
`

export const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const FieldLabel = styled.label`
  font-size: 13.5px;
  font-weight: 650;
  color: #1e293b;
`

export const ReferenceBadge = styled.span`
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
`

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const InputField = styled.input`
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
  outline: none;
  font-weight: 600;
  text-align: right;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #2563eb;
  }
`

export const UnitLabel = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  min-width: 44px;
`

export const InterpretationLabel = styled.div<{ $severity: 'normal' | 'warning' | 'critical' }>`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-align: center;
  
  ${({ $severity }) => {
    switch ($severity) {
      case 'critical':
        return css`
          background-color: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
        `;
      case 'warning':
        return css`
          background-color: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        `;
      case 'normal':
      default:
        return css`
          background-color: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        `;
    }
  }}
`

export const ResetButton = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #cbd5e1;
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  text-align: center;
  color: #94a3b8;

  svg {
    opacity: 0.7;
  }

  p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const LoadingSpinner = styled(Activity)`
  animation: ${rotate} 1.5s linear infinite;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const PageSizeSelect = styled.select`
  height: 32px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  outline: none;
`

export const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const HeaderSubtitle = styled.div`
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

export const EmployeeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

export const EmployeeName = styled.span`
  font-size: 13px;
  font-weight: 600;
`

export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 6px;
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const PageSizeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const PageSizeLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
`

export const ResultSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
`

export const SummaryItem = styled.div``

export const SummaryItemFull = styled.div`
  grid-column: span 2;
`

export const CommentsGroup = styled(FormGroup)`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const CommentsLabel = styled.label`
  font-size: 13.5px;
  font-weight: 700;
  color: #334155;
`

export const CommentsTextarea = styled(SearchInput)`
  min-height: 70px;
  padding-top: 10px;
  padding-left: 14px;
  resize: vertical;
`

export const ConclusionBlock = styled.div`
  margin-top: 10px;
`

export const ConclusionTitle = styled.strong``

export const ConclusionText = styled.div`
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-top: 6px;
  font-style: italic;
  font-size: 13.5px;
`


export const PrintWrapper = styled.div`
  position: absolute;
  left: -9999px;
  top: -9999px;
`

export const PrintContainer = styled.div`
  width: 700px;
  padding: 45px 55px;
  background-color: #ffffff;
  color: #1e293b;
  font-family: ${FONT};
  line-height: 1.5;
  font-size: 13px;
`

export const PrintHeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #0f172a;
  padding-bottom: 16px;
  margin-bottom: 24px;
`

export const PrintHospitalName = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #1e40af;
`

export const PrintDepartmentName = styled.div`
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  margin-top: 2px;
`

export const PrintAddress = styled.div`
  font-size: 10px;
  color: #94a3b8;
  margin-top: 2px;
`

export const PrintDateInfo = styled.div`
  text-align: right;
  font-size: 11px;
  color: #64748b;
`

export const PrintTitleContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

export const PrintTitle = styled.h2`
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  color: #0f172a;
  letter-spacing: 0.5px;
`

export const PrintSubtitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #2563eb;
  margin-top: 4px;
`

export const PrintPatientCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
`

export const PrintTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
`

export const PrintTh = styled.th`
  padding: 10px 12px;
  text-align: left;
  font-weight: 700;
  font-size: 11px;
  color: #475569;
  text-transform: uppercase;
  background: #f1f5f9;
  border-bottom: 2px solid #cbd5e1;
`

export const PrintTd = styled.td`
  padding: 10px 12px;
`

export const PrintTableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
`

export const PrintConclusionBlock = styled.div`
  margin-top: 20px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #cbd5e1;
`

export const PrintConclusionText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  font-style: italic;
  color: #334155;
`

export const PrintSignaturesFlex = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  border-top: 1px dashed #cbd5e1;
  padding-top: 20px;
`

export const PrintSignatureLine = styled.div`
  margin-top: 10px;
  font-size: 11px;
  color: #94a3b8;
`


