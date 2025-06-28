<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  fallbackSrc?: string
  loading?: 'lazy' | 'eager'
  class?: string
  width?: string | number
  height?: string | number
  aspectRatio?: 'square' | 'video' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: 'Image',
  fallbackSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/300px-User-avatar.svg.png',
  loading: 'lazy',
  class: '',
  aspectRatio: 'auto',
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const imgRef = ref<HTMLImageElement>()
const isLoading = ref(true)
const hasError = ref(false)
const currentSrc = ref(props.src)

// Handle image load success
function handleLoad(event: Event) {
  isLoading.value = false
  hasError.value = false
  emit('load', event)
}

// Handle image load error
function handleImgError(event: Event) {
  const img = event.target as HTMLImageElement
  hasError.value = true
  isLoading.value = false

  // If current src is not the fallback, try fallback
  if (currentSrc.value !== props.fallbackSrc) {
    currentSrc.value = props.fallbackSrc
    img.src = props.fallbackSrc
  }

  emit('error', event)
}

// Watch for src changes
watch(() => props.src, (newSrc) => {
  if (newSrc && newSrc !== currentSrc.value) {
    currentSrc.value = newSrc
    hasError.value = false
    isLoading.value = true
  }
})

// Computed classes
const imageClasses = computed(() => {
  const classes = [props.class]

  if (props.aspectRatio === 'square') {
    classes.push('aspect-square')
  }
  else if (props.aspectRatio === 'video') {
    classes.push('aspect-video')
  }

  return classes.filter(Boolean).join(' ')
})

// Initialize current src
onMounted(() => {
  currentSrc.value = props.src || props.fallbackSrc
})
</script>

<template>
  <div class="relative inline-block">
    <!-- Loading skeleton -->
    <div
      v-if="isLoading && !hasError"
      class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
      :class="imageClasses"
      :style="{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }"
    />
    <!-- Actual image -->
    <img
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      :loading="loading"
      :width="width"
      :height="height"
      class="transition-opacity duration-300 bg-gray-200 p-1"
      :class="[
        imageClasses,
        {
          'opacity-0': isLoading,
          'opacity-100': !isLoading,
        },
      ]"
      @load="handleLoad"
      @error="handleImgError"
    >

    <!-- Error state (optional, can be styled) -->
    <div
      v-if="hasError && currentSrc === fallbackSrc"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs rounded"
    >
      <img
        src="https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
        alt="Fallback Image"
        class="w-full h-full object-cover rounded"
      >
    </div>
  </div>
</template>

<style scoped>
img {
  object-fit: cover;
}
</style>
