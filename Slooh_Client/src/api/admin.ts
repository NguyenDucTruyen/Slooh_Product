import type { TrangThai } from '@/types'
import { $get, $patch } from './axios'

// User APIs
export async function apiGetAllUsers(config: any) {
  const response = await $get('/users', {
    params: config,
  })
  return response
}

export async function changeUserStatus(
  userId: string,
  status: TrangThai,
) {
  const response = await $patch(`/users/${userId}/status`, {
    trangThai: status,
  })
  return response
}

// Channel APIs
export async function apiGetAllChannels(config: { page?: number, limit?: number }) {
  const response = await $get('/kenh/admin/all', {
    params: config,
  })
  return response
}

export async function apiUpdateChannelStatus(
  maKenh: string,
  status: TrangThai,
) {
  const response = await $patch(`/kenh/admin/${maKenh}/status`, {
    trangThai: status,
  })
  return response
}

// Room APIs
export async function apiGetAllRooms(config: { page?: number, limit?: number }) {
  const response = await $get('/phong/admin/all', {
    params: config,
  })
  return response
}

export async function apiGetAllRoomsInChannel(
  maKenh: string,
  config: { page?: number, limit?: number },
) {
  const response = await $get(`/phong/admin/kenh/${maKenh}`, {
    params: config,
  })
  return response
}

export async function apiGetAllPublicRooms(config: { page?: number, limit?: number }) {
  const response = await $get('/phong/admin/public/all', {
    params: config,
  })
  return response
}

export async function apiUpdateRoomStatus(
  maPhong: string,
  status: TrangThai,
) {
  const response = await $patch(`/phong/admin/${maPhong}/status`, {
    trangThai: status,
  })
  return response
}
