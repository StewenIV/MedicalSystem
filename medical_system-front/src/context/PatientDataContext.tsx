import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { mockPatients, Patient } from 'data/mockData'
import { SavedInspection } from 'pages/WardRound/types'
import { PatientCardDto } from 'api/patientsApi'

interface PatientDataState {
  patients: Patient[]
  inspections: Record<string, SavedInspection[]>  
  drafts: Record<string, any> 
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
  addPatient: (dto: Partial<PatientCardDto>) => Promise<PatientCardDto>
  updatePatient: (id: string, dto: PatientCardDto) => Promise<void>
  deletePatient: (id: string) => Promise<void>
}
type PatientDataContextValue = PatientDataState & PatientDataActions

const PatientDataContext = createContext<PatientDataContextValue | null>(null)

export const PatientDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<any[]>([])
  const [inspections, setInspections] = useState<Record<string, SavedInspection[]>>({})
  const [drafts, setDrafts] = useState<Record<string, any>>({})

  React.useEffect(() => {
    import('../api/patientsApi').then(({ fetchAllPatients }) => {
      fetchAllPatients().then((data) => {
        const mapped = data.map(dto => ({
          ...dto,
          doctor: dto.doctorName,
          department: dto.departmentName,
          statusText: dto.statusText || 'Госпитализирован',
          activeProblems: dto.medicalProblems?.map(m => m.name) || []
        }))
        setPatients(mapped)
      }).catch(console.error)
    })
  }, [])

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

  const addPatient = useCallback(async (dto: Partial<PatientCardDto>) => {
    const { addPatient: apiAddPatient } = await import('../api/patientsApi')
    const newPatient = await apiAddPatient(dto)
    const mapped = {
      ...newPatient,
      doctor: newPatient.doctorName,
      department: newPatient.departmentName,
      statusText: newPatient.statusText || 'Амбулаторный',
      activeProblems: newPatient.medicalProblems?.map(m => m.name) || []
    }
    setPatients(prev => [...prev, mapped])
    return newPatient
  }, [])

  const updatePatient = useCallback(async (id: string, dto: PatientCardDto) => {
    const { updatePatientCard } = await import('../api/patientsApi')
    await updatePatientCard(id, dto)
    setPatients(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...dto,
              doctor: dto.doctorName,
              department: dto.departmentName,
              statusText: dto.statusText || 'Госпитализирован',
              activeProblems: dto.medicalProblems?.map(m => m.name) || []
            }
          : p
      )
    )
  }, [])

  const deletePatient = useCallback(async (id: string) => {
    const { deletePatient: apiDeletePatient } = await import('../api/patientsApi')
    await apiDeletePatient(id)
    setPatients(prev => prev.filter(p => p.id !== id))
  }, [])

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
      addPatient,
      updatePatient,
      deletePatient
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
