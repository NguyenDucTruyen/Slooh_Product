<script setup lang="ts">
import BaseImg from '@/components/common/BaseImg.vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

function redirectProfile() {
  router.push({ name: 'Profile' })
}

function redirectChangePassword() {
  router.push({ name: 'Profile', hash: '#password' })
}
async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <DropdownMenu v-if="userStore?.user">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative lg:px-6 py-6 lg:w-60">
        <BaseImg
          :src="userStore.user.anhDaiDien"
          :alt="userStore.user.hoTen"
          class="h-8 w-8 rounded-full"
          aspect-ratio="square"
        />
        <div class="sm:grid hidden flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ userStore.user.hoTen || userStore.user.email }}</span>
        </div>
        <Icon name="IconArrowDown" class="ml-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-52 rounded-lg"
      side="bottom"
      align="end"
      :side-offset="4"
    >
      <DropdownMenuItem>
        <div class="flex justify-between item-centers w-full">
          <span>Giao diện tối</span><Switch :model-value="themeStore.theme === 'dark'" @update:model-value="themeStore.toggleTheme()" />
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="redirectProfile">
        Thông tin cá nhân
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="redirectChangePassword">
        Đổi mật khẩu
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout">
        Đăng xuất
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
