<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const store = useStore()
const services = computed(() => store.state.admin.services)
const loading = computed(() => store.state.admin.loading)

onMounted(() => {
  store.dispatch('admin/fetchServices')
})

const open = ref(false)
const name = ref('')
const description = ref('')

const addService = async () => {
  await store.dispatch('admin/createService', {
    name: name.value,
    description: description.value,
  })
  name.value = ''
  description.value = ''
  open.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Services</h1>

      <Dialog>
        <DialogTrigger as-child>
          <Button>Add Service</Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a New Service</DialogTitle>
          </DialogHeader>

          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="serviceName" class="text-right">Name</Label>
              <Input
                id="serviceName"
                v-model="name"
                placeholder="Service name"
                class="col-span-3"
              />
            </div>

            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="serviceDescription" class="text-right">Description</Label>
              <Input
                id="serviceDescription"
                v-model="description"
                placeholder="Short description"
                class="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" @click="addService">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div v-if="loading">Loading…</div>
    <div v-else class="grid md:grid-cols-3 gap-4">
      <Card v-for="s in services" :key="s.id">
        <CardHeader>
          <CardTitle>{{ s.name }}</CardTitle>
        </CardHeader>
        <CardContent>{{ s.description }}</CardContent>
      </Card>
    </div>
  </div>
</template>
