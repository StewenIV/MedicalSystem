import { useMemo } from 'react'
import {
  LayoutDashboard,
  Users,
  Thermometer,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  FileUser,
  Stethoscope,
  Building2,
  Clock
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

interface AppSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const navItems = useMemo(
    () => [
      { key: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
      { key: 'patients', label: 'Пациенты', icon: Users },
      { key: 'temperature-sheet', label: 'Температурный лист', icon: Thermometer },
      { key: 'HospitalWorkplace', label: 'Стационар', icon: Calendar },
      { key: 'beds-admin', label: 'Администрирование стационара', icon: Building2 },
      { key: 'patient-card', label: 'Карточка пациента', icon: FileUser },
      { key: 'medical-staff-schedule', label: 'График работы медперсонала', icon: Clock },
      { key: 'reports', label: 'Отчёты', icon: BarChart3 },
      { key: 'settings', label: 'Управление', icon: Settings }
    ],
    []
  )

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
