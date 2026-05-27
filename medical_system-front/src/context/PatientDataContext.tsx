import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { mockPatients, Patient } from 'data/mockData'
import { SavedInspection } from 'pages/WardRound/types'
// ─── Состояние контекста ──────────────────────────────────────────
interface PatientDataState {
  patients: Patient[]
  inspections: Record<string, SavedInspection[]>  // patientId → inspections
  drafts: Record<string, any> // key → draft form state
}
interface PatientDataActions {
  saveInspection: (patientId: string, inspection: SavedInspection) => void
  updatePatientVitals: (patientId: string, vitals: any) => void
  updatePatientDiagnosis: (patientId: string, diagnosis: string) => void
  updatePatientMeds: (patientId: string, meds: Patient['currentMeds']) => void
  addHistoryEntry: (patientId: string, entry: Patient['history'][0]) => void
  getPatient: (patientId: string) => Patient | undefined
  getInspections: (patientId: string) => SavedInspection[]
  saveDraft: (key: string, draft: any) => void
  getDraft: (key: string) => any
}
type PatientDataContextValue = PatientDataState & PatientDataActions
// ─── Контекст ─────────────────────────────────────────────────────
const PatientDataContext = createContext<PatientDataContextValue | null>(null)
// ─── Провайдер ────────────────────────────────────────────────────
export const PatientDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [inspections, setInspections] = useState<Record<string, SavedInspection[]>>({})
  const [drafts, setDrafts] = useState<Record<string, any>>({})

  const saveDraft = useCallback((key: string, draft: any) => {
    setDrafts(prev => ({ ...prev, [key]: draft }))
  }, [])

  const getDraft = useCallback((key: string) => {
    return drafts[key]
  }, [drafts])

  const saveInspection = useCallback((patientId: string, inspection: SavedInspection) => {
    setInspections(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] ?? []), inspection],
    }))
  }, [])
  const updatePatientVitals = useCallback((patientId: string, vitals: any) => {
    setPatients(prev =>
      prev.map(p => p.id === patientId ? { ...p, vitals: { ...(p as any).vitals, ...vitals } } as Patient : p)
    )
  }, [])
  const updatePatientDiagnosis = useCallback((patientId: string, diagnosis: string) => {
    setPatients(prev =>
      prev.map(p =>
        p.id === patientId
          ? { ...p, activeProblems: [diagnosis, ...(p.activeProblems?.slice(1) ?? [])] }
          : p
      )
    )
  }, [])
  const updatePatientMeds = useCallback((patientId: string, meds: Patient['currentMeds']) => {
    setPatients(prev =>
      prev.map(p => p.id === patientId ? { ...p, currentMeds: meds } : p)
    )
  }, [])
  const addHistoryEntry = useCallback((patientId: string, entry: Patient['history'][0]) => {
    setPatients(prev =>
      prev.map(p =>
        p.id === patientId
          ? { ...p, history: [entry, ...(p.history ?? [])] }
          : p
      )
    )
  }, [])
  const getPatient = useCallback((patientId: string) => {
    return patients.find(p => p.id === patientId)
  }, [patients])
  const getInspections = useCallback((patientId: string) => {
    return inspections[patientId] ?? []
  }, [inspections])
  return (
    <PatientDataContext.Provider value={{
      patients,
      inspections,
      saveInspection,
      updatePatientVitals,
      updatePatientDiagnosis,
      updatePatientMeds,
      addHistoryEntry,
      getPatient,
      getInspections,
      drafts,
      saveDraft,
      getDraft,
    }}>
      {children}
    </PatientDataContext.Provider>
  )
}

export const usePatientData = (): PatientDataContextValue => {
  const ctx = useContext(PatientDataContext)
  if (!ctx) throw new Error('usePatientData must be used within PatientDataProvider')
  return ctx
}
