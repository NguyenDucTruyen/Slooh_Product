<route>
{
  meta: {
    layout: "session",
    title: "Phiên trình chiếu - Thành viên"
  }
}
</route>

<script setup lang="ts">
import type { Phong, Slide } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/toast'
import { useConfirmStore } from '@/stores/confirm'
import { usePhienStore } from '@/stores/phien'
import { useSessionStore } from '@/stores/session'
import { LoaiCauTraLoi, LoaiSlide, SocketEvent } from '@/types'
import { useAsyncState } from '@vueuse/core'

const LOAITRALOI = {
  [LoaiCauTraLoi.SINGLE_SELECT]: 'Trắc nghiệm một lựa chọn',
  [LoaiCauTraLoi.MULTI_SELECT]: 'Trắc nghiệm nhiều lựa chọn',
  [LoaiCauTraLoi.TRUE_FALSE]: 'Đúng/Sai',
} as const

const router = useRouter()
const route = useRoute()
const session = useSessionStore()
const phienStore = usePhienStore()
const confirmStore = useConfirmStore()

// State
const currentSlide = ref<Slide | null>(null)
const isConnecting = ref(false)
const isSessionError = ref(false)
const showNotice = ref(true)
const questionStarted = ref(false)
const roomData = ref<Phong | null>(null)
const showOption = ref(false)
const countDownShowOption = ref(5)
const countDownEndQuestion = ref(10) // Add countdown for question end

const startAnswerTime = ref(0)
const hasSubmitted = ref(false)
const answerTime = ref(0)

const isReportModalOpen = ref(false)
const selectedRoomForReport = ref<{ maPhong: string, tenPhong: string } | null>(null)

let intervalShowOptionId: any = null
let intervalEndQuestionId: any = null
// Get pin from route params
const id = route.params.id as string
const { isLoading } = useAsyncState(async () => {
  const res = await phienStore.getPinByRoomId(id)
  const maPin = res.data.maPin
  isConnecting.value = true // Get session data by PIN

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

  // Join the session
  const response = await session.joinSession(maPin, '')
  roomData.value = response.data.phong
  isConnecting.value = false

  session.socket?.on(SocketEvent.NAVIGATED, ({ trangIndex }) => {
    console.log('Navigated to trangIndex:', trangIndex, roomData.value)
    // Update current slide
    if (roomData.value?.trangs && trangIndex >= 0 && trangIndex < roomData.value.trangs.length) {
      currentSlide.value = roomData.value.trangs[trangIndex]
    }

    // Reset states
    if (currentSlide.value?.loaiTrang === LoaiSlide.NOI_DUNG) {
      showNotice.value = true
      questionStarted.value = false
    }
  })

  // Listen for question start events
  session.socket?.on(SocketEvent.QUESTION_STARTED, () => {
    if (currentSlide.value?.loaiTrang === LoaiSlide.CAU_HOI) {
      questionStarted.value = true
      showNotice.value = false
    }
  })

  // Reset everything when session ends
  session.socket?.on(SocketEvent.ENDED, () => {
    router.push(`/joinedchannels/${roomData.value?.maKenh}`)
  })
}, null, { immediate: true, onError: () => {
  isSessionError.value = true
  isConnecting.value = false
} })

onUnmounted(() => {
  session.disconnect()
})
function clearIntervalShowOption() {
  if (intervalShowOptionId) {
    clearInterval(intervalShowOptionId)
    intervalShowOptionId = null
  }
}

function clearIntervalEndQuestion() {
  if (intervalEndQuestionId) {
    clearInterval(intervalEndQuestionId)
    intervalEndQuestionId = null
  }
}

function handleSubmitAnswer() {
  if (hasSubmitted.value || !currentSlide.value)
    return

  const selectedIds = currentSlide.value.luaChon?.reduce((acc, option) => {
    if (option.isSelected) {
      acc.push(option.maLuaChon || '')
    }
    return acc
  }, [] as string[]) || []

  if (selectedIds.length === 0)
    return

  // Just record the submission time and mark as submitted
  hasSubmitted.value = true
  answerTime.value = Math.max(0, countDownEndQuestion.value)

  toast({
    title: 'Đã ghi nhận câu trả lời',
    description: 'Kết quả sẽ được hiển thị khi hết thời gian',
    variant: 'info',
    duration: 3000,
  })
}

