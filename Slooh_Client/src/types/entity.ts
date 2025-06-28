export enum Quyen {
  NGUOI_DUNG = 'NGUOI_DUNG',
  ADMIN = 'ADMIN',
}

export enum TrangThai {
  HOAT_DONG = 'HOAT_DONG',
  KHOA = 'KHOA',
}

export enum LoaiToken {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export enum LoaiOAuth {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export enum VaiTroKenh {
  THANH_VIEN = 'THANH_VIEN',
  CHU_KENH = 'CHU_KENH',
}

export enum TrangThaiThanhVien {
  YEU_CAU = 'YEU_CAU',
  THAM_GIA = 'THAM_GIA',
}

export enum HoatDongPhong {
  OFFLINE = 'OFFLINE',
  WAITING = 'WAITING',
  PRESENTING = 'PRESENTING',
}

export enum LoaiSlide {
  NOI_DUNG = 'NOI_DUNG',
  CAU_HOI = 'CAU_HOI',
}

export enum CachTrinhBay {
  CO_BAN = 'CO_BAN', // Classic
  HAI_COT = 'HAI_COT', //  title & text
  TRICH_DAN = 'TRICH_DAN', // quote
  HINH_ANH = 'HINH_ANH', // big media
  CO_BAN_TEXT = 'CO_BAN_TEXT', // title & text
}

export enum Diem {
  BINH_THUONG = 'BINH_THUONG',
  GAP_DOI = 'GAP_DOI',
  KHONG_DIEM = 'KHONG_DIEM',
}

export enum LoaiCauTraLoi {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  TRUE_FALSE = 'TRUE_FALSE',
}

export enum VaiTroPhien {
  THANH_VIEN = 'THANH_VIEN',
  CHU_PHIEN = 'CHU_PHIEN',
}

export enum TrangThaiBaoCao {
  CHUA_XU_LY = 'CHUA_XU_LY',
  DA_XU_LY = 'DA_XU_LY',
}

export interface NguoiDung {
  maNguoiDung: string
  hoTen: string
  email: string
  matKhau: string
  anhDaiDien?: string
  quyen: Quyen
  trangThai: TrangThai
  daXacThucEmail: boolean
  ngayTao: string
  ngayCapNhat: string
}

export interface Token {
  maToken: string
  maNguoiDung: string
  loaiToken: LoaiToken
  token: string
  hetHan: string
  daSuDung: boolean
  ngayTao: string
}

export interface OAuth {
  maOauth: string
  maNguoiDung: string
  loaiOAuth: LoaiOAuth
  oauthId: string
  token: string
  ngayTao: string
}

export interface Kenh {
  maKenh: string
  tenKenh: string
  trangThai: TrangThai
  ngayTao: string
  ngayXoa?: string
  thanhVien: ThanhVienKenh[]
}

export interface ThanhVienKenh {
  maThanhVienKenh: string
  maNguoiDung: string
  maKenh: string
  vaiTro: VaiTroKenh
  trangThai: TrangThaiThanhVien
  ngayTao: string
  nguoiDung: NguoiDung
}

export interface Phong {
  maPhong: string
  tenPhong: string
  maKenh?: string
  maChuPhong: string
  trangThai: TrangThai
  hoatDong: HoatDongPhong
  ngayTao: string
  ngayXoa?: string
  _count?: { trangs: number }
  maNguoiTao?: string
  trangs?: Slide[]
}

export interface Slide {
  maTrang: string
  maPhong: string
  loaiTrang: LoaiSlide
  thuTu: number
  tieuDe: string
  hinhAnh?: string
  video?: string
  hinhNen?: string
  cachTrinhBay?: CachTrinhBay
  canLeNoiDung?: string
  canLeTieuDe?: string
  noiDung?: string
  thoiGianGioiHan?: number
  diem?: Diem
  loaiCauTraLoi?: LoaiCauTraLoi
  luaChon?: LuaChon[]
}

export interface LuaChon {
  maLuaChon?: string
  maTrang?: string
  noiDung: string
  ketQua: boolean
  isSelected?: boolean
}

export interface PhienTrinhChieu {
  maPhien: string
  maPhong: string
  maPin: string
  ngayTao: string
}

export interface BaoCao {
  maBaoCao: string
  maNguoiDung: string
  maPhong: string
  noiDung: string
  hinhAnh?: string
  trangThai: TrangThaiBaoCao
  ngayTao: string
  ngayCapNhat: string
  ngayXoa?: string
  nguoiDung?: NguoiDung
  phong?: Phong & {
    kenh: Kenh
  }
}

export interface BaoCaoStats {
  total: number
  chuaXuLy: number
  daXuLy: number
}

export interface ThanhVienPhienTrinhChieu {
  maThanhVienPhien: string
  maNguoiDung?: string
  maPhien: string
  tenThanhVien: string
  anhDaiDien?: string
  vaiTro: VaiTroPhien
  tongDiem: number
  nguoiDung?: NguoiDung
  CAUTRALOI?: CauTraLoi[]
}

export interface CauTraLoi {
  maCauTraLoi: string
  maThanhVienPhien: string
  maLuaChon: string
  thoiGian: number
  thanhVien?: ThanhVienPhienTrinhChieu
  luaChon?: LuaChon
}
