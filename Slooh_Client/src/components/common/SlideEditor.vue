<script setup lang="ts">
import { CachTrinhBay, LoaiSlide, type Slide } from '@/types'

defineProps<{
  visible?: boolean
  specailType?: 'preview'
  editable?: boolean
}>()

const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
const LayoutSlide = computed(() => {
  switch (slide.value.cachTrinhBay) {
    case CachTrinhBay.CO_BAN:
      return defineAsyncComponent(() => import('@/components/app/room/slide-layout/COBAN.vue'))
    case CachTrinhBay.HAI_COT:
      return defineAsyncComponent(() => import('@/components/app/room/slide-layout/HAICOT.vue'))
    case CachTrinhBay.TRICH_DAN:
      return defineAsyncComponent(() => import('@/components/app/room/slide-layout/TRICHDAN.vue'))
    case CachTrinhBay.HINH_ANH:
      return defineAsyncComponent(() => import('@/components/app/room/slide-layout/HINHANH.vue'))
    case CachTrinhBay.CO_BAN_TEXT:
      return defineAsyncComponent(() => import('@/components/app/room/slide-layout/VANBAN.vue'))
    default:
      return defineAsyncComponent(() => import('@/components/app/room/slide-layout/COBAN.vue'))
  }
})
</script>

<template>
  <div
    class="content-area"
    :class="[visible ? 'w-[calc(100%-260px)]' : 'w-full']"
    :style="slide?.hinhNen
      ? {
        backgroundImage: `url(${slide.hinhNen.replace('/w_300', '')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
      : {
        backgroundColor: '#f3f4f6',
      }"
  >
    <div class="flex flex-col items-center h-full pt-6 gap-4">
      <!-- Title Editor - Fixed height -->
      <component
        :is="LayoutSlide"
        v-if="slide.loaiTrang === LoaiSlide.NOI_DUNG"
        v-model:slide="slide"
        :editable="editable"
      />
      <QuestionLayout
        v-else-if="slide.loaiTrang === LoaiSlide.CAU_HOI"
        v-model:slide="slide"
        :editable="editable"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-area {
  @apply relative h-full transition-[width] duration-300 p-6;
  @apply before:absolute before:inset-0 before:bg-gray-800/60 before:rounded-md;
  background-size: cover;
  overflow-y: auto;
}
.slide-editor {
  position: relative;
  height: 100%;
  transition: width 300ms;
  padding: 1.5rem;
  width: 0;
  overflow: hidden;

  &.visible {
    width: 400px;
  }

  .content {
    background: rgb(31 41 55 / 0.6);
    border-radius: 0.375rem;
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .bg-image-container {
    position: relative;
    aspect-ratio: 16/9;
    background: rgb(17 24 39);
    border-radius: 0.375rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-btn {
    position: absolute;
    padding: 0.5rem 1rem;
    background: rgb(59 130 246);
    color: white;
    border-radius: 0.375rem;
    transition: background-color 200ms;

    &:hover {
      background: rgb(37 99 235);
    }
  }

  .title-editor {
    border-radius: 0.375rem;
    background: rgb(31 41 55);
    padding: 0.75rem;
    min-height: 100px;

    &.has-image {
      background: transparent;
    }
  }

  .dynamic-area {
    flex: 1;
    background: rgb(31 41 55);
    border-radius: 0.375rem;
    padding: 0.75rem;
  }
}
</style>
