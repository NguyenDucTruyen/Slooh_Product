import { apiLogin, apiLogout, apiRegister, forgotPassword, requestResetPassword } from '@/api/auth'
import { type EmailData, type LoginData, type NguoiDung, Quyen, type RegisterData, type ResetPasswordData } from '@/types'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()
  const router = useRouter()
  const returnUrl = ref('')

  async function login(credentials: LoginData) {
    const data = await apiLogin(credentials)

    localStorage.setItem('Slooh_AccessToken', data.tokens.access.token)
    localStorage.setItem('Slooh_RefreshToken', data.tokens.refresh.token)

    const user = await userStore.getUserData() as NguoiDung
    router.push(returnUrl.value || user.quyen === Quyen.ADMIN ? '/admin' : '/')
  }

  async function logout() {
    await apiLogout(localStorage.getItem('Slooh_RefreshToken') || '')
    clearUserData()
  }

  function clearUserData() {
    localStorage.removeItem('Slooh_AccessToken')
    localStorage.removeItem('Slooh_RefreshToken')
    userStore.removeUser()
  }

  function register(credentials: RegisterData) {
    return apiRegister(credentials)
  }

  function setReturnUrl(url: string) {
    returnUrl.value = url
  }

  function clearReturnUrl() {
    returnUrl.value = ''
  }

  function sendEmailResetPassword(data: EmailData) {
    return forgotPassword(data)
  }
  function resetPassword(data: ResetPasswordData) {
    return requestResetPassword(data)
  }
  return {
    login,
    logout,
    register,
    returnUrl,
    setReturnUrl,
    clearReturnUrl,
    clearUserData,
    resetPassword,
    sendEmailResetPassword,
  }
})
