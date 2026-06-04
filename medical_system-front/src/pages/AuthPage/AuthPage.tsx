import { Helmet } from 'react-helmet'
import {
  PageWrapper,
  Card,
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

import {jwtDecode} from 'jwt-decode'
import { BackButton } from 'components/Button'
import { ReactComponent as GoogleIcon } from 'pages/img/google.svg'
import Input from 'components/Input'
import { ArrowRight, LogIn, User, Lock, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from 'store'
import { setUserInfo } from 'features/App/reducer'
import { UserRole } from 'features/App/types'
import { paths } from 'routes/helpers'
import { authApi } from 'api/authApi'
import { toast } from 'react-toastify'

const TOKEN_KEY = 'token'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const roleFromUrl = searchParams.get('role') as 'staff' | 'patient' | null
  const [selectedRole, setSelectedRole] = useState<'staff' | 'patient'>(
    roleFromUrl || 'staff'
  )

  useEffect(() => {
    if (roleFromUrl && (roleFromUrl === 'staff' || roleFromUrl === 'patient')) {
      setSelectedRole(roleFromUrl)
    }
  }, [roleFromUrl])

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!login.trim() || !password.trim()) {
      toast.error('Пожалуйста, заполните все поля формы.')
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.login(login.trim(), password)
      localStorage.setItem(TOKEN_KEY, response.token)

      const decodedToken: any = jwtDecode(response.token)
      console.log(decodedToken.displayName); 
      dispatch(setUserInfo({
        userId: decodedToken.sub,
        userLogin: decodedToken.login,  
        displayName: decodedToken.displayName ?? null,
        role: decodedToken.role as UserRole
      }))
      navigate(paths.home)
      toast.success(`Добро пожаловать, ${decodedToken.displayName ?? decodedToken.login}!`)
    } catch (err: any) {
      toast.error(err.message || 'Ошибка входа. Проверьте логин и пароль.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Вход — Пульмонология</title>
        <meta name="description" content="Страница входа в систему" />
      </Helmet>

      <PageWrapper>
        <Card>
          <BackButton onClick={() => navigate(paths.welcome)}>
            Назад{' '}
          </BackButton>

          <Logo>
            <div>
              <LogIn size={32} />
            </div>
            <h1>Пульмонология</h1>
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
              <label>Логин</label>
              <Input
                icon={<User size={18} />}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Введите ваш логин"
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </InputGroup>

            <CheckboxRow>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                Запомнить меня
              </label>

              <a href={paths.resetPassword}>Забыли пароль?</a>
            </CheckboxRow>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  {' '}Вход...
                </>
              ) : (
                'Войти'
              )}
            </SubmitButton>

            <Divider>или</Divider>

            <OAuthButton type="button" onClick={() => alert('Скоро будет')} disabled={isLoading}>
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
                <button
                  type="button"
                  onClick={() => navigate(paths.registration)}
                >
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
