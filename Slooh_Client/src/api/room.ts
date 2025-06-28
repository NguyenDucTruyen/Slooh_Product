import type { BodyUpdateRoom } from '@/types'
import { $delete, $get, $post, $put } from './axios'

export interface BodyCreateRoomWithAI {
  file: File
  tenPhong: string
  maKenh: string | null
  userPrompt?: string
}
export function createRoom(data: { tenPhong: string, maKenh: string }) {
  return $post('/phong', data)
}

export function getRoomDetail(id: string) {
  return $get(`/phong/${id}`)
}

export function updateRoom(id: string, data: BodyUpdateRoom) {
  return $put(`/phong/${id}`, data)
}

// Create a public room (no channel required)
export function creatPublicRoom(tenPhong: string) {
  return $post('/phong/public', { tenPhong })
}

// Create a public room (no channel required)
export function getPublicRoomList() {
  return $get('/phong/public', { page: 1, limit: 100 })
}

export function deleteRoom(id: string) {
  return $delete(`/phong/${id}`)
}

export function cloneRoom({ roomId, channelId }: { roomId: string, channelId: string }) {
  return $post(`/phong/${roomId}/clone`, { targetChannelId: channelId })
}

export async function createRoomWithAI(data: BodyCreateRoomWithAI) {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('tenPhong', data.tenPhong)
  if (data.maKenh) {
    formData.append('maKenh', data.maKenh)
  }
  else {
    formData.append('maKenh', '')
  }
  if (data.userPrompt) {
    formData.append('userPrompt', data.userPrompt)
  }
  return $post('/phong/extract-from-file', formData)
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCreateRoomWithAIResponse())
    }, 9000)
  })
}

