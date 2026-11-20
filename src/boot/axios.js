import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

export const API_URL =
  import.meta.env.QCLI_API_URL || 'https://6affc3957fc363ccff096b56.mockapi.io/api'
export const APP_TITLE = import.meta.env.QCLI_APP_TITLE || 'ร้านเครื่องเขียน'

const api = axios.create({ baseURL: API_URL })

async function getList(url) {
  try {
    const res = await api.get(url)
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    if (error.response && error.response.status === 404) return []
    throw error
  }
}

export const RESOURCE = '/shop'

async function getByType(type) {
  const list = await getList(RESOURCE)
  return list.filter((item) => item.type === type)
}

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api, getList, getByType }
