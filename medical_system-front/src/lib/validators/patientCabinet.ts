import { z } from 'zod'

const PHONE_REGEX = /^\+?[0-9\s\-()]+$/

export const generalSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно').max(100, 'Не более 100 символов'),
  lastName: z.string().min(1, 'Фамилия обязательна').max(100, 'Не более 100 символов'),
  middleName: z.string().max(100, 'Не более 100 символов').optional().or(z.literal('')),
  dateOfBirth: z.string().min(1, 'Дата рождения обязательна'),
  gender: z.string().min(1, 'Укажите пол'),
  maritalStatus: z.string().max(50, 'Не более 50 символов').optional().or(z.literal('')),
})

export const contactsSchema = z.object({
  phoneMobile: z.string().regex(PHONE_REGEX, 'Введите номер в международном формате').optional().or(z.literal('')),
  phoneHome: z.string().regex(PHONE_REGEX, 'Введите номер в международном формате').optional().or(z.literal('')),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  address: z.string().max(500, 'Не более 500 символов').optional().or(z.literal('')),
  city: z.string().max(100, 'Не более 100 символов').optional().or(z.literal('')),
  region: z.string().max(100, 'Не более 100 символов').optional().or(z.literal('')),
  zip: z.string().max(20, 'Не более 20 символов').optional().or(z.literal('')),
  country: z.string().max(100, 'Не более 100 символов').optional().or(z.literal('')),
})

export const otherSchema = z.object({
  language: z.string().max(50, 'Не более 50 символов').optional().or(z.literal('')),
  nationality: z.string().max(50, 'Не более 50 символов').optional().or(z.literal('')),
})

export const workSchema = z.object({
  profession: z.string().max(100, 'Не более 100 символов').optional().or(z.literal('')),
  organization: z.string().max(200, 'Не более 200 символов').optional().or(z.literal('')),
  address: z.string().max(500, 'Не более 500 символов').optional().or(z.literal('')),
})

export const relativeSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(200, 'Не более 200 символов'),
  relation: z.string().max(100, 'Не более 100 символов').optional().or(z.literal('')),
  phone: z.string().regex(PHONE_REGEX, 'Введите номер в международном формате').optional().or(z.literal('')),
})

// Keep for backward compatibility if needed in some places
export const trustedPersonSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов').max(200, 'Имя не должно превышать 200 символов'),
  phone: z.string().regex(PHONE_REGEX, 'Введите номер в международном формате').optional().or(z.literal('')),
  relation: z.string().max(100, 'Степень родства не должна превышать 100 символов').optional().or(z.literal('')),
})

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: z
      .string()
      .min(8, 'Пароль должен содержать не менее 8 символов')
      .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
    confirmPassword: z.string().min(1, 'Подтвердите новый пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type GeneralFormData = z.infer<typeof generalSchema>
export type ContactsFormData = z.infer<typeof contactsSchema>
export type OtherFormData = z.infer<typeof otherSchema>
export type WorkFormData = z.infer<typeof workSchema>
export type RelativeFormData = z.infer<typeof relativeSchema>
export type TrustedPersonFormData = z.infer<typeof trustedPersonSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
