<template>
  <div class="auth-layout">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  @apply flex justify-center items-center h-full bg-muted relative;
  background: url('@/assets/images/bg-image-1.jpg') center !important;
  background-size: cover !important;
}
</style>
