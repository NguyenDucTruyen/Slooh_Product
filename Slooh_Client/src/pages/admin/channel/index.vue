<route>
  {
      meta: {
      layout: "admin",
      title: "Admin - Quản lý kênh",
      }
  }
</route>

<script setup lang="ts">
import BaseImg from '@/components/common/BaseImg.vue'
import { Switch } from '@/components/ui/switch'
import { useAdminStore } from '@/stores/admin'
import { type Kenh, type NguoiDung, TrangThai, VaiTroKenh } from '@/types'
import { useAsyncState, useDebounceFn } from '@vueuse/core'
import { Calendar, Eye, Loader2, Users } from 'lucide-vue-next'

interface PaginatedChannelsResponse {
  channels: Kenh[]
  total: number
  page: number
  limit: number
  totalPages: number
}
type KenhMap = Kenh & {
  chuKenh: NguoiDung | undefined
}
const adminStore = useAdminStore()
const router = useRouter()
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

const { isLoading, state, execute } = useAsyncState<KenhMap[]>(
  async () => {
    const response = await adminStore.getAllChannels(queryConfig.value) as PaginatedChannelsResponse
    metaData.value = {
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
    return response.channels.map(channel => ({
      ...channel,
      chuKenh: channel.thanhVien.find(member => member.vaiTro === VaiTroKenh.CHU_KENH)?.nguoiDung,
    }))
  },
  [],
  { immediate: false },
)

// Watch for route changes to update queryConfig and fetch data
watch(() => route.query, () => {
  initializeFromRoute()
  execute()
}, { immediate: true })

async function updateChannelStatus(maKenh: string, trangThai: boolean) {
  const status = trangThai ? TrangThai.HOAT_DONG : TrangThai.KHOA
  await adminStore.updateChannelStatus(maKenh, status)
  state.value = state.value.map((channel) => {
    if (channel.maKenh === maKenh) {
      return { ...channel, trangThai: status }
    }
    return channel
  })
}

function viewChannelRooms(maKenh: string) {
  router.push(`/admin/channel/${maKenh}`)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function getStatusText(status: TrangThai) {
  return status === 'HOAT_DONG' ? 'Hoạt động' : 'Đã khóa'
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header Section -->
    <div class="border-b bg-card mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-foreground">
              Quản lý kênh
            </h1>
            <p class="text-sm text-muted-foreground mt-1">
              Quản lý và giám sát tất cả các kênh trong hệ thống
            </p>
          </div>

          <!-- Summary Cards -->
          <div class="flex gap-4">
            <Card class="p-4 min-w-32">
              <div class="flex items-center space-x-2">
                <Icon name="IconChannel" class="w-4 h-4 text-blue-600" />
                <div>
                  <p class="text-sm font-medium">
                    Tổng kênh: <span class="font-bold ">{{ metaData.total }}</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col flex-1">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <Loader2 class="w-8 h-8 animate-spin text-gray-500" />
      </div>

      <!-- Empty State -->
      <div v-else-if="state?.length === 0" class="flex justify-center items-center h-64">
        <div class="text-center">
          <Users class="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500">
            <!-- {{ queryConfig.tenKenh ? 'Không tìm thấy kênh nào.' : 'Chưa có kênh nào trong hệ thống.' }} -->
            Chưa có kênh nào trong hệ thống.
          </p>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="relative">
        <div class="overflow-auto h-[calc(100vh-320px)] scrollbar bg-background">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Thông tin kênh
                </th>
                <th scope="col" class="px-6 py-3">
                  Người tạo
                </th>
                <th scope="col" class="px-6 py-3">
                  Thành viên
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
                v-for="channel in state"
                :key="channel.maKenh"
                class="border-b hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <!-- Channel Info -->
                <th scope="row" class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="flex items-center">
                    <!-- <img
                      v-lazy="channel.anhDaiDien || '/default-channel.png'"
                      class="w-10 h-10 rounded-lg object-cover mr-3"
                      alt="Channel avatar"
                    > -->
                    <div>
                      <div class="text-base font-semibold">
                        {{ channel.tenKenh }}
                      </div>
                      <div class="font-normal text-gray-500 text-xs">
                        <span class="text-xs">{{ getStatusText(channel.trangThai) }}</span>
                      </div>
                    </div>
                  </div>
                </th>                <!-- Creator -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <BaseImg
                      :src="channel.chuKenh?.anhDaiDien"
                      :alt="channel.chuKenh?.hoTen"
                      class="w-8 h-8 rounded-full mr-2"
                      aspect-ratio="square"
                    />
                    <div>
                      <p class="font-medium">
                        {{ channel.chuKenh?.hoTen || 'N/A' }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ channel.chuKenh?.email || 'N/A' }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Member Count -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Users class="w-4 h-4 mr-1 text-gray-400" />
                    <span class="font-medium">{{ channel.thanhVien?.length || 0 }}</span>
                  </div>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Calendar class="w-4 h-4 mr-1 text-gray-400" />
                    <span>{{ formatDate(channel.ngayTao) }}</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Switch
                      :model-value="channel.trangThai === 'HOAT_DONG'"
                      @update:model-value="(value) => updateChannelStatus(channel.maKenh, value)"
                    />
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="viewChannelRooms(channel.maKenh)"
                  >
                    <Icon name="IconArrowRight" class="w-4 h-4 mr-1" />
                    Xem kênh
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <PaginationTable
          :total="metaData.total"
          :current-page="queryConfig.page"
          :items-per-page="queryConfig.limit"
        />
      </div>
    </div>
  </div>
</template>
