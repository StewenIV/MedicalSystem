import { Helmet } from 'react-helmet'
import { useState } from 'react'
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  ArrowLeft,
  UserPlus
} from 'lucide-react'

import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as GoogleIcon } from 'pages/img/google.svg'
import {
  RegistrationPageContainer,
  Card,
  Header,
  Grid,
  Field,
  RegistrationInput,
  Form,
  Divider,
  OAuthButton,
  Terms,
  BackButton,
  SubmitButton
} from './styled'

import { PatternFormat } from 'react-number-format'

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Пароли не совпадают'
    if (formData.password.length == 0 && formData.confirmPassword.length == 0)
      newErrors.confirmPassword = 'Введите пароль'
    if (!formData.lastName) newErrors.lastName = 'Введите фамилию'
    if (!formData.firstName) newErrors.firstName = 'Введите имя'
    if (!formData.email) newErrors.email = 'Введите email'
    if (!formData.password) newErrors.password = 'Введите пароль'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Введите дату рождения'
    if (!formData.phone) newErrors.phone = 'Введите телефон'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Пожалуйста, заполните все поля формы.')
      return
    }

    toast.success('Регистрация прошла успешно!')
    navigate(-1)
  }
  return (
    <>
      <Helmet>
        <title>Регистрация пациента</title>
        <meta
          name="description"
          content="Страница регистрации нового пациента"
        />
      </Helmet>

      <RegistrationPageContainer>
        <Card>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Назад
          </BackButton>

          <Header>
            <div>
              <UserPlus size={32} />
            </div>
            <h1>Регистрация пациента</h1>
            <p>Создайте учетную запись для доступа к системе</p>
          </Header>

          <Form onSubmit={handleSubmit}>
            <Grid columns={3}>
              <Field>
                <label>
                  Фамилия
                  <span> *</span>
                </label>{' '}
                <RegistrationInput
                  type="text"
                  value={formData.lastName}
                  placeholder="Иванов"
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  error={errors.lastName}
                  icon={<User />}
                />
              </Field>

              <Field>
                <label>
                  Имя
                  <span> *</span>
                </label>
                <RegistrationInput
                  type="text"
                  value={formData.firstName}
                  placeholder="Иван"
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  error={errors.firstName}
                  icon={<User />}
                />
              </Field>

              <Field>
                <label>Отчество</label>
                <RegistrationInput
                  type="text"
                  value={formData.middleName}
                  placeholder="Иванович"
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  icon={<User />}
                />
              </Field>
            </Grid>
            <Field>
              <label>
                Email
                <span> *</span>
              </label>
              <RegistrationInput
                type="email"
                value={formData.email}
                placeholder="example@example.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
                icon={<Mail />}
              />
            </Field>

            <Grid columns={2}>
              <Field>
                <label>
                  Пароль <span> *</span>
                </label>
                <RegistrationInput
                  type="password"
                  placeholder="Минимум 8 символов"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={errors.password}
                  icon={<Lock />}
                />
              </Field>

              <Field>
                <label>
                  Подтверждение пароля <span> *</span>
                </label>
                <RegistrationInput
                  type="password"
                  value={formData.confirmPassword}
                  placeholder="Повторите пароль"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })
                  }
                  error={errors.confirmPassword}
                  icon={<Lock />}
                />
              </Field>
            </Grid>

            <Grid columns={2}>
              <Field>
                <label>
                  Дата рождения <span> *</span>
                </label>
                <RegistrationInput
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  error={errors.dateOfBirth}
                  icon={<Calendar />}
                />
              </Field>

              <Field>
                <label>
                  Телефон <span> *</span>
                </label>
                <PatternFormat
                  allowEmptyFormatting
                  value={formData.phone}
                  onValueChange={(values) =>
                    setFormData({ ...formData, phone: values.value })
                  }
                  customInput={RegistrationInput}
                  error={errors.phone}
                  icon={<Phone />}
                  type="tel"
                  format="+373 (##) ###-###"
                  mask="_"
                />
              </Field>
            </Grid>

            <SubmitButton type="submit">Зарегистрироваться</SubmitButton>
          </Form>

          <Divider>или</Divider>

          <OAuthButton>
            <GoogleIcon
              width={24}
              height={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            />
            Зарегистрироваться через Google
          </OAuthButton>

          <Terms>
            Регистрируясь, вы соглашаетесь с условиями использования и политикой
            конфиденциальности
          </Terms>
        </Card>
      </RegistrationPageContainer>
    </>
  )
}

export default RegistrationPage
