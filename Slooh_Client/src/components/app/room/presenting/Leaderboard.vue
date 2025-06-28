<script setup lang="ts">
import type { LeaderboardData } from '@/types'
import BaseImg from '@/components/common/BaseImg.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

defineProps<{
  isOpen: boolean
  leaderboard: LeaderboardData
}>()

defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-center text-2xl font-bold">
          Bảng xếp hạng
        </DialogTitle>
      </DialogHeader>

      <div class="space-y-2 max-h-[70vh] overflow-y-auto py-4">
        <TransitionGroup
          name="leaderboard"
          tag="div"
          class="space-y-2"
        >
          <div
            v-for="user in leaderboard"
            :key="user.maThanhVienPhien"
            class="flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ease-in-out transform border border-gray-300 bg-slate-100"
          >
            <div
              class="flex items-center justify-center w-8 h-8 rounded-full font-bold"
              :class="[
                user.rank === 1 ? 'bg-yellow-500 text-black'
                : user.rank === 2 ? 'bg-gray-400 text-black'
                  : user.rank === 3 ? 'bg-amber-700 text-white'
                    : 'bg-muted text-muted-foreground',
              ]"
            >
              {{ user.rank }}
            </div>

            <BaseImg
              :src="user.anhDaiDien || ''"
              class="w-10 h-10 rounded-full object-cover"
              :alt="user.tenThanhVien"
            />

            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">
                {{ user.tenThanhVien }}
                <Icon v-if="user.isUser" name="IconCheck" class="inline-block ml-1 w-6 h-6 text-primary" />
              </div>
            </div>

            <div class="font-mono font-bold text-lg">
              {{ user.tongDiem }}
            </div>
          </div>
        </TransitionGroup>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.leaderboard-move {
  transition: transform 0.5s ease;
}

.leaderboard-enter-active,
.leaderboard-leave-active {
  transition: all 0.5s ease;
}

.leaderboard-enter-from,
.leaderboard-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
