import styled from 'styled-components'
import colors from 'consts/colors'

export const HomePageContainer = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
`

export const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`

export const HeaderInner = styled.div`
  padding: 16px 24px;
`

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const ContentLayout = styled.div`
  display: flex;
  align-items: flex-start;
`

export const Sidebar = styled.aside`
  width: 256px;
  background: white;
  border-right: 1px solid #e5e7eb;
  min-height: calc(100vh - 73px);
`

export const SidebarNav = styled.nav`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Main = styled.main`
  flex: 1;
  padding: 24px;
`

export const LogoBox = styled.div`
  width: 40px;
  height: 40px;
  background: ${colors.mainColor};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

export const NavButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  color: ${({ $active }) => ($active ? colors.mainColor : '#374151')};
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`

export const IconButton = styled.button`
  position: relative;
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`

export const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
`

export const CardBody = styled.div`
  padding: 16px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const AppointmentRow = styled.div<{ $clickable?: boolean }>`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ $clickable }) => ($clickable ? '#f9fafb' : 'transparent')};
  }
`

export const StatusBadge = styled.span<{
  status: 'Ожидается' | 'На приеме' | 'Завершено' | 'Свободно'
}>`
  padding: 4px 12px;
  border-radius: 9px;
  font-weight: 500;

  ${({ status }) =>
    status === 'Ожидается' &&
    `
      background:#dbeafe;
      color:#1e40af;
  `}
  ${({ status }) =>
    status === 'На приеме' &&
    `
      background:#dcfce7;
      color:#166534;
  `}
  ${({ status }) =>
    status === 'Завершено' &&
    `
      background:#f3f4f6;
      color:#374151;
  `}
  ${({ status }) =>
    status === 'Свободно' &&
    `
      background:#f9fafb;
      color:#9ca3af;
  `}
`

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
`

export const NotificationPanel = styled.div`
  position: fixed;
  top: 80px;
  right: 24px;
  width: 384px;
  max-height: 80vh;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const NotificationItem = styled.div<{ read?: boolean }>`
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  background: ${({ read }) => (read ? '#fafafa' : 'white')};
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`

export const NotificationContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`

export const NotificationIconWrapper = styled.div<{
  severity?: 'critical' | 'warning' | 'info'
}>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ severity }) => {
    switch (severity) {
      case 'critical':
        return `
          background: #fee2e2;
          color: #dc2626;
        `
      case 'warning':
        return `
          background: #fef3c7;
          color: #d97706;
        `
      default:
        return `
          background: #dbeafe;
          color: #2563eb;
        `
    }
  }}
`

export const NotificationBody = styled.div`
  flex: 1;
  min-width: 0;
`

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 4px;
`

export const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  line-height: 1.4;
`

export const NotificationTime = styled.div`
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  flex-shrink: 0;
`

export const NotificationMessage = styled.div`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 4px;
  line-height: 1.4;
`

export const NotificationDetails = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
  border-left: 3px solid #d1d5db;

  strong {
    color: #374151;
  }
`

export const NotificationPatient = styled.div`
  font-size: 13px;
  color: #374151;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    font-size: 12px;
    color: #6b7280;
  }
`

export const SeverityBadge = styled.span<{ severity: 'critical' | 'warning' }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;

  ${({ severity }) => {
    switch (severity) {
      case 'critical':
        return `
          background: #fee2e2;
          color: #991b1b;
        `
      case 'warning':
        return `
          background: #fef3c7;
          color: #92400e;
        `
    }
  }}
`

export const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
`

export const EmptyNotifications = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #9ca3af;

  svg {
    margin: 0 auto 12px;
    opacity: 0.5;
  }

  p {
    font-size: 14px;
  }
`
