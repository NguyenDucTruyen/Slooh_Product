import type {
  AnswerSubmittedData,
  BaseResponse,
  CreateSessionPayload,
  CreateSessionResponse,
  JoinSessionPayload,
  JoinSessionResponse,
  LeaderboardData,
  Member,
  MemberJoinedData,
  MemberLeftData,
  NavigateData,
  QuestionStartedData,
  QuestionState,
  SessionData,
  SessionState,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from '@/types/session'
import type { Socket } from 'socket.io-client'
import { useSocketIO } from '@/service/socket'
import { SocketEvent } from '@/types/session'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  // Connection state
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const accessToken = ref<string | undefined>()
  const error = ref<string | null>(null)
  const loading = ref(false)

  // Session state
  const sessionData = ref<SessionState>({
    isHost: false,
    currentPage: 0,
    members: [],
    leaderboard: [] as unknown as LeaderboardData,
    finalLeaderboard: [],
  })

  // Question state
  const questionState = ref<QuestionState>({
    isActive: false,
    trangIndex: 0,
    startTime: 0,
  })

  // Computed properties
  const isInSession = computed(() => !!(sessionData.value.maPhien || sessionData.value.maThanhVienPhien))
  const memberCount = computed(() => sessionData.value.members.length)

  // Socket event handlers setup
  const setupSocketListeners = () => {
    if (!socket.value)
      return
    // Connection events
    socket.value.on('connect', () => {
      isConnected.value = true
      error.value = null
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
    })

    socket.value.on('error', (err: Error) => {
      error.value = err.message || 'Socket error occurred'
    })

    // Session events
    socket.value.on(SocketEvent.STARTED, (data: SessionData) => {
      sessionData.value.maPhien = data.maPhien
      sessionData.value.maPin = data.maPin
    })

    socket.value.on(SocketEvent.MEMBER_JOINED, (data: MemberJoinedData) => {
      const newMember: Member = {
        maThanhVienPhien: data.maThanhVienPhien,
        tenThanhVien: data.tenThanhVien,
        anhDaiDien: data.anhDaiDien || '',
        isUser: data.isUser || false,
      }

      const existingIndex = sessionData.value.members.findIndex(
        member => member.maThanhVienPhien === data.maThanhVienPhien,
      )

      if (existingIndex === -1) {
        sessionData.value.members.push(newMember)
      }
      else {
        sessionData.value.members[existingIndex] = newMember
      }
      // sessionData.value.leaderboard = sessionData.value.leaderboard.filter(
      //   member => member.maThanhVienPhien !== data.maThanhVienPhien,
      // )
      sessionData.value.leaderboard.push({
        maThanhVienPhien: data.maThanhVienPhien,
        tenThanhVien: data.tenThanhVien,
        anhDaiDien: data.anhDaiDien || '',
        tongDiem: 0,
        rank: sessionData.value.leaderboard.length + 1,
        isUser: data.isUser || false,
      })
    })

    socket.value.on(SocketEvent.MEMBER_LEFT, (data: MemberLeftData) => {
      sessionData.value.members = sessionData.value.members.filter(
        member => member.maThanhVienPhien !== data.maThanhVienPhien,
      )
      sessionData.value.leaderboard = sessionData.value.leaderboard.filter(
        member => member.maThanhVienPhien !== data.maThanhVienPhien,
      )
    })

    socket.value.on(SocketEvent.NAVIGATED, (data: NavigateData) => {
      sessionData.value.currentPage = data.trangIndex
    })

    socket.value.on(SocketEvent.QUESTION_STARTED, (data: QuestionStartedData) => {
      questionState.value = {
        isActive: true,
        trangIndex: data.trangIndex,
        startTime: Date.now(),
      }
    })

    socket.value.on(SocketEvent.ANSWER_SUBMITTED, (data: AnswerSubmittedData) => {
      console.log('Answer submitted:', data)
      if (data.correct !== undefined) {
        // Handle correct/incorrect answer feedback if needed
      }
    })

    socket.value.on(SocketEvent.LEADERBOARD, (data: LeaderboardData) => {
      setTimeout(() => {
        sessionData.value.leaderboard = data
      }, 700)
    })

    socket.value.on(SocketEvent.ENDED, (data: LeaderboardData) => {
      sessionData.value.finalLeaderboard = data
      questionState.value.isActive = false
    })
  }

  // Socket initialization
  const initializeSocket = (token?: string) => {
    if (socket.value)
      socket.value.disconnect()

    accessToken.value = token
    socket.value = useSocketIO()

    if (token)
      socket.value.auth = { token }

    setupSocketListeners()
  }

  // State reset
  const resetSessionData = () => {
    sessionData.value = {
      isHost: false,
      currentPage: 0,
      members: [],
      leaderboard: [] as unknown as LeaderboardData,
      finalLeaderboard: [],
    }
    questionState.value = {
      isActive: false,
      trangIndex: 0,
      startTime: 0,
    }
  }

  // Host actions
  const createSession = async (maPhong: string): Promise<CreateSessionResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const payload: CreateSessionPayload = { maPhong }
      const response = await new Promise<CreateSessionResponse>((resolve, reject) => {
        socket.value!.emit(SocketEvent.CREATE_PHIEN, payload, (response: CreateSessionResponse) => {
          if (response.success)
            resolve(response)
          else
            reject(new Error(response.message))
        })
      })

      if (response.success && response.data) {
        sessionData.value.isHost = true
        sessionData.value.maPhien = response.data.maPhien
        sessionData.value.maPin = response.data.maPin
      }

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const navigateToPage = (trangIndex: number) => {
    if (!socket.value)
      return
    const payload: NavigateData = { trangIndex }
    socket.value.emit(SocketEvent.NAVIGATE, payload)
  }

  const startQuestion = (trangIndex: number) => {
    if (!socket.value)
      return
    const payload: QuestionStartedData = { trangIndex }
    socket.value.emit(SocketEvent.START_QUESTION, payload)
  }

  const showLeaderboard = () => {
    if (!socket.value)
      return
    socket.value.emit(SocketEvent.SHOW_LEADERBOARD)
  }

  // Participant actions
  const joinSession = async (maPin: string, tenThanhVien: string): Promise<JoinSessionResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const payload: JoinSessionPayload = { maPin, tenThanhVien: tenThanhVien || '' }
      const response = await new Promise<JoinSessionResponse>((resolve, reject) => {
        socket.value!.emit(SocketEvent.JOIN_PHIEN, payload, (response: JoinSessionResponse) => {
          if (response.success)
            resolve(response)
          else
            reject(new Error(response.message))
        })
      })

      if (response.success) {
        sessionData.value.isHost = false
        sessionData.value.maPin = maPin
        sessionData.value.maThanhVienPhien = response.data.maThanhVienPhien
      }

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to join session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const submitAnswer = async (maLuaChon: string | string[], thoiGian: number): Promise<SubmitAnswerResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const payload: SubmitAnswerPayload = { maLuaChon, thoiGian }
      const response = await new Promise<SubmitAnswerResponse>((resolve, reject) => {
        socket.value!.emit(SocketEvent.SUBMIT_ANSWER, payload, (response: SubmitAnswerResponse) => {
          if (response.success)
            resolve(response)
          else
            reject(new Error(response.message))
        })
      })

      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit answer'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const leaveSession = async (): Promise<BaseResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const response = await new Promise<BaseResponse>((resolve, reject) => {
        socket.value!.emit(SocketEvent.LEAVE_PHIEN, (response: BaseResponse) => {
          if (response.success)
            resolve(response)
          else
            reject(new Error(response.message))
        })
      })

      resetSessionData()
      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to leave session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const endSession = async (): Promise<BaseResponse> => {
    if (!socket.value)
      throw new Error('Socket not initialized')

    loading.value = true
    error.value = null

    try {
      const response = await new Promise<BaseResponse>((resolve, reject) => {
        socket.value!.emit(SocketEvent.END_PHIEN, (response: BaseResponse) => {
          if (response.success)
            resolve(response)
          else
            reject(new Error(response.message))
        })
      })

      resetSessionData()
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      return response
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to end session'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // Utility actions
  const clearError = () => {
    error.value = null
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
    isConnected.value = false
    resetSessionData()
  }

  // Initialize socket on store creation
  initializeSocket()

  return {
    // State
    socket,
    isConnected,
    sessionData,
    questionState,
    error,
    loading,

    // Computed
    isInSession,
    memberCount,

    // Actions
    initializeSocket,
    createSession,
    navigateToPage,
    startQuestion,
    showLeaderboard,
    endSession,
    joinSession,
    submitAnswer,
    leaveSession,
    clearError,
    disconnect,
  }
})
