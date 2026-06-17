import React from 'react'
import { Helmet } from 'react-helmet'
import PatientCabinetPage from './PatientCabinetPage'

interface PatientCabinetPageProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

const PatientCabinetPageContainer: React.FC<PatientCabinetPageProps> = ({
  activeSection,
  onSectionChange
}) => (
  <>
    <Helmet>
      <title>Личный кабинет пациента — Пульмонологическое отделение</title>
      <meta name="description" content="Личный кабинет пациента пульмонологического отделения. Доступ к анализам, выпискам и уведомлениям." />
    </Helmet>
    <PatientCabinetPage activeSection={activeSection} onSectionChange={onSectionChange} />
  </>
)

export default PatientCabinetPageContainer
