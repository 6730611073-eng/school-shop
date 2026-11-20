import { defineStore } from 'pinia'
import { api, getByType, RESOURCE } from '../boot/axios'
import { useAuthStore } from './auth-store'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false
  }),

  actions: {
    async fetchOrders() {
      const auth = useAuthStore()
      this.loading = true
      try {
        const all = await getByType('order')
        const mine = auth.isAdmin ? all : all.filter((o) => String(o.userId) === String(auth.user.id))
        this.orders = mine.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      } finally {
        this.loading = false
      }
    },

    async createOrder(items, total) {
      const auth = useAuthStore()

      const stocks = []
      for (const item of items) {
        const res = await api.get(`${RESOURCE}/${item.id}`)
        if (res.data.stock < item.qty) {
          throw new Error(`สินค้า "${res.data.name}" เหลือไม่พอ (เหลือ ${res.data.stock} ชิ้น)`)
        }
        stocks.push(res.data)
      }

      await api.post(RESOURCE, {
        type: 'order',
        userId: auth.user.id,
        username: auth.user.username,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
      })

      for (let i = 0; i < items.length; i++) {
        const p = stocks[i]
        await api.put(`${RESOURCE}/${p.id}`, { ...p, stock: p.stock - items[i].qty })
      }
    },

    async cancelOrder(id) {
      await api.delete(`${RESOURCE}/${id}`)
      this.orders = this.orders.filter((o) => o.id !== id)
    },

    async updateStatus(order, status) {
      const res = await api.put(`${RESOURCE}/${order.id}`, { ...order, status })
      const index = this.orders.findIndex((o) => o.id === order.id)
      if (index !== -1) this.orders[index] = res.data
    }
  }
})
