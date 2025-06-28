<script setup lang="ts">
import type { CreateReportData } from '@/api/report'
import { uploadImage } from '@/api/upload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { useReportStore } from '@/stores/report'
import { Loader2 } from 'lucide-vue-next'

interface Props {
  maPhong: string
  tenPhong?: string
}

const { maPhong, tenPhong = '' } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'success'): void
}>()

const open = defineModel<boolean>('open', { default: false })
const reportStore = useReportStore()

const formData = ref<CreateReportData>({
  maPhong,
  noiDung: '',
  hinhAnh: '',
})

const isSubmitting = ref(false)
const isUploading = ref(false)
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const previewImage = ref()
function resetForm() {
  formData.value = {
    maPhong,
    noiDung: '',
    hinhAnh: '',
  }
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn một file hình ảnh',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'Kích thước file không được vượt quá 5MB',
        variant: 'destructive',
      })
      return
    }

    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

function removeImage() {
  formData.value.hinhAnh = ''
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  previewImage.value = null
}

async function handleSubmit() {
  if (!formData.value.noiDung.trim()) {
    toast({
      title: 'Lỗi',
      description: 'Vui lòng nhập nội dung báo cáo',
      variant: 'destructive',
    })
    return
  }

  if (formData.value.noiDung.length < 10) {
    toast({
      title: 'Lỗi',
      description: 'Nội dung báo cáo phải có ít nhất 10 ký tự',
      variant: 'destructive',
    })
    return
  }

  if (formData.value.noiDung.length > 1000) {
    toast({
      title: 'Lỗi',
      description: 'Nội dung báo cáo không được vượt quá 1000 ký tự',
      variant: 'destructive',
    })
    return
  }

  try {
    isSubmitting.value = true
    if (selectedFile.value) {
      isUploading.value = true
      const response = await uploadImage(selectedFile.value)
      formData.value.hinhAnh = response.url
    }
    await reportStore.createReport(formData.value)

    toast({
      title: 'Thành công',
      description: 'Báo cáo đã được gửi thành công',
    })

    open.value = false
    resetForm()
    emit('success')
  }
  catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo'

    toast({
      title: 'Lỗi',
      description: errorMessage,
      variant: 'destructive',
    })
  }
  finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  open.value = false
  resetForm()
}

watch(open, (newValue) => {
  if (newValue) {
    formData.value.maPhong = maPhong
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Báo cáo phòng</DialogTitle>
        <DialogDescription>
          Báo cáo phòng "{{ tenPhong }}" nếu bạn thấy có nội dung không phù hợp
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="noiDung">Nội dung báo cáo *</Label>
          <textarea
            id="noiDung"
            v-model="formData.noiDung"
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải với phòng này..."
            class="min-h-[100px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            :maxlength="1000"
            rows="4"
          />
          <div class="text-sm text-muted-foreground text-right">
            {{ formData.noiDung.length }}/1000
          </div>
        </div>

        <div class="grid gap-2">
          <Label for="hinhAnh">Hình ảnh minh chứng (tùy chọn)</Label>

          <!-- File upload option -->
          <div class="space-y-2">
            <div class="flex gap-2">
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              >
              <Button
                type="button"
                variant="outline"
                size="sm"
                :disabled="isSubmitting || isUploading"
                @click="fileInputRef?.click()"
              >
                <Loader2 v-if="isUploading" class="w-4 h-4 mr-2 animate-spin" />
                {{ isUploading ? 'Đang tải lên...' : 'Chọn hình ảnh' }}
              </Button>
            </div>

            <div v-if="selectedFile" class="text-sm text-muted-foreground">
              Đã chọn: {{ selectedFile.name }} ({{ Math.round(selectedFile.size / 1024) }}KB)
            </div>

            <div v-if="isUploading" class="text-sm text-blue-600">
              Đang tải lên hình ảnh...
            </div>
          </div>

          <!-- Or manual URL input -->
          <div class="relative">
            <span class="text-sm text-muted-foreground">hoặc nhập link hình ảnh:</span>
            <div class="flex gap-2 mt-1">
              <Input
                id="hinhAnh"
                v-model="formData.hinhAnh"
                type="url"
                placeholder="https://example.com/image.jpg"
                :disabled="isSubmitting"
              />
              <Button
                v-if="formData.hinhAnh"
                type="button"
                variant="outline"
                size="sm"
                :disabled="isSubmitting"
                @click="removeImage"
              >
                Xóa
              </Button>
            </div>
          </div>

          <!-- Image preview -->
          <div v-if="previewImage" class="mt-2">
            <div class="relative inline-block">
              <img
                :src="previewImage"
                alt="Preview"
                class="max-w-full max-h-48 object-cover rounded-lg border shadow-sm"
                @error="() => { formData.hinhAnh = '' }"
              >
              <Button
                type="button"
                variant="destructive"
                size="sm"
                class="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                :disabled="isSubmitting"
                @click="removeImage"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="gap-2">
        <Button
          variant="outline"
          :disabled="isSubmitting || isUploading"
          @click="handleCancel"
        >
          Hủy
        </Button>
        <Button
          :disabled="isSubmitting || isUploading"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
          Gửi báo cáo
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
