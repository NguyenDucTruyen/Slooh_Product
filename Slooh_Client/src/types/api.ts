import type { LoaiCauTraLoi, LoaiSlide, LuaChon } from './entity'

export interface BodyUpdateRoom {
  tenPhong: string
  trangThai: string
  hoatDong: string
  danhSachTrang: UpdateSlide[]
}

export interface UpdateSlide {
  loaiTrang: LoaiSlide
  tieuDe: string
  hinhAnh?: string | null
  video?: string | null
  hinhNen?: string | null
  cachTrinhBay?: 'CO_BAN' | 'TIEU_DE_LON' | 'HAI_COT' | 'DANH_SACH' | 'TRICH_DAN' | 'HINH_ANH' | 'CO_BAN_TEXT' |  null
  noiDung?: string | null
  thoiGianGioiHan?: number | null
  canLeNoiDung?: string
  canLeTieuDe?: string
  diem?: 'BINH_THUONG' | 'GAP_DOI' | 'KHONG_DIEM'
  loaiCauTraLoi?: LoaiCauTraLoi
  danhSachLuaChon?: LuaChon[]
}
