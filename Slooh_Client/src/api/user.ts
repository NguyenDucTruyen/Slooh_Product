import { $get, $patch } from '@/api/axios'

export async function fetchUserData() {
  return $get('/users/me')
}
export async function updateUser(id: string, data: any) {
  return $patch(`/users/${id}`, data)
}
export async function updatePassword(data: any) {
  return $patch(`/users/change-password`, data)
}
