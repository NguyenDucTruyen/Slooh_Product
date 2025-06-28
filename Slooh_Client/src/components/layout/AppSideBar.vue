<script setup>
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
const data = ref({
  groupA: [
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
  ],
  groupB: [
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
    }
  ],
})
</script>

<template>
  <div
    class="w-full max-lg:fixed h-[100vh] top-[88px] sm:w-64 lg:hidden bg-card z-10 transition-all duration-300 ease-in-out rounded-lg shadow-lg overflow-hidden pt-8 pr-8"
    :class="sidebarStore.isOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'"
  >
    <button
      class="flex lg:hidden items-center justify-center w-10 h-10 rounded-lg transition duration-200 ease-in-out absolute right-1 top-1"
      :class="sidebarStore.isOpen ? 'bg-muted border border-border' : ''"
      @click="sidebarStore.close()"
    >
      <Icon
        name="IconClose" class="w-6 h-6 text-foreground"
      >
        <title>Close</title>
      </Icon>
    </button>
    <div class="w-full" style="height: calc(100% - 6rem)">
      <div
        class="flex flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden"
      >
        <AppSideBarGroup class="mb-8 mt-2">
          <template v-for="item in data.groupA" :key="item.id">
            <AppSideBarItem v-bind="item" />
          </template>
        </AppSideBarGroup>

        <AppSideBarGroup>
          <template #header>
            <span>Thư viện</span>
            <Separator class="w-full bg-border" />
          </template>
          <template v-for="item in data.groupB" :key="item.id">
            <AppSideBarItem v-bind="item" type-active="include" />
          </template>
        </AppSideBarGroup>
      </div>
    </div>
  </div>
  
</template>
