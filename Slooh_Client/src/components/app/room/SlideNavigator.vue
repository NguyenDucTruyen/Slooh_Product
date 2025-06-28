<script setup lang="ts">
import { defaultSlideData } from '@/constants/slide'
import { useConfirmStore } from '@/stores/confirm'
import { CachTrinhBay, Diem, LoaiCauTraLoi, LoaiSlide, type Slide } from '@/types'
import { decode } from 'html-entities'
import Draggable from 'vuedraggable'

const { indexSelectedSlide } = defineProps<{
  indexSelectedSlide: number
}>()
const confirmStore = useConfirmStore()
const slides = defineModel('slides', {
  default: () => [],
  type: Array as () => Slide[],
})
const selectedSlideId = defineModel('selected-slide-id')

function updateThuTu() {
  slides.value.forEach((slide, index) => {
    slide.thuTu = index + 1
  })
}
function addQuestion() {
  const newSlide: Slide = {
    maTrang: `new-slide-${Math.random()}`,
    maPhong: '',
    loaiTrang: LoaiSlide.CAU_HOI,
    tieuDe: '',
    hinhNen: defaultSlideData.hinhNen,
    thuTu: indexSelectedSlide + 1,
    loaiCauTraLoi: LoaiCauTraLoi.TRUE_FALSE,
    luaChon: Array.from({ length: 2 }, () => ({
      noiDung: '',
      ketQua: false,
    })),
    thoiGianGioiHan: 5,
    diem: Diem.BINH_THUONG,
  }
  slides.value.splice(indexSelectedSlide + 1, 0, newSlide)
  selectedSlideId.value = newSlide.maTrang
  updateThuTu()
}
function addSlide() {
  const newSlide: Slide = {
    maTrang: `new-slide-${Math.random()}`,
    maPhong: '',
    loaiTrang: LoaiSlide.NOI_DUNG,
    tieuDe: '',
    hinhNen: defaultSlideData.hinhNen,
    thuTu: indexSelectedSlide + 1,
    cachTrinhBay: CachTrinhBay.CO_BAN,
    noiDung: '',
  }
  slides.value.splice(indexSelectedSlide + 1, 0, newSlide)
  selectedSlideId.value = newSlide.maTrang
  updateThuTu()
}
async function deleteSlide(slide: Slide) {
  const confirm = await confirmStore.showConfirmDialog({
    title: 'Xóa trang',
    message: 'Bạn có chắc chắn muốn xóa trang này?',
    cancelText: 'Hủy',
    confirmText: 'Xóa',
  })
  if (!confirm)
    return
  const index = slides.value.findIndex(s => s.maTrang === slide.maTrang)
  if (index !== -1) {
    slides.value.splice(index, 1)
    updateThuTu()
  }
  if (selectedSlideId.value === slide.maTrang) {
    selectedSlideId.value = slides.value[index]?.maTrang || slides.value[index - 1]?.maTrang || ''
  }
}
function duplicateSlide(slide: Slide) {
  const newID = `new-slide-${Math.random()}`
  const newSlide: Slide = { ...slide, maTrang: newID, luaChon: slide?.luaChon?.map(choice => ({ ...choice })) || [] }
  slides.value.splice(slide.thuTu, 0, newSlide)
  selectedSlideId.value = newID
  updateThuTu()
  selectedSlideId.value = newID
}
</script>

<template>
  <div class="h-full space-y-2">
    <div class="w-full border-r py-2 space-y-2  overflow-y-auto">
      <Draggable
        v-model="slides"
        group="slide"
        item-key="thuTu"
        @update="updateThuTu"
      >
        <template #item="{ element }">
          <div
            class="card"
            :class="{ 'card-active': selectedSlideId === element.maTrang }"
            @click="selectedSlideId = element.maTrang"
          >
            <div class="action">
              <Button
                variant="secondary"
                class="w-6 h-6 p-2 hover:bg-gray-300 rounded-full bg-transparent "
                title="Nhân đôi"
                @click.stop="duplicateSlide(element)"
              >
                <Icon name="IconCopy" class="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                class="w-6 h-6 p-2 hover:bg-gray-300 rounded-full bg-transparent "
                title="Xóa"
                @click.stop="deleteSlide(element)"
              >
                <Icon name="IconTrash" class="w-4 h-4" />
              </Button>
            </div>
            <div class="text-sm font-semibold">
              {{ element.thuTu }}.
              {{ element.loaiTrang === LoaiSlide.NOI_DUNG ? 'Nội dung' : 'Câu hỏi' }}
            </div>
            <div
              class="card-content"
              :class="[
                selectedSlideId === element.maTrang ? 'border-accent' : '',
              ]"
              :style="{
                backgroundImage: element.hinhNen ? `url(${element.hinhNen})` : 'hsl(var(--card))',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backdropFilter: 'blur(20px)',
              }"
            >
              <div
                class="slide-content"
              >
                <div class="box-border">
                  <div class="text-[13px] font-medium text-black truncate bg-white py-0.5 px-2 rounded max-h-6 overflow-hidden text-center" v-html="decode(element.tieuDe)" />
                </div>
                <!-- Img -->
                <div class="w-12 h-10 rounded-lg backdrop:blur-md mx-auto my-1 flex items-center justify-center">
                  <img
                    v-if="element.hinhAnh"
                    :src="element.hinhAnh"
                    alt="Slide background"
                    class="w-full h-full object-cover rounded-md"
                  >
                  <Icon
                    v-else
                    name="IconImageSkeleton"
                    alt="Default slide image"
                    class="w-8 h-8 object-cover rounded-md text-slate-600"
                  />
                </div>
                <!-- content -->
                <div v-if="element.loaiTrang === LoaiSlide.NOI_DUNG" class="box-border">
                  <div class="text-xs font-medium text-black truncate bg-white py-0.5 px-1 rounded max-h-6 overflow-hidden text-center min-h-6" v-html="decode(element.noiDung)" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Draggable>
    </div>

    <!-- Thêm nút -->
    <div class="space-y-2 pt-4 h-28 left-0 flex flex-col items-center justify-center w-full pl-4 pr-2 sticky bottom-0 bg-card">
      <Button
        class="w-full"
        @click="addSlide"
      >
        Thêm nội dung
      </Button>
      <Button
        class="w-full"
        variant="secondary"
        @click="addQuestion"
      >
        Thêm câu hỏi
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  @apply p-2 pl-8 cursor-pointer bg-card relative text-gray-600;

  .card-content {
    @apply rounded-md p-2 border-2 h-28 relative;
    @apply before:absolute before:inset-0 before:bg-gray-800/50 before:rounded-md;
    .slide-content {
      @apply rounded-sm p-2 h-28 absolute inset-0;
      @apply before:absolute before:inset-0 before:bg-gray-800/60 before:rounded-md;
    }
  }
  .action {
    @apply absolute flex-col top-1/2 -translate-y-3 left-1 space-y-1 hidden;
  }
  &:hover {
    .card-content {
      @apply border-accent;
    }
    .action {
      @apply flex;
    }
  }
  &.card-active {
    @apply bg-accent/25 text-foreground;
    .slide-content {
        @apply before:bg-gray-800/0;
      }
  }
}
</style>
