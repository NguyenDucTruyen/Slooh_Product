<route>
  {
      meta: {
      layout: "admin",
      title: "Admin - Quản lý phòng",
      }
  }
</route>

<script setup lang="ts">
import type { NguoiDung, Phong, TrangThai } from '@/types'
import BaseImg from '@/components/common/BaseImg.vue'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import { useAdminStore } from '@/stores/admin'
import { usePreviewSlideStore } from '@/stores/preview'
import { useRoomStore } from '@/stores/room'
import { useAsyncState } from '@vueuse/core'
import { Calendar, Eye, Layers, Loader2, Users, Video } from 'lucide-vue-next'

type PhongMap = Phong & {
  nguoiTao: NguoiDung
}
interface PaginatedRoomsResponse {
  rooms: PhongMap[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const adminStore = useAdminStore()
const roomStore = useRoomStore()
const previewSlideStore = usePreviewSlideStore()
const route = useRoute()

const queryConfig = ref({
  page: 1,
  limit: 10,
})

const metaData = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
})

// Initialize queryConfig from URL parameters
function initializeFromRoute() {
  const page = Number(route.query.page) || 1
  const limit = Number(route.query.limit) || 10

  queryConfig.value = {
    page,
    limit,
  }
}

const { isLoading, state, execute } = useAsyncState<PhongMap[]>(
  async () => {
    const response = await adminStore.getAllPublicRooms(queryConfig.value) as PaginatedRoomsResponse
    metaData.value = {
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
    return response.rooms
  },
  [],
  { immediate: false },
)

const { execute: fetchDetail } = useAsyncState(
  (id: string) => {
    return (async () => {
      const response = await roomStore.getRoomDetail(id)
      if (response.trangs?.length === 0) {
        toast({
          title: 'Thông báo',
          description: 'Không có trang nào trong phòng này để xem nội dung.',
          variant: 'warning',
        })
        return
      }
      previewSlideStore.setPreviewSlide(response.trangs || [])
    })()
  },
  null,
  {
    immediate: false,
    onError: (error) => {
      Promise.reject(error)
    },
  },
)
// Watch for route changes to update queryConfig and fetch data
watch(() => route.query, () => {
  initializeFromRoute()
  execute()
}, { immediate: true })
async function updateRoomStatus(maPhong: string, trangThai: boolean) {
  const status = trangThai ? 'HOAT_DONG' as TrangThai : 'KHOA' as TrangThai
  await adminStore.updateRoomStatus(maPhong, status)
  state.value = state.value.map((room) => {
    if (room.maPhong === maPhong) {
      return { ...room, trangThai: status }
    }
    return room
  })
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function getStatusText(status: TrangThai) {
  return status === 'HOAT_DONG' ? 'Hoạt động' : 'Đã khóa'
}

function getActivityText(activity: string) {
  switch (activity) {
    case 'OFFLINE':
      return 'Offline'
    case 'WAITING':
      return 'Đang chờ'
    case 'PRESENTING':
      return 'Đang trình bày'
    default:
      return 'Không xác định'
  }
}

function getActivityColor(activity: string) {
  switch (activity) {
    case 'OFFLINE':
      return 'bg-gray-500'
    case 'WAITING':
      return 'bg-yellow-500'
    case 'PRESENTING':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

function getActivityTextColor(activity: string) {
  switch (activity) {
    case 'OFFLINE':
      return 'text-gray-500'
    case 'WAITING':
      return 'text-yellow-500'
    case 'PRESENTING':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

// Computed statistics
const roomStats = computed(() => {
  if (!state.value?.length)
    return null

  const total = state.value.length
  const active = state.value.filter(room => room.trangThai === 'HOAT_DONG').length
  const locked = state.value.filter(room => room.trangThai === 'KHOA').length
  const presenting = state.value.filter(room => room.hoatDong === 'PRESENTING').length
  return { total, active, locked, presenting }
})
</script>

<template>
  <div class="mt-2 py-2 px-6 bg-card shadow-lg flex-1">
    <div class="border-b mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Summary Cards -->
          <div v-if="roomStats" class="flex gap-4">
            <Card class="p-4 min-w-32">
              <div class="flex items-center space-x-2">
                <Users class="w-5 h-5 text-blue-600" />
                <div>
                  <p class="text-sm font-medium">
                    Tổng phòng
                  </p>
                  <p class="text-xl font-bold">
                    {{ roomStats.total }}
                  </p>
                </div>
              </div>
            </Card>

            <Card class="p-4 min-w-32">
              <div class="flex items-center space-x-2">
                <Eye class="w-5 h-5 text-green-600" />
                <div>
                  <p class="text-sm font-medium">
                    Hoạt động
                  </p>
                  <p class="text-xl font-bold">
                    {{ roomStats.active }}
                  </p>
                </div>
              </div>
            </Card>

            <Card class="p-4 min-w-32">
              <div class="flex items-center space-x-2">
                <Video class="w-5 h-5 text-orange-600" />
                <div>
                  <p class="text-sm font-medium">
                    Đang trình bày
                  </p>
                  <p class="text-xl font-bold">
                    {{ roomStats.presenting }}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col flex-1">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <Loader2 class="w-8 h-8 animate-spin text-gray-500" />
      </div>

      <!-- Empty State -->
      <div v-else-if="state?.length === 0" class="flex justify-center items-center h-64">
        <div class="text-center">
          <Video class="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500">
            Không tìm thấy phòng nào.
          </p>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="relative">
        <div class="overflow-auto h-[calc(100vh-380px)] scrollbar bg-background">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Thông tin phòng
                </th>
                <th scope="col" class="px-6 py-3">
                  Chủ sở hữu
                </th>
                <th scope="col" class="px-6 py-3">
                  Hoạt động
                </th>
                <th scope="col" class="px-6 py-3">
                  Số trang
                </th>
                <th scope="col" class="px-6 py-3">
                  Ngày tạo
                </th>
                <th scope="col" class="px-6 py-3">
                  Trạng thái
                </th>
                <th scope="col" class="px-6 py-3">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="room in state"
                :key="room.maPhong"
                class="border-b hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <!-- Room Info -->
                <th scope="row" class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                      <Video class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="text-base font-semibold">
                        {{ room.tenPhong }}
                      </div>
                      <div class="font-normal text-gray-500 text-xs">
                        <span class="text-xs">{{ getStatusText(room.trangThai) }}</span>
                      </div>
                    </div>
                  </div>
                </th>

                <!-- Room Owner -->
                <!-- Creator -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <BaseImg
                      :src="room.nguoiTao?.anhDaiDien"
                      :alt="room.nguoiTao?.hoTen"
                      class="w-8 h-8 rounded-full mr-2"
                      aspect-ratio="square"
                    />
                    <div>
                      <p class="font-medium">
                        {{ room.nguoiTao?.hoTen || 'N/A' }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ room.nguoiTao?.email || 'N/A' }}
                      </p>
                    </div>
                  </div>
                </td>              <!-- Activity Status -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div :class="`w-2 h-2 rounded-full mr-2 ${getActivityColor(room.hoatDong)}`" />
                    <span :class="`font-medium ${getActivityTextColor(room.hoatDong)}`">
                      {{ getActivityText(room.hoatDong) }}
                    </span>
                  </div>
                </td>

                <!-- Slide Count -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center">
                    <Layers class="w-4 h-4 mr-1 text-gray-400" />
                    <span class="font-medium">{{ room._count?.trangs || 0 }}</span>
                  </div>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Calendar class="w-4 h-4 mr-1 text-gray-400" />
                    <span>{{ formatDate(room.ngayTao) }}</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Switch
                      :model-value="room.trangThai === 'HOAT_DONG'"
                      @update:model-value="(value) => updateRoomStatus(room.maPhong, value)"
                    />
                  </div>
                </td>
                <td class="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="fetchDetail(0, room.maPhong)"
                  >
                    <Icon name="IconArrowRight" class="w-4 h-4 mr-1" />
                    Xem nội dung
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>        <!-- Pagination -->
        <PaginationTable
          :total="metaData.total"
          :current-page="queryConfig.page"
          :items-per-page="queryConfig.limit"
        />
      </div>
    </div>
  </div>
</template>
