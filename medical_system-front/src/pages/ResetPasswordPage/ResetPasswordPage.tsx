import { Helmet } from 'react-helmet'
import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import {
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Heart,
  LogIn,
  LockIcon,
  ArrowLeft
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
  SecurityNotice,
  BackButtonCopy,
  SecurityNoteText,
  SecurityNoteWrapper,
  OtpContainer,
  OtpInput as StyledOtpInput
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
 
  const [email, setEmail] = useState('asasd@kla.re')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('sadsdasAs4')
  const [confirmPassword, setConfirmPassword] = useState('sadsdasAs4')

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({
    email: false,
    code: false,
    password: false,
    confirmPassword: false
  })

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', ''])

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

  const handleSendEmail = async () => {
    setError('')
    setTouched({ ...touched, email: true })

    if (!validateEmailStep()) {
      return
    }

    setIsLoading(true)

    try {
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
    setOtpValues(['', '', '', '', '', ''])
    if (step === 'password') {
      setStep('code')
      setPassword('')
      setConfirmPassword('')
    } else if (step === 'email') {
      navigate(paths.auth)
    } else if (step === 'code'){
      setStep('email')
    }
  }

  const handlePressEnter = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      if (step === 'email') {
        handleSendEmail()
      } else if (step === 'code') {
        handleVerifyCode()
      } else if (step === 'password') {
        handleResetPassword()
      }
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return 

    const newOtpValues = [...otpValues]
    newOtpValues[index] = value.slice(-1) 
    
    setOtpValues(newOtpValues)
    setCode(newOtpValues.join(''))
    setError('')

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {

   if (e.key === 'Backspace') {
     e.preventDefault()

     if (otpValues[index]) {
       const newOtpValues = [...otpValues]
       newOtpValues[index] = ''
       setOtpValues(newOtpValues)
       setCode(newOtpValues.join(''))
     } else if (index > 0) {
       // если пусто — переходим назад и очищаем
       const newOtpValues = [...otpValues]
       newOtpValues[index - 1] = ''
       setOtpValues(newOtpValues)
       setCode(newOtpValues.join(''))

       otpRefs.current[index - 1]?.focus()
     }
   }

   if (e.key === 'ArrowLeft' && index > 0) {
     e.preventDefault()
     otpRefs.current[index - 1]?.focus()
   }

   if (e.key === 'ArrowRight' && index < 5) {
     e.preventDefault()
     otpRefs.current[index + 1]?.focus()
   }
  }

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (pastedData) {
      const newOtpValues = pastedData
        .split('')
        .concat(Array(6).fill(''))
        .slice(0, 6)
      setOtpValues(newOtpValues)
      setCode(newOtpValues.join(''))

      const lastFilledIndex = Math.min(pastedData.length - 1, 5)
      otpRefs.current[lastFilledIndex]?.focus()
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
          {step !== 'success' && step !== 'email' && (
            <>
              <BackButton onClick={handleBack} disabled={isLoading}>
                Назад{' '}
              </BackButton>
            </>
          )}

          {/*Ввод Email*/}
          {step === 'email' && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendEmail()
              }}
            >
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
                type="submit"
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
              <BackButtonCopy onClick={handleBack} disabled={isLoading}>
                <ArrowLeft size={18} />
                Вернуться ко входу
              </BackButtonCopy>
            </form>
          )}

          {/* Ввод кода подтверждения */}
          {step === 'code' && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleVerifyCode()
              }}
            >
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
                <OtpContainer>
                  {otpValues.map((value, index) => (
                    <StyledOtpInput
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      disabled={isLoading}
                      autoFocus={index === 0}
                      placeholder="0"
                    />
                  ))}
                </OtpContainer>
              </InputGroup>

              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                type="submit"
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
                      setOtpValues(['', '', '', '', '', ''])
                      setError('')
                    }}
                    disabled={isLoading}
                  >
                    Отправить повторно
                  </button>
                </p>
              </SecurityNotice>
            </form>
          )}

          {/* Новый пароль */}
          {step === 'password' && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleResetPassword()
              }}
            >
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
            </form>
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
            </SuccessMessage>
          )}
        </Card>

        <SecurityNoteWrapper>
          <SecurityNoteText>
            <span>🔒</span> Мы никогда не попросим вас сообщить ваш пароль по
            email или телефону. Если вы получили подозрительное письмо, не
            переходите по ссылкам и сообщите в службу поддержки.
          </SecurityNoteText>
        </SecurityNoteWrapper>
      </Container>
    </>
  )
}

export default ResetPasswordPage
