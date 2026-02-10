import { Helmet } from 'react-helmet'
import { useState } from 'react'
import {
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Heart,
  LogIn,
  ShieldAlert 
} from 'lucide-react'

import {
  Container,
  Card,
  MainTitle,
  TitleForm,
  SubTitle,
  InputGroup,
  Button,
  SuccessMessage,
  LogoBlock,
  LogoIcon,
  SubTitleForm,
  ErrorBox,
  FieldError,
  FieldSuccess,
  PasswordRequirements,
  RequirementItem,
  InfoBox,
  SecurityNotice
} from './styled'

import Input from 'components/Input'
import { BackButton } from 'components/Button'

import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { paths } from 'routes/helpers'

interface ResetPasswordPageProps {
  onLogin?: () => void
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>(
    'email'
  )

  const navigate = useNavigate()
  // Form data
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({
    email: false,
    code: false,
    password: false,
    confirmPassword: false
  })

  const emailSchema = z.object({
    email: z.string().email('Введите корректный email адрес')
  })

  const validateEmailStep = () => {
    const result = emailSchema.safeParse({ email })

    if (!result.success) {
      const error = result.error.flatten().fieldErrors
      setFieldErrors({
        email: error.email?.[0] ?? ''
      })
      return false
    }

    setFieldErrors({})
    return true
  }

  const codeSchema = z.object({
    code: z.string().length(6, 'Введите полный 6-значный код')
  })

  const validateCodeStep = () => {
    const result = codeSchema.safeParse({ code })

    if (!result.success) {
      const error = result.error.flatten().fieldErrors
      setFieldErrors({
        code: error.code?.[0] ?? ''
      })
      return false
    }

    setFieldErrors({})
    return true
  }

  const passwordSchema = z
    .object({
      password: z
        .string()
        .min(8, 'Минимум 8 символов')
        .regex(/[A-Z]/, 'Минимум 1 заглавная буква')
        .regex(/[a-z]/, 'Минимум 1 строчная буква')
        .regex(/[0-9]/, 'Минимум 1 цифра'),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Пароли не совпадают',
      path: ['confirmPassword']
    })

  // Password validation
  const validatePassword = () => {
    const result = passwordSchema.safeParse({ password, confirmPassword })

    if (!result.success) {
      const error = result.error.flatten().fieldErrors

      setFieldErrors({
        password: error.password?.[0] ?? '',
        confirmPassword: error.confirmPassword?.[0] ?? ''
      })

      return false
    }
    setFieldErrors({})
    return true
  }

