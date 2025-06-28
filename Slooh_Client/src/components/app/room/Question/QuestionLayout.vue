<script setup lang="ts">
import { uploadImage } from '@/api/upload'
import { toast } from '@/components/ui/toast'
import { useOptionStore } from '@/stores/option'
import { usePreviewSlideStore } from '@/stores/preview'
import { LoaiCauTraLoi, type LuaChon, type Slide } from '@/types'
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  editable?: boolean
}>()
const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
const optionStore = useOptionStore()
const previewSlideStore = usePreviewSlideStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)

watch(() => optionStore.option, (newOption) => {
  if (slide.value && newOption) {
    slide.value.luaChon?.push(newOption)
    optionStore.clearOption()
  }
})
function handleUploadImage() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn tệp hình ảnh hợp lệ.',
        variant: 'destructive',
      })
      return
    }
    const maxSizeMB = 5
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      toast({
        title: 'Lỗi',
        description: `Kích thước tệp không được vượt quá ${maxSizeMB} MB.`,
        variant: 'destructive',
      })
      fileInput.value!.value = '' // Reset input
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      if (slide.value) {
        uploading.value = true
        slide.value.hinhAnh = e.target?.result as string
        const response = await uploadImage(file)
        slide.value.hinhAnh = response.url
        uploading.value = false
      }
    }
    reader.readAsDataURL(file)
  }
}

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (slide.value) {
        slide.value.hinhAnh = e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}
function handleUpdateResult(option: LuaChon) {
  console.log('handleUpdateResult', option)
  if (slide.value.luaChon && slide.value.loaiCauTraLoi !== LoaiCauTraLoi.MULTI_SELECT) {
    slide.value.luaChon.forEach((item) => {
      if (item !== option) {
        item.ketQua = false
      }
    })
  }
}
const deletableOption = computed(() => {
  return slide.value.luaChon && slide.value.luaChon.length > 2
})
</script>

<template>
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
      :class="{ 'blur-md': uploading }"
    >
    <div
      v-if="editable && !previewSlideStore.isPreviewing"
      class="rounded-md w-full h-full flex-1 relative group"
      tabindex="0"
      :class="{ 'ring-2 ring-primary ring-offset-2': isDragging }"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        :disabled="uploading"
        @change="handleFileChange"
      >
      <div
        v-if="!slide.hinhAnh || uploading"
        class="absolute max-w-[400px] max-h-[400px] backdrop-blur-md flex flex-col items-center justify-center gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200/50 p-6 rounded-md text-center cursor-pointer"
        @click="handleUploadImage"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <template
          v-if="uploading"
        >
          <Loader2
            class="w-10 h-10 text-primary animate-spin m-auto"
            :class="{ 'opacity-100': uploading, 'opacity-0': !uploading }"
          />
          <p class="text-gray-900 dark:text-gray-400 font-medium">
            Đang tải lên...
          </p>
        </template>
        <template
          v-else
        >
          <div
            class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
          >
            <Icon
              name="IconPlus"
              class="w-8 h-8 text-gray-900"
            />
          </div>
          <div class="text-center">
            <p class="text-gray-900 dark:text-gray-400 font-medium">
              Nhấp để tải lên hình ảnh
            </p>
            <p class="text-sm text-gray-900 dark:text-gray-500 mt-1">
              Hoặc kéo và thả hình ảnh vào đây
            </p>
          </div>
        </template>
      </div>
      <div
        v-if="editable && !previewSlideStore.isPreviewing"
        class="flex absolute gap-2 p-4 bottom-0 right-0 p-x rounded-md bg-white/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Button
          :disabled="uploading"
          @click="handleUploadImage"
        >
          <Icon name="IconPlus" class="w-6 h-6" />
          Thay ảnh
        </Button>
        <Button
          variant="destructive"
          @click="slide.hinhAnh = ''"
        >
          <Icon name="IconTrash" class="w-6 h-6" />
          Xóa
        </Button>
      </div>
    </div>
  </div>
  <!-- Dynamic Area - Fixed height -->
  <div
    v-if="slide.luaChon"
    class="grid grid-cols-2 gap-x-5 gap-y-2.5 lg:gap-x-10 lg:gap-y-4 shrink-0 w-full rounded-lg"
  >
    <template v-for="(option, index) in slide.luaChon" :key="index">
      <AnswerOption
        v-model:option="slide.luaChon[index]"
        :index="index"
        :deletable="deletableOption"
        :editable="editable"
        @update-result="handleUpdateResult"
        @delete-option="slide.luaChon.splice(index, 1)"
      />
    </template>
  </div>
</template>
