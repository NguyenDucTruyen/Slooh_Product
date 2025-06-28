import type { Phong } from './entity'

export interface SessionData {
  maPhien: string
  maPin: string
  phong: Phong
}

export interface NavigateData {
  trangIndex: number
}

export interface QuestionStartedData {
  trangIndex: number
}

export interface MemberJoinedData {
  tenThanhVien: string
  maThanhVienPhien: string
  anhDaiDien?: string
  isUser?: boolean
  isHost?: boolean
}

export interface MemberLeftData {
  maThanhVienPhien: string
}

export interface AnswerSubmittedData {
  maThanhVienPhien: string
  correct?: boolean
}

export type LeaderboardData = { rank: number, tenThanhVien: string, anhDaiDien: string, tongDiem: number, isUser: boolean, maThanhVienPhien: string }[]

export interface SubmitAnswerPayload {
  maLuaChon: string | string[]
  thoiGian: number
}

export interface JoinSessionPayload {
  maPin: string
  tenThanhVien: string
}

export interface CreateSessionPayload {
  maPhong: string
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export enum SocketEvent {
  // Session events
  CREATE_PHIEN = 'phien:create',
  JOIN_PHIEN = 'phien:join',
  LEAVE_PHIEN = 'phien:leave',
  END_PHIEN = 'phien:end',

  // Navigation events
  NAVIGATE = 'phien:navigate',
  NAVIGATED = 'phien:navigated',

  // Question events
  START_QUESTION = 'phien:startQuestion',
  QUESTION_STARTED = 'phien:questionStarted',
  SUBMIT_ANSWER = 'phien:submitAnswer',
  ANSWER_SUBMITTED = 'phien:answerSubmitted',

  // Leaderboard events
  SHOW_LEADERBOARD = 'phien:showLeaderboard',
  LEADERBOARD = 'phien:leaderboard',

  // Member events
  MEMBER_JOINED = 'phien:memberJoined',
  MEMBER_LEFT = 'phien:memberLeft',

  // Status events
  STARTED = 'phien:started',
  ENDED = 'phien:ended',

  // System events
  ERROR = 'error',
  DISCONNECT = 'disconnect',
}

// Response types
export interface BaseResponse {
  success: boolean
  message?: string
}

export interface CreateSessionResponse extends BaseResponse {
  data?: {
    maPhien: string
    maPin: string
  }
}

export interface JoinSessionResponse extends BaseResponse {
  data: {
    isHost: boolean
    maPhien: string
    maThanhVienPhien: string
    phong: Phong
  }
}

export interface SubmitAnswerResponse extends BaseResponse {
  data: {
    correct?: boolean
  }
}

// State types
export interface SessionState {
  isHost: boolean
  currentPage: number
  maPhien?: string
  maPin?: string
  maThanhVienPhien?: string
  members: Member[]
  leaderboard: LeaderboardData // TODO: Type this properly
  finalLeaderboard: any[] // TODO: Type this properly
}

export interface QuestionState {
  isActive: boolean
  trangIndex: number
  startTime: number
}

export interface Member {
  maThanhVienPhien: string
  tenThanhVien: string
  anhDaiDien?: string
  isUser?: boolean
}
