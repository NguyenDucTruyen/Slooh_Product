<script setup lang="ts">
import { cn } from '@/lib/utils'
import { usePreviewSlideStore } from '@/stores/preview'

const previewSlideStore = usePreviewSlideStore()
const showNavigation = ref(true)
const isFullscreen = ref(false)
const isMouseOverNavigation = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null
= setTimeout(() => {
  showNavigation.value = false
}, 3000)

function requestFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    isFullscreen.value = false
  }
  else {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  }
}
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      previewSlideStore.clearPreviewSlide()
      break
    case 'ArrowLeft':
      previewSlideStore.previousSlide()
      resetNavigationTimeout()
      break
    case 'ArrowRight':
      previewSlideStore.nextSlide()
      resetNavigationTimeout()
      break
    case ' ':
      toggleNavigationVisibility()
      break
    case 'f':
      requestFullscreen()
      break
  }
}
function handleMouseOverNavigation() {
  isMouseOverNavigation.value = true
  showNavigation.value = true
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}
function toggleNavigationVisibility() {
  showNavigation.value = !showNavigation.value
  resetNavigationTimeout()
}
function resetNavigationTimeout() {
  if (timeoutId)
    clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    showNavigation.value = false
  }, 3000)
}
function exitPreview() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    isFullscreen.value = false
  }
  previewSlideStore.clearPreviewSlide()
}
function handleMouseMove() {
  if (!showNavigation.value || isMouseOverNavigation.value)
    return
  resetNavigationTimeout()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="fixed inset-0 bg-slate-200 group z-20"
    @click="toggleNavigationVisibility"
    @mousemove="handleMouseMove"
  >
    <SlideEditor
      v-if="previewSlideStore.previewSlide"
      v-model:slide="previewSlideStore.previewSlide[previewSlideStore.currentSlideIndex]"
    />
    <div
      :class="cn('absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2  p-2 rounded-md bg-white/70 backdrop-blur-md items-center z-10',
                 'transition-opacity duration-300 opacity-0',
                 { 'opacity-100': showNavigation },
      )"
      @click.stop
      @mouseenter="handleMouseOverNavigation"
      @mouseleave="() => { isMouseOverNavigation = false }"
    >
      <Button
        variant="outline"
        class="rounded-sm"
        title="Thoát xem trước"
        @click="exitPreview"
      >
        Thoát
      </Button>
      <Separator orientation="vertical" class="bg-slate-400 h-8 rounded-md" />
      <div class="flex gap-1 items-center text-xl font-semibold text-slate-700">
        <Button
          variant="outline"
          class="rounded-sm"
          :disabled="previewSlideStore.currentSlideIndex === 0"
          @click="previewSlideStore.previousSlide"
        >
          <Icon name="IconChevronLeft" class="w-5 h-5" />
        </Button>
        {{ previewSlideStore.currentSlideIndex + 1 }} / {{ previewSlideStore.previewSlide!.length }}
        <Button
          variant="outline"
          class="rounded-sm"
          @click="previewSlideStore.nextSlide"
        >
          <Icon name="IconChevronRight" class="w-5 h-5" />
        </Button>
      </div>
      <Separator orientation="vertical" class="bg-slate-400 h-8 rounded-md" />
      <Button
        variant="outline"
        class="rounded-sm"
        :title="isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'"
        @click="requestFullscreen"
      >
        <Icon
          v-if="isFullscreen"
          name="IconZoomIn" class="w-6 h-6"
        />

        <Icon
          v-else
          name="IconZoomOut" class="w-6 h-6"
        />
      </Button>
    </div>
  </div>
</template>
