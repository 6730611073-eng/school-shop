import { defineStore } from 'pinia'
import { api, getByType, RESOURCE } from '../boot/axios'

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem('shop_user') || 'null')
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: loadUser()
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(username, password) {
      const users = await getByType('user')
      const found = users.find((u) => u.username === username && u.password === password)
      if (!found) {
        throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      }
      this.user = { id: found.id, username: found.username, name: found.name, role: found.role }
      localStorage.setItem('shop_user', JSON.stringify(this.user))
    },

    async register(username, password, name) {
      const users = await getByType('user')
      if (users.some((u) => u.username === username)) {
        throw new Error('ชื่อผู้ใช้นี้มีคนใช้แล้ว')
      }
      await api.post(RESOURCE, { type: 'user', username, password, name, role: 'customer' })
    },

    logout() {
      this.user = null
      localStorage.removeItem('shop_user')
    }
  }
})
