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
import { useAuthStore } from '@/stores/auth'
import { loginValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { useAsyncState } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()
if (route.query.error) {
  toast({
    title: 'Lỗi',
    description: route.query.error as string ?? 'Có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn.',
    variant: 'destructive',
    duration: 5000,
  })
  router.replace({ query: { ...route.query, error: undefined } })
}
const authStore = useAuthStore()
const form = useForm({
  validationSchema: toTypedSchema(loginValidator),
})

const { isLoading, execute } = useAsyncState(authStore.login, null, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  await execute(0, values)
})
</script>

<template>
  <form class="sm:min-w-[25rem]" @submit.prevent="onSubmit">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
            Đăng nhập
        </CardTitle>
        <CardDescription class="text-center">
          Quản trị viên - Nhập thông tin tài khoản để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <InputValidator id="email" type="email" label="Email" placeholder="example@gmai.com" name="email" />
            <div class="grid gap-2">
              <InputValidator id="password" type="password" placeholder="Nhập mật khẩu" label="Mật khẩu" name="password" />
              <RouterLink to="/auth/forgot-password" class="ml-auto text-sm underline">
                Quên mật khẩu?
              </RouterLink>
            </div>
          </div>
          <Button
            type="submit"
            :is-loading="isLoading"
          >
            Đăng nhập
          </Button>
        </div>
      </Cardcontent>
    </Card>
  </form>
</template>
