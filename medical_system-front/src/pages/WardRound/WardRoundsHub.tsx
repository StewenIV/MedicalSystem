import React, { useState, useMemo, useEffect } from 'react'
import { formatLocalDate, toBackendDateString } from 'utils/dateUtils'
import {
  Search,
  ClipboardList,
  Stethoscope,
  Calendar,
  CheckCircle2,
  Circle,
  Users,
  Activity,
  UserCheck,
  Clock,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { usePatientData } from 'context/PatientDataContext'

import {
  SearchPageWrapper,
  SearchCard,
  SearchCardHeader,
  SearchCardTitle,
  SearchCardSubtitle,
  SearchFilterBar,
  FilterLabel,
  SearchFilterInput,
  SearchResetBtn,
  SearchTableWrap,
  SearchTableViewport,
  SearchTable,
  SearchThead,
  SearchTh,
  SearchTr,
  SearchTd,
  SearchTdBold,
  SearchTdMuted,
  PatientAvatar,
  PatientNameCell,
  StatusPill,
  SearchEmptyState,
  SearchPaginationRow,
  SearchPaginationInfo,
  SearchPageSizeSelect,
  SearchPaginationBtns,
  SearchPageBtn,
} from 'pages/PatientCard/styled'

import {
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
} from 'pages/MedicinesPage/styled'

import styled from 'styled-components'

export const ActionButton = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'SF Pro Display', 'Inter', -apple-system, sans-serif;
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === 'primary'
      ? `
        background: linear-gradient(135deg, #1d4ed8, #3b82f6);
        color: white;
        border: none;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
      `
      : `
        background: white;
        color: #475569;
        border: 1px solid #e2e8f0;
        &:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          color: #0f172a;
        }
      `}
