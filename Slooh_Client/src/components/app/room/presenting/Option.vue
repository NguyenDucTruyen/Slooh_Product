<script setup lang="ts">
import type { LoaiCauTraLoi, LuaChon } from '@/types'

import { cn } from '@/lib/utils'

const props = defineProps<{
  index: number
  type?: LoaiCauTraLoi
  showResult?: boolean
}>()

const emit = defineEmits(['selectOption'])

const option = defineModel('option', {
  type: Object as () => LuaChon,
  required: true,
})

const LIST_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F']

function handleSelect() {
  if (!props.showResult)
    emit('selectOption', props.index)
}

const buttonColor = computed(() => {
  const colors = {
    0: 'bg-amber-700 hover:bg-amber-600',
    1: 'bg-red-700 hover:bg-red-600',
    2: 'bg-green-700 hover:bg-green-600',
    3: 'bg-yellow-700 hover:bg-yellow-600',
    4: 'bg-slate-700 hover:bg-slate-600',
    5: 'bg-purple-700 hover:bg-purple-600',
  }
  return colors[props.index as keyof typeof colors]
})
</script>

<template>
  <button
    :class="cn(`flex w-full h-full relative p-x rounded-lg text-white max-h-[160px] min-h-[100px] transition-colors duration-200`, buttonColor,
               `before:content-[''] before:absolute before:inset-0 before:rounded-lg before:border-[4px] before:border-transparent before:z-10 `,
               {
                   'before:border-secondary': option.isSelected,
                   'before:border-success': props.showResult && option.ketQua && option.isSelected,
                   'before:bg-black/60': props.showResult && !option.ketQua,
               })"
    @click="handleSelect"
  >
    <div class="flex items-center justify-center font-bold text-2xl w-12 min-w-12 text-slate-900 h-full bg-white rounded-s-md lg:rounded-s-lg">
      {{ LIST_OPTIONS[props.index] }}
    </div>
    <div class="flex-1 max-w-[calc(100%-96px)] h-full flex items-center px-4">
      <RichTextEditor
        v-model="option.noiDung"
        special-type="question"
        placeholder="Nhập nội dung câu trả lời..."
        class="w-full bg-transparent border-none h-full text-xl max-h-[140px]"
      />
    </div>
  </button>
</template>
