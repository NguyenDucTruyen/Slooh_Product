<script setup lang="ts">
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

defineProps<{
  tenPhong: string
  pin: string
  length: number
  current: number
  memberCount: number
  isConnected: boolean
  qrCode: string
}>()
defineEmits<{
  (event: 'viewLeaderboard'): void
}>()
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button
        variant="outline"
      >
        <Icon name="IconEllipsis" class="w-6 h-6" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-40 bg-card p-0 overflow-hidden">
      <Drawer direction="right">
        <DrawerTrigger
          class="w-full"
        >
          <Button
            variant="outline"
            class="w-full rounded-none border-none"
          >
            Thông tin phiên
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader class="flex items-center justify-between border-b mb-4 border-slate-600">
            <DrawerTitle>Thông tin phiên</DrawerTitle>
            <DrawerClose
              class="bg-gray-400 border hover:bg-gray-600 rounded flex justify-center items-center p-1 transition-colors duration-200"
            >
              <Icon name="IconClose" class="w-5 h-5 text-background" />
            </DrawerClose>
          </DrawerHeader>
          <div class="px-6">
            <div class="space-y-2 text-md">
              <div class="flex justify-between">
                <span class="text-slate-900">Phòng:</span>
                <span class="font-semibold text-xl">{{ tenPhong }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">PIN:</span>
                <span class="font-mono text-xl">{{ pin }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Tổng slides:</span>
                <span class="text-xl">{{ length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Slide hiện tại:</span>
                <span class="text-xl">{{ current + 1 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Thành viên:</span>
                <span class="text-xl">{{ memberCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-900">Trạng thái:</span>
                <span
                  :class="isConnected ? 'text-green-600' : 'text-red-600'"
                  class="text-md"
                >
                  {{ isConnected ? 'Đã kết nối' : 'Mất kết nối' }}
                </span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger as-child>
                <div class="flex flex-col items-center gap-2 bg-card rounded overflow-hidden relative mt-6">
                  <div class="flex absolute inset-0 w-full h-full items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Icon
                      name="IconZoomOut" class="w-12 h-12 text-background"
                    />
                  </div>
                  <img
                    :src="qrCode"
                    aspect-ratio="square"
                  >
                </div>
              </DialogTrigger>
              <DialogContent class="max-w-2xl max-h-fit">
                <DialogHeader>
                  <DialogTitle class="text-center text-3xl">
                    Mã QR
                  </DialogTitle>
                  <Separator class="my-2 h-[2px] bg-slate-600" />
                </DialogHeader>
                <div class="flex flex-col items-center gap-2 bg-card rounded relative">
                  <img
                    :src="qrCode"

                    class="h-[400px]"
                    aspect-ratio="square"
                  >
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DrawerContent>
      </Drawer>
      <Separator class=" bg-slate-600" />
      <Button
        variant="outline"
        class="w-full  rounded-none border-none"
        @click="$emit('viewLeaderboard')"
      >
        Xem bảng xếp hạng
      </Button>
    </PopoverContent>
  </Popover>
</template>
