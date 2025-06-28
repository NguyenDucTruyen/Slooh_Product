<script setup lang="ts">
defineProps<{
  className?: string
}>()
</script>

<template>
  <div
    class="animate-pulse rounded-md bg-muted/40 relative overflow-hidden" :class="[
      className,
    ]"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skeleton-shine" />
    <slot />
  </div>
</template>

<style scoped>
.skeleton-shine {
  animation: shine 1.5s infinite;
}

@keyframes shine {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
