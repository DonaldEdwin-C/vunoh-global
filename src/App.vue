<script setup>
import { RouterView, useRoute } from 'vue-router'
import {computed } from 'vue'
import AdminLayout from './layouts/AdminLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import ProviderLayout from './layouts/ProviderLayout.vue'
import ClientLayout from './layouts/ClientLayout.vue'

const route = useRoute()
const layout = computed(() => {
  const name = route.meta.layout
  return {
    AdminLayout,
    AuthLayout,
    ProviderLayout,
    ClientLayout
  }[name]
})
</script>

<template>
   <Toaster />

  <component :is="layout">
    <RouterView />
  </component>
</template>


