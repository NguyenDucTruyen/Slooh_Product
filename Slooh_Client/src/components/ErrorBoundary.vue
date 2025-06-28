<script setup lang="ts">
import { toast } from '@/components/ui/toast'

onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    event.promise.catch((error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong.'
      if (errorMessage) {
        toast({
          title: 'Lỗi',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        })
        return
      }

      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn.',
        variant: 'destructive',
        duration: 5000,
      })
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('unhandledrejection', () => {})
})
</script>

<template>
  <slot />
</template>
