<script setup lang="ts">
import type { Kenh, NguoiDung, Phong } from '@/types'
import MemberList from '@/components/app/channel/MemberList.vue'
import RoomList from '@/components/app/channel/RoomList.vue'
import CreateRoomWithAIModal from '@/components/app/room/CreateRoomWithAIModal.vue'
import { toast } from '@/components/ui/toast'
import { useChannelStore } from '@/stores/channel'
import { useConfirmStore } from '@/stores/confirm'
import { useRoomStore } from '@/stores/room'
import { TrangThaiThanhVien, VaiTroKenh } from '@/types'
import { useAsyncState } from '@vueuse/core'

interface PhongData extends Phong {
  isSelected: boolean
}

interface NguoiDungData extends NguoiDung {
  isSelected: boolean
}

const TAB_LIST = {
  LIST: 'list',
  MEMBERS: 'members',
}

const router = useRouter()
const confirmStore = useConfirmStore()
const channelStore = useChannelStore()
const roomStore = useRoomStore()

const route = useRoute()
const maKenh = route.params.id as string
const searchValue = ref('')
const searchUserValue = ref('')
const isAddUserModalOpen = ref(false)
const isCreateRoomModalOpen = ref(false)
const breadCrumbItems = ref<any[]>([])
const isCreateRoomWithAIModalOpen = ref(false)
const membersResponse = ref<Partial<NguoiDungData>[]>([])
const requestJoinMembers = ref<Partial<NguoiDungData>[]>([])
const queryConfig = ref({
  page: 1,
  limit: 100,
})
const { execute: fetchChannels, state: detailChannel } = useAsyncState<Kenh>(() => {
  return (async () => {
    const response = await channelStore.getChannelDetail(maKenh)
    if (response) {
      const members = []
      const requests = []
      for (const member of response.thanhVien) {
        if (member.trangThai === TrangThaiThanhVien.THAM_GIA) {
          members.push({
            ...member.nguoiDung,
            vaiTro: member.vaiTro,
            isSelected: false,
          })
        }
        if (member.vaiTro !== VaiTroKenh.CHU_KENH && member.trangThai === TrangThaiThanhVien.YEU_CAU) {
          requests.push({
            ...member.nguoiDung,
            isSelected: false,
          })
        }
      }
      membersResponse.value = members
      requestJoinMembers.value = requests

      breadCrumbItems.value = [
        {
          text: 'Kênh của tôi',
          to: { name: 'channels' },
        },
        {
          text: response.tenKenh,
          disabled: true,
        },
      ]
    }
    return response
  })()
}, null as unknown as Kenh, {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})

const rooms = ref<PhongData[]>([])
const { isLoading } = useAsyncState<PhongData[]>(() => {
  return (async () => {
    const response = await channelStore.getRoomsInChannel(maKenh, queryConfig.value)
    rooms.value = response.rooms
    return response
  })()
}, [], {
  immediate: true,
  onError: (error) => {
    Promise.reject(error)
  },
})
const members = computed(() => {
  if (!searchUserValue.value)
    return membersResponse.value
  return membersResponse.value.filter((member) => {
    return member.hoTen?.toLowerCase().includes(searchUserValue.value.toLowerCase())
  })
})

const selectedMembers = computed(() => {
  return members.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur)
    }
    return acc
  }, [] as Partial<NguoiDungData>[])
})

