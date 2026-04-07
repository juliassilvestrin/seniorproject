// all tutor-related api calls
import api from './api'

export const tutorService = {
  // get all active tutors (used on tutors list page)
  async getAll() {
    const res = await api.get('/tutors')
    return res.data
  },

  // get single tutor by slug (used on profile page)
  async getBySlug(slug) {
    const res = await api.get(`/tutors/${slug}`)
    return res.data
  },

  // update own profile (dashboard)
  async updateProfile(data) {
    const res = await api.put('/tutors/me/profile', data)
    return res.data
  },

  // schedule crud
  async getMySchedule() {
    const res = await api.get('/tutors/me/schedule')
    return res.data
  },
  async addScheduleSlot(slot) {
    const res = await api.post('/tutors/me/schedule', slot)
    return res.data
  },
  async updateScheduleSlot(id, data) {
    const res = await api.put(`/tutors/me/schedule/${id}`, data)
    return res.data
  },
  async removeScheduleSlot(id) {
    const res = await api.delete(`/tutors/me/schedule/${id}`)
    return res.data
  },

  // absence crud
  async getMyAbsences() {
    const res = await api.get('/tutors/me/absences')
    return res.data
  },
  async addAbsence(absence) {
    const res = await api.post('/tutors/me/absences', absence)
    return res.data
  },
  async removeAbsence(id) {
    const res = await api.delete(`/tutors/me/absences/${id}`)
    return res.data
  }
}
