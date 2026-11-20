import { defineStore } from 'pinia'
import { api, getByType, RESOURCE } from '../boot/axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        this.products = await getByType('product')
      } finally {
        this.loading = false
      }
    },

    async addProduct(product) {
      const res = await api.post(RESOURCE, { ...product, type: 'product' })
      this.products.push(res.data)
    },

    async updateProduct(id, product) {
      const res = await api.put(`${RESOURCE}/${id}`, { ...product, type: 'product' })
      const index = this.products.findIndex((p) => p.id === id)
      if (index !== -1) this.products[index] = res.data
    },

    async deleteProduct(id) {
      await api.delete(`${RESOURCE}/${id}`)
      this.products = this.products.filter((p) => p.id !== id)
    }
  }
})
