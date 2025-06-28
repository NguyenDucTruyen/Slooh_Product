import type { EmailData, LoginData, RegisterData, ResetPasswordData } from '@/types'
import { $post } from './axios'

export function apiLogin(data: LoginData) {
  return $post('/auth/login', data)
}

export function apiRegister(data: RegisterData) {
  return $post('/auth/register', data)
}

export function forgotPassword(data: EmailData) {
  return $post('/auth/forgot-password', data)
}

export function requestResetPassword(data: ResetPasswordData) {
  return $post(`/auth/reset-password?token=${data.token}`, {
    password: data.password,
    confirmPassword: data.confirmPassword,
  })
}

export function sendVerificationEmail(data: EmailData) {
  return $post('/auth/send-verification-email', data)
}

export function verifyEmail(token: string) {
  return $post(`/auth/verify-email?token=${token}`, {})
}

export function apiLogout(refreshToken: string) {
  return $post('/auth/logout', { refreshToken })
}
