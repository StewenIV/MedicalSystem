import {
  Heart,
  CheckCircle,
  Shield,
  Clock,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react'
import { Helmet } from 'react-helmet'

import { 
  WelcomeScreenContainer,
  Hero,
  Logo,
  Title,
  Subtitle,
  Description,
  Buttons,
  PrimaryButton,
  SecondaryButton
 } from './styled'
import { on } from 'events'

interface WelcomeScreenProps {
  onContinue?: () => void
  onPatientPortal?: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue,
  onPatientPortal
}) => {
  return (
    <>
      <Helmet>
        <title>ЕМИС MedFlow</title>
        <meta
          name="description"
          content="Единая медицинская информационная система"
        />
      </Helmet>

      <WelcomeScreenContainer>
        <Hero>
          <Logo>
            <Heart size={48} />
          </Logo>
          <Title>ЕМИС MedFlow</Title>
          <Subtitle>Единая медицинская информационная система</Subtitle>
          <Description>
            Цифровизация здравоохранения для эффективной работы медицинского
            персонала и удобства пациентов
          </Description>

           <Buttons>
            <PrimaryButton onClick={onContinue}>
              <Users size={20} />
              Вход для персонала
            </PrimaryButton>

            <SecondaryButton onClick={onPatientPortal}>
              <FileText size={20} />
              Портал пациента
            </SecondaryButton>
           </Buttons>
        </Hero>
      </WelcomeScreenContainer>
    </>
  )
}
export default WelcomeScreen
