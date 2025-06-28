<template>
  <div class="auth-layout">
    <RouterView />
    <button
      to="/"
      class="absolute top-4 left-4 text-foreground hover:text-primary transition-colors bg-muted/80 rounded-md p-2 flex items-center gap-2"
      @click="$router.go(-1)"
    >
      <Icon name="IconBack" class="w-4 h-4" />
      Quay lại
    </button>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  @apply flex justify-center items-center h-full bg-muted relative;
  background: url('@/assets/images/bg-image-1.jpg') center !important;
  background-size: cover !important;
}
</style>
