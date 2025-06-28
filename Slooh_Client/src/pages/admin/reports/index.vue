<route>
  {
      meta: {
      layout: "admin",
      title: "Báo cáo",
      }
  }
  </route>

<script setup lang="ts">
import type { BaoCao, TrangThaiBaoCao } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { useConfirmStore } from '@/stores/confirm'
import { useReportStore } from '@/stores/report'
import { useAsyncState, useDebounceFn } from '@vueuse/core'
import { ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-vue-next'

defineOptions({
  layout: 'admin',
})

const router = useRouter()
const reportStore = useReportStore()
const confirmStore = useConfirmStore()

const searchValue = ref('')
const statusFilter = ref<TrangThaiBaoCao | 'ALL'>('ALL')
const currentPage = ref(1)
const pageSize = ref(10)

const query = computed(() => ({
  page: currentPage.value,
  limit: pageSize.value,
  search: searchValue.value || undefined,
  trangThai: statusFilter.value !== 'ALL' ? statusFilter.value : undefined,
}))

const {
  state: reportData,
  isLoading,
  execute: fetchReports,
} = useAsyncState(
  () => reportStore.getReports(query.value),
  { reports: [], totalCount: 0, totalPages: 0, currentPage: 1 },
  { immediate: true },
)

const { state: stats, execute: fetchStats } = useAsyncState(
  () => reportStore.getReportStats(),
  { total: 0, chuaXuLy: 0, daXuLy: 0 },
  { immediate: true },
)

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchReports()
}, 300)

watch(searchValue, debouncedSearch)

watch([statusFilter, currentPage], () => {
  console.log('query.value', query.value)
  fetchReports()
})

function getStatusBadgeClass(trangThai: TrangThaiBaoCao) {
  return trangThai === 'CHUA_XU_LY'
    ? 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
    : 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
}

function getStatusText(trangThai: TrangThaiBaoCao) {
  return trangThai === 'CHUA_XU_LY' ? 'Chưa xử lý' : 'Đã xử lý'
}

async function updateReportStatus(maBaoCao: string, trangThai: TrangThaiBaoCao) {
  try {
    await reportStore.updateReportStatus(maBaoCao, trangThai)
    toast({
      title: 'Thành công',
      description: 'Cập nhật trạng thái báo cáo thành công',
    })
    await fetchReports()
    await fetchStats()
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi cập nhật trạng thái',
      variant: 'destructive',
    })
  }
}

async function deleteReport(maBaoCao: string) {
  const result = await confirmStore.showConfirmDialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa báo cáo này không?',
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })

  if (!result)
    return

  try {
    await reportStore.deleteReport(maBaoCao)
    toast({
      title: 'Thành công',
      description: 'Xóa báo cáo thành công',
    })
    await fetchReports()
    await fetchStats()
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi xóa báo cáo',
      variant: 'destructive',
    })
  }
}

function viewReportDetail(maBaoCao: string) {
  // Navigate to report detail page
  router.push(`/admin/reports/${maBaoCao}`)
}

function nextPage() {
  if (currentPage.value < reportData.value.totalPages) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">
        Quản lý báo cáo
      </h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-card p-4 rounded-lg border">
        <h3 class="text-lg font-semibold">
          Tổng số báo cáo
        </h3>
        <p class="text-3xl font-bold text-blue-600">
          {{ stats.total }}
        </p>
      </div>
      <div class="bg-card p-4 rounded-lg border">
        <h3 class="text-lg font-semibold">
          Chưa xử lý
        </h3>
        <p class="text-3xl font-bold text-red-600">
          {{ stats.chuaXuLy }}
        </p>
      </div>
      <div class="bg-card p-4 rounded-lg border">
        <h3 class="text-lg font-semibold">
          Đã xử lý
        </h3>
        <p class="text-3xl font-bold text-green-600">
          {{ stats.daXuLy }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 items-center">
      <div class="flex-1">
        <Label for="search">Tìm kiếm</Label>
        <Input
          id="search"
          v-model="searchValue"
          placeholder="Tìm kiếm theo nội dung, tên phòng..."
          class="w-full"
        />
      </div>
      <div class="w-full sm:w-48">
        <Label for="status">Trạng thái</Label>
        <Select v-model="statusFilter">
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              Tất cả
            </SelectItem>
            <SelectItem value="CHUA_XU_LY">
              Chưa xử lý
            </SelectItem>
            <SelectItem value="DA_XU_LY">
              Đã xử lý
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Reports Table -->
    <div class="bg-card rounded-lg border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted">
          <tr>
            <th class="text-left p-4 font-medium">
              Báo cáo
            </th>
            <th class="text-left p-4 font-medium">
              Phòng
            </th>
            <th class="text-left p-4 font-medium">
              Người báo cáo
            </th>
            <th class="text-left p-4 font-medium">
              Trạng thái
            </th>
            <th class="text-left p-4 font-medium">
              Ngày tạo
            </th>
            <th class="text-left p-4 font-medium">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" class="text-center py-8">
              Đang tải...
            </td>
          </tr>
          <tr v-else-if="reportData.reports.length === 0">
            <td colspan="6" class="text-center py-8 text-muted-foreground">
              Không có báo cáo nào
            </td>
          </tr>
          <tr v-for="report in reportData.reports" v-else :key="report.maBaoCao" class="border-t">
            <td class="p-4">
              <div class="max-w-xs">
                <p class="truncate" :title="report.noiDung">
                  {{ report.noiDung }}
                </p>
              </div>
            </td>
            <td class="p-4">
              <div class="font-medium">
                {{ report.phong?.tenPhong || 'N/A' }}
              </div>
            </td>
            <td class="p-4">
              <div class="font-medium">
                {{ report.nguoiDung?.hoTen || 'N/A' }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ report.nguoiDung?.email || 'N/A' }}
              </div>
            </td>
            <td class="p-4 min-w-[104px]">
              <span :class="getStatusBadgeClass(report.trangThai)">
                {{ getStatusText(report.trangThai) }}
              </span>
            </td>
            <td class="p-4">
              {{ formatDate(report.ngayTao) }}
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  @click="viewReportDetail(report.maBaoCao)"
                >
                  <Eye class="w-4 h-4" />
                </Button>
                <Select
                  :model-value="report.trangThai"
                  @update:model-value="(value) => updateReportStatus(report.maBaoCao, value as TrangThaiBaoCao)"
                >
                  <SelectTrigger class="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHUA_XU_LY">
                      Chưa xử lý
                    </SelectItem>
                    <SelectItem value="DA_XU_LY">
                      Đã xử lý
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="destructive"
                  @click="deleteReport(report.maBaoCao)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-center">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage <= 1"
          @click="prevPage"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <span class="text-sm font-medium">
          Trang {{ currentPage }} / {{ reportData.totalPages || 1 }}
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage >= reportData.totalPages"
          @click="nextPage"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
