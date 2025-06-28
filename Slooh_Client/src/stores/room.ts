import type { BodyUpdateRoom, Phong } from '@/types'
import * as roomApi from '@/api/room'
import { defineStore } from 'pinia'

interface ResponseCreateRoom {
  message: string
  data: Phong
}
export const useRoomStore = defineStore('room', () => {
  async function createRoom(data: { tenPhong: string, maKenh: string }) {
    const response = await roomApi.createRoom(data)
    return response.data
  }

  async function getRoomDetail(id: string) {
    const response = await roomApi.getRoomDetail(id)
    return response.data
  }

  async function updateRoom(id: string, data: BodyUpdateRoom) {
    const response = await roomApi.updateRoom(id, data)
    return response.data
  }
  async function createPublicRoom(tenPhong: string) {
    const response = await roomApi.creatPublicRoom(tenPhong)
    return response.data
  }

  async function getPublicRoomList() {
    const response = await roomApi.getPublicRoomList()
    return response.data
  }

  async function deleteRoom(id: string) {
    const response = await roomApi.deleteRoom(id)
    return response.data
  }

  async function cloneRoom({ roomId, channelId }: { roomId: string, channelId: string }) {
    const response = await roomApi.cloneRoom({ roomId, channelId })
    return response.data
  }

  async function createRoomWithAI(data: roomApi.BodyCreateRoomWithAI) {
    const response = await roomApi.createRoomWithAI(data) as ResponseCreateRoom
    return response.data
  }

  return {
    createRoom,
    getRoomDetail,
    updateRoom,
    createPublicRoom,
    getPublicRoomList,
    deleteRoom,
    cloneRoom,
    createRoomWithAI,
  }
})
