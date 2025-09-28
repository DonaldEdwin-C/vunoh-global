import { createRouter, createWebHistory } from 'vue-router';

import HomeClient from '@/views/client/HomeClient.vue';
import ProfileClient from '@/views/client/ProfileClient.vue';
import HomeProvider from '@/views/provider/HomeProvider.vue';
import ProfileProvider from '@/views/provider/ProfileProvider.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import HomeAdmin from '@/views/admin/HomeAdmin.vue';
import UsersAdmin from '@/views/admin/UsersAdmin.vue';
import ListingsView from '@/views/admin/ListingsView.vue';
import ServicesAdmin from '@/views/admin/ServicesAdmin.vue';
import LoginAdmin from '@/views/admin/LoginAdmin.vue';
import ListingsProvider from '@/views/provider/ListingsProvider.vue';
import RequestClient from '@/views/client/RequestClient.vue';
import RequestsView from '@/views/provider/RequestsView.vue';

const routes = [
  {
    path: '/auth',
    name: 'auth',
    meta: { layout: 'AuthLayout' },
    children: [
      { path: 'login', name: 'auth.login', component: LoginView },
      { path: 'register', name: 'auth.register', component: RegisterView },
       {
        path: 'admin',
        name: 'auth.admin',
        component: LoginAdmin,
      },
    ],
  },


  {
    path: '/client',
    name: 'client',
    meta: { layout: 'ClientLayout', requiresAuth: true, role: 'client' },
    children: [
      { path: '', name: 'client.home', component: HomeClient },
      { path: 'profile', name: 'client.profile', component: ProfileClient },
      { path: 'requests', name: 'client.requests', component: RequestClient },

    ],
  },

    {
    path: '/provider',
    name: 'provider',
    meta: { layout: 'ProviderLayout', requiresAuth: true, role: 'provider' },
    children: [
      { path: '', name: 'provider.home', component: HomeProvider },
      { path: 'listings', name: 'provider.listings', component: ListingsProvider },
      { path: 'profile', name: 'provider.profile', component: ProfileProvider },
      { path: 'requests', name: 'provider.requests', component: RequestsView },


    ],
  },

  {
    path: '/admin',
    meta: {  layout: 'AdminLayout', role: 'admin' },
    children: [
      { path: '', name: 'admin.home', component: HomeAdmin },
      { path: 'users', name: 'admin.users', component: UsersAdmin },
      { path: 'listings', name: 'admin.listings', component: ListingsView },
      { path: 'services', name: 'admin.services', component: ServicesAdmin },
      { path: 'users', name: 'admin.users', component: UsersAdmin },




    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'auth.login', replace: true })
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return next({ name: '404', replace: true })
  }

  next()
})
export default router;
