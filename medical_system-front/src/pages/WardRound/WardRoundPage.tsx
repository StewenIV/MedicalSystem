import React, { useState, useCallback, useEffect } from 'react'
import {
  Clock, Save, X, Check, Sparkles, ChevronLeft,
  Thermometer, Heart, Wind, Droplets, Activity,
  AlertTriangle, TrendingUp, TrendingDown, Minus,
  FileText, Plus, Trash2,
} from 'lucide-react'
import {
  DailyRoundFormState,
  ComplaintKey, COMPLAINT_LABELS, ComplaintParams,
  GeneralCondition, BreathingType, RalesType, HeartRhythm, HeartTones,
  TongueState, AbdomenState, StoolState, UrinationState, DynamicsState,
  SkinColor, SkinTemp, SkinMoisture, ChestForm, ChestSymmetry,
  RoundPrescription, SavedInspection,
} from './types'
import { getInitialDailyState } from './mockRoundData'
import { usePatientData } from 'context/PatientDataContext'

import {
  PatientHeader,
  PatientAvatar,
  PatientInfo,
  PatientName,
  PatientMeta,
  PatientMetaItem,
  HeaderRight,
  HeaderBtn,
  StartTimeDisplay,
} from './styled'

// ─── Inline styles ────────────────────────────────────────────────

const FONT = `'SF Pro Display', 'Inter', -apple-system, sans-serif`

const pill = (active: boolean, color = 'blue'): React.CSSProperties => {
  const m: Record<string, { bg: string; text: string; border: string; aBg: string; aText: string; aBorder: string }> = {
    blue: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#eff6ff', aText: '#1d4ed8', aBorder: '#93c5fd' },
    green: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#f0fdf4', aText: '#166534', aBorder: '#86efac' },
    red: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#fef2f2', aText: '#991b1b', aBorder: '#fca5a5' },
    orange: { bg: 'white', text: '#64748b', border: '#e2e8f0', aBg: '#fff7ed', aText: '#9a3412', aBorder: '#fdba74' },
  }
  const c = m[color] ?? m.blue
  return {
    padding: '5px 12px', borderRadius: 20, fontFamily: FONT,
    border: `1.5px solid ${active ? c.aBorder : c.border}`,
    background: active ? c.aBg : c.bg,
    color: active ? c.aText : c.text,
    fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.13s',
  }
}

const checkBtn = (checked: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 7,
  padding: '6px 12px', borderRadius: 8,
  border: `1.5px solid ${checked ? '#93c5fd' : '#e2e8f0'}`,
  background: checked ? '#eff6ff' : 'white',
  color: checked ? '#1d4ed8' : '#64748b',
  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: FONT,
})

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 8,
  border: '1.5px solid #e2e8f0', fontFamily: FONT, fontSize: 13,
  color: '#1e293b', outline: 'none', boxSizing: 'border-box' as const, background: 'white',
}

const label: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5,
}

const block: React.CSSProperties = {
  background: 'white', borderRadius: 12, border: '1px solid #e5e7eb',
  marginBottom: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

const blockHeader: React.CSSProperties = {
  padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
  display: 'flex', alignItems: 'center', gap: 10, background: '#fafbfc',
  fontSize: 13, fontWeight: 700, color: '#0f172a',
}

const blockBody: React.CSSProperties = { padding: '14px 16px' }

const pillGroup: React.CSSProperties = { display: 'flex', flexWrap: 'wrap' as const, gap: 6 }

const sub: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em',
  textTransform: 'uppercase' as const, marginTop: 12, marginBottom: 6,
  paddingBottom: 4, borderBottom: '1px solid #f1f5f9',
}

// ─── Генерация текста ─────────────────────────────────────────────

