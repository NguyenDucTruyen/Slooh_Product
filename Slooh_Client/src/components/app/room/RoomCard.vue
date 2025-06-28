<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/toast'
import { usePreviewSlideStore } from '@/stores/preview'
import { useRoomStore } from '@/stores/room'
import { HoatDongPhong, type Phong, type Slide, TrangThai } from '@/types'
import { useAsyncState } from '@vueuse/core'
import { Loader2, Video } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

interface Props {
  item: Phong
  isAuthor: boolean
}

const { item, isAuthor } = defineProps<Props>()
defineEmits<{
  (e: 'clone', maPhong: string): void
  (e: 'report', maPhong: string, tenPhong: string): void
}>()
const previewSlideStore = usePreviewSlideStore()
const roomStore = useRoomStore()

const id_selected = defineModel({
  type: Boolean,
})
const slides = ref<Slide[]>()

const { execute: fetchDetail, isLoading } = useAsyncState<Phong>(() => {
  return (async () => {
    const response = await roomStore.getRoomDetail(item.maPhong)
    slides.value = response.trangs
    return response
  })()
}, null as unknown as Phong, {
  immediate: false,
  onError: (error) => {
    Promise.reject(error)
  },
})
// Class badge theo trạng thái
const badgeClass = computed(() => {
  switch (item.hoatDong) {
    case HoatDongPhong.PRESENTING:
      return 'bg-success text-white'
    case HoatDongPhong.OFFLINE:
      return 'bg-gray-500 text-white'
    case HoatDongPhong.WAITING:
      return 'bg-warning text-white'
    default:
      return 'bg-border text-foreground'
  }
})
async function handleNavigateToPreview() {
  await fetchDetail()
  if (slides.value?.length === 0) {
    toast({
      title: 'Không có trang nào để xem trước',
      description: 'Vui lòng thêm trang vào phòng trình chiếu trước khi xem trước.',
      variant: 'warning',
    })
    return
  }
  previewSlideStore.setPreviewSlide(slides.value || [])
}
</script>

<template>
  <div
    class="rounded-lg border border-border bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 relative"
  >
    <div class="flex justify-between p-2 items-center">
      <div
        class="flex items-center gap-2 flex-1 text-base font-medium"
      >
        <Video
          class="w-6 h-6 text-slate-600"
        />
        Phòng trình chiếu
      </div>
      <CheckboxRoot
        v-if="isAuthor"
        v-model="id_selected"
        :disabled="item.hoatDong !== HoatDongPhong.OFFLINE"
        :class="[item.hoatDong !== HoatDongPhong.OFFLINE ? 'cursor-not-allowed' : 'cursor-pointer']"
        class="hover:bg-green3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-background border border-border shadow-blackA7 shadow-[0_1px_4px_-2px] outline-none"
      >
        <CheckboxIndicator class="h-full w-full rounded flex items-center justify-center">
          <Icon
            name="IconCheck"
            class="h-4"
          />
        </CheckboxIndicator>
      </CheckboxRoot>
    </div>
    <!-- Body -->
    <div class="relative h-[186px] overflow-hidden">
      <img
        src="https://res.cloudinary.com/dzdfgj03g/image/upload/w_400/v1744825325/Theme-bg/theme-light-purple_gogrs5.webp" alt=""
        class="w-full object-contain"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black to-slate-600/80 opacity-50" />
      <div class="absolute inset-0 flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825325/Theme-bg/theme-light-purple_gogrs5.webp"
          alt=""
          class="w-28 h-28 rounded-full border-2 border-white/10 backdrop-blur-sm object-cover"
        >
      </div>
      <!-- Show how many slide -->
      <div class="absolute bottom-2 left-0 px-2 w-full flex items-center justify-between">
        <span
          class="bg-black/50 text-white text-xs px-2 py-1 rounded"
        >{{ item._count?.trangs }} trang</span>
        <div
          v-if="item.trangThai === TrangThai.KHOA"
          class="absolute top-1 right-1 px-2 py-1 rounded-md bg-destructive backdrop-blur-sm border border-destructive/20 text-background text-xs font-medium"
        >
          Bị khóa
        </div>
        <span
          v-else
          class="text-xs font-medium px-2 py-0.5 rounded-full"
          :class="badgeClass"
        >

          {{ item.hoatDong === HoatDongPhong.PRESENTING ? 'Đang trình chiếu' : item.hoatDong === HoatDongPhong.OFFLINE ? 'Offline' : 'Đang Chờ' }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between mb-2 p-2">
      <h2 class="title">
        {{ item.tenPhong }}
      </h2>

      <Popover>
        <PopoverTrigger>
          <button class="px-1 hover:bg-gray-200 rounded-sm">
            <Icon name="IconList" class="w-6 h-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" class="w-40 bg-card p-0">
          <div class="flex flex-col w-full">
            <template
              v-if="isAuthor"
            >
              <RouterLink
                :to="`/rooms/${item.maPhong}`"
                class="w-full"
              >
                <button class="w-full text-slate-800 font-normal hover:bg-gray-200 px-2 py-1 flex items-center gap-2">
                  <Icon name="IconEdit" class="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </RouterLink>
              <Separator />
              <button
                v-if="item.trangThai === TrangThai.HOAT_DONG"
                class="text-slate-800 font-normal hover:bg-gray-200 px-2 py-1 flex items-center gap-2"
                @click="$emit('clone', item.maPhong)"
              >
                <Icon name="IconCopy" class="w-4 h-4" />

                Nhân đôi
              </button>
              <Separator />
            </template>
            <button
              v-else
              class="w-full text-slate-800 font-normal hover:bg-gray-200 px-2 py-1 flex items-center gap-2"
              @click="$emit('report', item.maPhong, item.tenPhong)"
            >
              <Icon name="IconReport" class="w-4 h-4 !text-red-500" />
              Báo cáo
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <!-- Footer -->
    <div class="text-muted-foreground text-sm space-y-2 pb-4 px-2">
      <div v-if="isAuthor" class="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          class="w-full"
          :disabled="isLoading"
          @click="handleNavigateToPreview"
        >
          <Icon v-if="!isLoading" name="IconEyeOn" class="w-4 h-4" />
          <Loader2
            v-else
            class="w-4 h-4 text-primary animate-spin m-auto"
          />
          Xem trước
        </Button>
        <Button
          type="button"
          class="w-full"
          :disabled="item.trangThai === TrangThai.KHOA"
          @click="$router.push(`/presenting/${item.maPhong}`)"
        >
          <Icon name="IconPlay" class="w-4 h-4" />
          Trình chiếu
        </Button>
      </div>
      <Button
        v-else
        type="button"
        class="w-full"
        :disabled="item.hoatDong === HoatDongPhong.OFFLINE"
        @click="$router.push(`/session/room/${item.maPhong}`)"
      >
        Tham gia
        <Icon name="IconArrowRight" class="w-6 h-6" />
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.description {
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  min-block-size: 40px;
}
.title {
  font-size: 1.25rem;
  font-weight: 600;
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  min-block-size: 28px;
}
</style>
