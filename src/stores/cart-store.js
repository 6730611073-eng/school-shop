import { defineStore } from 'pinia'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('shop_cart') || '[]')
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadCart()
  }),

  getters: {
    totalQty: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  },

  actions: {
    save() {
      localStorage.setItem('shop_cart', JSON.stringify(this.items))
    },

    add(product) {
      const found = this.items.find((i) => i.id === product.id)
      if (found) {
        if (found.qty >= product.stock) return false
        found.qty++
      } else {
        if (product.stock < 1) return false
        this.items.push({ id: product.id, name: product.name, price: product.price, qty: 1 })
      }
      this.save()
      return true
    },

    setQty(id, qty) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      item.qty = qty && qty > 0 ? qty : 1
      this.save()
    },

    remove(id) {
      this.items = this.items.filter((i) => i.id !== id)
      this.save()
    },

    clear() {
      this.items = []
      this.save()
    }
  }
})
