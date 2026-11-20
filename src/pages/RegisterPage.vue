<template>
  <q-page class="q-pa-md">
    <div class="page-box" style="max-width: 400px">
      <q-card bordered flat class="q-pa-md q-mt-lg">
        <div class="text-h5 q-mb-md">สมัครสมาชิก</div>

        <q-form @submit.prevent="onRegister">
          <q-input
            v-model="name"
            label="ชื่อ-นามสกุล"
            outlined
            class="q-mb-sm"
            :rules="[(v) => !!v || 'กรุณากรอกชื่อ']"
          />
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
            :rules="[(v) => (v && v.length >= 4) || 'รหัสผ่านอย่างน้อย 4 ตัวอักษร']"
          />
          <q-input
            v-model="confirm"
            label="ยืนยันรหัสผ่าน"
            type="password"
            outlined
            class="q-mb-sm"
            :rules="[(v) => v === password || 'รหัสผ่านไม่ตรงกัน']"
          />
          <q-btn type="submit" color="teal" label="สมัครสมาชิก" class="full-width" :loading="loading" />
        </q-form>

        <div class="q-mt-md text-center">
          มีบัญชีแล้ว? <router-link to="/login">เข้าสู่ระบบ</router-link>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth-store'

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()

const name = ref('')
const username = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)

async function onRegister() {
  loading.value = true
  try {
    await auth.register(username.value, password.value, name.value)
    $q.notify({ type: 'positive', message: 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ' })
    router.push('/login')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'สมัครสมาชิกไม่สำเร็จ' })
  } finally {
    loading.value = false
  }
}
</script>
