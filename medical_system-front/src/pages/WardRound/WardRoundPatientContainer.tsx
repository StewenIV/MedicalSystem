import React, { useState, useEffect } from 'react'
import { ChevronLeft, Clock, Save, Check, X, FlaskConical, Stethoscope, Calendar } from 'lucide-react'
import { usePatientData } from 'context/PatientDataContext'
import PrimaryInspectionPage from './PrimaryInspectionPage'
import WardRoundPage from './WardRoundPage'
import LaboratoryTab from './LaboratoryTab'
import {
  PatientHeader,
  PatientAvatar,
  PatientInfo,
  PatientName,
  PatientMeta,
  PatientMetaItem,
  HeaderRight,
  HeaderBtn,
  StartTimeDisplay
} from './styled'

interface WardRoundPatientContainerProps {
  patientId: string
  initialType: 'hub' | 'primary' | 'daily' | 'laboratory'
  onClose: () => void
  onNavigateToTemperatureSheet?: (id: string) => void
}

const FONT = `'SF Pro Display', 'Inter', -apple-system, sans-serif`

export const WardRoundPatientContainer: React.FC<WardRoundPatientContainerProps> = ({
  patientId,
  initialType,
  onClose,
  onNavigateToTemperatureSheet
}) => {
  const { getPatient } = usePatientData()
  const patient = getPatient(patientId)

  const [activeTab, setActiveTab] = useState<'primary' | 'daily' | 'laboratory'>(() => {
    if (initialType === 'primary') return 'primary'
    if (initialType === 'laboratory') return 'laboratory'
    return 'daily'
  })

  const [headerActions, setHeaderActions] = useState<{
    handleSaveDraft?: () => void
    handleComplete?: () => void
    inspectionTime?: string
  } | null>(null)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Reset actions on tab change
    setHeaderActions(null)
  }, [activeTab])

  if (!patient) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontFamily: FONT }}>
        Пациент не найден
      </div>
    )
  }

  const isMobile = windowWidth < 992

  // STYLES FOR TABS
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontFamily: FONT,
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: active ? '#ffffff' : 'transparent',
    color: active ? '#1d4ed8' : '#64748b',
    boxShadow: active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
  })

  const mobileTabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 6px',
    fontSize: '12px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontFamily: FONT,
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    background: active ? '#eff6ff' : 'white',
    color: active ? '#1d4ed8' : '#64748b',
    borderBottom: active ? '3px solid #1d4ed8' : '3px solid transparent',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: isMobile ? '100vh' : 'calc(100vh - 84px)', background: '#f3f4f6', minHeight: 0 }}>
      {/* DESKTOP HEADER */}
      {!isMobile ? (
        <PatientHeader style={{ background: 'white', color: '#0f172a', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <HeaderBtn variant="ghost" onClick={onClose} style={{ color: '#475569', background: '#f1f5f9' }}>
            <ChevronLeft size={15} /> Обходы
          </HeaderBtn>

          <PatientAvatar style={{ width: '40px', height: '40px', fontSize: '14px', boxShadow: 'none' }}>
            {patient.lastName?.[0] || ''}
            {patient.firstName?.[0] || ''}
          </PatientAvatar>

          <PatientInfo style={{ flex: 1, minWidth: 0, marginRight: '16px' }}>
            <PatientName style={{ fontSize: '15px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {patient.lastName} {patient.firstName}
            </PatientName>
            <PatientMeta style={{ opacity: 0.8, color: '#64748b' }}>
              <PatientMetaItem><strong>Палата:</strong> {patient.department}</PatientMetaItem>
              <PatientMetaItem><strong>МК:</strong> {patient.medcardNum}</PatientMetaItem>
            </PatientMeta>
          </PatientInfo>

          {/* Desktop Central Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', margin: '0 auto', flexShrink: 0 }}>
            <button onClick={() => setActiveTab('primary')} style={tabStyle(activeTab === 'primary')}>
              <Stethoscope size={14} /> Первичный
            </button>
            <button onClick={() => setActiveTab('daily')} style={tabStyle(activeTab === 'daily')}>
              <Calendar size={14} /> Ежедневный
            </button>
            <button onClick={() => setActiveTab('laboratory')} style={tabStyle(activeTab === 'laboratory')}>
              <FlaskConical size={14} /> Лаборатория
            </button>
          </div>

          <HeaderRight style={{ flexShrink: 0, flexWrap: 'nowrap' }}>
            {headerActions?.inspectionTime && (
              <StartTimeDisplay style={{ color: '#64748b' }}>
                <Clock size={14} /> Начато: {headerActions.inspectionTime}
              </StartTimeDisplay>
            )}
            {headerActions?.handleSaveDraft && (
              <HeaderBtn variant="ghost" onClick={headerActions.handleSaveDraft} style={{ color: '#475569', background: '#f1f5f9' }}>
                <Save size={14} /> Черновик
              </HeaderBtn>
            )}
            <HeaderBtn variant="ghost" onClick={onClose} style={{ padding: '7px 10px', color: '#475569', background: '#f1f5f9' }}>
              <X size={15} />
            </HeaderBtn>
          </HeaderRight>
        </PatientHeader>
      ) : (
        /* MOBILE HEADER */
        <div style={{ background: 'white', display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#1d4ed8', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
              <ChevronLeft size={16} /> Назад
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Patient Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px 12px 16px' }}>
            <PatientAvatar style={{ width: '40px', height: '40px', fontSize: '14px', boxShadow: 'none' }}>
              {patient.lastName?.[0] || ''}
              {patient.firstName?.[0] || ''}
            </PatientAvatar>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: FONT }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                {patient.lastName} {patient.firstName}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px' }}>
                <span>Палата: {patient.department}</span>
                <span>МК: {patient.medcardNum}</span>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9' }}>
            <button onClick={() => setActiveTab('primary')} style={mobileTabStyle(activeTab === 'primary')}>
              <Stethoscope size={13} /> Первичный
            </button>
            <button onClick={() => setActiveTab('daily')} style={mobileTabStyle(activeTab === 'daily')}>
              <Calendar size={13} /> Ежедневный
            </button>
            <button onClick={() => setActiveTab('laboratory')} style={mobileTabStyle(activeTab === 'laboratory')}>
              <FlaskConical size={13} /> Лаборатория
            </button>
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: isMobile ? 'auto' : 'hidden', minHeight: 0 }}>
        {activeTab === 'primary' && (
          <PrimaryInspectionPage
            patientId={patientId}
            onClose={onClose}
            onNavigateToTemperatureSheet={onNavigateToTemperatureSheet}
            hideHeader={true}
            onRegisterActions={isMobile ? undefined : setHeaderActions}
          />
        )}
        {activeTab === 'daily' && (
          <WardRoundPage
            patientId={patientId}
            onClose={onClose}
            onNavigateToTemperatureSheet={onNavigateToTemperatureSheet}
            hideHeader={true}
            onRegisterActions={isMobile ? undefined : setHeaderActions}
          />
        )}
        {activeTab === 'laboratory' && (
          <LaboratoryTab
            patientId={patientId}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  )
}

export default WardRoundPatientContainer
