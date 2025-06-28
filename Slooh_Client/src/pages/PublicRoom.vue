<script setup lang="ts">
import type { Kenh, Phong } from '@/types'
import CreateRoomWithAIModal from '@/components/app/room/CreateRoomWithAIModal.vue'
import ModalCloneRoom from '@/components/app/room/ModalCloneRoom.vue'
import SearchHeader from '@/components/common/SearchHeader.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import { toast } from '@/components/ui/toast'
import { useChannelStore } from '@/stores/channel'
import { useConfirmStore } from '@/stores/confirm'
import { useRoomStore } from '@/stores/room'
import { useUserStore } from '@/stores/user'
import { useAsyncState } from '@vueuse/core'
import { SparklesIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface PhongData extends Phong {
  isSelected: boolean
}

const router = useRouter()
const channelStore = useChannelStore()
const roomStore = useRoomStore()
const confirmStore = useConfirmStore()
const userStore = useUserStore()

const searchValue = ref('')
const isCreateRoomModalOpen = ref(false)
const isCreateRoomWithAIModalOpen = ref(false)
const visibleModalCloneRoom = ref(false)
const isPinModalOpen = ref(false)
const temprarySelectedRoom = ref<string | null>(null)
const roomsResponse = ref<PhongData[]>([])
const { isLoading, execute } = useAsyncState(
  async () => {
    if (!userStore.isAuthenticated) {
      return { rooms: [] }
    }
    const response = await roomStore.getPublicRoomList()
    roomsResponse.value = response.rooms.map((room: Phong) => ({ ...room, isSelected: false }))
    return response
  },
  [],
  { immediate: true },
)
const { state: channels, isLoading: isFetchingChannels } = useAsyncState<Kenh[]>(() => {
  return (async () => {
    if (!userStore.isAuthenticated) {
      return []
    }
    const response = await channelStore.getChannelList({
      page: 1,
      limit: 100,
    })
    return response.channels
  })()
}, null as unknown as Kenh[], {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})

const filteredRooms = computed(() => {
  if (!searchValue.value)
    return roomsResponse.value
  return roomsResponse.value.filter((room) => {
    return room.tenPhong?.toLowerCase().includes(searchValue.value.toLowerCase())
  })
})

const selectedRoom = computed(() => {
  return roomsResponse.value.reduce((acc, cur) => {
    if (cur.isSelected)
      acc.push(cur.maPhong)
    return acc
  }, [] as string[])
})

function handleSearch(value: string) {
  searchValue.value = value
}

function openCreateRoomModal() {
  isCreateRoomModalOpen.value = true
}

function openCreateRoomWithAIModal() {
  isCreateRoomWithAIModalOpen.value = true
}

async function handleCreateRoom(name: string) {
  try {
    const response = await roomStore.createPublicRoom(name)
    router.push({ name: 'rooms-id', params: { id: response.maPhong } })
    toast({
      title: 'Thành công',
      description: 'Tạo phòng công khai thành công',
    })
  }
  catch (error) {
    Promise.reject(error)
  }
}

async function handleCreateRoomWithAI(data: { file: File, tenPhong: string, maKenh: string | null, userPrompt?: string }) {
  try {
    const response = await roomStore.createRoomWithAI(data)
    router.push({ name: 'rooms-id', params: { id: response.maPhong } })
    toast({
      title: 'Thành công',
      description: 'Tạo phòng với AI thành công',
    })
    isCreateRoomWithAIModalOpen.value = false
  }
  catch (error) {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi tạo phòng với AI',
      variant: 'destructive',
    })
    Promise.reject(error)
  }
}

async function deleteSelectedRoom() {
  if (selectedRoom.value.length === 0)
    return

  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedRoom.value.length} phòng đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })

  if (!result)
    return

  try {
    await Promise.all(selectedRoom.value.map(id => roomStore.deleteRoom(id)))
    toast({
      title: 'Thành công',
      description: 'Xóa phòng thành công',
    })
    const response = await roomStore.getPublicRoomList()
    roomsResponse.value = response.rooms.map((room: Phong) => ({ ...room, isSelected: false }))
  }
  catch (error) {
    Promise.reject(error)
  }
}
function handleCloneRoom(maPhong: string) {
  temprarySelectedRoom.value = maPhong
  visibleModalCloneRoom.value = true
}

watch(visibleModalCloneRoom, (newValue) => {
  if (!newValue) {
    temprarySelectedRoom.value = null
  }
})

async function handleCloneRoomSubmit({ roomId, channelId }: { roomId: string, channelId: string }) {
  try {
    await roomStore.cloneRoom({ roomId, channelId })
    toast({
      title: 'Thành công',
      description: 'Nhân đôi phòng thành công',
    })
    await execute()
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi nhân đôi phòng',
      variant: 'destructive',
    })
  }
  visibleModalCloneRoom.value = false
}
function handleOpenPinModal() {
  isPinModalOpen.value = true
}
</script>

