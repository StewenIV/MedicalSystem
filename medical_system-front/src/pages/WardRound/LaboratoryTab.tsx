import React, { useState, useEffect } from 'react'
import {
  FlaskConical,
  ClipboardList,
  Plus,
  Check,
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { usePatientData } from 'context/PatientDataContext'
import { useSelector } from 'react-redux'
import { selectDisplayName } from 'features/App/selectors'
import { formatLocalDate } from 'utils/dateUtils'

const FONT = `'SF Pro Display', 'Inter', -apple-system, sans-serif`

interface LaboratoryTabProps {
  patientId: string
  onClose?: () => void
}

const DEFAULT_TESTS = [
  { id: 'oac', name: 'ОАК', category: 'lab' },
  { id: 'oam', name: 'ОАМ', category: 'lab' },
  { id: 'biochem', name: 'Биохимия крови', category: 'lab' },
  { id: 'coag', name: 'Коагулограмма', category: 'lab' },
  { id: 'sputum', name: 'Мокрота', category: 'lab' },
  { id: 'ecg', name: 'ЭКГ', category: 'instrumental' },
  { id: 'fg', name: 'ФГ ОГК', category: 'instrumental' },
  { id: 'ct', name: 'КТ ОГК', category: 'instrumental' },
  { id: 'mri', name: 'МРТ', category: 'instrumental' },
  { id: 'echo', name: 'ЭхоКГ', category: 'instrumental' },
  { id: 'broncho', name: 'Бронхоскопия', category: 'instrumental' }
]

export const LaboratoryTab: React.FC<LaboratoryTabProps> = ({ patientId }) => {
  const { getPatient, updatePatientRoundData, loadPatientEncounters } = usePatientData()
  const patient = getPatient(patientId)
  const currentUserDisplayName = useSelector(selectDisplayName)

  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  if (!patient) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#94a3b8',
          fontFamily: FONT
        }}
      >
        Пациент не найден
      </div>
    )
  }

  const isMobile = windowWidth < 992

  const toggleTest = (name: string) => {
    setSelectedTests((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    )
  }

  const handleCreateReferrals = async () => {
    if (selectedTests.length === 0) {
      setToast({ text: 'Выберите хотя бы одно исследование', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const doctor = currentUserDisplayName || patient.doctor || 'Лечащий врач'
      const newLabs = selectedTests.map((testName) => ({
        id: '00000000-0000-0000-0000-000000000000',
        type: testName,
        date: new Date().toISOString(),
        statusText: 'Назначено',
        doctorName: doctor,
        reason: reason.trim()
      }))

      
      const existingLabs = (patient.labs || []).map((l: any) => ({
        id: l.id || '00000000-0000-0000-0000-000000000000',
        type: l.type || '',
        date: l.date,
        statusText: l.statusText || 'Назначено',
        doctorName: l.doctorName || l.doctor || 'Лечащий врач',
        reason: l.reason || ''
      }))

      const updatedLabs = [...existingLabs, ...newLabs]

      await updatePatientRoundData(patientId, undefined, undefined, undefined, {
        labs: updatedLabs
      })
      await loadPatientEncounters(patientId)

      setSelectedTests([])
      setReason('')
      setToast({ text: `Успешно создано направлений: ${newLabs.length}`, type: 'success' })
    } catch (err) {
      console.error(err)
      setToast({ text: 'Ошибка сохранения направлений', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status?: string) => {
    const s = (status || '').toLowerCase()
    if (s.includes('критич') || s.includes('внимание') || s.includes('отклон')) {
      return { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' }
    }
    if (s.includes('заверш') || s.includes('готов') || s.includes('выполн')) {
      return { bg: '#f0fdf4', text: '#166534', border: '#86efac' }
    }
    return { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' }
  }

  const sortedLabs = [...(patient.labs || [])].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA 
  })

  
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: isMobile ? 'auto' : '100%',
    background: '#f3f4f6',
    fontFamily: FONT,
    overflow: isMobile ? 'visible' : 'hidden'
  }

  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '100%' : '320px',
    flexShrink: 0,
    background: 'white',
    borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
    borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
    display: 'flex',
    flexDirection: 'column',
    overflowY: isMobile ? 'visible' : 'auto',
    padding: '24px',
    boxSizing: 'border-box'
  }

  const mainStyle: React.CSSProperties = {
    flex: 1,
    padding: isMobile ? '16px' : '24px 32px',
    overflowY: isMobile ? 'visible' : 'auto',
    boxSizing: 'border-box'
  }

  const sectionHeader: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: '16px',
    marginBottom: '10px',
    paddingBottom: '4px',
    borderBottom: '1px solid #f1f5f9'
  }

  const checkBtn = (checked: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 12px',
    borderRadius: '8px',
    border: `1.5px solid ${checked ? '#93c5fd' : '#e2e8f0'}`,
    background: checked ? '#eff6ff' : 'white',
    color: checked ? '#1d4ed8' : '#64748b',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: FONT,
    transition: 'all 0.12s'
  })

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FlaskConical size={18} color="#2563eb" /> Назначить исследования
        </h3>

        <div style={sectionHeader}>Лаборатория</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {DEFAULT_TESTS.filter((t) => t.category === 'lab').map((t) => {
            const checked = selectedTests.includes(t.name)
            return (
              <button key={t.id} style={checkBtn(checked)} onClick={() => toggleTest(t.name)}>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    border: `1.5px solid ${checked ? '#3b82f6' : '#cbd5e1'}`,
                    background: checked ? '#3b82f6' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {checked && <Check size={10} color="white" />}
                </span>
                {t.name}
              </button>
            )
          })}
        </div>

        <div style={sectionHeader}>Инструментальные</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {DEFAULT_TESTS.filter((t) => t.category === 'instrumental').map((t) => {
            const checked = selectedTests.includes(t.name)
            return (
              <button key={t.id} style={checkBtn(checked)} onClick={() => toggleTest(t.name)}>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    border: `1.5px solid ${checked ? '#3b82f6' : '#cbd5e1'}`,
                    background: checked ? '#3b82f6' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {checked && <Check size={10} color="white" />}
                </span>
                {t.name}
              </button>
            )
          })}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748b',
              display: 'block',
              marginBottom: '5px'
            }}
          >
            Показания / Примечание
          </label>
          <textarea
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1.5px solid #e2e8f0',
              fontFamily: FONT,
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              height: '80px',
              boxSizing: 'border-box',
              background: 'white'
            }}
            placeholder="Обоснование назначения..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button
          onClick={handleCreateReferrals}
          disabled={loading || selectedTests.length === 0}
          style={{
            width: '100%',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: selectedTests.length > 0 ? '#2563eb' : '#cbd5e1',
            color: 'white',
            fontWeight: 600,
            cursor: selectedTests.length > 0 ? 'pointer' : 'default',
            fontFamily: FONT,
            fontSize: '13px',
            transition: 'background 0.2s',
            boxShadow: selectedTests.length > 0 ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
          }}
        >
          {loading ? 'Сохранение...' : `Создать направление (${selectedTests.length})`}
        </button>
      </div>

      <div style={mainStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              margin: 0,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ClipboardList size={20} color="#64748b" /> История направлений
          </h2>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
            Всего: {sortedLabs.length}
          </span>
        </div>

        {sortedLabs.length === 0 ? (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '40px 24px',
              textAlign: 'center',
              color: '#94a3b8',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <ClipboardList size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
              Направлений не найдено
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Используйте панель слева, чтобы назначить лабораторные или инструментальные
              исследования.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px'
            }}
          >
            {sortedLabs.map((lab: any, idx: number) => {
              const statusColors = getStatusStyle(lab.statusText)
              const testDate = lab.date ? new Date(lab.date) : null
              const isInstrumental =
                DEFAULT_TESTS.find((t) => t.name === lab.type)?.category === 'instrumental'

              return (
                <div
                  key={lab.id || `local-lab-${idx}`}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isInstrumental ? '#7c3aed' : '#2563eb',
                          background: isInstrumental ? '#f5f3ff' : '#eff6ff',
                          padding: '2px 8px',
                          borderRadius: '20px'
                        }}
                      >
                        {isInstrumental ? 'Инструм.' : 'Лаборатория'}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          background: statusColors.bg,
                          color: statusColors.text,
                          border: `1px solid ${statusColors.border}`
                        }}
                      >
                        {lab.statusText || 'Назначено'}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        margin: '8px 0 4px 0',
                        color: '#1e293b'
                      }}
                    >
                      {lab.type}
                    </h4>

                    {lab.reason && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#64748b',
                          background: '#f8fafc',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          margin: '8px 0',
                          lineHeight: 1.4,
                          borderLeft: '2px solid #cbd5e1'
                        }}
                      >
                        <strong>Показания:</strong> {lab.reason}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '10px',
                      marginTop: '10px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginBottom: '4px'
                      }}
                    >
                      <Calendar size={12} />{' '}
                      {testDate
                        ? formatLocalDate(testDate.toISOString().split('T')[0]) +
                          ' ' +
                          testDate.toTimeString().split(' ')[0].slice(0, 5)
                        : '-'}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: '#94a3b8'
                      }}
                    >
                      <FileText size={12} /> Врач: {lab.doctorName || lab.doctor || 'Не указан'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '8px',
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: FONT
          }}
        >
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {toast.text}
        </div>
      )}
    </div>
  )
}

export default LaboratoryTab
