<script setup lang="ts">
import { type Kenh, TrangThai } from '@/types'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

interface Props {
  item: Kenh
  isOwner: boolean
}
const { item } = defineProps<Props>()
defineEmits(['update:id_selected', 'edit'])

const id_selected = defineModel({
  type: Boolean,
})

// Format ngày
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-md border border-border bg-gradient-to-b from-card to-card/95 text-card-foreground shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-primary/50"
  >
    <!-- Selection Checkbox with improved styling -->
    <CheckboxRoot
      v-if="isOwner"
      v-model="id_selected"
      class="absolute top-0.5 right-0.5 z-10 flex h-7 w-7 appearance-none items-center justify-center rounded-md bg-background/95 backdrop-blur border border-border hover:border-primary transition-colors duration-200 shadow-lg outline-none"
    >
      <CheckboxIndicator class="h-full w-full rounded-md flex items-center justify-center bg-primary/10">
        <Icon
          name="IconCheck"
          class="h-4 w-4 text-primary"
        />
      </CheckboxIndicator>
    </CheckboxRoot>

    <!-- Header with new design -->
    <div class="relative p-6 pb-4">
      <h2 class="title text-2xl group-hover:text-primary transition-colors duration-200">
        {{ item.tenKenh }}
      </h2>
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-500" />
    </div>

    <!-- Body with enhanced icon -->
    <div class="relative px-4 pt-2">
      <div class="rounded-lg overflow-hidden bg-muted/30 aspect-video flex items-center justify-center group-hover:bg-muted/50 transition-colors duration-300">
        <Icon
          name="IconChannel"
          class="w-20 h-20 text-primary/90 transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>

    <!-- Footer with improved layout -->
    <div class="p-6 pt-4 space-y-4">
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <p class="flex items-center gap-2">
          <Icon name="IconCalendar" class="w-4 h-4" />
          {{ formatDate(item.ngayTao) }}
        </p>
        <p v-if="item.thanhVien?.length" class="flex items-center gap-2">
          <Icon name="IconGroup" class="w-4 h-4" />
          {{ item.thanhVien?.length || 0 }}
        </p>
      </div>

      <!-- Action buttons with enhanced styling -->
      <div
        v-if="isOwner"
        class="grid grid-cols-2 gap-3"
      >
        <Button
          variant="outline"
          class="group/btn flex items-center gap-2 hover:border-primary/50"
          @click="$emit('edit', item)"
        >
            <Icon name="IconEdit" class="w-4 h-4 text-muted-foreground group-hover/btn:text-white group-hover/btn:translate-y-[-1px] group-hover/btn:rotate-[-10deg] transition-transform transform" />
          Chỉnh sửa
        </Button>
        <Button
          class="group/btn flex items-center gap-2"
          :disabled="item.trangThai === TrangThai.KHOA"
          @click="$router.push({ name: 'channels-id', params: { id: item.maKenh } })"
        >
          Truy cập
          <Icon
            name="IconArrowRight"
            class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
          />
        </Button>
      </div>
      <div
        v-else
        class="grid"
      >
        <Button
          class="group/btn w-full flex items-center justify-center gap-2"
          :disabled="item.trangThai === TrangThai.KHOA"
          @click="$router.push({ name: 'JoinedChannels-id', params: { id: item.maKenh } })"
        >
          Truy cập
          <Icon
            name="IconArrowRight"
            class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </div>

    <!-- Status Indicator -->
    <div
      v-if="item.trangThai === TrangThai.KHOA"
      class="absolute top-1 left-1 px-2 py-1 rounded-md bg-destructive/10 backdrop-blur-sm border border-destructive/20 text-destructive text-xs font-medium"
    >
      <!-- <Icon name="IconLock" class="w-4 h-4 inline-block mr-1" /> -->
      Bị khóa
    </div>
  </div>
</template>

<style scoped>
.title {
  font-weight: 600;
  line-height: 1.25;
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
</style>
