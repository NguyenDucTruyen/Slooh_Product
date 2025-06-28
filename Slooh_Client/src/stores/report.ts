import type { BaoCao, BaoCaoStats, TrangThaiBaoCao } from '@/types'
import * as reportApi from '@/api/report'
import { defineStore } from 'pinia'

export const useReportStore = defineStore('report', () => {
  // User functions
  async function createReport(data: reportApi.CreateReportData) {
    const response = await reportApi.createReport(data)
    return response.data
  }

  async function getMyReports() {
    const response = await reportApi.getMyReports()
    return response.data as BaoCao[]
  }

  // Admin functions
  async function getReports(query: reportApi.ReportListQuery = {}) {
    const response = await reportApi.getReports(query)
    return response.data as reportApi.ReportListResponse
  }

  async function getReportDetail(maBaoCao: string) {
    const response = await reportApi.getReportDetail(maBaoCao)
    return response.data as BaoCao
  }

  async function updateReportStatus(maBaoCao: string, trangThai: TrangThaiBaoCao) {
    const response = await reportApi.updateReportStatus(maBaoCao, { trangThai })
    return response.data
  }

  async function deleteReport(maBaoCao: string) {
    const response = await reportApi.deleteReport(maBaoCao)
    return response.data
  }

  async function getReportsByRoom(maPhong: string) {
    const response = await reportApi.getReportsByRoom(maPhong)
    return response.data as BaoCao[]
  }

  async function getReportStats() {
    const response = await reportApi.getReportStats()
    return response.data as BaoCaoStats
  }

  return {
    createReport,
    getMyReports,
    getReports,
    getReportDetail,
    updateReportStatus,
    deleteReport,
    getReportsByRoom,
    getReportStats,
  }
})
