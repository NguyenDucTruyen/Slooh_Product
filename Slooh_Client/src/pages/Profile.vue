<script setup lang="ts">
import { uploadImage } from '@/api/upload'
import BaseImg from '@/components/common/BaseImg.vue'
import { toast } from '@/components/ui/toast'
import { useUserStore } from '@/stores/user'
import { emailSchema, nameSchema } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const userStore = useUserStore()
const isEditing = ref(false)
const avatarPreview = ref(userStore.user?.anhDaiDien || '')
const isAvatarRemoved = ref(false)
const fileImage = ref<File | null>(null)
const isLoading = ref(false)
const profileSchema = toTypedSchema(
  z
    .object({
      username: nameSchema,
      email: emailSchema,
    }),
)

const form = useForm({
  validationSchema: profileSchema,
  initialValues: {
    username: userStore.user?.hoTen || '',
    email: userStore.user?.email || '',
  },
})

const handleSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true
    let avatarLink = isAvatarRemoved.value ? '' : userStore.user?.anhDaiDien || ''
    if (fileImage.value) {
      const res = await uploadImage(fileImage.value)
      avatarLink = res.url
    }
    const updatedValues = {
      ...values,
      avatar: avatarLink || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/300px-User-avatar.svg.png',
    }
    await userStore.updateUser(userStore.user!.maNguoiDung, updatedValues)
    toast({
      title: 'Cập nhật thành công',
      description: 'Thông tin cá nhân đã được cập nhật.',
    })
    isEditing.value = false
    form.resetForm()
    form.setValues({
      username: updatedValues.username || '',
      email: updatedValues.email || '',
    })
  }
  finally {
    isLoading.value = false
  }
})
function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    fileImage.value = target.files[0]
  }
  avatarPreview.value = URL.createObjectURL(fileImage.value as File)
  isAvatarRemoved.value = false
}
function removeAvatar() {
  avatarPreview.value = ''
  isAvatarRemoved.value = true
  fileImage.value = null
}
function startEdit() {
  isEditing.value = true
}
function cancelEdit() {
  isEditing.value = false
  form.resetForm()
  avatarPreview.value = userStore.user?.anhDaiDien || ''
  isAvatarRemoved.value = false
  fileImage.value = null
}
</script>

<template>
  <div class="flex flex-col items-center h-full">
    <div class="w-full flex justify-center">
      <div class="flex flex-col items-center w-11/12 md:w-3/4 lg:w-1/2 p-6 bg-white rounded-lg shadow-md mt-6">
        <h1 class="self-start text-2xl font-bold mt-4 mb-6">
          Thông tin cá nhân
        </h1>

        <form class="w-full grid grid-cols-4 gap-4" @submit="handleSubmit">
          <div class="flex flex-col">
            <div class="relative w-full mb-4">
              <BaseImg
                :src="avatarPreview"
                alt="Avatar"
                class="w-full rounded-lg"
                aspect-ratio="square"
              />
              <div
                v-if="isEditing"
                class="absolute rounded-lg inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer "
              >
                <label class="text-white text-sm font-medium cursor-pointer">
                  Tải lên
                  <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="handleAvatarChange"
                  >
                </label>
              </div>
            </div>

            <button
              v-if="isEditing && avatarPreview"
              type="button"
              class="text-red-500 text-sm mb-4"
              @click="removeAvatar"
            >
              Xóa ảnh đại diện
            </button>
          </div>
          <div class="flex flex-col col-span-3">
            <InputValidator
              v-model="form.values.username"
              type="text"
              label="Họ tên"
              name="username"
              :disabled="!isEditing"
              custom-class="mb-5 mt-1"
            />
            <InputValidator
              v-model="form.values.email"
              type="text"
              label="Email"
              name="email"
              disabled
              custom-class="mb-5 mt-4"
            />
            <div class="flex justify-end mt-6">
              <template
                v-if="isEditing"
              >
                <Button
                  class="mr-2"
                  variant="outline"
                  @click="cancelEdit"
                >
                  Hủy
                </Button>
                <Button type="submit">
                  <template v-if="isLoading">
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    Vui lòng chờ...
                  </template>
                  <template v-else>
                    Lưu
                  </template>
                </Button>
              </template>
              <div v-else>
                <Button @click="startEdit">
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
