<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { changePasswordValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const isPasswordLoading = ref(false)

// Change password form
const passwordForm = useForm({
  validationSchema: toTypedSchema(changePasswordValidator),
})

// Change password submit handler
const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
  try {
    isPasswordLoading.value = true
    await userStore.updatePassword(values)
    toast({
      title: 'Thành công',
      description: 'Đổi mật khẩu thành công',
    })
    await authStore.logout()
    router.push('/')
    passwordForm.resetForm()
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = Array.isArray(data?.message) ? data.message[0]?.message : data?.message || data?.error || 'Some thing went wrong'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
      duration: 5000,
    })
  }
  finally {
    isPasswordLoading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col items-center h-full">
    <div class="w-full flex justify-center">
      <div class="flex flex-col items-center w-11/12 md:w-3/4 lg:w-1/2 p-6 bg-white rounded-lg shadow-md mt-6">
        <h1 class="self-start text-2xl font-bold mt-4 mb-6">
          Đổi mật khẩu
        </h1>

        <Card class="w-full">
          <CardHeader>
            <CardTitle class="text-2xl text-center">
              Đổi mật khẩu
            </CardTitle>
            <CardDescription class="text-center">
              Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để thay đổi mật khẩu của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handlePasswordSubmit">
              <div class="space-y-4">
                <InputValidator
                  id="password"
                  label="Mật khẩu hiện tại"
                  placeholder="Nhập mật khẩu hiện tại"
                  type="password"
                  name="currentPassword"
                />
                <InputValidator
                  id="newPassword"
                  label="Mật khẩu mới"
                  placeholder="Nhập mật khẩu mới"
                  type="password"
                  name="newPassword"
                />
                <InputValidator
                  id="confirmNewPassword"
                  label="Xác nhận mật khẩu mới"
                  placeholder="Xác nhận mật khẩu mới"
                  type="password"
                  name="confirmNewPassword"
                />
                <div class="flex justify-end">
                  <Button type="submit" :disabled="isPasswordLoading">
                    <template v-if="isPasswordLoading">
                      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                      Vui lòng chờ
                    </template>
                    <template v-else>
                      Đổi mật khẩu
                    </template>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
