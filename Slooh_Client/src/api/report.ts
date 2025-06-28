import type { BaoCao, TrangThaiBaoCao } from '@/types'
import { $delete, $get, $patch, $post } from './axios'

export interface CreateReportData {
  maPhong: string
  noiDung: string
  hinhAnh?: string
}

export interface UpdateReportStatusData {
  trangThai: TrangThaiBaoCao
}

export interface ReportListQuery {
  page?: number
  limit?: number
  trangThai?: TrangThaiBaoCao
  search?: string
}

export interface ReportListResponse {
  reports: BaoCao[]
  totalCount: number
  totalPages: number
  currentPage: number
}

// User endpoints
export function createReport(data: CreateReportData) {
  return $post('/baocao', data)
}

export function getMyReports() {
  return $get('/baocao/my-reports')
}

// Admin endpoints
export function getReports(query: ReportListQuery = {}) {
  return $get('/baocao', {
    params: query,
  })
}

export function getReportDetail(maBaoCao: string) {
  return $get(`/baocao/${maBaoCao}`)
}

export function updateReportStatus(maBaoCao: string, data: UpdateReportStatusData) {
  return $patch(`/baocao/${maBaoCao}`, data)
}

export function deleteReport(maBaoCao: string) {
  return $delete(`/baocao/${maBaoCao}`)
}

export function getReportsByRoom(maPhong: string) {
  return $get(`/baocao/phong/${maPhong}`)
}

export function getReportStats() {
  return $get('/baocao/stats')
}
