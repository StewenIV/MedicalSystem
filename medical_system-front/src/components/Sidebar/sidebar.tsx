import { useMemo } from 'react'
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
  FlaskConical
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
    key: 'dashboard',
    label: 'Дашборд',
    icon: LayoutDashboard,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'patients',
    label: 'Пациенты',
    icon: Users,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'temperature-sheet',
    label: 'Температурный лист',
    icon: Thermometer,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'HospitalWorkplace',
    label: 'Стационар',
    icon: Calendar,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'ward-round',
    label: 'Обходы',
    icon: ClipboardList,
    roles: ['Doctor', 'ChiefDoctor']
  },
  {
    key: 'beds-admin',
    label: 'Администрирование стационара',
    icon: Building2,
    roles: ['ChiefDoctor']
  },
  {
    key: 'patient-card',
    label: 'Карточка пациента',
    icon: FileUser,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'medical-staff-schedule',
    label: 'График работы медперсонала',
    icon: Clock,
    roles: ['Doctor', 'Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'medicines',
    label: 'Учёт медикаментов',
    icon: Pill,
    roles: ['Nurse', 'HeadNurse', 'ChiefDoctor']
  },
  {
    key: 'reports',
    label: 'Отчёты',
    icon: BarChart3,
    roles: ['ChiefDoctor']
  },
  {
    key: 'settings',
    label: 'Управление',
    icon: Settings,
    roles: ['ChiefDoctor']
  }
]

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const userRole = useSelector(selectUserRole)

  const navItems = useMemo(() => {
    if (!userRole) return []
    return ALL_NAV_ITEMS.filter(item => item.roles.includes(userRole))
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
          <LogoSubtitle>Панель врача</LogoSubtitle>
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
