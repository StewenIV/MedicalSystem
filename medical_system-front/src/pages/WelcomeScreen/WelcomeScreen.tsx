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
import { useNavigate } from 'react-router-dom'
import { paths } from 'routes/helpers'

import {
  WelcomeScreenContainer,
  Hero,
  Logo,
  Title,
  Subtitle,
  Description,
  Buttons,
  PrimaryButton,
  SecondaryButton,
  SectionTitle,
  BenefitGrid,
  CardIcon,
  CardTitle,
  List,
  ListItem,
  Card
} from './styled'

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate()

  const handleStaffLogin = () => {
    navigate(`${paths.auth}?role=staff`)
  }

  const handlePatientLogin = () => {
    navigate(`${paths.auth}?role=patient`)
  }
  return (
    <>
      <Helmet>
        <title>ЕМИС MedFlow - Главная</title>
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
            <span>Цифровизация здравоохранения для </span>
            <span>эффективной работы медицинского персонала </span>
            <span>и удобства пациентов </span>
          </Description>

          <Buttons>
            <PrimaryButton onClick={handleStaffLogin}>
              <Users size={20} />
              Вход для персонала
            </PrimaryButton>

            <SecondaryButton onClick={handlePatientLogin}>
              <FileText size={20} />
              Портал пациента
            </SecondaryButton>
          </Buttons>
        </Hero>

        <SectionTitle>Ключевые преимущества системы</SectionTitle>

        <BenefitGrid>
          <Card>
            <CardIcon color="blue">
              <CheckCircle size={32} />
            </CardIcon>
            <CardTitle>Для медицинского персонала</CardTitle>
            <List>
              <ListItem>
                <CheckCircle /> История болезни пациента
              </ListItem>
              <ListItem>
                <CheckCircle /> Автоматизация назначений
              </ListItem>
              <ListItem>
                <CheckCircle /> Управление расписанием
              </ListItem>
              <ListItem>
                <CheckCircle /> Интеграция с лабораториями
              </ListItem>
            </List>
          </Card>

          <Card>
            <CardIcon color="green">
              <Shield size={28} />
            </CardIcon>
            <CardTitle>Цифровая медкарта</CardTitle>
            <List>
              <ListItem>
                <CheckCircle /> Отказ от бумажных носителей
              </ListItem>
              <ListItem>
                <CheckCircle /> Безопасное хранение
              </ListItem>
              <ListItem>
                <CheckCircle /> Доступ из любого отделения
              </ListItem>
              <ListItem>
                <CheckCircle /> Соответствие GDPR
              </ListItem>
            </List>
          </Card>

          <Card>
            <CardIcon color="purple">
              <Heart size={28} />
            </CardIcon>
            <CardTitle>Для пациентов</CardTitle>
            <List>
              <ListItem>
                <CheckCircle /> Онлайн-запись 24/7
              </ListItem>
              <ListItem>
                <CheckCircle /> Анализы и обследования
              </ListItem>
              <ListItem>
                <CheckCircle /> История посещений
              </ListItem>
              <ListItem>
                <CheckCircle /> Напоминания
              </ListItem>
            </List>
          </Card>

          <Card>
            <CardIcon color="orange">
              <Clock size={28} />
            </CardIcon>
            <CardTitle>Экономия времени</CardTitle>
            <List>
              <ListItem>
                <CheckCircle /> Быстрое оформление
              </ListItem>
              <ListItem>
                <CheckCircle /> Автозаполнение
              </ListItem>
              <ListItem>
                <CheckCircle /> Поиск пациентов
              </ListItem>
              <ListItem>
                <CheckCircle /> Обмен данными
              </ListItem>
            </List>
          </Card>

          <Card>
            <CardIcon color="teal">
              <TrendingUp size={28} />
            </CardIcon>
            <CardTitle>Аналитика</CardTitle>
            <List>
              <ListItem>
                <CheckCircle /> Отчёты
              </ListItem>
              <ListItem>
                <CheckCircle /> Статистика врачей
              </ListItem>
              <ListItem>
                <CheckCircle /> Эффективность лечения
              </ListItem>
              <ListItem>
                <CheckCircle /> Загруженность
              </ListItem>
            </List>
          </Card>

          <Card>
            <CardIcon color="red">
              <FileText size={28} />
            </CardIcon>
            <CardTitle>Управление учреждением</CardTitle>
            <List>
              <ListItem>
                <CheckCircle /> Учёт палат
              </ListItem>
              <ListItem>
                <CheckCircle /> Графики дежурств
              </ListItem>
              <ListItem>
                <CheckCircle /> Медикаменты
              </ListItem>
              <ListItem>
                <CheckCircle /> Контроль качества
              </ListItem>
            </List>
          </Card>
        </BenefitGrid>
      </WelcomeScreenContainer>
    </>
  )
}
export default WelcomeScreen
