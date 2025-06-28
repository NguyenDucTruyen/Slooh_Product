<script setup lang="ts">
import type { Kenh } from '@/types'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  channels: {
    type: Array as () => Kenh[],
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:open', 'add'])
const selectedType = ref('public')
const selectedChannel = ref('')

watch(() => props.open, (newValue) => {
  if (!newValue) {
    selectedType.value = 'public'
    selectedChannel.value = ''
  }
})

function handleSubmit() {
  emit('add', {
    roomId: props.roomId,
    channelId: selectedType.value === 'public' ? '' : selectedChannel.value,
  })
  emit('update:open', false)
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <DialogContent class="sm:max-w-[425px] p-4">
      <DialogHeader>
        <DialogTitle>Nhân đôi phòng</DialogTitle>
        <DialogDescription>
          Chọn loại phòng và kênh (nếu cần) để nhân đôi phòng này.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4">
        <div class="space-y-4">
          <Label>Loại phòng</Label>
          <RadioGroup v-model="selectedType" class="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem id="public" value="public" class="peer sr-only" />
              <Label
                for="public"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Icon name="IconPublic" class="mb-3 h-6 w-6" />
                <span class="text-sm font-medium">Công khai</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem id="channel" value="channel" class="peer sr-only" />
              <Label
                for="channel"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Icon name="IconChannel" class="mb-3 h-6 w-6" />
                <span class="text-sm font-medium">Trong kênh</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div v-if="selectedType === 'channel'" class="grid grid-cols-5 items-center gap-4">
          <Label for="channel-select" class="text-left">Kênh</Label>
          <Select
            v-model="selectedChannel"
            class="w-full mb-4 col-span-4"
          >
            <SelectTrigger class="w-full col-span-4">
              <SelectValue placeholder="Chọn kênh" />
            </SelectTrigger>
            <SelectContent class="w-full">
              <SelectGroup>
                <SelectItem
                  v-for="channel in channels"
                  :key="channel.maKenh"
                  :value="channel.maKenh"
                >
                  {{ channel.tenKenh }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          :disabled="selectedType === 'channel' && !selectedChannel"
          @click="handleSubmit"
        >
          Xác nhận
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
