<script setup lang="ts">
import BaseImg from '@/components/common/BaseImg.vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useConfirmStore } from '@/stores/confirm'
import { type Kenh, type NguoiDung, TrangThai, VaiTroKenh } from '@/types'

import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

interface NguoiDungData extends NguoiDung {
  isSelected: boolean
}
interface Props {
  user: NguoiDungData & {
    vaiTro: VaiTroKenh
  }
  type: string
  isOwner: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:selected', value: boolean): void
  (e: 'remove', value: NguoiDungData): void
  (e: 'handleRequest', value: NguoiDungData, accept: boolean): void
}>()
const MEMBER_TYPE = {
  [VaiTroKenh.THANH_VIEN]: 'Thành viên',
  [VaiTroKenh.CHU_KENH]: 'Chủ kênh',
}
const confirmStore = useConfirmStore()
const id_selected = defineModel({
  type: Boolean,
})

async function handleRemove() {
  const confirm = await confirmStore.showConfirmDialog({
    title: 'Xóa thành viên',
    message: `Bạn có chắc chắn muốn xóa ${props.user.hoTen} khỏi kênh không?`,
  })
  if (!confirm)
    return
  emit('remove', props.user)
}
async function handleAccept(accept: boolean) {
  if (!accept) {
    const confirm = await confirmStore.showConfirmDialog({
      title: 'Từ chối yêu cầu',
      message: `Bạn có chắc chắn muốn từ chối ${props.user.hoTen} vào kênh không?`,
    })
    if (!confirm)
      return
    emit('handleRequest', props.user, accept)
  }
  else {
    emit('handleRequest', props.user, accept)
  }
}
</script>

<template>
  <div class="grid grid-cols-7 gap-4 items-center p-4 border-b border-border hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 cursor-pointer rounded-md">
    <CheckboxRoot
      v-if="isOwner"
      v-model="id_selected"
      :disabled="user.vaiTro === VaiTroKenh.CHU_KENH"
      class="hover:bg-green3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-background border border-border shadow-blackA7 shadow-[0_1px_4px_-2px] outline-none"
    >
      <CheckboxIndicator
        class="h-full w-full rounded flex items-center justify-center"
      >
        <Icon
          name="IconCheck"
          class="h-4 w-4 text-grass11"
        />
      </CheckboxIndicator>
    </CheckboxRoot>    <div class="col-span-4 flex items-center gap-4">
      <BaseImg
        :src="user.anhDaiDien"
        :alt="user.hoTen"
        class="w-10 h-10 rounded-full"
        aspect-ratio="square"
      />
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold truncate-one-line">
          {{ user.hoTen }}
        </h2>
        <div class="text-sm text-muted-foreground truncate-one-line">
          {{ user.email }}
          <span class="text-foreground">
            - [{{ MEMBER_TYPE[user.vaiTro] }}]
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="isOwner"
      class="flex items-center justify-end gap-2 col-span-2"
    >
      <Popover>
        <PopoverTrigger>
          <button
            class="px-1 hover:bg-gray-200 rounded-sm"
            :disabled="user.vaiTro === VaiTroKenh.CHU_KENH"
          >
            <Icon name="IconEllipsis" class="w-6 h-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" class="w-40 bg-card p-0">
          <Button
            v-if="type === 'member'"
            type="button"
            variant="destructive"
            class="w-full"
            @click="handleRemove"
          >
            Xóa khỏi kênh
          </Button>
          <div
            v-else
            class="flex flex-col gap-1 p-1"
          >
            <Button
              type="button"
              variant="outline"
              class="w-full"
              @click="handleAccept(true)"
            >
              Chấp nhận
            </Button>
            <Button
              type="button"
              variant="destructive"
              class="w-full"
              @click="handleAccept(false)"
            >
              Từ chối
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