function handleSubmitFinalAnswer() {
  if (!currentSlide.value)
    return

  const selectedIds = currentSlide.value.luaChon?.reduce((acc, option) => {
    if (option.isSelected) {
      acc.push(option.maLuaChon || '')
    }
    return acc
  }, [] as string[]) || []

  // Use the recorded answer time if submitted, otherwise 0
  const timeRemaining = hasSubmitted.value ? answerTime.value : 0

  session.submitAnswer(
    currentSlide.value.loaiCauTraLoi === LoaiCauTraLoi.MULTI_SELECT ? selectedIds : selectedIds[0] || '',
    timeRemaining,
  ).then((res) => {
    toast({
      title: 'Kết quả câu trả lời',
      description: `${res.data.correct ? 'Câu trả lời đúng!' : 'Câu trả lời sai!'}`,
      variant: res.data.correct ? 'default' : 'destructive',
      duration: 3000,
    })
  }).catch((err) => {
    console.error('Error submitting answer:', err)
    toast({
      title: 'Lỗi gửi câu trả lời',
      description: 'Đã xảy ra lỗi khi gửi câu trả lời',
      variant: 'destructive',
    })
  })
}

function handleOptionSelect(index: number) {
  if (!currentSlide.value || !currentSlide.value.luaChon)
    return
  currentSlide.value.luaChon[index].isSelected = !currentSlide.value.luaChon[index].isSelected
  if (currentSlide.value.loaiCauTraLoi !== LoaiCauTraLoi.MULTI_SELECT) {
    currentSlide.value.luaChon.forEach((option, i) => {
      if (i !== index) {
        option.isSelected = false
      }
    })
  }
}

const hasSelectedOption = computed(() => {
  return currentSlide.value?.luaChon?.some(option => option.isSelected) || false
})

watch(currentSlide, (newValue) => {
  clearIntervalShowOption()
  clearIntervalEndQuestion()

  showOption.value = false
  hasSubmitted.value = false
  answerTime.value = 0
  countDownShowOption.value = 5
  countDownEndQuestion.value = newValue?.thoiGianGioiHan || 10

  if (newValue?.loaiTrang === LoaiSlide.CAU_HOI) {
    intervalShowOptionId = setInterval(() => {
      if (countDownShowOption.value > 1) {
        countDownShowOption.value--
      }
      else {
        clearIntervalShowOption()
        showOption.value = true
        startAnswerTime.value = Date.now() // Start tracking answer time
        countDownShowOption.value = 5

        // Start end question countdown after options are shown
        intervalEndQuestionId = setInterval(() => {
          if (countDownEndQuestion.value >= 1) {
            countDownEndQuestion.value--
          }
          else {
            handleSubmitFinalAnswer() // Submit all answers when time is up
            clearIntervalEndQuestion()
          }
        }, 1000)
      }
    }, 1000)
  }
}, { immediate: true })

onUnmounted(() => {
  clearIntervalShowOption()
  clearIntervalEndQuestion()
})
async function handleExitSession() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Thoát phiên',
    message: 'Bạn có chắc chắn muốn thoát khỏi phiên trình chiếu này?',
    confirmText: 'Thoát',
    cancelText: 'Hủy',
  })
  if (result) {
    session.disconnect()
    router.push({ name: 'JoinedChannels' })
  }
}
function handleReload() {
  window.location.reload()
}
function handleReportRoom() {
  selectedRoomForReport.value = { maPhong: roomData.value!.maPhong, tenPhong: roomData.value!.tenPhong }
  isReportModalOpen.value = true
}

