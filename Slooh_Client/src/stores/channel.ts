import * as apiChannel from '@/api/channel'
import { defineStore } from 'pinia'

export const useChannelStore = defineStore('channel', () => {
  // CRUD Channel
  async function getChannelList(config: any) {
    const res = await apiChannel.getChannelList(config)
    return res.data
  }
  async function createChannel(name: string) {
    const res = await apiChannel.createChannel(name)
    return res.data
  }
  async function updateChannel(id: string, name: string) {
    const res = await apiChannel.updateChannel(id, name)
    return res.data
  }
  async function deleteChannel(listId: string[]) {
    const res = await Promise.all(listId.map(id => apiChannel.deleteChannel(id)))
    return res.map(response => response.data)
  }
  async function getChannelDetail(id: string) {
    const res = await apiChannel.getChannelDetail(id)
    return res.data
  }
  // Channel - Member management
  async function addMemberToChannel(id: string, listEmail: string[]) {
    const res = await apiChannel.addMemberToChannel(id, listEmail)
    return res.data
  }
  async function removeMemberToChannel(id: string, listEmail: string[]) {
    const res = await apiChannel.removeMemberToChannel(id, listEmail)
    return res.data
  }
  async function acceptRequestJoinChannel(id: string, listEmail: string[]) {
    const res = await apiChannel.acceptRequestJoinChannel(id, listEmail)
    return res.data
  }
  async function rejectRequestJoinChannel(id: string, listEmail: string[]) {
    const res = await apiChannel.rejectRequestJoinChannel(id, listEmail)
    return res.data
  }
  // Channel - Member
  async function getChannelsJoined(config: any) {
    const res = await apiChannel.getChannelsJoined(config)
    return res.data
  }

  async function leaveChannel(id: string) {
    const res = await apiChannel.leaveChannel(id)
    return res.data
  }

  async function sendRequestJoinChannel(id: string) {
    const res = await apiChannel.sendRequestJoinChannel(id)
    return res.data
  }
  async function cancelRequestJoinChannel(id: string) {
    const res = await apiChannel.cancelRequestJoinChannel(id)
    return res.data
  }
  async function getChannelsRequestJoin(config: any) {
    const res = await apiChannel.getChannelsRequestJoin(config)
    return res.data
  }
  // Room management
  async function getRoomsInChannel(id: string, config: any) {
    const res = await apiChannel.getRoomsInChannel(id, config)
    return res.data
  }
  return {
    createChannel,
    getChannelList,
    updateChannel,
    deleteChannel,
    getChannelDetail,
    addMemberToChannel,
    removeMemberToChannel,
    acceptRequestJoinChannel,
    rejectRequestJoinChannel,
    getChannelsJoined,
    leaveChannel,
    sendRequestJoinChannel,
    cancelRequestJoinChannel,
    getChannelsRequestJoin,
    getRoomsInChannel
  }
})
