<script setup lang="ts">
import type { Slide } from '@/types'
import SlideSettingPanel from './SlideSettingPanel.vue'
import ThemePanel from './ThemePanel.vue'

const slide = defineModel('slide', {
  type: Object as () => Slide,
  required: true,
})
const visible = defineModel('visible')
</script>

<template>
  <div
    class="panel-area transition-transform duration-300 shadow-xl"
    :class="{ 'translate-x-0': visible, 'translate-x-full': !visible }"
  >
    <div class="relative w-full h-full flex flex-col items-center">
      <Tabs default-value="edit" class="w-full">
        <TabsList class="w-full rounded-none">
          <TabsTrigger value="edit">
            <Icon name="IconEdit" class="w-6 h-6" />
            Điều chỉnh
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Icon name="IconTheme" class="w-6 h-6" />
            Hình nền
          </TabsTrigger>
        </TabsList>        
        <TabsContent value="edit">
          <SlideSettingPanel v-model:slide="slide" />
        </TabsContent>
        <TabsContent value="theme">
          <ThemePanel v-model:slide="slide" />
        </TabsContent>
      </Tabs>
      <!-- Icon Toggle Show Panel -->
      <Button
        variant="secondary"
        class="py-4 px-2 rounded-s-lg rounded-e-none absolute top-1/2 left-[1px] -translate-x-full -translate-y-1/2 bg-card hover:bg-card-hover shadow-lg"
        @click="() => visible = !visible"
      >
        <Icon
          name="IconChevronLeft"
          class="w-5 h-5 transition-transform duration-300"
          :class="{ 'rotate-180': visible }"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .panel-area {
    @apply bg-card h-full w-[260px] absolute right-0 top-0;
  }
</style>
