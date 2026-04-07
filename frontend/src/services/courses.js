// course api calls
import api from './api'

export const courseService = {
  // get all courses with their tutors (used on courses page)
  async getAll() {
    const res = await api.get('/courses')
    return res.data
  }
}
