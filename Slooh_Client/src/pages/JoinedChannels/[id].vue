<script setup lang="ts">
import type { Kenh, NguoiDung, Phong, ThanhVienKenh } from '@/types'
import ReportRoomModal from '@/components/app/room/ReportRoomModal.vue'
import { toast } from '@/components/ui/toast'
import { useChannelStore } from '@/stores/channel'
import { useConfirmStore } from '@/stores/confirm'
import { HoatDongPhong, TrangThai, TrangThaiThanhVien, VaiTroKenh } from '@/types'
import { useAsyncState } from '@vueuse/core'

interface PhongData extends Phong {
  isSelected: boolean
}

interface NguoiDungData extends NguoiDung {
  isSelected: boolean
}
const confirmStore = useConfirmStore()
const channelStore = useChannelStore()

const route = useRoute()
const router = useRouter()
const maKenh = route.params.id as string
const searchValue = ref('')
const searchUserValue = ref('')
const breadCrumbItems = ref<any[]>([])

const isReportModalOpen = ref(false)
const selectedRoomForReport = ref<{ maPhong: string, tenPhong: string } | null>(null)
const roomsResponse = ref<PhongData[]>([])
const membersResponse = ref<Partial<NguoiDungData>[]>([])

const requestJoinMembers = ref<Partial<NguoiDungData>[]>([])

const { state: detailChannel } = useAsyncState<Kenh>(() => {
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
          text: 'Kênh đã tham gia',
          to: { name: 'JoinedChannels' },
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
useAsyncState<PhongData[]>(() => {
  return (async () => {
    const response = await channelStore.getRoomsInChannel(maKenh, { page: 1, limit: 100 })
    roomsResponse.value = response.rooms
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

const rooms = computed(() => {
  if (!searchValue.value)
    return roomsResponse.value
  return roomsResponse.value.filter((room) => {
    return room.tenPhong?.toLowerCase().includes(searchValue.value.toLowerCase().trim())
  })
})

async function leaveChannel() {
  const confirm = await confirmStore.showConfirmDialog({
    title: 'Rời khỏi kênh',
    message: 'Bạn có chắc chắn muốn rời khỏi kênh này không?',
    cancelText: 'Hủy',
    confirmText: 'Rời khỏi kênh',
  })
  if (confirm) {
    await channelStore.leaveChannel(maKenh)
    toast({ title: 'Thành công', description: 'Rời khỏi kênh thành công' })
    router.push({ name: 'JoinedChannels' })
  }
}

// Report functionality
function handleReportRoom(maPhong: string, tenPhong: string) {
  selectedRoomForReport.value = { maPhong, tenPhong }
  isReportModalOpen.value = true
}

function handleReportSuccess() {
  selectedRoomForReport.value = null
}
</script>

<template>
  <PageContainer
    :title="`Kênh: ${detailChannel?.tenKenh ?? ''}`" description="Danh sách các phòng và thành viên trong kênh"
    back-to="/joinedChannels"
  >
    <template #header-actions>
      <div class="flex gap-4">
        <Button
          type="button"
          variant="destructive"
          @click="leaveChannel"
        >
          Rời khỏi kênh
        </Button>
      </div>
    </template>
    <div class="flex flex-col items-center">
      <Tabs default-value="list" class="mt-6 w-full">
        <TabsList>
          <TabsTrigger value="list">
            <Icon name="IconList" class="w-6 h-6" />
            Danh sách phòng
          </TabsTrigger>
          <TabsTrigger value="members">
            <Icon name="IconListUser" class="w-6 h-6" />
            Thành viên
          </TabsTrigger>
        </TabsList>
        <!-- Danh sách room -->
        <TabsContent value="list">
          <div class="w-full flex items-center justify-between">
            <InputSearch
              v-model="searchValue"
              placeholder="Tìm kiếm phòng trình chiếu"
            />
          </div>
          <div class="mt-4 w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            <RoomCard
              v-for="room in rooms"
              :key="room.maPhong"
              v-model="room.isSelected"
              :item="room"
              :can-report="true"
              @report="handleReportRoom"
            />
          </div>
          <div
            v-if="!rooms.length"
            class="text-md font-semibold mb-4 w-full text-center text-muted-foreground mx-auto"
          >
            Không có kết quả
          </div>
        </TabsContent>
        <!-- Danh sách thành viên -->
        <TabsContent value="members">
          <div class="max-w-5xl mx-auto p-4">
            <h4
              class="text-lg font-semibold mt-4"
            >
              Danh sách thành viên ({{ membersResponse.length }})
            </h4>
            <div class="mt-2 w-full mx-auto grid grid-cols-1 gap-4">
              <div class="flex justify-between">
                <InputSearch
                  v-model="searchUserValue"
                  placeholder="Tìm kiếm thành viên"
                />
              </div>
              <template
                v-for="member in members"
                :key="member.maNguoiDung"
              >
                <MemberCard
                  v-model="member.isSelected"
                  :user="member"
                  type="member"
                />
              </template>
              <span
                v-if="!members.length"
                class="text-md font-semibold mb-4 text-center text-muted-foreground"
              >Không có kết quả</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </PageContainer>

  <!-- Report Modal -->
  <ReportRoomModal
    v-if="selectedRoomForReport"
    v-model:open="isReportModalOpen"
    :ma-phong="selectedRoomForReport.maPhong"
    :ten-phong="selectedRoomForReport.tenPhong"
    @success="handleReportSuccess"
  />
</template>
