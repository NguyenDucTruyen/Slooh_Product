import type { Slide } from '@/types'
import { defineStore } from 'pinia'

export const usePreviewSlideStore = defineStore('preview', () => {
  const previewSlide = ref<Slide[] | null>()
  const isPreviewing = ref(false)
  const currentSlideIndex = ref(0)
  function setPreviewSlide(slides: Slide[],currentIndex: number = 0) {
    previewSlide.value = slides
    isPreviewing.value = true
    currentSlideIndex.value = currentIndex
  }
  function clearPreviewSlide() {
    previewSlide.value = null
    isPreviewing.value = false
    currentSlideIndex.value = 0
  }
  function nextSlide() {
    if (previewSlide.value && currentSlideIndex.value < previewSlide.value.length - 1) {
      currentSlideIndex.value++
    }
  }
  function previousSlide() {
    if (currentSlideIndex.value > 0) {
      currentSlideIndex.value--
    }
  }
  return {
    previewSlide,
    isPreviewing,
    currentSlideIndex,
    setPreviewSlide,
    clearPreviewSlide,
    nextSlide,
    previousSlide,
  }
})
