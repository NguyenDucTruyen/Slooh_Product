<route>
    {
        meta: {
            layout: "empty",
            title: "Chỉnh sửa",
        }
    }
</route>

<script setup lang="ts">
import SlideEditor from '@/components/common/SlideEditor.vue'
import { toast } from '@/components/ui/toast'
import { useConfirmStore } from '@/stores/confirm'
import { usePreviewSlideStore } from '@/stores/preview'
import { useRoomStore } from '@/stores/room'
import { type BodyUpdateRoom, LoaiSlide, type Phong, type Slide, type UpdateSlide } from '@/types'
import { useAsyncState } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const roomStore = useRoomStore()
const confirmStore = useConfirmStore()
const route = useRoute()
const isPanelVisible = ref(true)
const slides = ref<Slide[]>()
const selectedSlideId = ref<string>()
const hasChanges = ref(false)
const previewSlideStore = usePreviewSlideStore()

const { state: roomDetail, isLoading, error } = useAsyncState<Phong>(() => {
  return (async () => {
    const response = await roomStore.getRoomDetail(route.params.id as string)
    slides.value = response.trangs
    selectedSlideId.value = response.trangs?.[0]?.maTrang || ''
    return response
  })()
}, null as unknown as Phong, {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})

// Watch for changes in all editable fields
watch(
  [
    slides,
    () => roomDetail.value?.tenPhong,
    () => roomDetail.value?.hoatDong,
    () => roomDetail.value?.trangThai,
  ],
  () => {
    if (roomDetail.value) {
      hasChanges.value = true
    }
  },
  { deep: true },
)

const currentSelectedIndex = computed(() => {
  return slides.value?.findIndex(slide => slide.maTrang === selectedSlideId.value) ?? 0
})

const indexSelectedSlide = computed(() => {
  return slides.value?.findIndex(slide => slide.maTrang === selectedSlideId.value) ?? -1
})

async function handleSave() {
  const formatData: BodyUpdateRoom = {
    tenPhong: roomDetail.value.tenPhong,
    hoatDong: roomDetail.value.hoatDong,
    trangThai: roomDetail.value.trangThai,
    danhSachTrang: (slides.value ?? []).map((slide: Slide): UpdateSlide => ({
      loaiTrang: slide.loaiTrang,
      tieuDe: slide.tieuDe,
      hinhAnh: slide.hinhAnh,
      hinhNen: slide.hinhNen,
      canLeNoiDung: slide.canLeNoiDung,
      canLeTieuDe: slide.canLeTieuDe,
      cachTrinhBay: slide.cachTrinhBay?.trim() ? slide.cachTrinhBay : null,
      noiDung: slide.noiDung,
      thoiGianGioiHan: slide.thoiGianGioiHan,
      diem: slide.diem,
      loaiCauTraLoi: slide.loaiCauTraLoi,
      danhSachLuaChon: slide.loaiTrang === LoaiSlide.CAU_HOI ? slide.luaChon : undefined,
    })),
  }

  await roomStore.updateRoom(roomDetail.value.maPhong, formatData)
  hasChanges.value = false
  toast({
    title: 'Cập nhật thành công',
    description: 'Phòng đã được cập nhật thành công.',
  })
}

async function handleBack() {
  if (hasChanges.value) {
    const result = await confirmStore.showConfirmDialog({
      title: 'Cảnh báo',
      message: 'Bạn có thay đổi chưa được lưu. Bạn có muốn lưu trước khi thoát không?',
      confirmText: 'Lưu',
      cancelText: 'Không lưu',
    })

    if (result) {
      await handleSave()
    }
  }
  goBack()
}
function goBack() {
  if (roomDetail.value?.maKenh) {
    router.push({
      name: 'channels-id',
      params: { id: roomDetail.value.maKenh },
    })
  }
  else {
    router.push({ name: 'PublicRoom' })
  }
}

// Add beforeunload handler
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (hasChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div class="room-layout">
    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div
      v-if="isLoading"
      class="text-gray-500 text-center flex items-center justify-center h-full"
    >
      Đang tải dữ liệu phòng...
    </div>
    <template v-if="!isLoading && roomDetail">
      <EditNavBar
        v-model:title="roomDetail.tenPhong"
        class="navbar"
        @save="handleSave"
        @back="handleBack"
        @cancel="goBack"
        @preview="previewSlideStore.setPreviewSlide(slides as Slide[], currentSelectedIndex)"
      />
      <div class="body">
        <div class="slide-navigator">
          <SlideNavigator
            v-model:selected-slide-id="selectedSlideId"
            v-model:slides="slides"
            :index-selected-slide="indexSelectedSlide"
          />
        </div>
        <div class="main-content">
          <SlideEditor
            v-if="slides?.length && indexSelectedSlide !== -1"
            v-model:slide="slides[indexSelectedSlide]"
            :visible="isPanelVisible"
            :editable="true"
          />
          <PanelArea
            v-if="slides?.length && indexSelectedSlide !== -1"
            v-model:visible="isPanelVisible"
            v-model:slide="slides[indexSelectedSlide]"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.room-layout {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas:
  "navbar"
  "body";
  }

  .navbar {
    grid-area: navbar;
  }  .body {
    display: flex;
    grid-area: body;
    height: calc(100vh - 90px);
  }
  .slide-navigator {
    background-color: var(--card);
    box-shadow: var(--shadow-lg);
    height: 100%;
    overflow-y: auto;
    width: 200px;
    position: relative;
  }
  .main-content {
    background-color: var(--card);
    box-shadow: var(--shadow-lg);
    height: 100%;
    width: calc(100% - 200px);
    position: relative;
  }
</style>
