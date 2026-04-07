// admin-only api calls
import api from './api'

export const adminService = {
  // tutor management
  async getAllTutors() {
    const res = await api.get('/admin/tutors')
    return res.data
  },
  async toggleTutorActive(id) {
    const res = await api.patch(`/admin/tutors/${id}/active`)
    return res.data
  },
  async changeTutorRole(id, role) {
    const res = await api.patch(`/admin/tutors/${id}/role`, { role })
    return res.data
  },

  // course management
  async getAllCourses() {
    const res = await api.get('/admin/courses')
    return res.data
  },
  async addCourse(course) {
    const res = await api.post('/admin/courses', course)
    return res.data
  },
  async deleteCourse(id) {
    const res = await api.delete(`/admin/courses/${id}`)
    return res.data
  },

  // invite code management
  async getInviteCodes() {
    const res = await api.get('/admin/invite-codes')
    return res.data
  },
  async generateInviteCode(role) {
    const res = await api.post('/admin/invite-codes', { role })
    return res.data
  },
  async revokeInviteCode(id) {
    const res = await api.delete(`/admin/invite-codes/${id}`)
    return res.data
  }
}
