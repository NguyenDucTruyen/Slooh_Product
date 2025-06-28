import type { TrangThai } from '@/types'
import * as api from '@/api/admin'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
  // User functions
  async function getAllUser(config: any = {}) {
    const response = await api.apiGetAllUsers(config)
    return response
  }

  async function changeUserStatus(
    userId: string,
    status: TrangThai,
  ) {
    const response = await api.changeUserStatus(userId, status)
    return response
  }

  // Channel functions
  async function getAllChannels(config: { page?: number, limit?: number } = {}) {
    const response = await api.apiGetAllChannels(config)
    return response.data
  }

  async function updateChannelStatus(
    maKenh: string,
    status: TrangThai,
  ) {
    const response = await api.apiUpdateChannelStatus(maKenh, status)
    return response
  }

  // Room functions
  async function getAllRooms(config: { page?: number, limit?: number } = {}) {
    const response = await api.apiGetAllRooms(config)
    return response
  }

  async function getAllRoomsInChannel(
    maKenh: string,
    config: { page?: number, limit?: number } = {},
  ) {
    const response = await api.apiGetAllRoomsInChannel(maKenh, config)
    return response.data
  }

  async function getAllPublicRooms(config: { page?: number, limit?: number } = {}) {
    const response = await api.apiGetAllPublicRooms(config)
    return response.data
  }

  async function updateRoomStatus(
    maPhong: string,
    status: TrangThai,
  ) {
    const response = await api.apiUpdateRoomStatus(maPhong, status)
    return response
  }

  return {
    // User functions
    getAllUser,
    changeUserStatus,
    // Channel functions
    getAllChannels,
    updateChannelStatus,
    // Room functions
    getAllRooms,
    getAllRoomsInChannel,
    getAllPublicRooms,
    updateRoomStatus,
  }
})