function mockCreateRoomWithAIResponse() {
  return {
    success: true,
    message: 'Tạo phòng từ file thành công.',
    data: {
      maPhong: '7f0d8b54-b194-456b-89e4-7949fd06f266',
      tenPhong: 'Giới thiệu chung về CNTT',
      moTa: 'Phòng học này giới thiệu khái niệm cơ bản về Công nghệ thông tin, bao gồm các khái niệm chính, phân loại máy tính và cấu trúc của hệ thống thông tin.',
      maKenh: null,
      trangThai: 'HOAT_DONG',
      hoatDong: 'OFFLINE',
      ngayTao: '2025-06-24T15:12:17.454Z',
      danhSachTrang: [
        {
          maTrang: '0ef94bce-6c2c-41d5-b525-b29446b6d8db',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Khái niệm cơ bản về Tin học và CNTT',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Tin học là ngành khoa học nghiên cứu về máy tính và xử lý thông tin. Công nghệ thông tin (IT) hoặc Công nghệ thông tin và truyền thông (ICT) sử dụng máy tính và hệ thống truyền thông để lưu trữ, tìm kiếm, truyền và xử lý thông tin. ICT là sự kết hợp của Tin học và Công nghệ truyền thông.',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: '63e71e58-90cf-4b6d-a22e-964b8aab39d9',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Máy tính và Chương trình',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Máy tính là thiết bị thực hiện chương trình để nhận, xử lý dữ liệu và tạo ra thông tin. Chương trình là dãy lệnh điều khiển máy tính.',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: '101f75c1-bbd8-4e43-b364-e03cd3c53850',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Mô hình máy tính',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Mô hình cơ bản gồm các thiết bị vào (Input), bộ nhớ chính (Main Memory), bộ xử lý (Processor), các thiết bị ra (Output), thiết bị lưu trữ (Storage) và thiết bị truyền thông (Communication Devices).',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: '697da877-2180-4a01-93cb-764269702f3b',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Phân loại máy tính',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Các loại máy tính hiện đại bao gồm siêu máy tính, máy tính lớn, máy tính tầm trung, máy tính cá nhân, thiết bị di động và máy tính nhúng.',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: '4e73b2b7-5815-4a7b-9343-b9c5511af151',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Hệ thống thông tin',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Hệ thống thông tin gồm 6 phần: con người, quy trình, phần mềm, phần cứng, dữ liệu và kết nối mạng. CNTT nghiên cứu và xây dựng các hệ thống thông tin.',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: '4f528706-0a4a-435a-b51c-d92040f07ca1',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Thành phần của hệ thống thông tin',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Con người (người dùng và quản trị viên), quy trình (hướng dẫn sử dụng), phần mềm (hệ thống và ứng dụng), phần cứng, dữ liệu và kết nối mạng là các thành phần quan trọng.',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: '4529363f-bf1b-4929-8467-3024037186a5',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Dữ liệu, thông tin và tri thức',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Dữ liệu là yếu tố thô chưa xử lý. Thông tin là dữ liệu đã được xử lý. Tri thức là sự hiểu biết dựa trên dữ liệu và thông tin. Tất cả đều được mã hóa thành số nhị phân.',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: '63edd10d-5568-4b0d-81c0-5c686fc20a1d',
          loaiTrang: 'NOI_DUNG',
          tieuDe: 'Kết nối mạng',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: 'Kết nối mạng cho phép chia sẻ thông tin giữa các máy tính. Bao gồm mạng máy tính, Internet, Web, điện toán đám mây, truyền thông không dây và Internet vạn vật (IoT).',
          thoiGianGioiHan: null,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: null,
          danhSachLuaChon: [],
        },
        {
          maTrang: 'b1a4ab80-5f0e-4d9b-be80-f1d18e12f489',
          loaiTrang: 'CAU_HOI',
          tieuDe: 'Công nghệ thông tin và truyền thông (ICT) là sự kết hợp của:',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: '',
          thoiGianGioiHan: 60,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: 'SINGLE_SELECT',
          danhSachLuaChon: [
            {
              maLuaChon: '9be20004-4446-492f-bbc0-2cfc256d05b6',
              noiDung: 'Tin học và Điện tử',
              ketQua: false,
            },
            {
              maLuaChon: '66f8d28c-b7ca-46b8-b74e-31f7cf97be4b',
              noiDung: 'Tin học và Công nghệ truyền thông',
              ketQua: true,
            },
            {
              maLuaChon: '5734b0f4-cfed-40e2-ba71-dc13e2d989cd',
              noiDung: 'Toán học và Tin học',
              ketQua: false,
            },
            {
              maLuaChon: 'c4a4ef96-f016-430f-bb18-01564ca5591b',
              noiDung: 'Điện tử và Công nghệ truyền thông',
              ketQua: false,
            },
          ],
        },
        {
          maTrang: 'b41786fc-a32a-4457-a6b4-c9a2f4192ae7',
          loaiTrang: 'CAU_HOI',
          tieuDe: 'Mô hình cơ bản của máy tính KHÔNG bao gồm thành phần nào sau đây?',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: '',
          thoiGianGioiHan: 60,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: 'SINGLE_SELECT',
          danhSachLuaChon: [
            {
              maLuaChon: '2123c9b9-0dd2-461c-be0f-a16cbcf8c24e',
              noiDung: 'Bộ xử lý',
              ketQua: false,
            },
            {
              maLuaChon: '99ebaecd-c315-470c-a4d4-21abe3c649aa',
              noiDung: 'Bộ nhớ chính',
              ketQua: false,
            },
            {
              maLuaChon: 'c672b6fa-9123-4a75-b06e-22cd8f73aada',
              noiDung: 'Thiết bị in',
              ketQua: false,
            },
            {
              maLuaChon: '87f1b44b-fd62-434e-942e-2f084ef78c7c',
              noiDung: 'Nguồn điện xoay chiều',
              ketQua: true,
            },
          ],
        },
        {
          maTrang: 'ca20e25a-b970-4289-8497-771cda1e79f6',
          loaiTrang: 'CAU_HOI',
          tieuDe: 'Hệ thống thông tin bao gồm những thành phần nào?',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: '',
          thoiGianGioiHan: 60,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: 'MULTI_SELECT',
          danhSachLuaChon: [
            {
              maLuaChon: '895de384-ac3a-40cf-b62d-285135f23ad1',
              noiDung: 'Con người',
              ketQua: true,
            },
            {
              maLuaChon: '41cf0615-f619-4f7e-879e-728bacc326fb',
              noiDung: 'Quy trình',
              ketQua: true,
            },
            {
              maLuaChon: '5d7bf53d-8f57-4a29-a39d-f3c249361e3a',
              noiDung: 'Phần mềm',
              ketQua: true,
            },
            {
              maLuaChon: 'f88c33e6-e453-4fae-8271-cc7a4ee98a9a',
              noiDung: 'Phần cứng',
              ketQua: true,
            },
            {
              maLuaChon: '231b74af-5897-41a8-a270-c0836651892c',
              noiDung: 'Dữ liệu',
              ketQua: true,
            },
            {
              maLuaChon: '7aeb869b-1f6b-4c77-a1e8-9d37ba710784',
              noiDung: 'Kết nối mạng',
              ketQua: true,
            },
          ],
        },
        {
          maTrang: '3bc64d6c-f931-476e-a4a4-06a675df28bf',
          loaiTrang: 'CAU_HOI',
          tieuDe: 'Máy tính nhúng được sử dụng trong:',
          hinhAnh: null,
          video: null,
          hinhNen: null,
          cachTrinhBay: null,
          canLeTieuDe: null,
          canLeNoiDung: null,
          noiDung: '',
          thoiGianGioiHan: 60,
          diem: 'BINH_THUONG',
          loaiCauTraLoi: 'MULTI_SELECT',
          danhSachLuaChon: [
            {
              maLuaChon: 'ab8d01aa-7f4d-4b31-b05f-08404b01c6c2',
              noiDung: 'Điện thoại thông minh',
              ketQua: false,
            },
            {
              maLuaChon: '9d95b2dd-408f-4185-9e08-3032666893a7',
              noiDung: 'Máy tính để bàn',
              ketQua: false,
            },
            {
              maLuaChon: '03f8941a-d0b7-4a9a-ace7-0511bc0907ca',
              noiDung: 'Bộ điều khiển trong ô tô',
              ketQua: true,
            },
            {
              maLuaChon: 'abdc7a81-65f3-4ed3-8f98-6d104df3a548',
              noiDung: 'Máy ATM',
              ketQua: true,
            },
            {
              maLuaChon: 'b4f557c9-f540-4037-a4d5-9dfca1629036',
              noiDung: 'Máy tính xách tay',
              ketQua: false,
            },
          ],
        },
      ],
    },
  }
}
