// auth helpers - login, logout, register, and getting current user
import api from './api'

export const authService = {
  // log in with email + password, store token and user in localStorage
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  },

  // step 1: verify invite code before letting someone register
  async verifyInviteCode(code) {
    const res = await api.post('/auth/verify-code', { code })
    return res.data
  },

  // step 2: create new tutor account
  async register(data) {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  // clear everything and send to login
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  // get current logged-in user from localStorage
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('token')
  },

  // fetch fresh user data from the backend
  async me() {
    const res = await api.get('/auth/me')
    return res.data
  }
}
