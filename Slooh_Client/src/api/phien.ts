import type { PhienTrinhChieu, Phong, ThanhVienPhienTrinhChieu } from '@/types'
import type { AxiosResponse } from 'axios'
import { $delete, $get, $post } from './axios'

export interface PhienResponse {
  maPhien: string
  tenPhong: string
  isPublic: boolean
  soThanhVien: number
  soTrang: number
  // Add other session properties as needed
}

export interface CreatePhien {
  maPhien: string
  maPin: string
  phong: Phong
}

export interface CreatePhienResponse {
  data: CreatePhien
}

export interface DetailPhien extends PhienTrinhChieu {
  phong: Phong
  thanhVien: ThanhVienPhienTrinhChieu[]
}

export interface DetailPhienResponse {
  data: DetailPhien
}
export interface GetPinByRoomIdResponse {
  data: {
    maPin: string
  }
}

export interface LeaderboardResponse {
  // Add leaderboard type definition as needed
  // Example:
  players: Array<{
    id: string
    score: number
    name: string
  }>
}

export const phienApi = {
  // Create new presentation session
  createPhien: (maPhong: string): Promise<AxiosResponse<CreatePhienResponse>> => {
    return $post('/phien', { maPhong })
  },

  // Get session by PIN
  getPhienByPin: (maPin: string): Promise<AxiosResponse<PhienResponse>> => {
    return $get(`/phien/pin/${maPin}`)
  },

  // Get session details
  getPhienById: (maPhien: string): Promise<AxiosResponse<DetailPhienResponse>> => {
    return $get(`/phien/${maPhien}`)
  },

  // Get leaderboard
  getLeaderboard: (maPhien: string): Promise<AxiosResponse<LeaderboardResponse>> => {
    return $get(`/phien/${maPhien}/leaderboard`)
  },

  // End session
  endPhien: (maPhien: string): Promise<AxiosResponse<void>> => {
    return $delete(`/phien/${maPhien}`)
  },

  // Get PIN by Room ID
  getPinByRoomId: (maPhong: string): Promise<AxiosResponse<GetPinByRoomIdResponse>> => {
    return $get(`/phien/pin/room/${maPhong}`)
  },
}
