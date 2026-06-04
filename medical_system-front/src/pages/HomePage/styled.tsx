import styled, { css } from 'styled-components'
import colors from 'consts/colors'


const FONT = `'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`


export const HomePageContainer = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  font-family: ${FONT};
  display: flex;
  flex-direction: column;
`


export const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
`

export const HeaderInner = styled.div`
  padding: 8px 24px;
  min-height: 64px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: auto 1fr auto;
  }

  @media (max-width: 640px) {
    position: relative;
    grid-template-columns: auto auto;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export const FlexRight = styled(Flex)`
justify-content: flex-end;
  gap: 12px;
  flex-wrap: nowrap;
  min-width: 0;

  @media (max-width: 900px) {
    gap: 10px;
  }

  @media (max-width: 640px) {
    justify-self: end;
    gap: 8px;
  }

  @media (max-width: 480px) {
    justify-self: start;
    width: 100%;
    justify-content: space-between;
  }
`


export const LogoBox = styled.div`
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.28);
  flex-shrink: 0;
`

export const LogoTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

export const LogoTitle = styled.span`
  font-family: ${FONT};
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.15;

  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  filter: drop-shadow(0 1px 1px rgba(15, 23, 42, 0.1));
`

export const LogoSubtitle = styled.span`
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
`


export const DateLabel = styled.div`
   display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.01em;
  white-space: nowrap;

  svg {
    opacity: 0.6;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    font-size: 12px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`


export const ContentLayout = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: stretch;
`

export const Sidebar = styled.aside`
  width: 256px;
  background: white;
  border-right: 1px solid #e5e7eb;
  flex-shrink: 0;
  min-height: 0;
`

export const SidebarNav = styled.nav`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const SidebarGroupLabel = styled.div`
  font-family: ${FONT};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  padding: 10px 12px 6px;
`

export const NavButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  color: ${({ $active }) => ($active ? colors.mainColor : '#374151')};
  font-family: ${FONT};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '450')};
  letter-spacing: ${({ $active }) => ($active ? '-0.01em' : '0')};
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  svg {
    opacity: ${({ $active }) => ($active ? 1 : 0.55)};
    transition: opacity 0.15s;
  }

  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 25%;
    bottom: 25%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: ${({ $active }) => ($active ? colors.mainColor : 'transparent')};
    transition: background 0.15s;
  }

  &:hover {
    background: #f8faff;
    color: ${colors.mainColor};
    svg {
      opacity: 0.85;
    }
  }
`


export const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`


export const SectionTitle = styled.h2`
  font-family: ${FONT};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin: 0 0 2px;
`

export const SectionSubtitle = styled.p`
  font-family: ${FONT};
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 20px;
  font-weight: 400;
`


export const Card = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`

export const CardHeader = styled.div`
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f1f5f9;
  font-family: ${FONT};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #0f172a;
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
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  border-radius: 6px;
  transition: background 0.12s;

  font-family: ${FONT};
  font-size: 14px;
  color: #1e293b;

  strong {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }

  &:hover {
    background: ${({ $clickable }) => ($clickable ? '#f8faff' : 'transparent')};
  }
`


export const StatusBadge = styled.span<{
  status: 'Ожидается' | 'На приеме' | 'Завершено' | 'Свободно'
}>`
  padding: 3px 10px;
  border-radius: 20px;
  font-family: ${FONT};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;

  ${({ status }) => status === 'Ожидается' && `background:#dbeafe; color:#1e40af;`}
  ${({ status }) => status === 'На приеме' && `background:#dcfce7; color:#166534;`}
  ${({ status }) => status === 'Завершено' && `background:#f1f5f9; color:#475569;`}
  ${({ status }) => status === 'Свободно' && `background:#f9fafb; color:#9ca3af;`}
`


export const IconButton = styled.button`
    position: relative;
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #374151;
  transition:
    background 0.15s,
    color 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
    color: ${colors.mainColor};
  }

  @media (max-width: 640px) {
    padding: 7px;
  }

  @media (max-width: 480px) {
    padding: 6px;
  }
`

export const SearchWrapper = styled.div<{ $open?: boolean }>`
  width: 100%;
  max-width: 480px;
  justify-self: center;
  min-width: 0;
  transition: all 0.25s ease;

  @media (max-width: 640px) {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 70px;

    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transform: ${({ $open }) =>
      $open ? 'translateY(0)' : 'translateY(-10px)'};
    pointer-events: ${({ $open }) =>
      $open ? 'auto' : 'none'};

    background: white;
    padding: 8px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 20;
  }
`

export const SearchIconButton = styled(IconButton)`
  display: none;

  @media (max-width: 640px) {
    display: flex;
  }
`

export const Separator = styled.div`
   width: 1px;
  height: 30px;
  background: #e5e7eb;
  flex-shrink: 0;

  @media (max-width: 640px) {
    display: none;
  }
`

export const AccountInfo = styled.div`
display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px;
  min-width: 0;

  @media (max-width: 900px) {
    gap: 8px;
    padding: 0 4px;
  }

  @media (max-width: 640px) {
    padding: 0;
  }
`

export const AccountText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  line-height: 1.2;

  @media (max-width: 900px) {
    gap: 1px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`

export const AccountName = styled.span`
   font-family: ${FONT};
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: -0.01em;
  white-space: nowrap;

  @media (max-width: 900px) {
    font-size: 13px;
  }
`

export const AccountRole = styled.span`
  font-family: ${FONT};
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  letter-spacing: 0;
  white-space: nowrap;

  @media (max-width: 900px) {
    font-size: 11px;
  }
`

export const AccountAvatar = styled.div`
    width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: ${FONT};
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.28);

  @media (max-width: 900px) {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 12px;
  }
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
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const NotificationItem = styled.div<{ read?: boolean }>`
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  background: ${({ read }) => (read ? '#fafafa' : 'white')};
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8faff;
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
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ severity }) => {
    switch (severity) {
      case 'critical':
        return `background:#fee2e2; color:#dc2626;`
      case 'warning':
        return `background:#fef3c7; color:#d97706;`
      default:
        return `background:#dbeafe; color:#2563eb;`
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
  font-family: ${FONT};
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  letter-spacing: -0.01em;
`

export const NotificationTime = styled.div`
  font-family: ${FONT};
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.01em;
`

export const NotificationMessage = styled.div`
  font-family: ${FONT};
  font-size: 13px;
  color: #475569;
  margin-bottom: 4px;
  line-height: 1.5;
`

export const NotificationDetails = styled.div`
  font-family: ${FONT};
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
  padding: 7px 10px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #cbd5e1;
  line-height: 1.5;

  strong {
    color: #334155;
    font-weight: 600;
  }
`

export const NotificationPatient = styled.div`
  font-family: ${FONT};
  font-size: 13px;
  color: #334155;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-weight: 600;
  }

  span {
    font-size: 11px;
    color: #94a3b8;
    letter-spacing: 0.01em;
  }
`

export const SeverityBadge = styled.span<{ severity: 'critical' | 'warning' }>`
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  font-family: ${FONT};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 4px;

  ${({ severity }) => severity === 'critical' && `background:#fee2e2; color:#991b1b;`}
  ${({ severity }) => severity === 'warning' && `background:#fef3c7; color:#92400e;`}
`

export const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 17px;
  height: 17px;
  background: #ef4444;
  color: white;
  border-radius: 9px;
  font-family: ${FONT};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`

export const EmptyNotifications = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #94a3b8;

  svg {
    margin: 0 auto 12px;
    opacity: 0.4;
  }

  p {
    font-family: ${FONT};
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
    margin: 0;
  }
`
