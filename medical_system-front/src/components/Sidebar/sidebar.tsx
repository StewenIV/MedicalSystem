import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  LayoutDashboard,
  Users,
  Thermometer,
  Calendar,
  BarChart3,
  Settings,
  FileUser,
  Stethoscope,
  Building2,
  Clock,
  Pill,
  ClipboardList,
  FlaskConical,
  UserCircle,
  FileText,
  Bell,
  UserCog
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar'
import { LogoBox, LogoTextBlock, LogoTitle, LogoSubtitle } from '@/pages/HomePage/styled'
import { cn } from '@/lib/utils'
import { selectUserRole } from 'features/App/selectors'
import { UserRole } from 'features/App/types'
import { usePatientNotifications } from 'context/PatientNotificationsContext'

interface AppSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

interface NavItem {
  key: string
  label: string
  icon: React.ElementType
  roles: UserRole[]
}

const ALL_NAV_ITEMS: NavItem[] = [
  {
    key: 'patients',
    label: 'Пациенты',
    icon: Users,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'ward-round',
    label: 'Обходы',
    icon: ClipboardList,
    roles: ['Doctor', 'ChiefDoctor']
  },
  {
    key: 'temperature-sheet',
    label: 'Температурный лист',
    icon: Thermometer,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'discharge',
    label: 'Выписка',
    icon: FileUser,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'HospitalWorkplace',
    label: 'Стационар',
    icon: Calendar,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'beds-admin',
    label: 'Администрирование стационара',
    icon: Building2,
    roles: ['ChiefDoctor']
  },
  {
    key: 'medical-staff-schedule',
    label: 'График работы медперсонала',
    icon: Clock,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'staff-admin',
    label: 'Управление персоналом',
    icon: UserCog,
    roles: ['ChiefDoctor']
  },
  {
    key: 'medicines',
    label: 'Учёт медикаментов',
    icon: Pill,
    roles: ['Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'patient-dashboard',
    label: 'Главная',
    icon: LayoutDashboard,
    roles: ['Patient']
  },
  {
    key: 'patient-exams',
    label: 'Результаты обследований',
    icon: FileText,
    roles: ['Patient']
  },
  {
    key: 'patient-docs',
    label: 'Медицинские документы',
    icon: ClipboardList,
    roles: ['Patient']
  },
  {
    key: 'patient-notifications',
    label: 'Уведомления',
    icon: Bell,
    roles: ['Patient']
  },
  {
    key: 'patient-profile',
    label: 'Мой профиль',
    icon: UserCircle,
    roles: ['Patient']
  },
  {
    key: 'laboratory',
    label: 'Лаборатория',
    icon: FlaskConical,
    roles: ['LaboratoryEmployee']
  }
]

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const userRole = useSelector(selectUserRole)
  const { unreadCount } = usePatientNotifications()

  const navItems = useMemo(() => {
    if (!userRole) return []
    return ALL_NAV_ITEMS.filter((item) => item.roles.includes(userRole))
  }, [userRole])

  return (
    <Sidebar>
      <SidebarHeader
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          padding: '24px 16px'
        }}
      >
        <LogoBox>
          <Stethoscope size={22} color="#fff" />
        </LogoBox>
        <LogoTextBlock>
          <LogoTitle>Пульмонология</LogoTitle>
          <LogoSubtitle>
            {userRole === 'Doctor' || userRole === 'ChiefDoctor'
              ? 'Панель врача'
              : userRole === 'Nurse' || userRole === 'HeadNurse'
                ? 'Панель медсестры'
                : userRole === 'LaboratoryEmployee'
                  ? 'Панель лаборатории'
                  : userRole === 'Patient'
                    ? 'Кабинет пациента'
                    : 'Медсистема'}
          </LogoSubtitle>
        </LogoTextBlock>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ key, label, icon: Icon }) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    className={cn(
                      'border-[1px] py-8 text-[18px] font-medium tracking-[-0.01em] py-[24px] gap-3',
                      'text-slate-600',
                      'data-[active=true]:text-blue-700 data-[active=true]:bg-blue-50 data-[active=true]:font-semibold'
                    )}
                    isActive={activeSection === key}
                    onClick={() => onSectionChange(key)}
                    tooltip={label}
                  >
                    <Icon size={24} style={{ minWidth: '24px', minHeight: '24px' }} />

                    <span className="h-6 w-[1px] bg-slate-200"></span>
                    <span>{label}</span>
                    {key === 'patient-notifications' && unreadCount > 0 && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          background: '#ef4444',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '99px',
                          minWidth: '16px',
                          textAlign: 'center'
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
