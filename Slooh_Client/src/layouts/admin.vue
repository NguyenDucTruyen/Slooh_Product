<script setup>
import AppSidebarAdmin from '@/components/admin/Sidebar/AppSidebarAdmin.vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'
</script>

<template>
  <div class="flex flex-col h-full justify-between">
    <div
      class="flex w-full h-full"
    >
      <AppSidebarAdmin class="max-lg:hidden" />
      <div class="flex flex-col h-full w-full lg:[width:calc(100%-15rem)]">
        <header class="flex h-16 items-center">
          <AdminHeader />
        </header>
        <div class="flex flex-1 flex-col gap-4 bg-muted h-[calc(100%-64px)] pb-4 overflow-y-auto">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
