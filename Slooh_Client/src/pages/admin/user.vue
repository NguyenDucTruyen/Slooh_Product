<route>
  {
      meta: {
      layout: "admin",
      title: "Admin - Quản lý người dùng",
      }
  }
  </route>

<script setup lang="ts">
import BaseImg from '@/components/common/BaseImg.vue'
import { Switch } from '@/components/ui/switch'
import { useAdminStore } from '@/stores/admin'
import { type NguoiDung, Quyen, TrangThai } from '@/types'
import { useAsyncState, useDebounceFn } from '@vueuse/core'
import { Calendar, Loader2 } from 'lucide-vue-next'

interface PaginatedUsersResponse {
  users: NguoiDung[]
  total: number
  page: number
  limit: number
  totalPages: number
}
const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()

const queryConfig = ref({
  hoTen: '',
  page: 1,
  limit: 8,
})
const metaData = ref({
  total: 0,
  page: 1,
  limit: 8,
  totalPages: 0,
})
const { isLoading, state, execute } = useAsyncState<NguoiDung[]>(
  async () => {
    const response = await adminStore.getAllUser(queryConfig.value) as PaginatedUsersResponse
    metaData.value = {
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
    return response.users.filter(user => user.quyen !== Quyen.ADMIN) // Exclude admin users
  },
  [],
  { immediate: false }, // Don't execute immediately, let route watcher handle it
)

// Initialize queryConfig from URL parameters
function initializeFromRoute() {
  const page = Number(route.query.page) || 1
  const search = (route.query.search as string) || ''
  const limit = Number(route.query.limit) || 8

  queryConfig.value = {
    hoTen: search,
    page,
    limit,
  }
}

// Watch for route changes to update queryConfig and fetch data
watch(() => route.query, () => {
  initializeFromRoute()
  execute()
}, { immediate: true })

// Update URL query parameters without triggering route watcher
function updateQueryParams(params: Record<string, any>) {
  const query = { ...route.query, ...params }

  // Remove empty search parameter
  if (params.search === '') {
    delete query.search
  }

  router.replace({ query })
}
// Handle search input changes with debounced URL update
const debouncedSearch = useDebounceFn(() => {
  updateQueryParams({ search: queryConfig.value.hoTen, page: 1 })
}, 500)

async function updateUserStatus(maNguoiDung: string, trangThai: boolean) {
  const status = trangThai ? TrangThai.HOAT_DONG : TrangThai.KHOA
  await adminStore.changeUserStatus(maNguoiDung, status)
  state.value = state.value.map((user) => {
    if (user.maNguoiDung === maNguoiDung) {
      return { ...user, trangThai: status }
    }
    return user
  })
}

// Watch for search input changes
watch(() => queryConfig.value.hoTen, debouncedSearch)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}
function getStatusText(status: TrangThai) {
  return status === 'HOAT_DONG' ? 'Hoạt động' : 'Đã khóa'
}
</script>

<template>
  <div class="h-full flex flex-col py-6">
    <div class="flex items-center justify-between flex-col flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 ml-2">
      <label for="table-search" class="sr-only">Tìm kiếm</label>
      <div class="relative">
        <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
          <Icon name="IconSearch" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <input v-model="queryConfig.hoTen" type="text" class="block p-2 px-8 text-sm border rounded-lg w-80 dark:text-white bg-background focus:outline-none focus:ring-0" placeholder="Tìm kiếm người dùng">
        <div
          v-show="queryConfig.hoTen"
          class="absolute inset-y-0 rtl:inset-r-0 end-0 flex items-center pe-3 cursor-pointer" @click="queryConfig.hoTen = ''"
        >
          <Icon name="IconClose" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <!-- isLoading -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <Loader2 class="w-8 h-8 animate-spin text-gray-500" />
      </div>
      <div v-if="state.length === 0" class="flex justify-center items-center h-64">
        <p class="text-gray-500">
          Không có người dùng nào.
        </p>
      </div>
      <div v-else class="relative">
        <div class="overflow-auto h-[calc(100vh-230px)] scrollbar bg-background">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Người dùng
                </th>
                <th scope="col" class="px-6 py-3">
                  Ngày đăng ký
                </th>
                <th scope="col" class="px-6 py-3">
                  Quyền
                </th>
                <th scope="col" class="px-6 py-3">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in state" :key="user.maNguoiDung" class="border-b hover:bg-slate-200 dark:hover:bg-slate-800">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <BaseImg
                    :src="user.anhDaiDien"
                    :alt="user.hoTen"
                    class="w-10 h-10 rounded-full"
                    aspect-ratio="square"
                  />
                  <div class="ps-3">
                    <div class="text-base font-semibold">
                      {{ user.hoTen }}
                    </div>
                    <div class="font-normal text-gray-500">
                      {{ user.email }}
                    </div>
                  </div>
                </th>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Calendar class="w-4 h-4 mr-1 text-gray-400" />
                    <span>{{ formatDate(user.ngayTao) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  {{ user.quyen === Quyen.ADMIN ? 'Quản trị viên' : 'Người dùng' }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Switch :model-value="user.trangThai === TrangThai.HOAT_DONG" @update:model-value="(value) => updateUserStatus(user.maNguoiDung, value)" />
                    <span class="ml-2 text-xs">{{ getStatusText(user.trangThai) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationTable
          :total="metaData.total"
          :current-page="queryConfig.page"
          :items-per-page="queryConfig.limit"
        />
      </div>
    </div>
  </div>
</template>