<template>
  <template v-if="!userStore.isAuthenticated">
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center space-y-8">
      <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon name="IconPublic" class="w-8 h-8 text-primary" />
      </div>
      <div class="space-y-3">
        <h3 class="text-2xl font-semibold">
          Chào mừng đến với Phòng công khai
        </h3>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Đăng nhập để tạo và quản lý phòng trình chiếu của riêng bạn. Bạn có thể tạo phòng mới,
          chia sẻ nội dung và tương tác với người khác trong cộng đồng.
        </p>
      </div>

      <!-- New Join Session Section -->
      <div class="w-full max-w-2xl mx-auto p-6 rounded-xl bg-card/50 backdrop-blur border border-border/50">
        <div class="flex items-center gap-4 mb-4">
          <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="IconPlay" class="w-5 h-5 text-primary" />
          </div>
          <div class="flex-1 text-left">
            <h4 class="font-semibold">
              Tham gia ngay không cần tài khoản
            </h4>
            <p class="text-sm text-muted-foreground">
              Tham gia các phiên trình chiếu công khai đang diễn ra
            </p>
          </div>
          <Button
            class="shrink-0" variant="default"
            @click="handleOpenPinModal"
          >
            <Icon name="IconArrowRight" class="w-4 h-4 mr-2" />
            Tham gia phiên
          </Button>
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <Button @click="router.push('/auth/login')">
          Đăng nhập ngay
        </Button>
        <Button variant="outline" @click="router.push('/auth/signup')">
          Tạo tài khoản
        </Button>
      </div>
    </div>
  </template>
  <PageContainer
    v-else
    title="Phòng công khai"
    description="Khám phá và tham gia các phòng trình chiếu công khai. Tạo phòng riêng và chia sẻ nội dung của bạn với cộng đồng."
  >
    <template #header-actions>
      <Button
        :variant="userStore.isAuthenticated ? 'outline' : 'default'"
        @click="handleOpenPinModal"
      >
        Tham gia phiên
      </Button>
    </template>

    <SearchHeader
      v-model="searchValue"
      placeholder="Tìm kiếm phòng trình chiếu"
      @search="handleSearch"
    >
      <Button
        type="button"
        variant="destructive"
        :disabled="selectedRoom.length === 0"
        @click="deleteSelectedRoom"
      >
        <Icon
          name="IconTrash"
          class="h-4 w-4 mr-2"
        />
        Xóa {{ selectedRoom.length }} phòng
      </Button>
      <Button
        type="button"
        @click="openCreateRoomModal"
      >
        <Icon
          name="IconPlus"
          class="h-4 w-4 mr-2"
        />
        Tạo phòng trình chiếu
      </Button>
      <Button
        type="button"
        variant="outline"
        class="relative bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none transition-all duration-300 hover:scale-105"
        @click="openCreateRoomWithAIModal"
      >
        <SparklesIcon class="h-5 w-5 mr-2 animate-pulse text-white" />
        <span class="font-medium">Tạo với AI</span>
        <div class="absolute -top-1 -right-1">
          <span class="flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
          </span>
        </div>
      </Button>
    </SearchHeader>
    <TransitionGroup
      name="list"
      tag="div"
    >
      <template v-if="isLoading">
        <div
          v-for="n in 5"
          :key="`skeleton-${n}`"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4 transform transition-all duration-500"
          :style="{ transitionDelay: `${n * 100}ms` }"
        >
          <Skeleton class="h-[325px]" />
        </div>
      </template>
      <template v-else>
        <div
          v-if="filteredRooms.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4"
        >
          <RoomCard
            v-for="room in filteredRooms"
            :key="room.maPhong"
            v-model="room.isSelected"
            :is-author="true"
            :item="room"
            @clone="handleCloneRoom(room.maPhong)"
          />
        </div>
        <div
          v-else
          class="text-md font-semibold mb-4 w-full text-center text-muted-foreground col-span-full transition-all duration-500"
        >
          Không có kết quả
        </div>
      </template>
    </TransitionGroup>
  </PageContainer>

  <CreateRoomModal
    v-model:open="isCreateRoomModalOpen"
    @create="handleCreateRoom"
  />
  <CreateRoomWithAIModal
    v-model:open="isCreateRoomWithAIModalOpen"
    @create="handleCreateRoomWithAI"
  />
  <ModalCloneRoom
    v-if="!isFetchingChannels && temprarySelectedRoom"
    v-model:open="visibleModalCloneRoom"
    :channels="channels"
    :room-id="temprarySelectedRoom"
    @add="handleCloneRoomSubmit"
  />

  <ModalEnterPin
    v-model:open="isPinModalOpen"
    @confirm="(pin: string) => {
      router.push({ name: 'session-prepare', query: { pin } })
    }"
  />
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-move {
  transition: transform 0.5s ease;
}
</style>
