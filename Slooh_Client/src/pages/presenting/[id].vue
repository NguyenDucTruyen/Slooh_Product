<route>
{
  meta: {
    layout: "session",
    title: "Trình chiếu - Chủ kênh",
    requiresAuth: true
  }
}
</route>

<script setup lang="ts">
import Leaderboard from '@/components/app/room/presenting/Leaderboard.vue'
import Presenting from '@/components/app/room/presenting/Presenting.vue'
import BaseImg from '@/components/common/BaseImg.vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { useRoomStore } from '@/stores/room'
import { useSessionStore } from '@/stores/session'
import { type LeaderboardData, LoaiSlide } from '@/types'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const router = useRouter()
const route = useRoute()
const session = useSessionStore()
const roomStore = useRoomStore()

// Get room ID from route params
const roomId = route.params.id as string

// State
const isConnecting = ref(false)
const isSessionActive = ref(false)
const isSessionError = ref(false)
const showQRDialog = ref(false)
const showLeaderboardDialog = ref(false)
const roomData = ref<any>(null)
const qrcode = ref()

// Check if user is channel owner (placeholder - implement actual check)
const isChannelOwner = computed(() => {
  // You'll need to implement this check based on your room/channel structure
  return true
})

// Computed properties (defined early to avoid hoisting issues)
const currentSlide = computed(() => {
  if (!roomData.value?.trangs)
    return null
  return roomData.value.trangs[session.sessionData.currentPage]
})

const totalSlides = computed(() => roomData.value?.trangs?.length || 0)
const sessionPin = computed(() => session.sessionData.maPin)
const isConnected = computed(() => session.isConnected)

const isCurrentPageQuestion = computed(() => {
  return currentSlide.value?.loaiTrang === LoaiSlide.CAU_HOI
})

// Redirect if not authorized
if (!isChannelOwner.value) {
  router.push({ name: 'index' })
}

