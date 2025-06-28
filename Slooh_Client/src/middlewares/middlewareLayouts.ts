import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { Quyen } from '@/types'

export async function middlewareLayout(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const isAuthenticated = userStore.isAuthenticated
  const layout = to.meta.layout as string

  if (isAuthenticated && layout === 'auth') {
    console.warn('Redirecting authenticated user from auth/admin layout:', to.fullPath, isAuthenticated)
    if (authStore.returnUrl) {
      const returnUrl = authStore.returnUrl
      authStore.clearReturnUrl()
      return next(returnUrl)
    }
    return next('/')
  }

  if (isAuthenticated && layout === 'admin' && userStore.user?.quyen !== Quyen.ADMIN) {
    return next('/')
  }
  if (isAuthenticated && !layout && userStore.user?.quyen === Quyen.ADMIN) {
    return next('/admin')
  }

  if (!isAuthenticated && !['error', 'auth'].includes(layout)) {
    authStore.clearUserData()
  }
  if (!isAuthenticated && ['admin'].includes(layout)) {
    next('/admin/login')
  }

  if (!isAuthenticated && to.meta.authorized) {
    next('/')
  }
  return next()
}
