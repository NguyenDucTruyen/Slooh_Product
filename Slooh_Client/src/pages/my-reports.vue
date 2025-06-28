<script setup lang="ts">
import type { BaoCao } from '@/types'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useReportStore } from '@/stores/report'
import { useAsyncState } from '@vueuse/core'
import { Eye } from 'lucide-vue-next'

const reportStore = useReportStore()

const {
  state: reports,
  isLoading,
} = useAsyncState(
  () => reportStore.getMyReports(),
  [] as BaoCao[],
  { immediate: true },
)

function getStatusText(trangThai: string) {
  return trangThai === 'CHUA_XU_LY' ? 'Chưa xử lý' : 'Đã xử lý'
}

function getStatusBadgeClass(trangThai: string) {
  return trangThai === 'CHUA_XU_LY'
    ? 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
    : 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
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

function viewRoom(maPhong: string) {
  if (maPhong) {
    useRouter().push(`/rooms/${maPhong}`)
  }
}
</script>

<template>
  <PageContainer title="Báo cáo của tôi" description="Danh sách các báo cáo bạn đã gửi">
    <div class="space-y-6">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        Đang tải...
      </div>

      <!-- Empty state -->
      <div v-else-if="reports.length === 0" class="text-center py-12">
        <div class="text-muted-foreground">
          <h3 class="text-lg font-medium mb-2">
            Chưa có báo cáo nào
          </h3>
          <p>Bạn chưa gửi báo cáo nào cho hệ thống.</p>
        </div>
      </div>

      <!-- Reports list -->
      <div v-else class="space-y-4">
        <div
          v-for="report in reports"
          :key="report.maBaoCao"
          class="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-3">
              <!-- Report content -->
              <div>
                <h3 class="font-medium text-lg mb-2">
                  Báo cáo phòng: {{ report.phong?.tenPhong || 'N/A' }}
                </h3>
                <p class="text-muted-foreground">
                  {{ report.noiDung }}
                </p>
              </div>

              <!-- Report metadata -->
              <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Ngày gửi: {{ formatDate(report.ngayTao) }}</span>
                <span>•</span>
                <span :class="getStatusBadgeClass(report.trangThai)">
                  {{ getStatusText(report.trangThai) }}
                </span>
                <span v-if="report.ngayCapNhat !== report.ngayTao">
                  • Cập nhật: {{ formatDate(report.ngayCapNhat) }}
                </span>
              </div>

              <!-- Evidence image -->
              <div v-if="report.hinhAnh" class="mt-3">
                <p class="text-sm font-medium mb-2">
                  Hình ảnh minh chứng:
                </p>
                <img
                  :src="report.hinhAnh"
                  alt="Hình ảnh minh chứng"
                  class="max-w-xs h-auto rounded border"
                  @error="(e) => { if (e.target) (e.target as HTMLImageElement).style.display = 'none' }"
                >
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2">
              <Button
                v-if="report.phong?.maPhong"
                variant="outline"
                size="sm"
                @click="viewRoom(report.phong.maPhong)"
              >
                <Eye class="w-4 h-4 mr-2" />
                Xem phòng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>
