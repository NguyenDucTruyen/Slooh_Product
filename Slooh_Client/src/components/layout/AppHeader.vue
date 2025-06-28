<script setup lang="ts">
import UserDropdown from '@/components/common/UserDropdown.vue'
import Button from '@/components/ui/button/Button.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { useUserStore } from '@/stores/user'
import { Quyen } from '@/types'

const sidebarStore = useSidebarStore()
const router = useRouter()
function toggleSidebar() {
  sidebarStore.toggle()
}
const userStore = useUserStore()

const listHeaders = ref([

  {
    id: 1,
    icon: 'IconHome',
    iconActive: 'IconHomeActive',
    title: 'Trang chủ',
    url: '/',
    name: ['index'],
  },
  {
    id: 2,
    icon: 'IconPublic',
    iconActive: 'IconPublicActive',
    title: 'Phòng công khai',
    url: '/publicRoom',
    name: ['PublicRoom'],
  },
  {
    id: 4,
    icon: 'IconGroup',
    iconActive: 'IconGroupActive',
    title: 'Kênh của tôi',
    url: '/channels',
    content: 'Đăng nhập để xem kênh của bạn',
    authorized: true,
    name: ['channels', 'channels-id'],
  },
  {
    id: 5,
    icon: 'IconJoin',
    iconActive: 'IconJoinActive',
    title: 'Kênh đã tham gia',
    url: '/joinedchannels',
    content: 'Đăng nhập để xem kênh đã tham gia',
    authorized: true,
    name: ['JoinedChannels', 'JoinedChannels-id'],
  },
])
function handleRedirect() {
  if (userStore.user!.quyen === Quyen.ADMIN) {
    router.push('/admin')
  }
  else {
    router.push('/')
  }
}
</script>

<template>
  <div class="app-header flex items-center justify-between w-full h-full gap-1 p-2 lg:pr-8 bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-sm border-b border-border/40 shadow-sm">
    <!-- Logo Section -->
    <div class="flex items-center gap-4">
      <div
        class="logo-container gap-2 pl-6 cursor-pointer hidden lg:flex items-center"
        @click="handleRedirect"
      >
        <img
          src="@/assets/images/Logo_Slooh_Horizontal.png"
          alt="Slooh Logo"
          class="h-12 hover:opacity-90 transition-opacity"
        >
      </div>
      <div
        class="logo-container gap-2 pl-1 cursor-pointer hidden max-lg:flex items-center"
        @click="handleRedirect"
      >
        <img
          src="@/assets/images/Logo_Slooh.png"
          alt="Slooh Logo"
          class="h-12 hover:opacity-90 transition-opacity"
        >
      </div>

      <!-- Mobile Menu Button -->
      <div class="lg:hidden flex items-center mr-4">
        <button
          class="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          :class="sidebarStore.isOpen ? 'bg-muted border border-border shadow-inner' : ''"
          @click="toggleSidebar()"
        >
          <Icon
            name="IconMenu"
            class="w-6 h-6 transition-colors duration-300"
            :class="sidebarStore.isOpen ? 'text-primary' : 'text-foreground'"
          >
            <title>Menu</title>
          </Icon>
        </button>
      </div>
    </div>

    <!-- Navigation Links -->
    <div
      v-if="userStore.user?.quyen !== Quyen.ADMIN"
      class="hidden lg:flex items-center gap-2"
    >
      <template v-for="item in listHeaders" :key="item.id">
        <AppSideBarItem
          v-bind="item"
          class="p-4 transition-colors duration-300 hover:text-slate-100"
          type-active="include"
        />
      </template>
    </div>
    <!-- Auth Buttons -->
    <div class="flex items-center">
      <UserDropdown v-if="userStore?.user" />
      <template v-else>
        <div class="flex items-center gap-3">
          <router-link to="/auth/signup">
            <Button
              class="rounded-full px-6 h-10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              variant="outline"
            >
              Đăng ký
            </Button>
          </router-link>
          <router-link to="/auth/login">
            <Button
              class="rounded-full px-6 h-10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Đăng nhập
            </Button>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  position: relative;
}

.logo-container::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, hsl(var(--primary)), transparent);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.logo-container:hover::after {
  width: 80%;
}
</style>