function handleReportSuccess() {
  selectedRoomForReport.value = null
}
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center bg-slate-900/80">
    <Popover>
      <PopoverTrigger class="absolute top-4 left-4 z-50">
        <Button class="rounded-sm px-2" variant="secondary">
          <Icon name="IconEllipsis" class="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" class="w-40 bg-card p-0">
        <div class="flex flex-col w-full gap-1 p-1 bg-slate-300 rounded-sm">
          <Button
            variant="outline"
            @click="handleReportRoom"
          >
            Báo cáo
            <Icon name="IconReport" class="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            @click="handleReload"
          >
            Tải lại trang
          </Button>
          <Button
            variant="destructive"
            @click="handleExitSession"
          >
            Thoát phiên
          </Button>
        </div>
      </PopoverContent>
    </Popover>
    <!-- Loading state -->
    <div
      v-if="isLoading || isConnecting"
      class="text-center"
    >
      <div class="animate-spin w-8 h-8 border-4 border-background border-t-transparent rounded-full mx-auto mb-4" />
      <p class="text-lg font-medium text-background">
        Đang kết nối...
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="isSessionError"
      class="text-center space-y-4"
    >
      <Icon name="IconClose" class="w-16 h-16 text-destructive mx-auto" />
      <h2 class="text-2xl font-semibold text-background">
        Không thể tham gia phiên trình chiếu
      </h2>
      <p class="text-secondary">
        Có lỗi xảy ra khi tham gia phiên hoặc phiên không tồn tại.
      </p>
      <Button @click="router.push('/')">
        Về trang chủ
      </Button>
    </div>

    <!-- Session content -->
    <template v-else>
      <!-- Notice screen -->
      <div
        v-if="currentSlide?.loaiTrang === LoaiSlide.NOI_DUNG && showNotice"
        class="text-center space-y-6 p-6"
      >
        <h2 class="text-2xl font-semibold text-background">
          Hãy nhìn lên màn hình trình chiếu để xem nội dung
        </h2>
      </div>

      <!-- Question screen -->
      <div v-else-if="currentSlide?.loaiTrang === LoaiSlide.CAU_HOI" class="w-full h-full">
        <div v-if="!showOption" class="flex flex-col h-full justify-center items-center p-6">
          <h2
            class="text-2xl text-center font-semibold text-background mb-4"
          >
            Trả lời câu hỏi: {{ LOAITRALOI[currentSlide.loaiCauTraLoi!] }}
          </h2>
          <div
            class="mb-12 z-10 rounded-full w-24 leading-[96px] flex justify-center items-center bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 text-5xl font-semibold"
            @click="showOption = true"
          >
            {{ countDownShowOption }}
          </div>
        </div>
        <div
          v-else
          class="flex relative w-full h-full flex-col items-center justify-end p-4"
        >
          <div
            class="border-2 mb-4 right-0 z-10 rounded-full px-6 py-4 bg-primary text-2xl text-background font-semibold min-w-36 text-center"
          >
            {{ countDownEndQuestion > 0 ? `Còn ${countDownEndQuestion}s` : 'Hết giờ' }}
          </div>
          <div
            class="grid lg:grid-cols-2 gap-y-2.5 lg:gap-x-10 lg:gap-y-4 shrink-0 w-full rounded-lg"
          >
            <template v-for="(option, index) in currentSlide!.luaChon" :key="index">
              <Option
                v-model:option="currentSlide!.luaChon![index]"
                :index="index"
                :type="currentSlide!.loaiCauTraLoi"
                :show-result="countDownEndQuestion <= 0"
                @select-option="handleOptionSelect(index)"
              />
            </template>
          </div>
          <Button
            class="w-full max-w-96 py-6 text-xl mt-4"
            :disabled="!hasSelectedOption || hasSubmitted || countDownEndQuestion <= 0"
            :variant="hasSubmitted ? 'ghost' : 'default'"
            @click="handleSubmitAnswer()"
          >
            {{ hasSubmitted ? 'Đã gửi câu trả lời' : 'Gửi câu trả lời' }}
          </Button>
        </div>
      </div>
      <!-- Default slide content -->
      <div v-else class="w-full h-full flex items-center justify-center text-background text-xl font-semibold px-6 text-center">
        Vui lòng chờ chờ nội dung trình chiếu
      </div>
    </template>
  </div>
  <ReportRoomModal
    v-if="selectedRoomForReport"
    v-model:open="isReportModalOpen"
    :ma-phong="selectedRoomForReport.maPhong"
    :ten-phong="selectedRoomForReport.tenPhong"
    @success="handleReportSuccess"
  />
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