function generateDailyText(form: DailyRoundFormState, patientName: string): string {
  const parts: string[] = []

  // Форматирование даты из ISO в RU
  const dateRu = form.inspectionDate
    ? new Date(form.inspectionDate).toLocaleDateString('ru-RU')
    : form.inspectionDate

  parts.push(`Осмотр лечащего врача от ${dateRu}. Время: ${form.inspectionTime}.`)

  const condMap: Record<GeneralCondition, string> = {
    satisfactory: 'удовлетворительное',
    moderate: 'средней степени тяжести, стабильное',
    severe: 'тяжёлое',
    critical: 'крайне тяжёлое',
  }
  if (form.generalCondition) {
    parts.push(`Общее состояние ${condMap[form.generalCondition]}.`)
  }

  const active = form.complaints.filter(c => c !== 'none')
  if (form.complaints.includes('none') || active.length === 0) {
    parts.push('Жалоб не предъявляет.')
  } else {
    const labels = active.map(c => {
      let t = COMPLAINT_LABELS[c].toLowerCase()
      if (c === 'fever' && form.complaintParams.fever?.maxTemp) t += ` до ${form.complaintParams.fever.maxTemp}°C`
      return t
    })
    parts.push(`Жалобы на ${labels.join(', ')}.`)
    if (form.complaintsNote) parts.push(form.complaintsNote)
  }

  const bpStr = form.bpSys && form.bpDia ? `${form.bpSys}/${form.bpDia}` : ''
  const vitalParts: string[] = []
  if (form.temperature) vitalParts.push(`Температура ${form.temperature}°C`)
  if (form.hr) vitalParts.push(`ЧСС ${form.hr} в мин`)
  if (bpStr) vitalParts.push(`АД ${bpStr} мм рт. ст`)
  if (form.rr) vitalParts.push(`ЧДД ${form.rr} в мин`)
  if (form.spo2) vitalParts.push(`SpO₂ ${form.spo2}%`)
  if (vitalParts.length) parts.push(vitalParts.join('. ') + '.')

  const skinColorMap: Record<string, string> = { pale_pink: 'бледно-розовая', pale: 'бледная', hyperemia: 'гиперемирована', cyanosis: 'цианотичная', icteric: 'иктеричная' }
  const skinTempMap: Record<string, string> = { warm: 'тёплая', cold: 'холодная', hot: 'горячая' }
  const skinMoistMap: Record<string, string> = { dry: 'сухая', moist: 'влажная', excessive: 'повышенная влажность' }
  if (form.skinColor || form.skinTemp || form.skinMoisture) {
    let skinParts: string[] = []
    if (form.skinColor) skinParts.push(skinColorMap[form.skinColor] ?? form.skinColor)
    if (form.skinTemp) skinParts.push(skinTempMap[form.skinTemp] ?? form.skinTemp)
    if (form.skinMoisture) skinParts.push(skinMoistMap[form.skinMoisture] ?? form.skinMoisture)
    parts.push(`Кожные покровы: ${skinParts.join(', ')}.`)
  }

  if (form.breathingType) {
    const bt: Record<string, string> = { vesicular: 'везикулярное', harsh: 'жёсткое', weakened: 'ослабленное', bronchial: 'бронхиальное' }
    let respStr = `Аускультативно дыхание ${bt[form.breathingType] ?? form.breathingType}`
    if (form.ralesType) {
      const rt: Record<string, string> = { none: ', хрипы не выслушиваются', dry: ', сухие хрипы', moist: ', влажные хрипы', crepitation: ', крепитация' }
      respStr += rt[form.ralesType] ?? ''
    }
    respStr += '.'
    if (form.respiratoryNote) respStr += ' ' + form.respiratoryNote
    parts.push(respStr)
  }

  if (form.heartRhythm) {
    let heartStr = `Сердечная деятельность ${form.heartRhythm === 'regular' ? 'ритмичная' : 'аритмичная'}, тоны ${form.heartTones === 'clear' ? 'ясные' : form.heartTones === 'muffled' ? 'приглушены' : 'глухие'}.`
    if (form.heartNote) heartStr += ' ' + form.heartNote
    parts.push(heartStr)
  }

  const dynMap: Record<DynamicsState, string> = {
    improvement: 'Отмечается положительная динамика.',
    no_change: 'Динамика отсутствует.',
    deterioration: 'Отмечается ухудшение состояния.',
  }
  if (form.dynamics) parts.push(dynMap[form.dynamics])
  if (form.dynamicsComment) parts.push(form.dynamicsComment)

  if (form.treatmentDecision === 'keep') {
    parts.push('Лечение продолжить по листу назначений.')
  } else {
    parts.push('Лечение скорректировано.')
  }

  if (form.controlStudies) parts.push(`Контроль: ${form.controlStudies}.`)
  if (form.nextInspection) parts.push(`Повторный осмотр: ${form.nextInspection}.`)

  return parts.join(' ')
}

// ─── Пропсы ───────────────────────────────────────────────────────

interface DailyRoundPageProps {
  patientId: string
  onClose: () => void
  onNavigateToTemperatureSheet?: (id: string) => void
}

// ═══════════════════════════════════════════════════════════════════
// КОМПОНЕНТ
// ═══════════════════════════════════════════════════════════════════