  // Handle sending email with verification code
  const handleSendEmail = async () => {
    setError('')
    setTouched({ ...touched, email: true })

    if (!validateEmailStep()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.1
            ? resolve(true)
            : reject(
                new Error('Не удалось отправить письмо. Попробуйте позже.')
              )
        }, 2000)
      })

      setStep('code')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle verifying code
  const handleVerifyCode = async () => {
    setError('')
    setTouched({ ...touched, code: true })

    if (!validateCodeStep()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if code matches (for demo purposes, accept "578202")
          if (code === '578202') {
            resolve(true)
          } else {
            reject(new Error('Неверный код. Проверьте код и попробуйте снова.'))
          }
        }, 2000)
      })

      setStep('password')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resetting password
  const handleResetPassword = async () => {
    setError('')
    setTouched({ ...touched, password: true, confirmPassword: true })

    if (!validatePassword()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.1
            ? resolve(true)
            : reject(new Error('Не удалось сбросить пароль. Попробуйте позже.'))
        }, 2000)
      })

      setStep('success')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setError('')
    if (step === 'code') {
      setStep('email')
      setCode('')
    } else if (step === 'password') {
      setStep('code')
      setPassword('')
      setConfirmPassword('')
    } else if (step === 'email') {
      navigate(paths.auth)
    }
  }

  const emailError = touched.email ? fieldErrors.email : ''
  const isEmailValid = !emailError && email.length > 0
  const passwordError = touched.password ? fieldErrors.password : ''
  const confirmPasswordError = touched.confirmPassword
    ? fieldErrors.confirmPassword
    : ''

  const isPasswordValid =
    !passwordError &&
    !confirmPasswordError &&
    password.length > 0 &&
    confirmPassword.length > 0

  return (
    <>
      <Helmet>
        <title>Сброс пароля</title>
        <meta
          name="description"
          content="Страница для сброса пароля в системе ЕМИС MedFlow"
        />
      </Helmet>

      <Container>
        <LogoBlock>
          <LogoIcon>
            <Heart size={28} />
          </LogoIcon>
          <MainTitle>ЕМИС MedFlow</MainTitle>
          <SubTitle>Единая медицинская информационная система</SubTitle>
        </LogoBlock>

        <Card>
          {step !== 'success' && (
            <BackButton onClick={handleBack} disabled={isLoading} />
          )}

          {/*Ввод Email*/}
          {step === 'email' && (
            <>
              <TitleForm>Восстановление пароля</TitleForm>
              <SubTitleForm>
                Введите email адрес, указанный при регистрации. Мы отправим вам
                код для восстановления пароля.
              </SubTitleForm>

              {error && (
                <ErrorBox>
                  <AlertCircle size={20} />
                  <div>
                    <strong>Ошибка</strong>
                    <div>{error}</div>
                  </div>
                </ErrorBox>
              )}

              <InputGroup>
                <label>
                  Email адрес<span> *</span>
                </label>
                <Input
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="ivanov@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)

                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: '' })
                    }
                  }}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  disabled={isLoading}
                />
                {emailError && (
                  <FieldError>
                    <AlertCircle size={14} />
                    {emailError}
                  </FieldError>
                )}
                {!emailError && touched.email && isEmailValid && (
                  <FieldSuccess>
                    <CheckCircle2 size={14} />
                    Email корректен
                  </FieldSuccess>
                )}
              </InputGroup>

              <Button
                onClick={handleSendEmail}
                disabled={isLoading || !isEmailValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Отправить код
                  </>
                )}
              </Button>
            </>
          )}

          {/* Ввод кода подтверждения */}
          {step === 'code' && (
            <>
              <TitleForm>Введите код подтверждения</TitleForm>
              <SubTitleForm>
                Мы отправили 6-значный код на вашу почту{' '}
                <strong>{email}</strong>. Проверьте папку «Входящие» или «Спам».
              </SubTitleForm>

              <InfoBox>
                <Mail size={16} />
                <div>
                  <strong>Пример письма:</strong>
                  <p>
                    Ваш разовый код: <strong>578202</strong>
                  </p>
                  <small>
                    Вводите этот код только на официальном сайте. Не делитесь им
                    ни с кем.
                  </small>
                </div>
              </InfoBox>

              {error && (
                <ErrorBox>
                  <AlertCircle size={20} />
                  <div>
                    <strong>Ошибка</strong>
                    <div>{error}</div>
                  </div>
                </ErrorBox>
              )}

              <InputGroup>
                <label>
                  Код подтверждения<span> *</span>
                </label>
                <Input
                  icon={<Lock size={18} />}
                  type="text"
                  placeholder="Введите 6-значный код"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setCode(value)
                    setError('')
                  }}
                  onBlur={() => setTouched({ ...touched, code: true })}
                  disabled={isLoading}
                  maxLength={6}
                />
              </InputGroup>

              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Проверка...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Подтвердить код
                  </>
                )}
              </Button>

              <SecurityNotice>
                <p>
                  💡 Не получили код?{' '}
                  <button
                    onClick={() => {
                      setStep('email')
                      setCode('')
                      setError('')
                    }}
                    disabled={isLoading}
                  >
                    Отправить повторно
                  </button>
                </p>
              </SecurityNotice>
            </>
          )}

          {/* Новый пароль */}
          {step === 'password' && (
            <>
              <TitleForm>Создайте новый пароль</TitleForm>
              <SubTitleForm>
                Пароль должен быть надёжным и отличаться от предыдущего.
              </SubTitleForm>

              {error && (
                <ErrorBox>
                  <AlertCircle size={20} />
                  <div>
                    <strong>Ошибка</strong>
                    <div>{error}</div>
                  </div>
                </ErrorBox>
              )}

              <InputGroup>
                <label>
                  Новый пароль<span> *</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Input
                    icon={<Lock size={18} />}
                    placeholder="Введите новый пароль"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    disabled={isLoading}
                    type="password"
                  />
                </div>

                <PasswordRequirements>
                  <RequirementItem $valid={password.length >= 8}>
                    {password.length >= 8 ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <div className="circle" />
                    )}
                    Минимум 8 символов
                  </RequirementItem>
                  <RequirementItem $valid={/[A-Z]/.test(password)}>
                    {/[A-Z]/.test(password) ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <div className="circle" />
                    )}
                    Заглавная буква (A-Z)
                  </RequirementItem>
                  <RequirementItem $valid={/[a-z]/.test(password)}>
                    {/[a-z]/.test(password) ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <div className="circle" />
                    )}
                    Строчная буква (a-z)
                  </RequirementItem>
                  <RequirementItem $valid={/[0-9]/.test(password)}>
                    {/[0-9]/.test(password) ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <div className="circle" />
                    )}
                    Цифра (0-9)
                  </RequirementItem>
                </PasswordRequirements>
              </InputGroup>

              <InputGroup>
                <label>
                  Подтвердите пароль<span> *</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Input
                    icon={<Lock size={18} />}
                    placeholder="Повторите новый пароль"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    onBlur={() =>
                      setTouched({ ...touched, confirmPassword: true })
                    }
                    disabled={isLoading}
                  />
                </div>
                {confirmPasswordError && (
                  <FieldError>
                    <AlertCircle size={14} />
                    {confirmPasswordError}
                  </FieldError>
                )}
                {!confirmPasswordError &&
                  confirmPassword &&
                  password === confirmPassword && (
                    <FieldSuccess>
                      <CheckCircle2 size={14} />
                      Пароли совпадают
                    </FieldSuccess>
                  )}
              </InputGroup>

              <Button
                onClick={handleResetPassword}
                disabled={isLoading || !isPasswordValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Сохранить новый пароль
                  </>
                )}
              </Button>

              <SecurityNotice>
                <p>
                  💡 <strong>Совет:</strong> Используйте уникальный пароль,
                  который вы не используете на других сайтах.
                </p>
              </SecurityNotice>
            </>
          )}

          {/*Успешно*/}
          {step === 'success' && (
            <SuccessMessage>
              <div className="icon-wrapper">
                <CheckCircle2 size={48} />
              </div>
              <TitleForm>Пароль успешно изменён!</TitleForm>
              <SubTitleForm>
                Ваш новый пароль был успешно сохранён. Теперь вы можете
                использовать его для входа в систему.
              </SubTitleForm>

              <Button
                onClick={() => {
                  if (onLogin) onLogin()
                  else window.location.href = '/'
                }}
              >
                <LogIn size={18} />
                Войти в систему
              </Button>

              <InfoBox style={{ marginTop: '24px' }}>
                <AlertCircle size={16} />
                <div>
                  <strong>Важные напоминания:</strong>
                  <ul>
                    <li>Не сообщайте свой пароль никому</li>
                    <li>Регулярно меняйте пароль</li>
                    <li>Используйте двухфакторную аутентификацию</li>
                  </ul>
                </div>
              </InfoBox>

              <SecurityNotice>
                <p>
                  Если вы не меняли пароль,{' '}
                  <button
                    onClick={() => alert('Связь со службой безопасности')}
                  >
                    сообщите в службу безопасности
                  </button>
                </p>
              </SecurityNotice>
            </SuccessMessage>
          )}
        </Card>
      </Container>
    </>
  )
}

export default ResetPasswordPage
