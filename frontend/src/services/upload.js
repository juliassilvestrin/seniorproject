// photo upload api calls
import api from './api'

export const uploadService = {
  // upload a profile photo - sends multipart form data
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('photo', file)
    const res = await api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
