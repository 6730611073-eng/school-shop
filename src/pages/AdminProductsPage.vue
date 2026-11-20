<template>
  <q-page class="q-pa-md">
    <div class="page-box">
      <div class="row items-center q-mb-md">
        <div class="text-h5 col">จัดการสินค้า</div>
        <q-btn color="teal" icon="add" label="เพิ่มสินค้า" @click="openAdd" />
      </div>

      <q-table
        :rows="productStore.products"
        :columns="columns"
        row-key="id"
        :loading="productStore.loading"
        flat
        bordered
      >
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round color="blue" icon="edit" @click="openEdit(props.row)" />
            <q-btn flat round color="red" icon="delete" @click="confirmDelete(props.row)" />
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="showDialog">
        <q-card style="width: 400px; max-width: 90vw">
          <q-card-section class="text-h6">
            {{ editId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า' }}
          </q-card-section>

          <q-form @submit.prevent="save">
            <q-card-section>
              <q-input
                v-model="form.name"
                label="ชื่อสินค้า"
                outlined
                class="q-mb-sm"
                :rules="[(v) => !!v || 'กรุณากรอกชื่อสินค้า']"
              />
              <q-input
                v-model="form.category"
                label="หมวดหมู่ (เช่น ปากกา, สมุด)"
                outlined
                class="q-mb-sm"
                :rules="[(v) => !!v || 'กรุณากรอกหมวดหมู่']"
              />
              <q-input
                v-model.number="form.price"
                label="ราคา (บาท)"
                type="number"
                outlined
                class="q-mb-sm"
                :rules="[(v) => v > 0 || 'ราคาต้องมากกว่า 0']"
              />
              <q-input
                v-model.number="form.stock"
                label="จำนวนในสต็อก"
                type="number"
                outlined
                class="q-mb-sm"
                :rules="[(v) => (v !== '' && v >= 0) || 'จำนวนต้องไม่ติดลบ']"
              />
              <q-input v-model="form.image" label="ลิงก์รูปภาพ (ไม่ใส่ก็ได้)" outlined />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="ยกเลิก" v-close-popup />
              <q-btn type="submit" color="teal" label="บันทึก" :loading="saving" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/product-store'

const $q = useQuasar()
const productStore = useProductStore()

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left' },
  { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left' },
  { name: 'price', label: 'ราคา', field: 'price', align: 'right' },
  { name: 'stock', label: 'สต็อก', field: 'stock', align: 'right' },
  { name: 'actions', label: 'จัดการ', field: 'actions', align: 'center' }
]

const showDialog = ref(false)
const saving = ref(false)
const editId = ref(null)
const form = ref({ name: '', category: '', price: 0, stock: 0, image: '' })

function openAdd() {
  editId.value = null
  form.value = { name: '', category: '', price: 0, stock: 0, image: '' }
  showDialog.value = true
}

function openEdit(row) {
  editId.value = row.id
  form.value = { ...row }
  showDialog.value = true
}

async function save() {
  saving.value = true
  try {
    if (editId.value) {
      await productStore.updateProduct(editId.value, form.value)
      $q.notify({ type: 'positive', message: 'แก้ไขสินค้าแล้ว' })
    } else {
      await productStore.addProduct(form.value)
      $q.notify({ type: 'positive', message: 'เพิ่มสินค้าแล้ว' })
    }
    showDialog.value = false
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'บันทึกไม่สำเร็จ' })
  } finally {
    saving.value = false
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'ยืนยันการลบ',
    message: `ต้องการลบ "${row.name}" ใช่หรือไม่?`,
    cancel: true
  }).onOk(async () => {
    try {
      await productStore.deleteProduct(row.id)
      $q.notify({ type: 'positive', message: 'ลบสินค้าแล้ว' })
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'ลบไม่สำเร็จ' })
    }
  })
}

onMounted(async () => {
  try {
    await productStore.fetchProducts()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'โหลดสินค้าไม่สำเร็จ' })
  }
})
</script>
