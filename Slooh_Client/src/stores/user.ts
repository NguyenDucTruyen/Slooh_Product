import type { NguoiDung } from '@/types'
import * as api from '@/api/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref<NguoiDung | null>(null)

  function setUser(newUser: any) {
    user.value = newUser
  }
  function removeUser() {
    user.value = null
  }
  async function getUserData() {
    const data = await api.fetchUserData()
    setUser(data)
    return data
  }
  async function updateUser(id: string, data: any) {
    const updatedUser = await api.updateUser(id, {
      hoTen: data.username,
      anhDaiDien: data.avatar,
    })
    setUser(updatedUser)
    return updatedUser
  }
  async function updatePassword(data: any) {
    const { confirmNewPassword, ...filterData } = data
    const updatedUser = await api.updatePassword(filterData)
    return updatedUser
  }
  const isAuthenticated = computed(() => !!user.value)
  return {
    user,
    setUser,
    isAuthenticated,
    removeUser,
    getUserData,
    updateUser,
    updatePassword,
  }
})
