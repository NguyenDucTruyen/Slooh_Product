<script setup>
import UserDropdown from '@/components/common/UserDropdown.vue'
import Button from '@/components/ui/button/Button.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="app-header flex items-center justify-end w-full h-full gap-1 p-2 lg:pr-8 bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-sm border-b border-border/40 shadow-sm">
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
