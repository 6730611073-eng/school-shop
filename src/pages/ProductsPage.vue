<template>
  <q-page class="q-pa-md">
    <div class="page-box">
      <div class="text-h5 q-mb-md">สินค้าทั้งหมด</div>

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-8">
          <q-input v-model="search" outlined dense label="ค้นหาสินค้า" clearable />
        </div>
        <div class="col-12 col-sm-4">
          <q-select v-model="category" :options="categories" outlined dense label="หมวดหมู่" />
        </div>
      </div>

      <div v-if="productStore.loading" class="text-center q-pa-lg">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="filtered.length === 0" class="text-grey q-pa-md">ไม่พบสินค้า</div>

      <div v-else class="row q-col-gutter-md">
        <div v-for="p in filtered" :key="p.id" class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered>
            <q-img v-if="p.image" :src="p.image" :ratio="4 / 3" />
            <div v-else class="bg-grey-3 flex flex-center" style="height: 140px; font-size: 64px">
              {{ emojiOf(p) }}
            </div>

            <q-card-section>
              <div class="text-subtitle1">{{ p.name }}</div>
              <div class="text-caption text-grey-7">{{ p.category }}</div>
              <div class="text-h6 text-teal-8">{{ p.price }} บาท</div>
              <div class="text-caption" :class="p.stock > 0 ? 'text-grey-7' : 'text-red'">
                {{ p.stock > 0 ? 'เหลือ ' + p.stock + ' ชิ้น' : 'สินค้าหมด' }}
              </div>
            </q-card-section>

            <q-card-actions>
              <q-btn
                color="teal"
                icon="add_shopping_cart"
                label="ใส่ตะกร้า"
                class="full-width"
                :disable="p.stock < 1"
                @click="addToCart(p)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/product-store'
import { useCartStore } from '../stores/cart-store'
import { useAuthStore } from '../stores/auth-store'

const router = useRouter()
const $q = useQuasar()
const productStore = useProductStore()
const cart = useCartStore()
const auth = useAuthStore()

const search = ref('')
const category = ref('ทั้งหมด')

const categories = computed(() => {
  const list = productStore.products.map((p) => p.category).filter((c) => !!c)
  return ['ทั้งหมด', ...new Set(list)]
})

const filtered = computed(() => {
  return productStore.products.filter((p) => {
    const matchName = !search.value || String(p.name).toLowerCase().includes(search.value.toLowerCase())
    const matchCat = category.value === 'ทั้งหมด' || p.category === category.value
    return matchName && matchCat
  })
})

function emojiOf(p) {
  const name = String(p.name || '')
  if (name.includes('กรรไกร')) return '✂️'
  if (name.includes('ไม้บรรทัด')) return '📏'
  if (name.includes('ยางลบ')) return '🧽'
  const map = {
    'ปากกา': '🖊️',
    'ดินสอ': '✏️',
    'สมุด': '📒',
    'กระเป๋า': '🎒',
    'อุปกรณ์เขียน': '🖍️'
  }
  return map[p.category] || '📦'
}

function addToCart(product) {
  if (!auth.isLoggedIn) {
    $q.notify({ type: 'warning', message: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ' })
    router.push({ path: '/login', query: { redirect: '/' } })
    return
  }
  const ok = cart.add(product)
  if (ok) {
    $q.notify({ type: 'positive', message: `เพิ่ม ${product.name} ลงตะกร้าแล้ว` })
  } else {
    $q.notify({ type: 'warning', message: 'จำนวนสินค้าในตะกร้าเต็มสต็อกแล้ว' })
  }
}

onMounted(async () => {
  try {
    await productStore.fetchProducts()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'เชื่อมต่อ API ไม่ได้ ตรวจสอบไฟล์ .env' })
  }
})
</script>
