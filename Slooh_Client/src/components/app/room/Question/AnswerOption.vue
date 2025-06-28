<script setup lang="ts">
import type { LuaChon } from '@/types'
import { cn } from '@/lib/utils'

const props = defineProps<{
  index: number
  deletable?: boolean
  editable?: boolean
  showResult?: boolean
}>()
const emit = defineEmits<{
  (e: 'updateResult', value: LuaChon): void
  (e: 'deleteOption', index: number): void
}>()
const option = defineModel('option', {
  type: Object as () => LuaChon,
  required: true,
})
const LIST_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F']
watch(() => option.value.ketQua, (newValue) => {
  if (newValue) {
    emit('updateResult', option.value)
  }
})
</script>

<template>
  <div
    class="flex w-full h-full relative p-x rounded-md lg:rounded-lg text-white max-h-[160px] min-h-[100px]"
    :class="{
      'bg-blue-700': props.index === 0,
      'bg-red-700': props.index === 1,
      'bg-green-700': props.index === 2,
      'bg-yellow-700': props.index === 3,
      'bg-slate-700': props.index === 4,
      'bg-purple-700': props.index === 5,

    }"
  >
    <div
      :class="cn('flex items-center justify-center font-bold text-2xl w-12 min-w-12 text-slate-900 h-full bg-white rounded-s-md lg:rounded-s-lg',
                 {
                   'before:content-[\'\'] before:absolute before:inset-0 before:rounded-lg before:border-[4px] before:border-transparent before:z-[1]': !editable,
                   'before:bg-black/60': props.showResult && !option.ketQua,
                 })"
    >
      {{ LIST_OPTIONS[props.index] }}
    </div>
    <div class="flex-1 max-w-[calc(100%-96px)] h-full">
      <RichTextEditor
        v-model="option.noiDung"
        special-type="question"
        placeholder="Nhập nội dung câu trả lời..."
        class="w-full bg-transparent border-none h-full"
        :class="[!editable ? 'text-2xl max-h-[160px]' : 'text-xl max-h-[140px]']"
        :editable="editable"
      />
    </div>
    <div
      v-if="editable"
      class="flex flex-col gap-2 items-center justify-center font-bold text-2xl w-12 min-w-12 text-foreground/80 h-full rounded-e-md lg:rounded-e-lg"
    >
      <input
        v-model="option.ketQua"
        type="checkbox"
        class="w-6 h-6 accent-primary rounded-full cursor-pointer"
      >
      <Button
        v-if="props.deletable"
        variant="destructive"
        class="p-2 shadow-md border border-slate-50"
        @click=" $emit('deleteOption', index)"
      >
        <Icon name="IconTrash" class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>