const DailyRoundPage: React.FC<DailyRoundPageProps> = ({ patientId, onClose, onNavigateToTemperatureSheet }) => {
  const { getPatient, saveInspection, updatePatientVitals, addHistoryEntry, saveDraft, getDraft } = usePatientData()
  const patient = getPatient(patientId)

  const [form, setForm] = useState<DailyRoundFormState>(() => {
    const draft = getDraft(`${patientId}-daily`)
    if (draft) return draft
    return getInitialDailyState(patientId, patient)
  })
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showPrescModal, setShowPrescModal] = useState(false)
  const [newPresc, setNewPresc] = useState<Partial<RoundPrescription>>({})

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMsg({ text, type })
  }, [])

  const setField = useCallback(<K extends keyof DailyRoundFormState>(key: K, value: DailyRoundFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleComplaint = (k: ComplaintKey) => {
    setForm(prev => {
      const c = prev.complaints
      if (k === 'none') return { ...prev, complaints: ['none'] }
      const without = c.filter(x => x !== 'none')
      return { ...prev, complaints: without.includes(k) ? without.filter(x => x !== k) : [...without, k] }
    })
  }

  const handleSaveDraft = () => {
    setField('status', 'draft')
    saveDraft(`${patientId}-daily`, { ...form, status: 'draft' })
    showToast('Черновик сохранён', 'success')
  }

  const handleGenerateAndSave = () => {
    if (!patient) return
    const text = generateDailyText(form, `${patient.lastName} ${patient.firstName}`)
    setField('generatedText', text)
    setField('status', 'completed')
    
    // Очистить черновик
    saveDraft(`${patientId}-daily`, null)

    const bpStr = form.bpSys && form.bpDia ? `${form.bpSys}/${form.bpDia}` : ''

    const insp: SavedInspection = {
      id: `daily-${Date.now()}`,
      type: 'daily',
      date: form.inspectionDate,
      time: form.inspectionTime,
      doctor: form.doctor,
      vitals: { temp: form.temperature, hr: form.hr, bp: bpStr, spo2: form.spo2, rr: form.rr },
      generatedText: text,
    }

    saveInspection(patientId, insp)

    if (form.temperature || form.hr || form.bpSys || form.spo2 || form.rr) {
      updatePatientVitals(patientId, {
        temp: form.temperature || undefined,
        hr: form.hr || undefined,
        bp: bpStr || undefined,
        spo2: form.spo2 || undefined,
        resp: form.rr || undefined,
      })
    }

    const getPrescriptionsDiff = (oldMeds: any[], newPrescs: RoundPrescription[], decision: string) => {
      if (decision === 'keep') return 'Не изменились.'
      if (oldMeds.length === 0 && newPrescs.length === 0) return 'Назначений нет.'
      
      const oldMap = new Map(oldMeds.map((m, i) => [`med-${i}`, m]))
      const newMap = new Map(newPrescs.map(p => [p.id, p]))
      
      const added: string[] = []
      const removed: string[] = []
      const changed: string[] = []
      
      oldMap.forEach((oldMed, id) => {
        if (!newMap.has(id)) {
          removed.push(`${oldMed.name} (${oldMed.dose})`)
        } else {
          const newMed = newMap.get(id)!
          if (newMed.drug !== oldMed.name || newMed.dose !== oldMed.dose || newMed.route !== oldMed.route || newMed.frequency !== oldMed.regimen) {
            changed.push(`${oldMed.name} ${oldMed.dose} -> ${newMed.drug} ${newMed.dose} ${newMed.unit} ${newMed.route}`)
          }
        }
      })
      
      newMap.forEach((newMed, id) => {
        if (id.startsWith('np-') || !oldMap.has(id)) {
          added.push(`${newMed.drug} ${newMed.dose}${newMed.unit}`)
        }
      })
      
      const parts: string[] = []
      if (added.length) parts.push(`Добавлено: ${added.join(', ')}`)
      if (removed.length) parts.push(`Убрано: ${removed.join(', ')}`)
      if (changed.length) parts.push(`Изменено: ${changed.join('; ')}`)
      
      if (parts.length === 0) return 'Не изменились.'
      return parts.join('.\n')
    }

    const complaintsText = form.complaints.includes('none') || form.complaints.filter(c => c !== 'none').length === 0
      ? 'Жалоб не предъявляет.'
      : `Жалобы на ${form.complaints.filter(c => c !== 'none').map(c => {
          let t = COMPLAINT_LABELS[c].toLowerCase()
          if (c === 'fever' && form.complaintParams.fever?.maxTemp) t += ` до ${form.complaintParams.fever.maxTemp}°C`
          return t
        }).join(', ')}.` + (form.complaintsNote ? ` ${form.complaintsNote}` : '')

    // Extract objective string by removing complaints, date, and treatment/plan
    const splitText = text.split('.')
    const objectiveParts = splitText.filter(p => {
      const lower = p.toLowerCase()
      if (lower.includes('осмотр лечащего врача от') || lower.includes('время:')) return false
      if (lower.includes('жалобы на') || lower.includes('жалоб не предъявляет')) return false
      if (lower.includes('контроль:') || lower.includes('повторный осмотр:')) return false
      if (lower.includes('лечение продолжить') || lower.includes('лечение скорректировано')) return false
      return p.trim().length > 0 && p !== form.complaintsNote
    })

    addHistoryEntry(patientId, {
      dateTime: `${form.inspectionDate} ${form.inspectionTime}`,
      type: 'Ежедневный осмотр',
      doctor: form.doctor,
      conclusion: text, // Полное заключение
      complaints: complaintsText,
      objective: objectiveParts.join('. ') + '.',
      recommendations: getPrescriptionsDiff(patient.currentMeds || [], form.prescriptions, form.treatmentDecision || 'keep'),
    })

    setShowResult(true)
    showToast('Осмотр сохранён в карточке пациента', 'success')
  }

  const addPresc = () => {
    if (!newPresc.drug) return showToast('Укажите название препарата', 'error')
    const p: RoundPrescription = {
      id: `np-${Date.now()}`, drug: newPresc.drug ?? '', dose: newPresc.dose ?? '',
      unit: newPresc.unit ?? 'мг', route: newPresc.route ?? 'перорально',
      frequency: newPresc.frequency ?? '1р/д', form: newPresc.form ?? '',
      regimen: newPresc.regimen ?? '', comment: newPresc.comment, action: 'new',
    }
    setForm(prev => ({ ...prev, prescriptions: [...prev.prescriptions, p] }))
    setNewPresc({})
    setShowPrescModal(false)
    showToast('Назначение добавлено', 'success')
  }

  if (!patient) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
      Пациент не найден
    </div>
  )

  const blockDone: Record<string, boolean> = {
    info: !!form.inspectionDate && !!form.inspectionTime && !!form.doctor,
    vitals: !!form.temperature || !!form.hr || !!form.bpSys || !!form.rr || !!form.spo2,
    complaints: form.complaints.length > 0,
    objective: !!form.generalCondition,
    diagnosis: true, // В ежедневном диагноз только для чтения
    prescriptions: form.prescriptions.length > 0,
    recommendations: !!form.controlStudies || !!form.nextInspection || form.treatmentDecision !== undefined,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 84px)', background: '#f3f4f6', fontFamily: FONT }}>
      {/* ── Хедер ── */}
      <PatientHeader>
        <HeaderBtn variant="ghost" onClick={onClose}>
          <ChevronLeft size={15} /> Обходы
        </HeaderBtn>

        <PatientAvatar>
          {patient.lastName?.[0] || ''}{patient.firstName?.[0] || ''}
        </PatientAvatar>

        <PatientInfo>
          <PatientName>Ежедневный осмотр: {patient.lastName} {patient.firstName} {patient.middleName}</PatientName>
          <PatientMeta>
            <PatientMetaItem><strong>Палата:</strong> {patient.department}</PatientMetaItem>
            <PatientMetaItem><strong>Возраст:</strong> {patient.age} лет</PatientMetaItem>
            <PatientMetaItem><strong>МК:</strong> {patient.medcardNum}</PatientMetaItem>
          </PatientMeta>
        </PatientInfo>

        <HeaderRight>
          <StartTimeDisplay>
            <Clock size={14} /> Начато: {form.inspectionTime}
          </StartTimeDisplay>
          <HeaderBtn variant="ghost" onClick={handleSaveDraft}>
            <Save size={14} /> Черновик
          </HeaderBtn>
          <HeaderBtn variant="primary" onClick={handleGenerateAndSave}>
            <Check size={14} /> Завершить
          </HeaderBtn>
          <HeaderBtn variant="ghost" onClick={onClose} style={{ padding: '7px 10px' }}>
            <X size={15} />
          </HeaderBtn>
        </HeaderRight>
      </PatientHeader>

      {/* Тело */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Левая навигация */}
        <nav style={{ width: 220, flexShrink: 0, background: 'white', borderRight: '1px solid #e5e7eb', overflowY: 'auto', padding: '12px 0' }}>
          {[
            { id: 'info', label: 'Информация', icon: Clock },
            { id: 'vitals', label: 'Показатели', icon: Activity },
            { id: 'complaints', label: 'Жалобы', icon: FileText },
            { id: 'objective', label: 'Объективно', icon: Heart },
            { id: 'diagnosis', label: 'Диагноз', icon: AlertTriangle },
            { id: 'prescriptions', label: 'Назначения', icon: Plus },
            { id: 'recommendations', label: 'Рекомендации', icon: Sparkles }
          ].map(sec => (
             <button key={sec.id} onClick={() => document.getElementById(`daily-${sec.id}`)?.scrollIntoView({ behavior: 'smooth' })} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: 'none', background: 'transparent', color: '#374151', fontFamily: FONT, fontSize: 14.5, fontWeight: 450, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <sec.icon size={14} />
                <span style={{ flex: 1 }}>{sec.label}</span>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: blockDone[sec.id] ? '#22c55e' : '#d1d5db',
                  flexShrink: 0,
                }} />
             </button>
          ))}
        </nav>

        {/* Форма */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', scrollBehavior: 'smooth' }}>
          <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Дата / время */}
            <div id="daily-info" style={block}>
          <div style={blockHeader}><Clock size={15} /> Информация об осмотре</div>
          <div style={{ ...blockBody, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>Дата</label>
              <input type="date" style={inputStyle} value={form.inspectionDate} onChange={e => setField('inspectionDate', e.target.value)} />
            </div>
            <div>
              <label style={label}>Время</label>
              <input type="time" style={inputStyle} value={form.inspectionTime} onChange={e => setField('inspectionTime', e.target.value)} />
            </div>
            <div>
              <label style={label}>Врач</label>
              <input style={inputStyle} value={form.doctor} onChange={e => setField('doctor', e.target.value)} />
            </div>
          </div>
        </div>

            {/* Показатели */}
            <div id="daily-vitals" style={block}>
          <div style={blockHeader}>
            <Activity size={15} /> Показатели
            {onNavigateToTemperatureSheet && (
              <button onClick={() => onNavigateToTemperatureSheet(patientId)} style={{ marginLeft: 'auto', fontSize: 11, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT }}>
                Температурный лист →
              </button>
            )}
          </div>
          <div style={blockBody}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 12 }}>
              {([
                { key: 'temperature', lbl: 'Температура', unit: '°C', icon: <Thermometer size={16} color="#3b82f6" />, min: 35, max: 43, step: '0.1', alert: (v: string) => parseFloat(v) >= 38 },
                { key: 'hr', lbl: 'ЧСС', unit: 'уд/мин', icon: <Heart size={16} color="#ef4444" />, min: 20, max: 250, step: '1', alert: () => false },
                { key: 'rr', lbl: 'ЧДД', unit: 'в мин', icon: <Wind size={16} color="#06b6d4" />, min: 6, max: 60, step: '1', alert: () => false },
                { key: 'spo2', lbl: 'SpO₂', unit: '%', icon: <Droplets size={16} color="#22c55e" />, min: 50, max: 100, step: '1', alert: (v: string) => parseFloat(v) < 95 },
              ] as const).map(v => {
                const val = (form as any)[v.key] as string
                const isAlert = v.alert(val)
                return (
                  <div key={v.key} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 12px 10px', border: `1.5px solid ${isAlert ? '#fca5a5' : '#f1f5f9'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      {v.icon}
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{v.lbl}</span>
                    </div>
                    <input
                      type="number" min={v.min} max={v.max} step={v.step}
                      style={{ width: '100%', fontSize: 18, fontWeight: 700, border: 'none', background: 'transparent', color: isAlert ? '#dc2626' : '#0f172a', outline: 'none', fontFamily: FONT, padding: '2px 0' }}
                      value={val}
                      onChange={e => setField(v.key as any, e.target.value)}
                    />
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{v.unit}</div>
                  </div>
                )
              })}

              {/* АД — два поля */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 12px 10px', border: '1.5px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Activity size={16} color="#8b5cf6" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>АД</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input type="number" min={60} max={260} style={{ width: '50%', fontSize: 16, fontWeight: 700, border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', color: '#0f172a', outline: 'none', fontFamily: FONT, padding: '4px 6px' }} placeholder="120" value={form.bpSys} onChange={e => setField('bpSys', e.target.value)} />
                  <span style={{ color: '#94a3b8', fontWeight: 700 }}>/</span>
                  <input type="number" min={40} max={160} style={{ width: '50%', fontSize: 16, fontWeight: 700, border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', color: '#0f172a', outline: 'none', fontFamily: FONT, padding: '4px 6px' }} placeholder="80" value={form.bpDia} onChange={e => setField('bpDia', e.target.value)} />
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>мм рт.ст</div>
              </div>
            </div>
          </div>
        </div>

            {/* Жалобы */}
            <div id="daily-complaints" style={block}>
          <div style={blockHeader}><FileText size={15} /> Жалобы</div>
          <div style={blockBody}>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 12 }}>
              {(Object.keys(COMPLAINT_LABELS) as ComplaintKey[]).map(k => (
                <button key={k} style={checkBtn(form.complaints.includes(k))} onClick={() => toggleComplaint(k)}>
                  <span style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${form.complaints.includes(k) ? '#3b82f6' : '#cbd5e1'}`, background: form.complaints.includes(k) ? '#3b82f6' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {form.complaints.includes(k) && <Check size={9} color="white" />}
                  </span>
                  {COMPLAINT_LABELS[k]}
                </button>
              ))}
            </div>
            {form.complaints.includes('fever') && (
              <div style={{ padding: '10px 12px', background: '#fff7ed', borderRadius: 8, border: '1px solid #fed7aa', marginBottom: 10 }}>
                <label style={{ ...label, color: '#9a3412' }}>Максимальная температура (°C)</label>
                <input type="number" min={35} max={43} step={0.1} style={inputStyle} placeholder="38.5" value={form.complaintParams.fever?.maxTemp ?? ''} onChange={e => setField('complaintParams', { ...form.complaintParams, fever: { maxTemp: e.target.value } })} />
              </div>
            )}
            <div>
              <label style={label}>Дополнение врача</label>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' as const }} placeholder="Уточнения..." value={form.complaintsNote} onChange={e => setField('complaintsNote', e.target.value)} />
            </div>
          </div>
        </div>

            {/* Объективно */}
            <div id="daily-objective" style={block}>
          <div style={blockHeader}><Activity size={15} /> Объективно</div>
          <div style={blockBody}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>

              {/* Общее состояние */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Общее состояние</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
                  {([['satisfactory', 'Удовлетворительное', 'green'], ['moderate', 'Средней тяжести', 'orange'], ['severe', 'Тяжёлое', 'red']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.generalCondition === val, c)} onClick={() => setField('generalCondition', form.generalCondition === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
              </div>

              {/* Кожа */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Кожа</div>
                <div style={sub}>Цвет</div>
                <div style={pillGroup}>
                  {([['pale_pink', 'Бледно-розовая', 'green'], ['pale', 'Бледная', 'blue'], ['hyperemia', 'Гиперемия', 'orange'], ['cyanosis', 'Цианоз', 'blue']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.skinColor === val, c)} onClick={() => setField('skinColor', form.skinColor === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <div style={sub}>Температура</div>
                <div style={pillGroup}>
                  {([['warm', 'Тёплая', 'green'], ['cold', 'Холодная', 'blue'], ['hot', 'Горячая', 'red']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.skinTemp === val, c)} onClick={() => setField('skinTemp', form.skinTemp === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <div style={sub}>Влажность</div>
                <div style={pillGroup}>
                  {([['dry', 'Сухая', 'orange'], ['moist', 'Влажная', 'green'], ['excessive', 'Повышенная', 'blue']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.skinMoisture === val, c)} onClick={() => setField('skinMoisture', form.skinMoisture === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
              </div>

              {/* Грудная клетка */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Грудная клетка</div>
                <div style={sub}>Форма</div>
                <div style={pillGroup}>
                  {([['normosthenic', 'Нормостен.'], ['hypersthenic', 'Гиперстен.'], ['asthenic', 'Астен.'], ['emphysematous', 'Эмфизем.']] as const).map(([val, lbl]) => (
                    <button key={val} style={pill(form.chestForm === val)} onClick={() => setField('chestForm', form.chestForm === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <div style={sub}>Симметрия</div>
                <div style={pillGroup}>
                  {([['symmetric', 'Симметричная', 'green'], ['asymmetric', 'Асимметричная', 'orange']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.chestSymmetry === val, c)} onClick={() => setField('chestSymmetry', form.chestSymmetry === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
              </div>

              {/* Дыхание */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Дыхание</div>
                <div style={pillGroup}>
                  {([['vesicular', 'Везикулярное', 'green'], ['harsh', 'Жёсткое', 'orange'], ['weakened', 'Ослабленное', 'blue']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.breathingType === val, c)} onClick={() => setField('breathingType', form.breathingType === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <div style={{ marginTop: 6, ...sub }}>Хрипы</div>
                <div style={pillGroup}>
                  {([['none', 'Нет', 'green'], ['dry', 'Сухие', 'orange'], ['moist', 'Влажные', 'blue']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.ralesType === val, c)} onClick={() => setField('ralesType', form.ralesType === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <input style={{ ...inputStyle, marginTop: 6, fontSize: 12 }} placeholder="Доп. данные..." value={form.respiratoryNote} onChange={e => setField('respiratoryNote', e.target.value)} />
              </div>

              {/* Сердце */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Сердце</div>
                <div style={pillGroup}>
                  {([['regular', 'Ритмичное', 'green'], ['irregular', 'Аритмия', 'red']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.heartRhythm === val, c)} onClick={() => setField('heartRhythm', form.heartRhythm === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <div style={{ marginTop: 6, ...pillGroup }}>
                  {([['clear', 'Тоны ясные', 'green'], ['muffled', 'Приглушены', 'orange'], ['deaf', 'Глухие', 'red']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.heartTones === val, c)} onClick={() => setField('heartTones', form.heartTones === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <input style={{ ...inputStyle, marginTop: 6, fontSize: 12 }} placeholder="Комментарий..." value={form.heartNote} onChange={e => setField('heartNote', e.target.value)} />
              </div>

              {/* Язык */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Язык</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                  {([['moist_clean', 'Влажный, чистый', 'green'], ['moist_coated', 'Влажный, обложен', 'orange'], ['dry_clean', 'Сухой, чистый', 'orange'], ['dry_coated', 'Сухой, обложен', 'red']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.tongueState === val, c)} onClick={() => setField('tongueState', form.tongueState === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
              </div>

              {/* Живот */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Живот</div>
                <div style={pillGroup}>
                  {([['soft', 'Мягкий, б/б', 'green'], ['tense', 'Напряжён', 'red'], ['bloated', 'Вздут', 'orange']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.abdomenState === val, c)} onClick={() => setField('abdomenState', form.abdomenState === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
                <input style={{ ...inputStyle, marginTop: 6, fontSize: 12 }} placeholder="Комментарий..." value={form.abdomenNote} onChange={e => setField('abdomenNote', e.target.value)} />
              </div>

              {/* Стул */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Стул</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                  {([['normal', 'Норм., регулярный', 'green'], ['constipation', 'Задержка', 'orange'], ['diarrhea', 'Жидкий', 'red'], ['absent', 'Нет', 'red']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.stool === val, c)} onClick={() => setField('stool', form.stool === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
              </div>

              {/* Мочеиспускание */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: 8 }}>Мочеиспускание</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                  {([['free_painless', 'Свободное, б/б', 'green'], ['difficult', 'Затруднено', 'orange'], ['painful', 'Болезненное', 'red'], ['frequent', 'Учащённое', 'orange']] as const).map(([val, lbl, c]) => (
                    <button key={val} style={pill(form.urination === val, c)} onClick={() => setField('urination', form.urination === val ? null : val)}>{lbl}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Динамика */}
        <div id="daily-diagnosis" style={block}>
          <div style={blockHeader}><TrendingUp size={15} /> Динамика</div>
          <div style={blockBody}>
            <div style={pillGroup}>
              {([
                ['improvement', 'Улучшение', 'green', TrendingUp],
                ['no_change', 'Стабильно', 'blue', Minus],
                ['deterioration', 'Ухудшение', 'red', TrendingDown],
              ] as const).map(([val, lbl, c, Icon]) => (
                <button
                  key={val}
                  style={{ ...pill(form.dynamics === val, c), display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => setField('dynamics', form.dynamics === val ? null : val)}
                >
                  <Icon size={13} /> {lbl}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={label}>Комментарий к динамике</label>
              <input style={inputStyle} placeholder="Состояние улучшается на фоне проводимой терапии..." value={form.dynamicsComment} onChange={e => setField('dynamicsComment', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Лечение */}
        <div id="daily-prescriptions" style={block}>
          <div style={blockHeader}>Лечение</div>
          <div style={blockBody}>
            <div style={pillGroup}>
              {([['keep', 'Оставить по листу назначений'], ['modify', 'Изменить']] as const).map(([val, lbl]) => (
                <button key={val} style={checkBtn(form.treatmentDecision === val)} onClick={() => setField('treatmentDecision', val)}>
                  <span style={{ width: 15, height: 15, borderRadius: '50%', border: `2px solid ${form.treatmentDecision === val ? '#3b82f6' : '#cbd5e1'}`, background: form.treatmentDecision === val ? '#3b82f6' : 'white', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {form.treatmentDecision === val && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'block' }} />}
                  </span>
                  {lbl}
                </button>
              ))}
            </div>

            {form.treatmentDecision === 'modify' && (
              <div style={{ marginTop: 14 }}>
                {form.prescriptions.map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                    <input style={{ ...inputStyle, flex: 2 }} value={p.drug} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, drug: e.target.value } : x) }))} placeholder="Препарат" />
                    <input style={{ ...inputStyle, flex: 1 }} value={p.dose} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, dose: e.target.value } : x) }))} placeholder="Доза" />
                    <input style={{ ...inputStyle, flex: 1 }} value={p.route} onChange={e => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.map(x => x.id === p.id ? { ...x, route: e.target.value } : x) }))} placeholder="Путь" />
                    <button onClick={() => setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.filter(x => x.id !== p.id) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={15} /></button>
                  </div>
                ))}
                <button onClick={() => setShowPrescModal(true)} style={{ marginTop: 6, fontSize: 13, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: FONT }}>
                  <Plus size={14} /> Добавить назначение
                </button>
              </div>
            )}
          </div>
        </div>

        {/* План */}
        <div id="daily-plan" style={block}>
          <div style={blockHeader}>План</div>
          <div style={{ ...blockBody, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>Контроль исследований</label>
              <input style={inputStyle} placeholder="ФГ ОГК контроль..." value={form.controlStudies} onChange={e => setField('controlStudies', e.target.value)} />
            </div>
            <div>
              <label style={label}>Повторный осмотр</label>
              <input style={inputStyle} placeholder="Завтра в 10:00..." value={form.nextInspection} onChange={e => setField('nextInspection', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Результат */}
        {showResult && form.generatedText ? (
          <div style={{ ...block, border: '2px solid #22c55e' }}>
            <div style={{ ...blockHeader, background: '#f0fdf4', color: '#059669' }}>
              <FileText size={15} color="#059669" /> Запись осмотра сформирована и сохранена
              <button
                onClick={() => { navigator.clipboard.writeText(form.generatedText); showToast('Текст скопирован', 'success') }}
                style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 8, border: '1px solid #86efac', background: 'white', color: '#059669', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
              >
                Копировать
              </button>
            </div>
            <div style={{ ...blockBody, background: '#fafffe' }}>
              <pre style={{ whiteSpace: 'pre-wrap' as const, fontFamily: FONT, fontSize: 13, color: '#1e293b', lineHeight: 1.7, margin: 0 }}>
                {form.generatedText}
              </pre>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={handleGenerateAndSave}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 4px 18px rgba(5,150,105,0.35)' }}
            >
              <Sparkles size={18} /> Сформировать запись осмотра
            </button>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Текст будет сохранён в истории пациента</div>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Модал назначения */}
      {showPrescModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowPrescModal(false)}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, maxWidth: 540, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Добавить назначение</h3>

            <div style={{ marginBottom: 12 }}>
              <label style={label}>Препарат *</label>
              <input style={inputStyle} placeholder="Цефтриаксон" value={newPresc.drug ?? ''} onChange={e => setNewPresc(p => ({ ...p, drug: e.target.value }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={label}>Форма</label>
                <select style={{ ...inputStyle, appearance: 'auto' as any }} value={newPresc.form ?? ''} onChange={e => setNewPresc(p => ({ ...p, form: e.target.value }))}>
                  <option value="">Выбрать...</option>
                  <option>Таблетки</option><option>Капсулы</option><option>р-р д/ин.</option>
                  <option>р-р д/инф.</option><option>Порошок</option><option>Суспензия</option>
                  <option>Капли</option><option>Мазь</option><option>Аэрозоль</option>
                </select>
              </div>
              <div>
                <label style={label}>Доза</label>
                <input type="number" min={0} step={0.1} style={inputStyle} placeholder="1.0" value={newPresc.dose ?? ''} onChange={e => setNewPresc(p => ({ ...p, dose: e.target.value }))} />
              </div>
              <div>
                <label style={label}>Единицы</label>
                <select style={{ ...inputStyle, appearance: 'auto' as any }} value={newPresc.unit ?? 'мг'} onChange={e => setNewPresc(p => ({ ...p, unit: e.target.value }))}>
                  <option>мг</option><option>г</option><option>мл</option><option>ЕД</option><option>мкг</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={label}>Путь введения</label>
                <select style={{ ...inputStyle, appearance: 'auto' as any }} value={newPresc.route ?? 'перорально'} onChange={e => setNewPresc(p => ({ ...p, route: e.target.value }))}>
                  <option>перорально</option><option>в/в</option><option>в/в капельно</option>
                  <option>в/м</option><option>п/к</option><option>ингаляционно</option><option>местно</option>
                </select>
              </div>
              <div>
                <label style={label}>Кратность</label>
                <select style={{ ...inputStyle, appearance: 'auto' as any }} value={newPresc.frequency ?? '1р/д'} onChange={e => setNewPresc(p => ({ ...p, frequency: e.target.value }))}>
                  <option>1р/д</option><option>2р/д</option><option>3р/д</option><option>4р/д</option>
                  <option>каждые 6ч</option><option>каждые 8ч</option><option>каждые 12ч</option><option>по требованию</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowPrescModal(false)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontFamily: FONT }}>Отмена</button>
              <button onClick={addPresc} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#059669', color: 'white', cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>Добавить</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999, padding: '12px 20px', borderRadius: 10, background: toastMsg.type === 'success' ? '#059669' : toastMsg.type === 'error' ? '#dc2626' : '#1d4ed8', color: 'white', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 28px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT }}>
          {toastMsg.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          {toastMsg.text}
        </div>
      )}
    </div>
  )
}

export default DailyRoundPage
