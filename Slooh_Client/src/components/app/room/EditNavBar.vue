<script setup lang="ts">
import EditableInput from '@/components/common/EditableInput.vue'
import Button from '@/components/ui/button/Button.vue'

defineEmits<Emits>()
const roomTitle = defineModel<string>('title', {
  default: 'Untitled',
})
interface Emits {
  (e: 'save'): void
  (e: 'back'): void
  (e: 'preview'): void
  (e: 'cancel'): void
}
function handleSaveTitle(title: string) {
  roomTitle.value = title
}

</script>

<template>
  <div class="app-header">
    <div class="app-header-part">
      <div
        class="gap-2 ml-6 cursor-pointer flex items-center hover:bg-muted rounded-lg py-2 px-4"
        @click="$emit('back')"
      >
        <Icon name="IconArrowRight" class="w-6 h-6 rotate-180" />
      </div>
      <div class="flex items-center mr-4">
        <EditableInput
          v-slot="{ data }"
          class="text-lg font-medium"
          :value="roomTitle"
          @save="handleSaveTitle"
        >
          <div class="flex flex-col cursor-pointer">
            <span class="border-transparent hover:border-slate-500 text-base max-w-[320px] truncate-one-line">
              {{ data }}
            </span>
            <span class="text-xs text-gray-500"> Click để chỉnh sửa </span>
          </div>
        </EditableInput>
      </div>
    </div>
    <div class="app-header-part">
      <Button
        variant="secondary"
        class="text-sm rounded-full"
        @click="$emit('preview')"
      >
        <Icon name="IconEyeOn" class="w-5 h-5" />
        Xem trước
      </Button>

      <Separator orientation="vertical" class="h-6" />
      <Button
        variant="secondary"
        class="text-sm rounded-full"
        @click="$emit('cancel')"
      >
        Hủy bỏ
      </Button>
      <Button
        class="text-sm rounded-full"
        @click="$emit('save')"
      >
        Lưu
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  @apply flex items-center justify-between w-full h-full gap-1 p-2 lg:pr-8 bg-border/30 shadow-lg border-b border-foreground/30;
}
.app-header-part {
    @apply flex items-center gap-2;
}
</style>
