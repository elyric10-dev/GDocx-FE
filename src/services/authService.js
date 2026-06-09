import api from './api'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const authService = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setTokens({ access_token, refresh_token }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
    if (refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
    }
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  async register(email, password, fullName) {
    const payload = { email, password }
    if (fullName) payload.full_name = fullName
    const { data } = await api.post('/auth/register', payload)
    this.setTokens(data)
    return data
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    this.setTokens(data)
    return data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      this.clearTokens()
    }
  },

  async getMe() {
    const { data } = await api.get('/auth/me')
    return data
  },
}
