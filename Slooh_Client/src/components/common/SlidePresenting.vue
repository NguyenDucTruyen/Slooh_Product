<script setup lang="ts">
import { CachTrinhBay, LoaiCauTraLoi, LoaiSlide, type Slide } from '@/types'

defineProps<{
  visible?: boolean
  specailType?: 'preview'
  editable?: boolean
}>()

const emit = defineEmits<{
  (event: 'start'): void
  (event: 'end'): void
}>()
const LOAITRALOI = {
  [LoaiCauTraLoi.SINGLE_SELECT]: 'Trắc nghiệm một lựa chọn',
  [LoaiCauTraLoi.MULTI_SELECT]: 'Trắc nghiệm nhiều lựa chọn',
  [LoaiCauTraLoi.TRUE_FALSE]: 'Đúng/Sai',
} as const

const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})

const showOption = ref(false)
const countDownShowOption = ref(5)
const countDownEndQuestion = ref(10) // Add countdown for question end

let intervalShowOptionId: any = null
let intervalEndQuestionId: any = null

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

function clearIntervalShowOption() {
  if (intervalShowOptionId) {
    clearInterval(intervalShowOptionId)
    intervalShowOptionId = null
  }
}

function clearIntervalEndQuestion() {
  if (intervalEndQuestionId) {
    clearInterval(intervalEndQuestionId)
    intervalEndQuestionId = null
  }
}

watch(slide, (newValue) => {
  clearIntervalShowOption()
  clearIntervalEndQuestion()

  showOption.value = false
  countDownShowOption.value = 5
  countDownEndQuestion.value = newValue.thoiGianGioiHan || 10

  if (newValue.loaiTrang === LoaiSlide.CAU_HOI) {
    intervalShowOptionId = setInterval(() => {
      if (countDownShowOption.value > 1) {
        countDownShowOption.value--
      }
      else {
        clearIntervalShowOption()
        showOption.value = true
        countDownShowOption.value = 5
        emit('start')

        // Start end question countdown after options are shown
        intervalEndQuestionId = setInterval(() => {
          if (countDownEndQuestion.value >= 1) {
            countDownEndQuestion.value--
          }
          else {
            clearIntervalEndQuestion()
            emit('end')
          }
        }, 1000)
      }
    }, 1000)
  }
}, { immediate: true })

onUnmounted(() => {
  clearIntervalShowOption()
  clearIntervalEndQuestion()
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
      <template
        v-else-if="slide.loaiTrang === LoaiSlide.CAU_HOI"
      >
        <RichTextEditor
          v-model="slide.tieuDe"
          v-model:align="slide.canLeTieuDe"
          placeholder="Click để nhập tiêu đề..."
          class="shrink-0 max-h-[110px]"
          :editable="editable"
        />

        <!-- Image Area with preview -->
        <div
          class="w-full h-full relative rounded-lg overflow-hidden "
        >
          <img
            v-if="slide.hinhAnh"
            :src="slide.hinhAnh"
            alt="Slide image"
            class="absolute inset-0 w-full h-full object-contain rounded-lg"
          >
        </div>
        <!-- Dynamic Area - Fixed height -->
        <template
          v-if="slide.luaChon"
        >
          <div v-if="!showOption" class="z-10 flex flex-col h-full justify-center items-center p-6">
            <h2
              class="text-3xl text-center font-semibold text-background mb-4"
            >
              Trả lời câu hỏi: {{ LOAITRALOI[slide.loaiCauTraLoi!] }}
            </h2>

            <div
              class="mb-12 z-10 rounded-full w-24 leading-[96px] flex justify-center items-center bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 text-5xl font-semibold"
              @click="showOption = true"
            >
              {{ countDownShowOption }}
            </div>
          </div>
          <div
            v-else
            class="relative w-full"
          >
            <div
              class="absolute bottom-full border-2 mb-4 right-0 z-10 rounded-full px-6 py-4 bg-primary text-2xl text-background font-semibold min-w-36 text-center"
            >
              {{ countDownEndQuestion > 0 ? `Còn ${countDownEndQuestion}s` : 'Hết giờ' }}
            </div>
            <div
              class="grid grid-cols-2 gap-x-5 gap-y-2.5 lg:gap-x-10 lg:gap-y-4 shrink-0 w-full rounded-lg"
            >
              <template v-for="(option, index) in slide.luaChon" :key="index">
                <AnswerOption
                  v-model:option="slide.luaChon[index]"
                  :index="index"
                  :show-result="countDownEndQuestion <= 0"
                />
              </template>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-area {
  position: relative;
  height: 100%;
  transition: width 300ms;
  padding: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: rgba(31, 41, 55, 0.6);
    border-radius: 0.375rem;
  }

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
