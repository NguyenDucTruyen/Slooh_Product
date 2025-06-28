<script setup lang="ts">
import type { Slide } from '@/types'

const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
</script>

<template>
  <div class="grid grid-cols-1 w-full h-full gap-12">
    <div class="flex flex-col justify-center gap-6  col-span-1">
      <RichTextEditor
        v-model="slide.tieuDe"
        v-model:align="slide.canLeTieuDe"
        placeholder="Click để nhập tiêu đề..."
        class="shrink-0 max-h-[150px]"
        v-bind="$attrs"
      />
      <RichTextEditor
        v-model="slide.noiDung"
        v-model:align="slide.canLeNoiDung"
        placeholder="Click để nhập tiêu đề..."
        class="max-h-[470px] text-xl"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>
