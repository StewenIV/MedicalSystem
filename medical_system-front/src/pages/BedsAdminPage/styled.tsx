import styled, { css, keyframes } from 'styled-components'

// ─── Tokens ───────────────────────────────────────────────────────────────────

const FONT = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ─── Page shell ───────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  font-family: ${FONT};
  padding: 32px 40px 48px;
  animation: ${fadeUp} 0.3s ease both;
`

export const TwoColLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
`

// ─── Page header ──────────────────────────────────────────────────────────────

export const PageTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
`

export const PageTitleBlock = styled.div``

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.04em;
  margin: 0 0 4px;
`

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
`

export const StatsBadgesRow = styled.div`
  display: flex;
  gap: 12px;
`

export const StatBadge = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 20px;
  min-width: 110px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`

export const StatBadgeLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 4px;
`

export const StatBadgeValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.04em;
  line-height: 1;
`

// ─── Filter bar ───────────────────────────────────────────────────────────────

export const FilterBar = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

export const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #374151;
  flex-shrink: 0;
`

export const FilterSelect = styled.select`
  height: 34px;
  padding: 0 28px 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  background: #f9fafb url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 8px center;
  appearance: none;
  font-family: ${FONT};
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #6366f1; }
`

export const SearchInput = styled.input`
  height: 34px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  background: #f9fafb;
  font-family: ${FONT};
  font-size: 13px;
  color: #374151;
  outline: none;
  width: 160px;
  transition: border-color 0.15s, background 0.15s;
  &::placeholder { color: #94a3b8; }
  &:focus { border-color: #6366f1; background: #fff; }
`

export const ResetBtn = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.14s;
  &:hover { border-color: #9ca3af; background: #f3f4f6; }
`

// ─── Table ────────────────────────────────────────────────────────────────────

export const TableWrap = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
`

export const Thead = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
`

export const Th = styled.th`
  padding: 11px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #94a3b8;
  white-space: nowrap;
`

export const Tbody = styled.tbody``

export const Tr = styled.tr<{ $selected?: boolean }>`
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  background: ${p => p.$selected ? '#f0f9ff' : 'transparent'};
  transition: background 0.12s;

  &:last-child { border-bottom: none; }
  &:hover { background: ${p => p.$selected ? '#e0f2fe' : '#f8fafc'}; }
`

export const Td = styled.td`
  padding: 13px 16px;
  color: #374151;
  vertical-align: middle;
`

export const TdBold = styled(Td)`
  font-weight: 700;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
`

export const TdMuted = styled(Td)`
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
`

// ─── Room type badge ──────────────────────────────────────────────────────────

export const TypeBadge = styled.span<{ $type: 'Обычная' | 'Реанимация' | 'Изолятор' }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  ${p => {
    if (p.$type === 'Реанимация') return css`background:#fee2e2;color:#991b1b;`
    if (p.$type === 'Изолятор')   return css`background:#fef9c3;color:#92400e;`
    return css`background:#dbeafe;color:#1e40af;`
  }}
`

// ─── Gender cell ──────────────────────────────────────────────────────────────

export const GenderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #374151;
`

// ─── Bed count cell ───────────────────────────────────────────────────────────

export const BedCountCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`

export const BedCountNum = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
`

export const BedCountUnit = styled.div`
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
`

// ─── Priority bar ─────────────────────────────────────────────────────────────

export const PriorityWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const PriorityBar = styled.div<{ $filled: boolean }>`
  width: 5px;
  height: 16px;
  border-radius: 2px;
  background: ${p => p.$filled ? '#0f172a' : '#e5e7eb'};
`

// ─── Actions ──────────────────────────────────────────────────────────────────

export const ActionCell = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

export const ActionIconBtn = styled.button<{ $danger?: boolean }>`
  width: 28px; height: 28px;
  border-radius: 6px;
  border: 1px solid ${p => p.$danger ? '#fecaca' : '#e5e7eb'};
  background: ${p => p.$danger ? '#fff5f5' : '#fff'};
  color: ${p => p.$danger ? '#dc2626' : '#6b7280'};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.14s;
  &:hover {
    border-color: ${p => p.$danger ? '#f87171' : '#9ca3af'};
    background: ${p => p.$danger ? '#fee2e2' : '#f3f4f6'};
  }
`

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #f1f5f9;
  background: #fafafa;
`

export const PaginationInfo = styled.div`
  font-size: 12px;
  color: #94a3b8;
`

export const PaginationBtns = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 30px; height: 30px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid ${p => p.$active ? '#0f172a' : '#e5e7eb'};
  background: ${p => p.$active ? '#0f172a' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#374151'};
  font-family: ${FONT};
  font-size: 13px;
  font-weight: ${p => p.$active ? '700' : '400'};
  cursor: pointer;
  transition: all 0.14s;
  &:hover:not(:disabled) {
    border-color: ${p => p.$active ? '#0f172a' : '#9ca3af'};
    background: ${p => p.$active ? '#0f172a' : '#f3f4f6'};
  }
  &:disabled { opacity: 0.4; cursor: default; }
`

// ─── Right panel — editor ─────────────────────────────────────────────────────

export const EditorPanel = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  position: sticky;
  top: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
`

export const EditorTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin: 0 0 4px;
`

export const EditorSubtitle = styled.p`
  font-size: 12.5px;
  color: #94a3b8;
  margin: 0 0 20px;
  line-height: 1.5;
`

export const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 18px 0;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`

export const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${p => p.$fullWidth && 'grid-column: 1 / -1;'}
`

export const FormLabel = styled.label`
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #64748b;
`

export const FormInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: ${FONT};
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
`

export const FormSelect = styled.select`
  height: 38px;
  padding: 0 28px 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 10px center;
  appearance: none;
  font-family: ${FONT};
  font-size: 14px;
  color: #0f172a;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
  &:focus { border-color: #6366f1; }
`

// ─── Radio group ──────────────────────────────────────────────────────────────

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  color: #374151;
  cursor: pointer;
  user-select: none;

  input[type="radio"] {
    width: 16px; height: 16px;
    accent-color: #0f172a;
    cursor: pointer;
  }
`

// ─── Priority slider ──────────────────────────────────────────────────────────

export const SliderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const SliderLabel = styled.div`
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PriorityBadge = styled.span`
  background: #f1f5f9;
  color: #374151;
  border-radius: 5px;
  padding: 2px 7px;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`

export const PriorityLevelLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`

export const RangeInput = styled.input`
  width: 100%;
  height: 4px;
  appearance: none;
  background: #0f172a;
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #0f172a;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    cursor: pointer;
    transition: box-shadow 0.14s;
  }
  &::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 4px rgba(15,23,42,0.1);
  }
`

// ─── Beds management ──────────────────────────────────────────────────────────

export const BedsMgmtHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const BedsMgmtTitle = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
`

export const AddBedBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-family: ${FONT};
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.14s;
  &:hover { border-color: #9ca3af; background: #f9fafb; }
`

export const BedsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const BedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
  transition: border-color 0.14s;
  &:hover { border-color: #d1d5db; }
`

export const BedTag = styled.div`
  width: 28px; height: 28px;
  border-radius: 6px;
  background: #0f172a;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  letter-spacing: 0.02em;
  flex-shrink: 0;
`

export const BedInfo = styled.div`
  flex: 1;
`

export const BedName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.01em;
`

export const BedId = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 1px;
  font-variant-numeric: tabular-nums;
`

export const BedStatus = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #16a34a;
`

export const BedDeleteBtn = styled.button`
  width: 26px; height: 26px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  background: #fff5f5;
  color: #dc2626;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.14s; flex-shrink: 0;
  &:hover { background: #fee2e2; border-color: #f87171; }
`

// ─── Editor footer ─────────────────────────────────────────────────────────────

export const EditorFooter = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`

export const SaveBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border-radius: 9px;
  border: none;
  background: #0f172a;
  color: #fff;
  font-family: ${FONT};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: background 0.15s, transform 0.15s;
  &:hover { background: #1e293b; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

export const ResetEditorBtn = styled.button`
  width: 42px; height: 42px;
  border-radius: 9px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.14s; flex-shrink: 0;
  &:hover { border-color: #9ca3af; background: #f3f4f6; }
`