import { Helmet } from 'react-helmet'
import {
  PageWrapper,
  Card,
  BackButton,
  Logo,
  Tabs,
  Tab,
  Form,
  InputGroup,
  CheckboxRow,
  SubmitButton,
  Divider,
  OAuthButton,
  RegisterBlock
} from './styled'

import { ReactComponent as GoogleIcon } from 'pages/img/google.svg'
import Input from 'components/Input'
import { ArrowLeft, ArrowRight, LogIn, User, Lock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from 'store'
import { setIsLogged, setUserRole } from 'features/App/reducer'
import { UserRole } from 'features/App/types'
import { paths } from 'routes/helpers'

import { toast } from 'react-toastify'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [selectedRole, setSelectedRole] = useState<'staff' | 'patient'>('staff')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!login || !password) {
      toast.error('Пожалуйста, заполните все поля формы.')
      return
    }

    // Определяем роль пользователя на основе логина
    let role: UserRole = 'patient'

    if (login.includes('admin')) {
      role = 'admin'
    } else if (login.includes('chief')) {
      role = 'chief_doctor'
    } else if (login.includes('doctor')) {
      role = 'doctor'
    } else if (login.includes('head_nurse')) {
      role = 'head_nurse'
    } else if (login.includes('nurse')) {
      role = 'nurse'
    } else if (login.includes('lab')) {
      role = 'laboratory'
    }

    // Сохраняем состояние в Redux
    dispatch(setUserRole(role))
    dispatch(setIsLogged(true))

    // Перенаправляем на главную страницу
    navigate(paths.home)
  }

  return (
    <>
      <Helmet>
        <title>AuthPage</title>
        <meta name="description" content="Страница входа в систему" />
      </Helmet>

      <PageWrapper>
        <Card>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Назад
          </BackButton>

          <Logo>
            <div>
              <LogIn size={32} />
            </div>
            <h1>ЕМИС MedFlow</h1>
            <p>Вход в систему</p>
          </Logo>
          <Tabs>
            <Tab
              active={selectedRole === 'staff'}
              onClick={() => setSelectedRole('staff')}
            >
              Для персонала
            </Tab>
            <Tab
              active={selectedRole === 'patient'}
              onClick={() => setSelectedRole('patient')}
            >
              Для пациентов
            </Tab>
          </Tabs>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <label>Логин / Email</label>
              <Input
                icon={<User size={18} />}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Введите ваш логин или email"
              />
            </InputGroup>

            <InputGroup>
              <label>Пароль</label>
              <Input
                icon={<Lock size={18} />}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите ваш пароль"
              />
            </InputGroup>

            <CheckboxRow>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Запомнить меня
              </label>

              <a href="#">Забыли пароль?</a>
            </CheckboxRow>

            <SubmitButton type="submit">Войти</SubmitButton>

            <Divider>или</Divider>

            <OAuthButton onClick={() => alert('Скоро будет')}>
              <GoogleIcon
                width={24}
                height={24}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              />
              Войти с помощью Google
            </OAuthButton>

            {selectedRole === 'patient' && (
              <RegisterBlock>
                <p>Нет учетной записи?</p>
                <button onClick={() => navigate(paths.registration)}>
                  Зарегистрироваться как пациент
                  <ArrowRight size={16} />
                </button>
              </RegisterBlock>
            )}
          </Form>
        </Card>
      </PageWrapper>
    </>
  )
}

export default AuthPage
