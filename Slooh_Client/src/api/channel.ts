import { $delete, $get, $patch, $post } from './axios'

// CRUD Kênh
export function getChannelList(config: any) {
  return $get('/kenh', {
    params: config,
  })
}
export function createChannel(name: string) {
  return $post('/kenh', { tenKenh: name })
}

export function updateChannel(id: string, name: string) {
  return $patch(`/kenh/${id}`, { tenKenh: name })
}
export function deleteChannel(id: string) {
  return $delete(`/kenh/${id}`)
}
export function getChannelDetail(id: string) {
  return $get(`/kenh/${id}`)
}

// Chủ kênh -  quản lý thành viên

export function addMemberToChannel(id: string, listEmail: string[]) {
  return $post(`/kenh/${id}/thanhVien`, { listEmail })
}

export function removeMemberToChannel(id: string, listEmail: string[]) {
  return $delete(`/kenh/${id}/thanhVien`, { data: { listEmail } })
}

export function acceptRequestJoinChannel(id: string, listEmail: string[]) {
  return $post(`/kenh/${id}/yeuCau/dongY`, { listEmail })
}
export function rejectRequestJoinChannel(id: string, listEmail: string[]) {
  return $post(`/kenh/${id}/yeuCau/tuChoi`, { listEmail })
}

// Thành viên
export function sendRequestJoinChannel(id: string) {
  return $post(`/kenh/${id}/yeuCau`, {})
}

export function cancelRequestJoinChannel(id: string) {
  return $delete(`/kenh/${id}/yeuCau`, {})
}

export function leaveChannel(id: string) {
  return $post(`/kenh/${id}/roi`, {})
}
export function getChannelsJoined(config: any) {
  return $get('/kenh/daThamGia', {
    params: config,
  })
}
export function getChannelsRequestJoin(config: any) {
  return $get('/kenh/yeuCauThamGia', {
    params: config,
  })
}

// List rooms in channel
export function getRoomsInChannel(id: string, config: any) {
  return $get(`/phong/kenh/${id}`, {
    params: config,
  })
}
