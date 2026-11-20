<template>
  <q-page class="q-pa-md">
    <div class="page-box">
      <div class="text-h5 q-mb-md">
        {{ auth.isAdmin ? 'ออเดอร์ทั้งหมด (แอดมิน)' : 'ออเดอร์ของฉัน' }}
      </div>

      <div v-if="orderStore.loading" class="text-center q-pa-lg">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="orderStore.orders.length === 0" class="text-grey q-pa-md">ยังไม่มีออเดอร์</div>

      <div v-else>
        <q-card v-for="o in orderStore.orders" :key="o.id" flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-subtitle1">ออเดอร์ #{{ o.id }}</div>
                <div class="text-caption text-grey-7">
                  {{ formatDate(o.createdAt) }}
                  <span v-if="auth.isAdmin"> | ผู้สั่ง: {{ o.username }}</span>
                </div>
              </div>
              <q-badge :color="statusColor(o.status)" :label="o.status" />
            </div>

            <q-separator class="q-my-sm" />

            <div v-for="(item, index) in o.items" :key="index">
              {{ item.name }} x {{ item.qty }} = {{ item.price * item.qty }} บาท
            </div>

            <div class="text-subtitle1 q-mt-sm">รวม {{ o.total }} บาท</div>
          </q-card-section>

          <q-card-actions>
            <!-- แอดมิน: เปลี่ยนสถานะ -->
            <q-select
              v-if="auth.isAdmin"
              :model-value="o.status"
              :options="statusList"
              dense
              outlined
              label="สถานะ"
              style="min-width: 160px"
              @update:model-value="(v) => changeStatus(o, v)"
            />
            <q-space />
            <!-- ลูกค้า: ยกเลิกได้เฉพาะที่ยังเป็น pending / แอดมินลบได้ทุกอัน -->
            <q-btn
              v-if="auth.isAdmin || o.status === 'pending'"
              flat
              color="red"
              :label="auth.isAdmin ? 'ลบออเดอร์' : 'ยกเลิกออเดอร์'"
              @click="confirmDelete(o)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth-store'
import { useOrderStore } from '../stores/order-store'

const $q = useQuasar()
const auth = useAuthStore()
const orderStore = useOrderStore()

const statusList = ['pending', 'paid', 'shipped', 'completed']

function statusColor(status) {
  if (status === 'pending') return 'orange'
  if (status === 'paid') return 'blue'
  if (status === 'shipped') return 'purple'
  return 'green'
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('th-TH')
}

async function changeStatus(order, status) {
  try {
    await orderStore.updateStatus(order, status)
    $q.notify({ type: 'positive', message: 'อัปเดตสถานะแล้ว' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'อัปเดตสถานะไม่สำเร็จ' })
  }
}

function confirmDelete(order) {
  $q.dialog({
    title: 'ยืนยัน',
    message: `ต้องการลบออเดอร์ #${order.id} ใช่หรือไม่?`,
    cancel: true
  }).onOk(async () => {
    try {
      await orderStore.cancelOrder(order.id)
      $q.notify({ type: 'positive', message: 'ลบออเดอร์แล้ว' })
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'ลบออเดอร์ไม่สำเร็จ' })
    }
  })
}

onMounted(async () => {
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'โหลดออเดอร์ไม่สำเร็จ' })
  }
})
</script>
