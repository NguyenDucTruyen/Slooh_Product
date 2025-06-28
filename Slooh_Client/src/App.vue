<script setup lang="ts">
import { useConfirmStore } from '@/stores/confirm'
import { usePreviewSlideStore } from '@/stores/preview'
import { useThemeStore } from '@/stores/theme'

const confirmStore = useConfirmStore()
const previewSlideStore = usePreviewSlideStore()

useThemeStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="slide">
      <ErrorBoundary>
        <component :is="Component" />
      </ErrorBoundary>
    </transition>
  </router-view>
  <Toaster />
  <ConfirmationModal
    v-if="confirmStore.visible"
  />

  <Preview
    v-if="previewSlideStore.isPreviewing"
  />
</template>
