<template>
  <q-page class="q-pa-md">
    <div class="page-box">
      <div class="text-h5 q-mb-md">ตะกร้าสินค้า</div>

      <div v-if="cart.items.length === 0" class="text-grey q-pa-md">
        ตะกร้าว่างเปล่า <router-link to="/">ไปเลือกสินค้า</router-link>
      </div>

      <div v-else>
        <q-list bordered separator class="bg-white">
          <q-item v-for="item in cart.items" :key="item.id">
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption>{{ item.price }} บาท / ชิ้น</q-item-label>
            </q-item-section>

            <q-item-section side style="width: 110px">
              <q-input
                :model-value="item.qty"
                type="number"
                min="1"
                dense
                outlined
                label="จำนวน"
                @update:model-value="(v) => cart.setQty(item.id, Number(v))"
              />
            </q-item-section>

            <q-item-section side style="width: 100px">
              {{ item.price * item.qty }} บาท
            </q-item-section>

            <q-item-section side>
              <q-btn flat round color="red" icon="delete" @click="cart.remove(item.id)" />
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-h6 text-right q-mt-md">รวมทั้งหมด {{ cart.totalPrice }} บาท</div>

        <div class="text-right q-mt-md">
          <q-btn flat color="grey-8" label="ล้างตะกร้า" class="q-mr-sm" @click="cart.clear()" />
          <q-btn color="teal" label="สั่งซื้อสินค้า" :loading="loading" @click="checkout" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCartStore } from '../stores/cart-store'
import { useOrderStore } from '../stores/order-store'

const router = useRouter()
const $q = useQuasar()
const cart = useCartStore()
const orderStore = useOrderStore()
const loading = ref(false)

async function checkout() {
  loading.value = true
  try {
    await orderStore.createOrder(cart.items, cart.totalPrice)
    cart.clear()
    $q.notify({ type: 'positive', message: 'สั่งซื้อสำเร็จ' })
    router.push('/orders')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'สั่งซื้อไม่สำเร็จ' })
  } finally {
    loading.value = false
  }
}
</script>
