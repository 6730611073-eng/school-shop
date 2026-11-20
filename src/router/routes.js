const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'products', component: () => import('../pages/ProductsPage.vue') },
      {
        path: 'login',
        name: 'login',
        component: () => import('../pages/LoginPage.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../pages/RegisterPage.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('../pages/CartPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('../pages/OrdersPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'admin/products',
        name: 'admin-products',
        component: () => import('../pages/AdminProductsPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

export default routes
