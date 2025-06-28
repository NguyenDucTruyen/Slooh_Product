<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  backTo?: string
}>()

defineEmits<{
  (event: 'back'): void
}>()
</script>

<template>
  <div class="flex flex-col min-h-0 max-w-full h-full">
    <div
      class="flex items-center justify-between bg-card shadow-sm px-6 py-1 gap-4"
      :class="{ 'pl-0': backTo }"
    >
      <div class="flex gap-2">
        <slot name="back-button">
          <RouterLink
            v-if="backTo"
            :to="backTo"
            class="text-sm hover:bg-gray-300 transition-colors duration-200 ease-in-out"
            title="Quay lại"
          >
            <div class="h-full flex items-center p-2 border-r border-slate-300">
              <Icon name="IconBack" class="h-4 w-4" />
            </div>
          </RouterLink>
        </slot>
        <div class="flex flex-col items-center justify-center py-2">
          <h1 class="text-xl text-center font-bold mb-1">
            {{ title }}
          </h1>
          <p class="text-sm text-muted-foreground mt-1 ">
            {{ description }}
          </p>
        </div>
      </div>
      <slot name="header-actions" />
    </div>

    <div class="p-4 bg-card mt-1 shadow-lg flex-1">
      <slot />
    </div>
  </div>
</template>
