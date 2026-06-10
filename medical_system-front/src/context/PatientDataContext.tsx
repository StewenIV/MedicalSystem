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
  addHistoryEntry: (patientId: string, entry: Patient['history'][0]) => Promise<SavedInspection>
  updateHistoryEntry: (patientId: string, encounterId: string, entry: Patient['history'][0]) => Promise<void>
  updatePatientRoundData: (patientId: string, vitals?: any, diagnosis?: string, meds?: Patient['currentMeds']) => Promise<void>
  getPatient: (patientId: string) => Patient | undefined
  getInspections: (patientId: string) => SavedInspection[]
  loadPatientEncounters: (patientId: string) => Promise<void>
  saveDraft: (key: string, draft: any) => void
  getDraft: (key: string) => any
  addPatient: (dto: Partial<PatientCardDto>) => Promise<PatientCardDto>
  updatePatient: (id: string, dto: PatientCardDto) => Promise<void>
  deletePatient: (id: string) => Promise<void>
}
type PatientDataContextValue = PatientDataState & PatientDataActions

const PatientDataContext = createContext<PatientDataContextValue | null>(null)

const cleanEmptyDates = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(cleanEmptyDates)

  const newObj: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key]
      if (key === 'dateTime' && typeof val === 'string' && val.includes(' ')) {
        newObj[key] = val.replace(' ', 'T')
        continue
      }
      if (typeof val === 'string' && (val === 'дд.мм.гггг' || val === '' || val === '__.__.____')) {
        if (val === 'дд.мм.гггг' || val === '__.__.____' || key.toLowerCase().includes('date')) {
          newObj[key] = null
          continue
        }
      }
      newObj[key] = typeof val === 'object' ? cleanEmptyDates(val) : val
    }
  }
  return newObj
}

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

    import('../api/encountersApi').then(({ fetchTodayEncounters }) => {
      fetchTodayEncounters().then((grouped) => {
        setInspections(grouped)
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
      [patientId]: [...(prev[patientId] ?? []).filter(i => i.id !== inspection.id), inspection],
    }))
  }, [])

  const updatePatientVitals = useCallback(async (patientId: string, vitals: any) => {
    try {
      const { postVitalSign } = await import('../api/vitalSignsApi')
      const bpParts = (vitals.bp ?? '').split('/')
      const sys = bpParts[0] ? parseInt(bpParts[0]) : null
      const dia = bpParts[1] ? parseInt(bpParts[1]) : null
      
      const payload = {
        temperature: vitals.temp ? parseFloat(vitals.temp) : null,
        pulse: vitals.hr ? parseInt(vitals.hr) : null,
        bloodPressureSystolic: sys,
        bloodPressureDiastolic: dia,
        spO2: vitals.spo2 ? parseInt(vitals.spo2) : null,
        respiratoryRate: vitals.resp ? parseInt(vitals.resp) : null
      }
      
      await postVitalSign(patientId, payload)
      
      setPatients(prev =>
        prev.map(p => p.id === patientId ? { ...p, vitals: { ...(p as any).vitals, ...vitals } } as Patient : p)
      )
    } catch (err) {
      console.error('Failed to post vitals to server:', err)
      setPatients(prev =>
        prev.map(p => p.id === patientId ? { ...p, vitals: { ...(p as any).vitals, ...vitals } } as Patient : p)
      )
    }
  }, [])

  const updatePatientDiagnosis = useCallback(async (patientId: string, diagnosis: string) => {
    try {
      setPatients(prev => {
        const patient = prev.find(p => p.id === patientId)
        if (!patient) return prev
        
        const updatedProblems = [...(patient.medicalProblems ?? [])]
        const primaryProbIndex = updatedProblems.findIndex((p: any) => p.isActive)
        if (primaryProbIndex >= 0) {
          updatedProblems[primaryProbIndex] = { ...updatedProblems[primaryProbIndex], name: diagnosis }
        } else {
          updatedProblems.push({ id: '00000000-0000-0000-0000-000000000000', name: diagnosis, isActive: true })
        }
        
        const updatedPatient = {
          ...patient,
          medicalProblems: updatedProblems,
          activeProblems: [diagnosis, ...(patient.activeProblems?.slice(1) ?? [])]
        }
        
        import('../api/patientsApi').then(({ updatePatientCard }) => {
          const cleanedDto = cleanEmptyDates(updatedPatient)
          updatePatientCard(patientId, cleanedDto).catch(console.error)
        })

        return prev.map(p => p.id === patientId ? updatedPatient : p)
      })
    } catch (err) {
      console.error('Failed to update patient diagnosis:', err)
    }
  }, [])

  const updatePatientMeds = useCallback(async (patientId: string, meds: Patient['currentMeds']) => {
    try {
      setPatients(prev => {
        const patient = prev.find(p => p.id === patientId)
        if (!patient) return prev
        
        const updatedMeds = meds.map((m: any) => ({
          id: m.id?.startsWith('med-') || m.id?.startsWith('np-') ? '00000000-0000-0000-0000-000000000000' : m.id || '00000000-0000-0000-0000-000000000000',
          name: m.name || m.drug,
          dose: m.dose,
          form: m.form,
          regimen: m.regimen || m.frequency
        }))
        
        const updatedPatient = {
          ...patient,
          currentMeds: updatedMeds
        }

        import('../api/patientsApi').then(({ updatePatientCard }) => {
          const cleanedDto = cleanEmptyDates(updatedPatient)
          updatePatientCard(patientId, cleanedDto).catch(console.error)
        })

        return prev.map(p => p.id === patientId ? updatedPatient : p)
      })
    } catch (err) {
      console.error('Failed to update patient medications:', err)
    }
  }, [])

  const addHistoryEntry = useCallback(async (patientId: string, entry: Patient['history'][0]) => {
    try {
      const { createEncounter } = await import('../api/encountersApi')
      
      let backendType = 'Daily Round'
      if (entry.type?.toLowerCase().includes('первичн') || entry.type?.toLowerCase().includes('повторн')) {
        backendType = 'Primary Inspection'
      }

      let dt = new Date()
      if (entry.dateTime) {
        const parsed = Date.parse(entry.dateTime.replace(' ', 'T'))
        if (!isNaN(parsed)) {
          dt = new Date(parsed)
        }
      }

      const reqPayload = {
        dateTime: dt.toISOString(),
        type: backendType,
        conclusion: entry.conclusion ?? '',
        complaints: entry.complaints ?? '',
        objective: entry.objective ?? '',
        recommendations: entry.recommendations ?? '',
        formData: entry.formData ?? null,
      }

      const savedInsp = await createEncounter(patientId, reqPayload)
      
      setInspections(prev => ({
        ...prev,
        [patientId]: [...(prev[patientId] ?? []).filter(i => i.id !== savedInsp.id), savedInsp],
      }))

      setPatients(prev =>
        prev.map(p =>
          p.id === patientId
            ? {
                ...p,
                history: [
                  {
                    id: savedInsp.id,
                    dateTime: entry.dateTime,
                    type: entry.type,
                    doctorName: savedInsp.doctor,
                    complaints: entry.complaints,
                    objective: entry.objective,
                    conclusion: entry.conclusion,
                    recommendations: entry.recommendations,
                    formData: entry.formData,
                  },
                  ...(p.history ?? []),
                ],
              }
            : p
        )
      )
      return savedInsp
    } catch (err) {
      console.error('Failed to save encounter to backend:', err)
      setPatients(prev =>
        prev.map(p =>
          p.id === patientId
            ? { ...p, history: [entry, ...(p.history ?? [])] }
            : p
        )
      )
      throw err
    }
  }, [])

  const updateHistoryEntry = useCallback(async (patientId: string, encounterId: string, entry: Patient['history'][0]) => {
    try {
      const { updateEncounter } = await import('../api/encountersApi')
      
      let backendType = 'Daily Round'
      if (entry.type?.toLowerCase().includes('первичн') || entry.type?.toLowerCase().includes('повторн')) {
        backendType = 'Primary Inspection'
      }

      let dt = new Date()
      if (entry.dateTime) {
        const parsed = Date.parse(entry.dateTime.replace(' ', 'T'))
        if (!isNaN(parsed)) {
          dt = new Date(parsed)
        }
      }

      const reqPayload = {
        dateTime: dt.toISOString(),
        type: backendType,
        conclusion: entry.conclusion ?? '',
        complaints: entry.complaints ?? '',
        objective: entry.objective ?? '',
        recommendations: entry.recommendations ?? '',
        formData: entry.formData ?? null,
      }

      const savedInsp = await updateEncounter(patientId, encounterId, reqPayload)
      
      setInspections(prev => ({
        ...prev,
        [patientId]: (prev[patientId] ?? []).map(i => i.id === encounterId ? savedInsp : i),
      }))

      setPatients(prev =>
        prev.map(p =>
          p.id === patientId
            ? {
                ...p,
                history: (p.history ?? []).map((h: any) =>
                  h.id === encounterId
                    ? {
                        ...h,
                        dateTime: entry.dateTime,
                        type: entry.type,
                        doctorName: savedInsp.doctor,
                        complaints: entry.complaints,
                        objective: entry.objective,
                        conclusion: entry.conclusion,
                        recommendations: entry.recommendations,
                        formData: entry.formData,
                      }
                    : h
                ),
              }
            : p
        )
      )
    } catch (err) {
      console.error('Failed to update encounter on backend:', err)
      throw err
    }
  }, [])

  const updatePatientRoundData = useCallback(async (
    patientId: string,
    vitals?: { temp?: string; hr?: string; bp?: string; spo2?: string; resp?: string },
    diagnosis?: string,
    meds?: Patient['currentMeds']
  ) => {
    try {
      const patient = patients.find(p => p.id === patientId)
      if (!patient) return

      const updatedPatient = { ...patient }

      if (vitals) {
        updatedPatient.vitals = {
          ...updatedPatient.vitals,
          temp: vitals.temp ?? updatedPatient.vitals?.temp,
          bp: vitals.bp ?? updatedPatient.vitals?.bp,
          hr: vitals.hr ?? updatedPatient.vitals?.hr,
          resp: vitals.resp ?? updatedPatient.vitals?.resp,
          spo2: vitals.spo2 ?? updatedPatient.vitals?.spo2,
        }
      }

      if (diagnosis) {
        const updatedProblems = [...(updatedPatient.medicalProblems ?? [])]
        const primaryProbIndex = updatedProblems.findIndex((p: any) => p.isActive)
        if (primaryProbIndex >= 0) {
          updatedProblems[primaryProbIndex] = { ...updatedProblems[primaryProbIndex], name: diagnosis }
        } else {
          updatedProblems.push({ id: '00000000-0000-0000-0000-000000000000', name: diagnosis, isActive: true })
        }
        updatedPatient.medicalProblems = updatedProblems
        updatedPatient.activeProblems = [diagnosis, ...(updatedPatient.activeProblems?.slice(1) ?? [])]
      }

      if (meds) {
        updatedPatient.currentMeds = meds.map((m: any) => ({
          id: m.id?.startsWith('med-') || m.id?.startsWith('np-') ? '00000000-0000-0000-0000-000000000000' : m.id || '00000000-0000-0000-0000-000000000000',
          name: m.name || m.drug,
          dose: m.dose,
          form: m.form,
          regimen: m.regimen || m.frequency
        }))
      }

      const { updatePatientCard } = await import('../api/patientsApi')
      const cleanedDto = cleanEmptyDates(updatedPatient)
      await updatePatientCard(patientId, cleanedDto)

      if (vitals) {
        const { postVitalSign } = await import('../api/vitalSignsApi')
        const bpParts = (vitals.bp ?? '').split('/')
        const sys = bpParts[0] ? parseInt(bpParts[0]) : null
        const dia = bpParts[1] ? parseInt(bpParts[1]) : null
        
        const vitalsPayload = {
          temperature: vitals.temp ? parseFloat(vitals.temp) : null,
          pulse: vitals.hr ? parseInt(vitals.hr) : null,
          bloodPressureSystolic: sys,
          bloodPressureDiastolic: dia,
          spO2: vitals.spo2 ? parseInt(vitals.spo2) : null,
          respiratoryRate: vitals.resp ? parseInt(vitals.resp) : null
        }
        await postVitalSign(patientId, vitalsPayload)
      }

      setPatients(prev => prev.map(p => p.id === patientId ? updatedPatient : p))
    } catch (err) {
      console.error('Failed to update consolidated patient round data:', err)
      throw err
    }
  }, [patients])

  const getPatient = useCallback((patientId: string) => {
    return patients.find(p => p.id === patientId)
  }, [patients])
  const getInspections = useCallback((patientId: string) => {
    return inspections[patientId] ?? []
  }, [inspections])

  const loadPatientEncounters = useCallback(async (patientId: string) => {
    try {
      const { fetchPatientEncounters } = await import('../api/encountersApi')
      const data = await fetchPatientEncounters(patientId)
      setInspections(prev => ({
        ...prev,
        [patientId]: data,
      }))
    } catch (err) {
      console.error('Failed to load patient encounters:', err)
    }
  }, [])
  const addPatient = useCallback(async (dto: Partial<PatientCardDto>) => {
    const { addPatient: apiAddPatient } = await import('../api/patientsApi')
    const cleanedDto = cleanEmptyDates(dto)
    const newPatient = await apiAddPatient(cleanedDto)
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
    const cleanedDto = cleanEmptyDates(dto)
    await updatePatientCard(id, cleanedDto)
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
      updateHistoryEntry,
      updatePatientRoundData,
      getPatient,
      getInspections,
      loadPatientEncounters,
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