`



interface WardRoundsHubProps {
  onStartPrimary: (patientId: string) => void
  onStartDaily: (patientId: string) => void
  onOpenPatient: (patientId: string) => void
}

type FilterType = 'all' | 'today' | 'inspected' | 'waiting'


const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'П'
  return `${lastName?.[0] || ''}${firstName?.[0] || ''}`.toUpperCase()
}


const WardRoundsHub: React.FC<WardRoundsHubProps> = ({
  onStartPrimary,
  onStartDaily,
  onOpenPatient,
}) => {
  const { patients, getInspections } = usePatientData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [pageSize, setPageSize] = useState(8)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [query, filter])

  const today = formatLocalDate(new Date())
  const todayISO = toBackendDateString(new Date())

  const inpatients = useMemo(() => {
    return patients.filter(p =>
      p.status === 'Hospitalized' ||
      p.status === 'Outpatient' ||
      p.statusText?.toLowerCase().includes('госпитализ')
    )
  }, [patients])

  const getIsInspectedToday = (patientId: string) => {
    const insp = getInspections(patientId)
    return insp.some(i => i.date === todayISO)
  }

  const filtered = useMemo(() => {
    let list = inpatients

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        `${p.lastName} ${p.firstName} ${p.middleName}`.toLowerCase().includes(q) ||
        (p.medcardNum ?? '').toLowerCase().includes(q) ||
        p.id.includes(q)
      )
    }

    if (filter === 'inspected') list = list.filter(p => getIsInspectedToday(p.id))
    if (filter === 'waiting') list = list.filter(p => !getIsInspectedToday(p.id))

    return list
  }, [inpatients, query, filter, todayISO])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const safePage = Math.max(1, Math.min(page, totalPages || 1))

  const paginatedPatients = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage, pageSize])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const inspectedToday = inpatients.filter(p => getIsInspectedToday(p.id)).length
  const criticalCount = inpatients.filter(p => p.status === 'critical').length
  const waitingCount = inpatients.length - inspectedToday

  return (
    <SearchPageWrapper style={{ padding: 24, height: '100%', overflow: 'auto', background: '#f3f4f6' }}>
      <SearchCard style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <SearchCardHeader>
          <SearchCardTitle>Обходы пациентов</SearchCardTitle>
          <SearchCardSubtitle>
            {today} · Отделение пульмонологии
          </SearchCardSubtitle>
        </SearchCardHeader>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(238, 242, 247, 0.9)' }}>
          <StatsGrid>
            <StatCard $color="#3b82f6">
              <StatIcon $bg="#eff6ff" $color="#3b82f6">
                <Users size={20} />
              </StatIcon>
              <StatLabel>Всего пациентов</StatLabel>
              <StatValue>{inpatients.length}</StatValue>
            </StatCard>
            
            <StatCard $color="#10b981">
              <StatIcon $bg="#f0fdf4" $color="#10b981">
                <UserCheck size={20} />
              </StatIcon>
              <StatLabel>Осмотрено сегодня</StatLabel>
              <StatValue>{inspectedToday}</StatValue>
            </StatCard>
            
            <StatCard $color="#f59e0b">
              <StatIcon $bg="#fffbeb" $color="#f59e0b">
                <Clock size={20} />
              </StatIcon>
              <StatLabel>Ожидают осмотра</StatLabel>
              <StatValue>{waitingCount}</StatValue>
            </StatCard>
            
            <StatCard $color="#ef4444">
              <StatIcon $bg="#fef2f2" $color="#ef4444">
                <AlertTriangle size={20} />
              </StatIcon>
              <StatLabel>Критических</StatLabel>
              <StatValue>{criticalCount}</StatValue>
            </StatCard>
          </StatsGrid>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '18px 24px', borderBottom: '1px solid rgba(238, 242, 247, 0.9)', background: '#fafbff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FilterLabel style={{ minHeight: 'auto', margin: 0 }}>
              <SlidersHorizontal size={13} />
              Поиск:
            </FilterLabel>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none'
                }}
              />
              <SearchFilterInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по ФИО, номеру карты, ID"
                style={{ paddingLeft: 36, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <FilterLabel style={{ minHeight: 'auto', margin: 0 }}>Фильтры:</FilterLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <ActionButton 
                $variant={filter === 'all' ? 'primary' : 'ghost'} 
                onClick={() => setFilter('all')}
              >
                Все пациенты
              </ActionButton>
              <ActionButton 
                $variant={filter === 'waiting' ? 'primary' : 'ghost'} 
                onClick={() => setFilter('waiting')}
              >
                <Circle size={14} /> Ждут осмотра
              </ActionButton>
              <ActionButton 
                $variant={filter === 'inspected' ? 'primary' : 'ghost'} 
                onClick={() => setFilter('inspected')}
              >
                <CheckCircle2 size={14} /> Осмотрены
              </ActionButton>
            </div>
          </div>

          {filter !== 'all' && (
            <div style={{ marginTop: 8 }}>
              <ActionButton $variant="ghost" onClick={() => setFilter('all')} style={{ color: '#ef4444' }}>
                <X size={14} /> Сбросить фильтр
              </ActionButton>
            </div>
          )}
        </div>

        <SearchTableWrap style={{ flex: 1, margin: 0, borderRadius: 0, border: 'none', borderTop: '1px solid rgba(191, 219, 254, 0.78)', boxShadow: 'none' }}>
          <SearchTableViewport>
            <SearchTable>
              <SearchThead>
                <tr>
                  <SearchTh>Пациент</SearchTh>
                  <SearchTh>Диагноз</SearchTh>
                  <SearchTh>Палата / Койка</SearchTh>
                  <SearchTh>Госп.</SearchTh>
                  <SearchTh>Статус</SearchTh>
                  <SearchTh style={{ textAlign: 'right' }}>Действия</SearchTh>
                </tr>
              </SearchThead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <SearchEmptyState>
                        <ClipboardList size={48} />
                        <p>{query ? 'Пациент не найден' : 'Нет пациентов для отображения'}</p>
                        <span>Попробуйте изменить параметры поиска или фильтры</span>
                      </SearchEmptyState>
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map(p => {
                    const inspToday = getInspections(p.id).filter(i => i.date === todayISO)
                    const isInspected = inspToday.length > 0
                    const lastInsp = inspToday[inspToday.length - 1]
                    const rawDate = p.history?.[0]?.dateTime || p.lastUpdated
                    const admDate = rawDate ? formatLocalDate(rawDate) : '-'

                    return (
                      <SearchTr
                        key={p.id}
                      >
                        <SearchTdBold>
                          <PatientNameCell>
                            <PatientAvatar>
                              {getInitials(p.firstName, p.lastName)}
                            </PatientAvatar>
                            <div>
                              <div>
                                {p.lastName} {p.firstName}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: '#94a3b8',
                                  fontWeight: 400,
                                  marginTop: 2
                                }}
                              >
                                {p.age} лет · {p.gender} · МК: {p.medcardNum}
                              </div>
                              {isInspected && lastInsp && (
                                <div style={{ fontSize: 11, color: '#059669', marginTop: 4, fontWeight: 600 }}>
                                  ✓ Осмотрен в {lastInsp.time} ({lastInsp.type === 'primary' ? 'первичный' : 'ежедневный'})
                                </div>
                              )}
                            </div>
                          </PatientNameCell>
                        </SearchTdBold>
                        
                        <SearchTd style={{ fontSize: 12, lineHeight: 1.4, maxWidth: 200, whiteSpace: 'normal' }}>
                          {p.activeProblems?.[0] ?? '-'}
                        </SearchTd>
                        
                        <SearchTd>
                          <div style={{ fontWeight: 600 }}>302 / 3</div>
                          <div style={{ color: '#94a3b8', fontSize: 12 }}>{p.department}</div>
                        </SearchTd>
                        
                        <SearchTdMuted>{admDate}</SearchTdMuted>
                        
                        <SearchTd>
                          {isInspected ? (
                            <StatusPill $status="hospitalized">
                              <CheckCircle2 size={11} style={{ marginRight: 4 }} /> Осмотрен
                            </StatusPill>
                          ) : (
                            <StatusPill $status="discharged">
                              <Circle size={11} style={{ marginRight: 4 }} /> Ожидает
                            </StatusPill>
                          )}
                        </SearchTd>
                        
                        <SearchTd style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <ActionButton
                              $variant="primary"
                              onClick={(e) => { e.stopPropagation(); onStartPrimary(p.id); }}
                              title="Первичный / повторный осмотр"
                              style={{ padding: '6px 12px', fontSize: 12 }}
                            >
                              <Stethoscope size={14} />
                              <span className="hidden sm:inline">Первичный</span>
                            </ActionButton>
                            <ActionButton
                              onClick={(e) => { e.stopPropagation(); onStartDaily(p.id); }}
                              title="Ежедневный обход"
                              style={{ padding: '6px 12px', fontSize: 12, background: '#10b981', color: 'white', borderColor: '#059669' }}
                            >
                              <Calendar size={14} />
                              <span className="hidden sm:inline">Ежедневный</span>
                            </ActionButton>
                          </div>
                        </SearchTd>
                      </SearchTr>
                    )
                  })
                )}
              </tbody>
            </SearchTable>
          </SearchTableViewport>
        </SearchTableWrap>
        {totalPages >= 1 && (
          <SearchPaginationRow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SearchPaginationInfo>
                Показано {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
                {Math.min(safePage * pageSize, filtered.length)} из {filtered.length}
              </SearchPaginationInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>По</span>
                <SearchPageSizeSelect
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  {[5, 8, 15, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </SearchPageSizeSelect>
              </div>
            </div>
            <SearchPaginationBtns>
              <SearchPageBtn onClick={() => handlePageChange(1)} disabled={safePage === 1}>
                <ChevronLeft size={14} />
                <ChevronLeft size={14} />
              </SearchPageBtn>
              <SearchPageBtn
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
              >
                <ChevronLeft size={14} />
              </SearchPageBtn>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p = i + 1
                if (totalPages > 5) {
                  const start = Math.max(1, Math.min(safePage - 2, totalPages - 4))
                  p = start + i
                }
                return (
                  <SearchPageBtn
                    key={p}
                    $active={p === safePage}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </SearchPageBtn>
                )
              })}
              <SearchPageBtn
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
              >
                <ChevronRight size={14} />
              </SearchPageBtn>
              <SearchPageBtn
                onClick={() => handlePageChange(totalPages)}
                disabled={safePage === totalPages}
              >
                <ChevronRight size={14} />
                <ChevronRight size={14} />
              </SearchPageBtn>
            </SearchPaginationBtns>
          </SearchPaginationRow>
        )}
      </SearchCard>
    </SearchPageWrapper>
  )
}

export default WardRoundsHub
