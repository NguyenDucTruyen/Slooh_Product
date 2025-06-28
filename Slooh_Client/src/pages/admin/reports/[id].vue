<route>
  {
      meta: {
      layout: "admin",
      title: "Chi tiết báo cáo",
      }
  }
  </route>

<script setup lang="ts">
import type { BaoCao, TrangThaiBaoCao } from '@/types'
import { Button } from '@/components/ui/button'
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
import { useAsyncState } from '@vueuse/core'
import { ArrowLeft, Trash2 } from 'lucide-vue-next'

defineOptions({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const reportStore = useReportStore()
const confirmStore = useConfirmStore()

const maBaoCao = route.params.id as string

const {
  state: report,
  isLoading,
  execute: fetchReport,
} = useAsyncState(
  () => reportStore.getReportDetail(maBaoCao),
  null as BaoCao | null,
  { immediate: true },
)

function getStatusText(trangThai: TrangThaiBaoCao) {
  return trangThai === 'CHUA_XU_LY' ? 'Chưa xử lý' : 'Đã xử lý'
}

function getStatusBadgeClass(trangThai: TrangThaiBaoCao) {
  return trangThai === 'CHUA_XU_LY'
    ? 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium'
    : 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
}

async function updateReportStatus(trangThai: TrangThaiBaoCao) {
  if (!report.value)
    return

  try {
    await reportStore.updateReportStatus(report.value.maBaoCao, trangThai)
    toast({
      title: 'Thành công',
      description: 'Cập nhật trạng thái báo cáo thành công',
    })
    await fetchReport()
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi cập nhật trạng thái',
      variant: 'destructive',
    })
  }
}

async function deleteReport() {
  if (!report.value)
    return

  const result = await confirmStore.showConfirmDialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa báo cáo này không?',
    confirmText: 'Xóa',
    cancelText: 'Hủy',
  })

  if (!result)
    return

  try {
    await reportStore.deleteReport(report.value.maBaoCao)
    toast({
      title: 'Thành công',
      description: 'Xóa báo cáo thành công',
    })
    router.push('/admin/reports')
  }
  catch {
    toast({
      title: 'Lỗi',
      description: 'Có lỗi xảy ra khi xóa báo cáo',
      variant: 'destructive',
    })
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function goBack() {
  router.push('/admin/reports')
}

function goToChannel() {
  if (report.value?.phong?.maPhong) {
    router.push(`/admin/channel/${report.value.phong.kenh.maKenh}`)
  }
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="outline" size="sm" @click="goBack">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Quay lại
      </Button>
      <h1 class="text-3xl font-bold">
        Chi tiết báo cáo
      </h1>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      Đang tải...
    </div>

    <div v-else-if="!report" class="text-center py-8">
      Không tìm thấy báo cáo
    </div>

    <div v-else class="grid gap-6">
      <!-- Report Status and Actions -->
      <div class="bg-card rounded-lg border p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">
            Trạng thái báo cáo
          </h2>
          <span :class="getStatusBadgeClass(report.trangThai)">
            {{ getStatusText(report.trangThai) }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex-1">
            <label class="text-sm font-medium mb-2 block">Cập nhật trạng thái</label>
            <Select
              :model-value="report.trangThai"
              @update:model-value="(value) => updateReportStatus(value as TrangThaiBaoCao)"
            >
              <SelectTrigger class="w-48">
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
          </div>
          <Button variant="destructive" @click="deleteReport">
            <Trash2 class="w-4 h-4 mr-2" />
            Xóa báo cáo
          </Button>
        </div>
      </div>

      <!-- Report Information -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Report Details -->
        <div class="bg-card rounded-lg border p-6">
          <h2 class="text-xl font-semibold mb-4">
            Thông tin báo cáo
          </h2>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Nội dung báo cáo</label>
              <p class="whitespace-pre-wrap">
                {{ report.noiDung }}
              </p>
            </div>

            <div v-if="report.hinhAnh">
              <label class="text-sm font-medium text-muted-foreground">Hình ảnh minh chứng</label>
              <div class="mt-2">
                <img
                  :src="report.hinhAnh"
                  alt="Hình ảnh minh chứng"
                  class="max-w-full h-auto rounded-lg border"
                  @error="(e) => { if (e.target) (e.target as HTMLImageElement).style.display = 'none' }"
                >
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-muted-foreground">Ngày tạo</label>
              <p>{{ formatDate(report.ngayTao) }}</p>
            </div>
          </div>
        </div>

        <!-- User and Room Information -->
        <div class="space-y-6">
          <!-- Reported Room Information -->
          <div class="bg-card rounded-lg border p-6">
            <h2 class="text-xl font-semibold mb-4">
              Phòng bị báo cáo
            </h2>

            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Tên phòng</label>
                <p class="font-medium">
                  {{ report.phong?.tenPhong || 'N/A' }}
                </p>
              </div>

              <div>
                <label class="text-sm font-medium text-muted-foreground">Kênh</label>
                <p class="font-mono text-sm">
                  {{ report.phong?.kenh?.tenKenh || 'Phòng công khai' }}
                </p>
              </div>

              <div class="flex gap-2">
                <Button
                  v-if="report.phong?.kenh?.maKenh"
                  variant="outline"
                  size="sm"
                  @click="goToChannel"
                >
                  Xem kênh
                </Button>
                <RouterLink
                  v-else
                  to="/admin/public-room"
                >
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Xem phòng công khai
                  </Button>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Reporter Information -->
          <div class="bg-card rounded-lg border p-6">
            <h2 class="text-xl font-semibold mb-4">
              Người báo cáo
            </h2>

            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Họ tên</label>
                <p class="font-medium">
                  {{ report.nguoiDung?.hoTen || 'N/A' }}
                </p>
              </div>

              <div>
                <label class="text-sm font-medium text-muted-foreground">Email</label>
                <p>{{ report.nguoiDung?.email || 'N/A' }}</p>
              </div>

              <div v-if="report.nguoiDung?.anhDaiDien">
                <label class="text-sm font-medium text-muted-foreground">Ảnh đại diện</label>
                <div class="mt-2">
                  <img
                    :src="report.nguoiDung.anhDaiDien"
                    alt="Ảnh đại diện"
                    class="w-16 h-16 rounded-full object-cover border"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
