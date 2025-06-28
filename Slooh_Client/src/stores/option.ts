import type { LuaChon } from '@/types'
import { defineStore } from 'pinia'

export const useOptionStore = defineStore('option', () => {
  const option = ref<LuaChon | null>(null)
  const addOption = () => {
    option.value = {
      noiDung: '',
      ketQua: false,
    }
  }
  const clearOption = () => {
    option.value = null
  }
  return { option, addOption, clearOption }
})
