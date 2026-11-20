<template>
  <q-page class="q-pa-md">
    <div class="page-box" style="max-width: 400px">
      <q-card bordered flat class="q-pa-md q-mt-lg">
        <div class="text-h5 q-mb-md">เข้าสู่ระบบ</div>

        <q-banner v-if="!API_URL" class="bg-orange-2 q-mb-md">
          ยังไม่ได้ตั้งค่า QCLI_API_URL ในไฟล์ .env
        </q-banner>

        <q-form @submit.prevent="onLogin">
          <q-input
            v-model="username"
            label="ชื่อผู้ใช้"
            outlined
            class="q-mb-sm"
            :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
          />
          <q-input
            v-model="password"
            label="รหัสผ่าน"
            type="password"
            outlined
            class="q-mb-sm"
            :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน']"
          />
          <q-btn type="submit" color="teal" label="เข้าสู่ระบบ" class="full-width" :loading="loading" />
        </q-form>

        <div class="q-mt-md text-center">
          ยังไม่มีบัญชี? <router-link to="/register">สมัครสมาชิก</router-link>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth-store'
import { API_URL } from '../boot/axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

async function onLogin() {
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    $q.notify({ type: 'positive', message: 'เข้าสู่ระบบสำเร็จ' })
    router.push(route.query.redirect || '/')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'เข้าสู่ระบบไม่สำเร็จ' })
  } finally {
    loading.value = false
  }
}
</script>
