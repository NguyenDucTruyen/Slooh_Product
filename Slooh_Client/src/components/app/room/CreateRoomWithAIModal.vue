<script setup lang="ts">
import { toast } from '@/components/ui/toast'
import { Loader2 } from 'lucide-vue-next'

const { open } = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open', 'create'])

const roomName = ref('')
const selectedFile = ref<File | null>(null)
const userPrompt = ref('')
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement>()

const isCreatable = computed(() => {
  return roomName.value.trim() !== '' && selectedFile.value !== null
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const allowedTypes = [
      'application/pdf', // PDF
      'text/plain', // TXT
      'application/msword', // DOC (Word cũ)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX (Word mới)
    ]

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file PDF, Word hoặc text.',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'Kích thước file không được vượt quá 10MB.',
        variant: 'destructive',
      })
      return
    }

    selectedFile.value = file
  }
}

function removeFile() {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function handleCreate() {
  if (!isCreatable.value)
    return

  isUploading.value = true

  const data = {
    file: selectedFile.value!,
    tenPhong: roomName.value.trim(),
    maKenh: null, // As requested, maKenh can be ignored
    userPrompt: userPrompt.value.trim() || undefined,
  }

  emit('create', data)
}

function handleClose() {
  emit('update:open', false)
  // Reset form
  roomName.value = ''
  selectedFile.value = null
  userPrompt.value = ''
  isUploading.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Watch for open prop changes to reset form when modal closes
watch(() => open, (newValue) => {
  if (!newValue) {
    isUploading.value = false
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[500px] p-4">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Icon name="IconPlus" class="w-5 h-5" />
          Tạo phòng với AI
        </DialogTitle>
        <DialogDescription>
          Tải lên tài liệu và để AI tạo slide trình chiếu cho bạn.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Room Name Input -->
        <div class="space-y-2">
          <Label for="room-name">Tên phòng *</Label>
          <Input
            id="room-name"
            v-model="roomName"
            placeholder="Nhập tên phòng"
            autocomplete="off"
            :disabled="isUploading"
          />
        </div>

        <!-- File Upload -->
        <div class="space-y-2">
          <Label for="file-upload">Tài liệu *</Label>
          <div class="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              accept=".pdf,.doc,.docx,.txt"
              :disabled="isUploading"
              @change="handleFileSelect"
            >

            <div v-if="!selectedFile" class="text-center space-y-2">
              <Icon name="IconImageSkeleton" class="w-8 h-8 mx-auto text-muted-foreground" />
              <div>
                <Button
                  variant="outline"
                  :disabled="isUploading"
                  @click="fileInput?.click()"
                >
                  Chọn tài liệu
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                Hỗ trợ PDF, Word, Text (tối đa 10MB)
              </p>
            </div>

            <div v-else class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="IconSuccess" class="w-5 h-5 text-green-500" />
                <div>
                  <p class="font-medium">
                    {{ selectedFile.name }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                :disabled="isUploading"
                @click="removeFile"
              >
                <Icon name="IconTrash" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- User Prompt (Optional) -->
        <div class="space-y-2">
          <Label for="user-prompt">Yêu cầu đặc biệt (tùy chọn)</Label>
          <Input
            id="user-prompt"
            v-model="userPrompt"
            placeholder="Mô tả cách bạn muốn AI tạo slide (ví dụ: tập trung vào các điểm chính, thêm nhiều hình ảnh...)"
            :disabled="isUploading"
          />
        </div>
      </div>

      <DialogFooter class="gap-2">
        <Button
          variant="outline"
          :disabled="isUploading"
          @click="handleClose"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          :disabled="!isCreatable || isUploading"
          @click="handleCreate"
        >
          <Loader2 v-if="isUploading" class="animate-spin w-4 h-4 mr-2" />
          {{ isUploading ? 'Đang tạo...' : 'Tạo với AI' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
