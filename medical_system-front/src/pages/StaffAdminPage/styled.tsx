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

  &:disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
    border-color: #cbd5e1;
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
`

export const CardContent = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 18px;
  }
`

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 4px 10px;

  @media (max-width: 768px) {
    padding: 0;
    flex-direction: column;
    align-items: flex-start;
  }
`

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  transition: filter 0.25s ease, letter-spacing 0.25s ease;

  &:hover {
    filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.28));
    letter-spacing: -0.035em;
  }

  @media (max-width: 1024px) {
    font-size: 24px;
  }
`

export const CardSubtitle = styled.p`
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
 
   ${CardHeader}:hover & {
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

export const TwoColLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
  gap: 24px;
  align-items: start;

  > div {
    min-width: 0;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const FilterBar = styled.div`
  ${softCard};
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
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
`

export const AddStaffBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  font-family: ${FONT_STACK};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  &:active {
    transform: translateY(0);
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
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
  color: #0f172a;
`

export const TdMuted = styled(Td)`
  color: #94a3b8;
`

export const RoleBadge = styled.span<{ $role?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid transparent;

  ${(p) => {
    switch (p.$role) {
      case 'ChiefDoctor':
        return css`
          background: rgba(109, 40, 217, 0.1);
          color: #6d28d9;
          border-color: rgba(109, 40, 217, 0.25);
        `
      case 'Doctor':
        return css`
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          border-color: rgba(37, 99, 235, 0.25);
        `
      case 'HeadNurse':
        return css`
          background: rgba(13, 148, 136, 0.1);
          color: #0d9488;
          border-color: rgba(13, 148, 136, 0.25);
        `
      case 'Nurse':
        return css`
          background: rgba(219, 39, 119, 0.1);
          color: #db2777;
          border-color: rgba(219, 39, 119, 0.25);
        `
      case 'LaboratoryEmployee':
        return css`
          background: rgba(217, 119, 6, 0.1);
          color: #d97706;
          border-color: rgba(217, 119, 6, 0.25);
        `
      default:
        return css`
          background: rgba(100, 116, 139, 0.1);
          color: #64748b;
          border-color: rgba(100, 116, 139, 0.25);
        `
    }
  }}
`

export const ActionCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

export const ActionIconBtn = styled.button<{ $danger?: boolean }>`
  padding: 6px;
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

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.5)' : '#2563eb')};
    background: ${(p) => (p.$danger ? 'rgba(239, 68, 68, 0.1)' : '#eff6ff')};
  }
`

export const EditorPanel = styled.div`
  ${softCard};
  position: sticky;
  top: 24px;
  border-radius: 16px;
  padding: 20px;
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
  height: 1px;
  margin: 16px 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(147, 197, 253, 0.95) 50%,
    transparent 100%
  );
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

export const PasswordInput = styled(Input)`
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

export const EditorFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
`

export const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  font-family: ${FONT_STACK};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.28);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`

export const ResetEditorBtn = styled.button`
  height: 40px;
  padding: 0 16px;
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
    background-color 0.2s ease;

  &:hover {
    border-color: #2563eb;
    background: #f0f4ff;
    color: #1e40af;
  }
`

export const PasswordHint = styled.span`
  font-size: 11px;
  color: #94a3b8;
  margin-top: -4px;
`

export const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-top: 1px solid rgba(191, 219, 254, 0.5);
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
`

export const PaginationInfo = styled.div`
  font-size: 12px;
  color: #94a3b8;
`

export const PaginationBtns = styled.div`
  display: flex;
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
  transition: all 0.2s ease;

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
