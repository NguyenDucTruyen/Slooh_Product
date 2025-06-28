import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

export async function middlewareAuth(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const accessToken = localStorage.getItem('Slooh_AccessToken')

  if (accessToken && !userStore.isAuthenticated) {
    try {
      await userStore.getUserData()
    }
    catch (error) {
      console.error('Error fetching user data:', error)
      authStore.clearUserData()
    }
  }
  return next()
}
