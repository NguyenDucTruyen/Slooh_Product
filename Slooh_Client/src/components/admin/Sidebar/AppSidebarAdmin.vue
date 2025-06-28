<script setup>
import AppSideBarGroup from '@/components/layout/SideBar/AppSideBarGroup.vue'
import AppSideBarItem from '@/components/layout/SideBar/AppSideBarItem.vue'
import { BarChart3 } from 'lucide-vue-next'

const data = ref({
  groupA: [
    {
      id: 2,
      icon: 'IconListUser',
      title: 'Người dùng',
      url: '/admin/user',
      name: ['admin-user']
    },
    {
      id: 3,
      icon: 'IconChannel',
      title: 'Kênh',
      url: '/admin/channel',
      name: ['admin-channel', 'admin-channel-id']
    },
    {
      id: 4,
      icon: 'IconPublic',
      title: 'Phòng công khai',
      url: '/admin/public-room',
      name: ['admin-public-room']
    },
    {
      id: 1,
      icon: BarChart3,
      title: 'Thống kê',
      url: '/admin',
      name: ['admin-statistic']
    },
    {
      id: 5,
      icon: 'IconReport',
      title: 'Báo cáo',
      url: '/admin/reports',
      name: ['admin-reports', 'admin-reports-id'],
    },
  ].sort((a, b) => a.id - b.id),

})
</script>

<template>
  <div class="flex flex-col duration-200 w-[15rem] bg-transparent ease-linear border-r border-gray-200">
    <div class="flex items-center gap-4 h-16 border-b">
      <div
        class="logo-container gap-2 pl-6 cursor-pointer hidden lg:flex items-center"
        @click="$router.push('/')"
      >
        <img
          src="@/assets/images/Logo_Slooh_Horizontal.png"
          alt="Slooh Logo"
          class="h-12 hover:opacity-90 transition-opacity"
        >
      </div>
      <div
        class="logo-container gap-2 pl-1 cursor-pointer hidden max-lg:flex items-center"
        @click="$router.push('/')"
      >
        <img
          src="@/assets/images/Logo_Slooh.png"
          alt="Slooh Logo"
          class="h-12 hover:opacity-90 transition-opacity"
        >
      </div>
    </div>
    <div class="w-full" style="height: calc(100% - 6rem)">
      <div
        class="flex flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden"
      >
        <AppSideBarGroup class="mb-8">
          <template v-for="item in data.groupA" :key="item.id">
            <AppSideBarItem v-bind="item" />
          </template>
        </AppSideBarGroup>
      </div>
    </div>
  </div>
</template>
