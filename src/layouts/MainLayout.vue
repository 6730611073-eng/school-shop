<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-teal-7">
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="router.push('/')">
          {{ APP_TITLE }}
        </q-toolbar-title>

        <q-btn flat label="สินค้า" to="/" />

        <template v-if="auth.isLoggedIn">
          <q-btn flat icon="shopping_cart" label="ตะกร้า" to="/cart">
            <q-badge v-if="cart.totalQty > 0" color="red" floating>{{ cart.totalQty }}</q-badge>
          </q-btn>
          <q-btn flat label="ออเดอร์" to="/orders" />
          <q-btn v-if="auth.isAdmin" flat label="จัดการสินค้า" to="/admin/products" />
          <span class="q-mx-sm gt-xs">สวัสดี {{ auth.user.name }}</span>
          <q-btn flat label="ออกจากระบบ" @click="logout" />
        </template>
        <template v-else>
          <q-btn flat label="เข้าสู่ระบบ" to="/login" />
          <q-btn flat label="สมัครสมาชิก" to="/register" />
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth-store'
import { useCartStore } from '../stores/cart-store'
import { APP_TITLE } from '../boot/axios'

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()
const cart = useCartStore()

function logout() {
  auth.logout()
  cart.clear()
  $q.notify({ type: 'info', message: 'ออกจากระบบแล้ว' })
  router.push('/login')
}
</script>