const selectedRequestJoinMembers = computed(() => {
  return requestJoinMembers.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur)
    }
    return acc
  }, [] as Partial<NguoiDungData>[])
})
const selectedRoom = computed(() => {
  return rooms.value.reduce((acc, cur) => {
    if (cur.isSelected) {
      acc.push(cur.maPhong)
    }
    return acc
  }, [] as string[])
})
const filterdRooms = computed(() => {
  if (!searchValue.value)
    return rooms.value
  return rooms.value.filter((room) => {
    return room.tenPhong?.toLowerCase().includes(searchValue.value.toLowerCase())
  })
})
function handleSearch(value: string) {
  searchValue.value = value
}
async function deleteSelectedRoom() {
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
    // Refresh room list after deletion
    const response = await channelStore.getRoomsInChannel(maKenh, queryConfig.value)
    rooms.value = response.rooms
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi xóa phòng',
      variant: 'destructive',
    })
  }
}
function openCreateRoomModal() {
  isCreateRoomModalOpen.value = true
}
function openAddUserModal() {
  isAddUserModalOpen.value = true
}
async function handleCreateRoom(name: string) {
  const response = await roomStore.createRoom({
    tenPhong: name,
    maKenh,
  })
  router.push({ name: 'rooms-id', params: { id: response.maPhong } })
}
async function handleRemoveMember(user: NguoiDungData) {
  await channelStore.removeMemberToChannel(maKenh, [user.email] as string[])
  fetchChannels(0)
}
async function deleteSelectedMembers() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Cảnh báo',
    message: `Bạn có chắc chắn muốn xóa ${selectedMembers.value.length} thành viên đã chọn không?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })
  if (!result)
    return
  await channelStore.removeMemberToChannel(maKenh, selectedMembers.value.map(member => member.email) as string[])
  fetchChannels(0)
}
async function handleAcceptMultiRequest(value: boolean) {
  if (!value) {
    const result = await confirmStore.showConfirmDialog({
      title: 'Cảnh báo',
      message: `Bạn có chắc chắn muốn ${value ? 'chấp nhận' : 'từ chối'} ${selectedRequestJoinMembers.value.length} yêu cầu tham gia đã chọn không?`,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy',
    })
    if (!result)
      return
  }
  if (value) {
    await channelStore.acceptRequestJoinChannel(maKenh, selectedRequestJoinMembers.value.map(member => member.email) as string[])
  }
  else {
    await channelStore.rejectRequestJoinChannel(maKenh, selectedRequestJoinMembers.value.map(member => member.email) as string[])
  }
  fetchChannels(0)
}
async function handleAcceptRequest(user: NguoiDungData, accept: boolean) {
  if (accept) {
    await channelStore.acceptRequestJoinChannel(maKenh, [user.email] as string[])
  }
  else {
    await channelStore.rejectRequestJoinChannel(maKenh, [user.email] as string[])
  }
  fetchChannels(0)
}
async function handleAddUser(ids: string[]) {
  await channelStore.addMemberToChannel(maKenh, ids)
  fetchChannels(0)
  toast({
    title: 'Thành công',
    description: 'Thêm thành viên thành công',
  })
}

const visibleModalCloneRoom = ref(false)
const temprarySelectedRoom = ref<string | null>(null)

// Clone room functionality
function handleCloneRoom(maPhong: string) {
  temprarySelectedRoom.value = maPhong
  visibleModalCloneRoom.value = true
}

async function handleCloneRoomSubmit({ roomId, channelId }: { roomId: string, channelId: string }) {
  try {
    await roomStore.cloneRoom({ roomId, channelId })
    toast({
      title: 'Thành công',
      description: 'Nhân đôi phòng thành công',
    })
    // Refresh room list after cloning
    const response = await channelStore.getRoomsInChannel(maKenh, queryConfig.value)
    rooms.value = response.rooms
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

// Define the list of channels to show in clone modal
const { state: channels, isLoading: isFetchingChannels } = useAsyncState<Kenh[]>(() => {
  return (async () => {
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

function openCreateRoomWithAIModal() {
  isCreateRoomWithAIModalOpen.value = true
}

async function handleCreateRoomWithAI(data: { file: File, tenPhong: string, maKenh: string | null, userPrompt?: string }) {
  try {
    data.maKenh = maKenh
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
</script>

<template>
  <PageContainer
    :title="`Kênh: ${detailChannel?.tenKenh ?? ''}`" description="Danh sách các phòng và thành viên trong kênh"
    back-to="/channels"
  >
    <Tabs :default-value="route.query.tab || 'list'">
      <TabsList>
        <TabsTrigger value="list" @click="router.replace({ query: { tab: TAB_LIST.LIST } })">
          <Icon name="IconList" class="w-6 h-6" />
          Danh sách phòng
        </TabsTrigger>
        <TabsTrigger value="members" @click="router.replace({ query: { tab: TAB_LIST.MEMBERS } })">
          <Icon name="IconListUser" class="w-6 h-6" />
          Thành viên
        </TabsTrigger>
      </TabsList>      <!-- Danh sách room -->
      <TabsContent value="list">
        <TransitionGroup
          name="list"
          tag="div"
        >
          <template v-if="isLoading">
            <div
              class="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-20"
            >
              <Skeleton
                v-for="n in 4"
                :key="`skeleton-${n}`"
                class="h-[330px]"
              />
            </div>
          </template>
          <RoomList
            v-else
            :rooms="filterdRooms"
            @create="openCreateRoomModal"
            @delete="deleteSelectedRoom"
            @search="handleSearch"
            @clone="handleCloneRoom"
            @create-with-a-i="openCreateRoomWithAIModal"
          />
        </TransitionGroup>
      </TabsContent>
      <!-- Danh sách thành viên -->
      <TabsContent value="members">
        <MemberList
          :members="membersResponse"
          :request-join-members="requestJoinMembers"
          @remove-member="handleRemoveMember"
          @delete-selected="deleteSelectedMembers"
          @add-user="openAddUserModal"
          @accept-request="handleAcceptRequest"
          @accept-multi-request="handleAcceptMultiRequest"
        />
      </TabsContent>
    </Tabs>
  </PageContainer>
  <div class="flex flex-col items-center" />
  <CreateRoomModal
    v-model:open="isCreateRoomModalOpen"
    @create="handleCreateRoom"
  />
  <AddUserModal
    v-model:open="isAddUserModalOpen"
    @add="handleAddUser"
  />
  <ModalCloneRoom
    v-if="!isFetchingChannels && temprarySelectedRoom"
    v-model:open="visibleModalCloneRoom"
    :channels="channels"
    :room-id="temprarySelectedRoom"
    @add="handleCloneRoomSubmit"
  />
  <CreateRoomWithAIModal
    v-model:open="isCreateRoomWithAIModalOpen"
    @create="handleCreateRoomWithAI"
  />
</template>