// Load room data and create session when component mounts
onMounted(async () => {
  try {
    isConnecting.value = true

    // Load room data first
    roomData.value = await roomStore.getRoomDetail(roomId)

    // Get access token from localStorage
    const accessToken = localStorage.getItem('Slooh_AccessToken')

    // Initialize socket connection
    session.initializeSocket(accessToken || undefined)

    // Wait for socket connection
    await new Promise((resolve) => {
      const checkConnection = () => {
        if (session.isConnected) {
          resolve(void 0)
        }
        else {
          setTimeout(checkConnection, 100)
        }
      }
      checkConnection()
    })

    // Create session for this room
    await session.createSession(roomId)
    const url = `${import.meta.env.VITE_API_URL}/session/${session.sessionData.maPhien}`
    qrcode.value = useQRCode(url, {
      size: 256,
      margin: 1,
      errorCorrectionLevel: 'H',
    })
    // isSessionActive.value = true
  }
  catch (error: any) {
    isSessionError.value = true
    console.error('Failed to create session:', error)
  }
  finally {
    isConnecting.value = false
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (isSessionActive.value) {
    session.endSession()
  }
  session.disconnect()
})

// Navigation methods
function navigateToPage(pageIndex: number) {
  try {
    session.navigateToPage(pageIndex)
  }
  catch (error: any) {
    toast({
      title: 'Lỗi điều hướng',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

function startQuestion() {
  if (!isCurrentPageQuestion.value) {
    toast({
      title: 'Không thể bắt đầu',
      description: 'Trang hiện tại không phải là câu hỏi',
      variant: 'destructive',
    })
    return
  }

  try {
    session.startQuestion(session.sessionData.currentPage)
  }
  catch (error: any) {
    toast({
      title: 'Lỗi bắt đầu câu hỏi',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

function showLeaderboard() {
  try {
    showLeaderboardDialog.value = true
    session.showLeaderboard()
  }
  catch (error: any) {
    toast({
      title: 'Lỗi hiển thị bảng xếp hạng',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

async function endSession() {
  try {
    await session.endSession()
    isSessionActive.value = false
    toast({
      title: 'Kết thúc phiên',
      description: 'Phiên trình chiếu đã kết thúc',
    })
    if (roomData.value.maKenh) {
      // If this is a channel session, redirect to channel page
      router.push({ name: 'channels-id', params: { id: roomData.value.maKenh } })
    }
    else {
      router.push({ name: 'PublicRoom' })
    }
  }
  catch (error: any) {
    toast({
      title: 'Lỗi kết thúc phiên',
      description: error?.message || 'Có lỗi xảy ra',
      variant: 'destructive',
    })
  }
}

// Copy PIN to clipboard
async function copyPin() {
  if (session.sessionData.maPin) {
    try {
      await navigator.clipboard.writeText(session.sessionData.maPin)
      toast({
        title: 'Đã sao chép',
        variant: 'info',
        description: 'PIN đã được sao chép vào clipboard',
      })
    }
    catch {
      toast({
        title: 'Lỗi sao chép',
        description: 'Không thể sao chép PIN',
        variant: 'destructive',
      })
    }
  }
}
</script>

<template>
  <div class="min-h-screen p-4 w-full justify-center">
    <div class="h-full overflow-hidden p-0 grid">
      <!-- Loading State -->
      <div v-if="isConnecting" class="text-center p-12 bg-card">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p class="text-foreground text-xl">
          Đang kết nối và tạo phiên trình chiếu...
        </p>
      </div>
      <template
        v-else
      >
        <template v-if="!isSessionActive">
          <div class="flex gap-4 justify-center">
            <div class="space-y-2 p-4 rounded bg-card mb-4 text-center px-12 inline-block">
              <div
                v-if="roomData?.kenh"
                class="text-primary font-medium text-2xl"
              >
                Kênh: {{ roomData?.kenh.tenKenh }}
              </div>
              <div class="text-primary font-semibold text-3xl">
                {{ roomData?.tenPhong }}
              </div>
              <Icon name="IconSuccess" class="w-16 h-16 text-success mx-auto" />
              <h2 class="text-xl font-semibold">
                Phiên trình chiếu đã được tạo thành công
              </h2>
              <p class="text-foreground">
                {{ session.memberCount }} thành viên đã tham gia
              </p>
              <div class="flex gap-4 justify-center">
                <Button
                  variant="destructive"
                  @click="endSession"
                >
                  Kết thúc phiên
                </Button>
                <Button
                  @click="() => {
                    isSessionActive = true
                    session.navigateToPage(0)
                  }"
                >
                  Bắt đầu trình chiếu
                </Button>
              </div>
            </div>

            <div
              v-if="!roomData?.kenh"
              class="grid gap-4 mb-4"
            >
              <div class="flex flex-col items-center gap-2 bg-card p-4 rounded">
                <span class="text-foreground text-4xl">Mã PIN:</span>
                <button
                  variant="outline"
                  size="sm"
                  class="font-mono text-5xl font-bold"
                  @click="copyPin"
                >
                  {{ sessionPin }}
                </button>
              </div>

              <Dialog v-model:open="showQRDialog">
                <DialogTrigger as-child>
                  <div class="flex flex-col items-center gap-2 bg-card rounded overflow-hidden relative" @click="showQRDialog = true">
                    <div class="flex absolute inset-0 w-full h-full items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Icon
                        name="IconZoomOut" class="w-12 h-12 text-background"
                      />
                    </div>
                    <img
                      :src="qrcode?.value"
                      aspect-ratio="square"
                    >
                  </div>
                </DialogTrigger>
                <DialogContent class="max-w-2xl max-h-fit">
                  <DialogHeader>
                    <DialogTitle class="text-center text-3xl">
                      Mã QR
                    </DialogTitle>
                    <Separator class="my-2 h-[2px] bg-slate-600" />
                  </DialogHeader>
                  <div class="flex flex-col items-center gap-2 bg-card rounded relative">
                    <img
                      :src="qrcode?.value"
                      class="h-[400px]"
                      aspect-ratio="square"
                    >
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div class="flex gap-4 justify-center">
            <template
              v-for="(member, index) in session.sessionData.members"
              :key="index"
            >
              <div class="flex items-center gap-2 bg-card px-4 py-2 rounded">
                <BaseImg
                  :src="member.anhDaiDien"
                  :alt="member.tenThanhVien"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div class="text-foreground text-lg font-semibold max-w-32 truncate">
                  {{ member.tenThanhVien }}
                </div>
              </div>
            </template>
          </div>
        </template>

        <Leaderboard
          v-model:is-open="showLeaderboardDialog"
          :leaderboard="session.sessionData.leaderboard || []"
        />

        <!-- Main Content -->
        <Presenting
          v-if="isSessionActive && currentSlide"
          :slide="currentSlide"
          :current="session.sessionData.currentPage"
          :length="totalSlides"
          :ten-phong="roomData?.tenPhong"
          :pin="sessionPin || ''"
          :member-count="session.memberCount"
          :is-connected="isConnected"
          :qr-code="qrcode?.value"
          @next="navigateToPage(session.sessionData.currentPage + 1)"
          @previous="navigateToPage(session.sessionData.currentPage - 1)"
          @exit="endSession"
          @start-question="startQuestion"
          @view-leaderboard="showLeaderboard"
        />
        <div v-else-if="isSessionError" class="text-center py-12">
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-2">
            Không thể tạo phiên trình chiếu
          </h2>
          <p class="text-gray-600 mb-4">
            Đã xảy ra lỗi khi kết nối hoặc tạo phiên trình chiếu. Vui lòng thử lại sau.
          </p>
          <Button variant="outline" @click="router.go(0)">
            Thử lại
          </Button>
        </div>
      </template>
      <!-- Error State -->
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.625;
}
</style>
