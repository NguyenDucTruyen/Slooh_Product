<script setup lang="ts">
defineProps<{
  placeholder?: string
  modelValue?: string
}>()

defineEmits<{
  search: [value: string]
}>()
</script>

<template>
  <div class="w-full flex items-center justify-between mb-4 flex-wrap gap-2">
    <InputSearch
      :model-value="modelValue"
      :placeholder="placeholder"
      @update:model-value="$emit('search', $event)"
    />
    <div class="flex gap-4 flex-wrap">
      <slot />
    </div>
  </div>
</template>
