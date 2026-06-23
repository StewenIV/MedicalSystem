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

import { BackButton } from 'components/Button'
import { ReactComponent as GoogleIcon } from 'pages/img/google.svg'
import Input from 'components/Input'
import { ArrowRight, LogIn, User, Lock, Loader2, Mail, Calendar, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch } from 'store'
import { setUserInfo } from 'features/App/reducer'
import { UserRole } from 'features/App/types'
import { paths } from 'routes/helpers'
import { authApi, decodeJwt } from 'api/authApi'
import { toast } from 'react-toastify'
import { PatternFormat } from 'react-number-format'
import { getPhoneFormat } from 'utils/phoneFormat'

const PatternFormatAny = PatternFormat as any

const TOKEN_KEY = 'token'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const roleFromUrl = searchParams.get('role') as 'staff' | 'patient' | null
  const [selectedRole, setSelectedRole] = useState<'staff' | 'patient'>(roleFromUrl || 'staff')

  useEffect(() => {
    if (roleFromUrl && (roleFromUrl === 'staff' || roleFromUrl === 'patient')) {
      setSelectedRole(roleFromUrl)
    }
  }, [roleFromUrl])

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [googleClient, setGoogleClient] = useState<any>(null)
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [newGoogleUser, setNewGoogleUser] = useState<{
    email: string
    firstName: string
    lastName: string
  } | null>(null)
  const [googleRegData, setGoogleRegData] = useState({
    gender: 'Male',
    dateOfBirth: '',
    phone: '',
    firstName: '',
    lastName: '',
    middleName: ''
  })
  const [googleErrors, setGoogleErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    authApi
      .getGoogleConfig()
      .then((config) => {
        if (config.clientId) {
          loadGoogleScript(config.clientId)
        }
      })
      .catch((err) => {
        console.error('Error fetching Google config:', err)
      })
  }, [])

  const loadGoogleScript = (clientId: string) => {
    if ((window as any).google) {
      initGoogleClient(clientId)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      initGoogleClient(clientId)
    }
    document.head.appendChild(script)
  }

  const initGoogleClient = (clientId: string) => {
    if ((window as any).google) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: (response: any) => {
            if (response.error) {
              toast.error('Ошибка авторизации через Google')
              return
            }
            handleGoogleToken(response.access_token)
          }
        })
        setGoogleClient(client)
      } catch (err) {
        console.error('Failed to init Google OAuth client', err)
      }
    }
  }

  const handleGoogleToken = async (accessToken: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.googleLogin(accessToken)
      if (response.isNewUser) {
        setGoogleToken(accessToken)
        setNewGoogleUser({
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName
        })
        setGoogleRegData((prev) => ({
          ...prev,
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          middleName: ''
        }))
      } else {
        if (!response.token) throw new Error('Не получен токен авторизации.')
        localStorage.setItem(TOKEN_KEY, response.token)
        const decodedToken = decodeJwt(response.token)
        if (!decodedToken) {
          throw new Error('Не удалось декодировать токен авторизации.')
        }

        dispatch(
          setUserInfo({
            userId: decodedToken.sub ?? '',
            userLogin: decodedToken.login ?? '',
            displayName: decodedToken.displayName ?? null,
            role: (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
              decodedToken.role) as UserRole,
            patientId: decodedToken.patientId ?? null
          })
        )
        navigate(paths.home)
        toast.success(`Добро пожаловать, ${decodedToken.displayName ?? decodedToken.login}!`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Ошибка входа через Google.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLoginClick = () => {
    if (googleClient) {
      googleClient.requestAccessToken()
    } else {
      toast.error('Интеграция Google Sign-In не настроена или загружается.')
    }
  }

  const handleGoogleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!googleToken) return

    const errs: Record<string, string> = {}

    const singleWordRegex = /^[А-Яа-яее]+(-[А-Яа-яее]+)?$/i

    if (!googleRegData.lastName.trim()) {
      errs.lastName = 'Укажите фамилию'
    } else if (!singleWordRegex.test(googleRegData.lastName.trim())) {
      errs.lastName = 'Только русские буквы'
    }

    if (!googleRegData.firstName.trim()) {
      errs.firstName = 'Укажите имя'
    } else if (!singleWordRegex.test(googleRegData.firstName.trim())) {
      errs.firstName = 'Только русские буквы'
    }

    if (googleRegData.middleName.trim() && !singleWordRegex.test(googleRegData.middleName.trim())) {
      errs.middleName = 'Только русские буквы'
    }

    if (!googleRegData.dateOfBirth) errs.dateOfBirth = 'Укажите дату рождения'
    if (!googleRegData.phone) errs.phone = 'Укажите телефон'

    if (Object.keys(errs).length > 0) {
      setGoogleErrors(errs)
      toast.error('Пожалуйста, заполните поля корректно.')
      return
    }

    const firstName = googleRegData.firstName.trim()
    const lastName = googleRegData.lastName.trim()
    const middleName = googleRegData.middleName.trim()

    setIsLoading(true)
    try {
      const response = await authApi.googleRegister({
        accessToken: googleToken,
        gender: googleRegData.gender,
        dateOfBirth: googleRegData.dateOfBirth,
        phone: googleRegData.phone,
        firstName,
        lastName,
        middleName
      })

      if (!response.token) throw new Error('Не получен токен авторизации после регистрации.')
      localStorage.setItem(TOKEN_KEY, response.token)
      const decodedToken = decodeJwt(response.token)
      if (!decodedToken) {
        throw new Error('Не удалось декодировать токен авторизации.')
      }

      dispatch(
        setUserInfo({
          userId: decodedToken.sub ?? '',
          userLogin: decodedToken.login ?? '',
          displayName: decodedToken.displayName ?? null,
          role: (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
            decodedToken.role) as UserRole,
          patientId: decodedToken.patientId ?? null
        })
      )
      navigate(paths.home)
      toast.success(
        `Регистрация завершена! Добро пожаловать, ${decodedToken.displayName ?? decodedToken.login}!`
      )
    } catch (err: any) {
      toast.error(err.message || 'Ошибка регистрации через Google.')
    } finally {
      setIsLoading(false)
    }
  }

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

      const decodedToken = decodeJwt(response.token)
      if (!decodedToken) {
        throw new Error('Не удалось декодировать токен авторизации.')
      }

      dispatch(
        setUserInfo({
          userId: decodedToken.sub ?? '',
          userLogin: decodedToken.login ?? '',
          displayName: decodedToken.displayName ?? null,
          role: (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
            decodedToken.role) as UserRole,
          patientId: decodedToken.patientId ?? null
        })
      )
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
        <title>{newGoogleUser ? 'Завершение регистрации' : 'Вход'} — Пульмонология</title>
        <meta name="description" content="Страница входа в систему" />
      </Helmet>

      <PageWrapper>
        {newGoogleUser ? (
          <Card>
            <BackButton
              onClick={() => {
                setNewGoogleUser(null)
                setGoogleToken(null)
              }}
            >
              Назад{' '}
            </BackButton>

            <Logo>
              <div>
                <User size={32} />
              </div>
              <h1>Регистрация</h1>
              <p>Пожалуйста, укажите недостающие данные пациента</p>
            </Logo>

            <Form onSubmit={handleGoogleRegisterSubmit}>
              <InputGroup>
                <label>Email</label>
                <Input icon={<Mail size={18} />} type="text" value={newGoogleUser.email} disabled />
              </InputGroup>

              <InputGroup>
                <label>Фамилия *</label>
                <Input
                  icon={<User size={18} />}
                  type="text"
                  value={googleRegData.lastName}
                  onChange={(e) => {
                    setGoogleRegData({ ...googleRegData, lastName: e.target.value })
                    if (googleErrors.lastName) setGoogleErrors({ ...googleErrors, lastName: '' })
                  }}
                  error={googleErrors.lastName}
                  placeholder="Иванов"
                />
              </InputGroup>

              <InputGroup>
                <label>Имя *</label>
                <Input
                  icon={<User size={18} />}
                  type="text"
                  value={googleRegData.firstName}
                  onChange={(e) => {
                    setGoogleRegData({ ...googleRegData, firstName: e.target.value })
                    if (googleErrors.firstName) setGoogleErrors({ ...googleErrors, firstName: '' })
                  }}
                  error={googleErrors.firstName}
                  placeholder="Иван"
                />
              </InputGroup>

              <InputGroup>
                <label>Отчество</label>
                <Input
                  icon={<User size={18} />}
                  type="text"
                  value={googleRegData.middleName}
                  onChange={(e) => {
                    setGoogleRegData({ ...googleRegData, middleName: e.target.value })
                    if (googleErrors.middleName)
                      setGoogleErrors({ ...googleErrors, middleName: '' })
                  }}
                  error={googleErrors.middleName}
                  placeholder="Иванович"
                />
              </InputGroup>

              <InputGroup>
                <label>Пол</label>
                <Tabs style={{ marginBottom: 0 }}>
                  <Tab
                    type="button"
                    active={googleRegData.gender === 'Male'}
                    onClick={() => setGoogleRegData({ ...googleRegData, gender: 'Male' })}
                  >
                    Мужской
                  </Tab>
                  <Tab
                    type="button"
                    active={googleRegData.gender === 'Female'}
                    onClick={() => setGoogleRegData({ ...googleRegData, gender: 'Female' })}
                  >
                    Женский
                  </Tab>
                </Tabs>
              </InputGroup>

              <InputGroup>
                <label>Дата рождения *</label>
                <Input
                  icon={<Calendar size={18} />}
                  type="date"
                  value={googleRegData.dateOfBirth}
                  onChange={(e) =>
                    setGoogleRegData({ ...googleRegData, dateOfBirth: e.target.value })
                  }
                  error={googleErrors.dateOfBirth}
                  disabled={isLoading}
                />
              </InputGroup>

              <InputGroup>
                <label>Телефон *</label>
                <PatternFormatAny
                  allowEmptyFormatting
                  value={googleRegData.phone}
                  onValueChange={(values: any) =>
                    setGoogleRegData({
                      ...googleRegData,
                      phone: values.value ? values.formattedValue : ''
                    })
                  }
                  customInput={Input}
                  error={googleErrors.phone}
                  icon={<Phone size={18} />}
                  type="tel"
                  format={getPhoneFormat(googleRegData.phone)}
                  mask="_"
                  disabled={isLoading}
                />
              </InputGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />{' '}
                    Сохранение...
                  </>
                ) : (
                  'Завершить регистрацию'
                )}
              </SubmitButton>
            </Form>
          </Card>
        ) : (
          <Card>
            <BackButton onClick={() => navigate(paths.welcome)}>Назад </BackButton>

            <Logo>
              <div>
                <LogIn size={32} />
              </div>
              <h1>Пульмонология</h1>
              <p>Вход в систему</p>
            </Logo>
            <Tabs>
              <Tab active={selectedRole === 'staff'} onClick={() => setSelectedRole('staff')}>
                Для персонала
              </Tab>
              <Tab active={selectedRole === 'patient'} onClick={() => setSelectedRole('patient')}>
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
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </SubmitButton>

              {selectedRole === 'patient' && (
                <>
                  <Divider>или</Divider>

                  <OAuthButton type="button" onClick={handleGoogleLoginClick} disabled={isLoading}>
                    <GoogleIcon
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    />
                    Войти с помощью Google
                  </OAuthButton>
                </>
              )}

              {selectedRole === 'patient' && (
                <RegisterBlock>
                  <p>Нет учетной записи?</p>
                  <button type="button" onClick={() => navigate(paths.registration)}>
                    Зарегистрироваться как пациент
                    <ArrowRight size={16} />
                  </button>
                </RegisterBlock>
              )}
            </Form>
          </Card>
        )}
      </PageWrapper>
    </>
  )
}

export default AuthPage
