import { io, type Socket } from 'socket.io-client'

export function useSocketIO(): Socket {
  const socketUrl = import.meta.env.VITE_SOCKET_URL
  const socket = io(socketUrl)
  return socket
}
