// schedule api calls
import api from './api'

export const scheduleService = {
  // get all weekly slots (used on schedule page and tv display)
  async getAll() {
    const res = await api.get('/schedule')
    return res.data
  }
}
