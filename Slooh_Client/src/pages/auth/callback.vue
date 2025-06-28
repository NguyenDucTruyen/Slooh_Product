<route>
  {
      meta: {
      layout: "auth",
      title: "Login",
      }
  }
</route>

<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const accessToken = route.query.accessToken as string
const refreshToken = route.query.refreshToken as string
if (!accessToken || !refreshToken) {
  router.push('/auth/login')
}
else {
  try {
    localStorage.setItem('Slooh_AccessToken', accessToken)
    localStorage.setItem('Slooh_RefreshToken', refreshToken)
    await userStore.getUserData()
    router.push('/')
  }
  catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong.'
    router.push('/')
    if (errorMessage) {
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      })
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4">
        Callback Page
      </h1>
      <p class="text-lg">
        Access Token: {{ accessToken }}
      </p>
      <p class="text-lg">
        Refresh Token: {{ refreshToken }}
      </p>
    </div>
  </div>
</template>
