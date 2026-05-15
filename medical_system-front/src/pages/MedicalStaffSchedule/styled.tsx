import styled from 'styled-components'

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`

export const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`

export const MonthYearSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const MonthDisplay = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  padding: 8px 16px;
  background: #f0f4f8;
  border-radius: 6px;
  min-width: 200px;
  text-align: center;
`

export const NavigationButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #2563eb;
  }

  &:active {
    background: #1d4ed8;
  }
`

export const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    background: #f8f9fa;
    border-bottom: 2px solid #e2e8f0;
  }

  th {
    padding: 16px 12px;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    white-space: nowrap;
    position: sticky;
    top: 0;
    background: #f8f9fa;
    border-right: 1px solid #e2e8f0;

    &:last-child {
      border-right: none;
    }
  }

  tbody tr {
    border-bottom: 1px solid #e2e8f0;
    transition: background 0.15s;

    &:hover {
      background: #f0f4f8;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 16px 12px;
    color: #4a5568;
    border-right: 1px solid #e2e8f0;

    &:last-child {
      border-right: none;
    }
  }
`

export const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const EmployeeName = styled.span`
  font-weight: 600;
  color: #1a1a1a;
`

export const Position = styled.span`
  font-size: 12px;
  color: #718096;
  font-style: italic;
`

export const ShiftCell = styled.td<{ isDay?: boolean; isDayOff?: boolean }>`
  background-color: ${(props) => {
    if (props.isDayOff) return '#fee2e2';
    if (props.isDay) return '#dbeafe';
    return 'white';
  }} !important;
  text-align: center;
  font-weight: 500;
  color: ${(props) => {
    if (props.isDayOff) return '#7f1d1d';
    if (props.isDay) return '#1e40af';
    return '#4a5568';
  }};
  min-width: 70px;
`

export const DayOffBadge = styled.span`
  display: inline-block;
  background: #fecaca;
  color: #7f1d1d;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`

export const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
  align-items: center;
`

export const FilterLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #a0aec0;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`

export const StatCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  h3 {
    font-size: 12px;
    font-weight: 600;
    color: #718096;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
  }
`

export const StickyNameColumn = styled.td`
  position: sticky;
  left: 0;
  background: white;
  z-index: 10;

  table tbody tr:hover & {
    background: #f0f4f8;
  }
`

export const NameColumnHeader = styled.th`
  position: sticky;
  left: 0;
  background: #f8f9fa;
  z-index: 11;
`

export const ExportButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #059669;
  }

  &:active {
    background: #047857;
  }
`
