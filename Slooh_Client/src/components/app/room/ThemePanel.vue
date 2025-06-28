<script setup lang="ts">
import type { Slide } from '@/types'
import { listThemes } from '@/assets/data/slide-data'

const props = defineProps<{
  slide: Slide
}>()

const emit = defineEmits<{
  (e: 'update:slide', value: Slide): void
}>()

const themes = ref(listThemes)

function handleThemeSelect(themeImage: string) {
  emit('update:slide', { ...props.slide, hinhNen: themeImage })
}
</script>

<template>
  <div class="h-[calc(100vh-130px)] overflow-y-auto p-2">
    <div
      v-for="(item, index) in themes"
      :key="item.section"
      class="grid"
      :class="{ ' mt-5': index > 0 }"
    >
      <span class="text-lg mb-1">
        {{ item.section }}
      </span>
      <div class="grid grid-cols-2 gap-2">
        <template
          v-for="theme in item.list"
          :key="theme.id"
        >
          <div
            class="w-full h-20 rounded-md overflow-hidden relative cursor-pointer hover:scale-105 transition-transform duration-300 border-[3px]"
            :class="[theme.image === slide?.hinhNen ? 'border-ring' : 'border-transparent before:absolute before:inset-0 before:bg-gray-800/60 before:rounded-md']"
            @click="handleThemeSelect(theme.image)"
          >
            <img :src="theme.image" alt="" class="w-full h-full object-cover rounded-sm">
            <span class="absolute left-0 bottom-0 text-sm text-center w-full p-1 bg-gradient-to-tr from-transparent to-black/50 text-white">
              {{ theme.name }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
