<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'

const store = useStore()
const searchQuery = ref('')
const modalOpen = ref(false)
const selectedListing = ref(null)

const requestForm = ref({
  delivery_date: '',
  price_offered: '',
})

onMounted(() => {
  store.dispatch('clientListings/fetchApprovedListings')
})

const listings = computed(() => store.state.clientListings.listings)
const loading = computed(() => store.state.clientListings.loading)

const filteredListings = computed(() => {
  if (!searchQuery.value) return listings.value
  return listings.value.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function openModal(listing) {
  selectedListing.value = listing
  requestForm.value = { delivery_date: '', price_offered: '' }
  modalOpen.value = true
}

async function submitRequest() {
  if (!selectedListing.value) return
  try {
    await store.dispatch('requests/createRequest', {
      listing_id: selectedListing.value.id,
      delivery_date: requestForm.value.delivery_date || null,
      price_offered: requestForm.value.price_offered || null,
    })
    modalOpen.value = false
    alert('Request sent successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to send request.')
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-center mb-6">Available Services</h1>

    <Input
      v-model="searchQuery"
      placeholder="Search services..."
      class="max-w-md mx-auto mb-6"
    />

    <div v-if="loading" class="text-center py-20 text-gray-500">Loading...</div>
    <div v-else-if="filteredListings.length === 0" class="text-center py-20 text-gray-500 border rounded-md">
      No approved listings found.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="listing in filteredListings"
        :key="listing.id"
        class="hover:shadow-lg transition cursor-pointer"
      >
        <img
          v-if="listing.images?.length"
          :src="listing.images[0].image_url"
          class="w-full h-48 object-cover rounded-t-md"
        />
        <CardContent class="p-4">
          <CardHeader>
            <CardTitle>{{ listing.title }}</CardTitle>
          </CardHeader>
          <p class="text-sm text-gray-600">{{ listing.description }}</p>
          <p class="font-medium">Price: KES {{ listing.price ?? 'N/A' }}</p>
          <p class="font-medium">Category: {{ listing.category?.name }}</p>

          <Dialog v-model="modalOpen">
            <DialogTrigger asChild>
              <Button variant="outline" class="mt-2 w-full" @click="openModal(listing)">
                Request Service
              </Button>
            </DialogTrigger>

            <DialogContent class="max-w-[85%] mx-auto">
              <DialogHeader>
                <DialogTitle>Request: {{ selectedListing?.title }}</DialogTitle>
              </DialogHeader>

              <div class="flex flex-col md:flex-row gap-6 mt-2">
                <!-- Service Image -->
                <div class="flex-shrink-0 w-full md:w-1/3">
                  <img
                    v-if="selectedListing?.images?.length"
                    :src="selectedListing.images[0].image_url"
                    class="w-full h-64 object-cover rounded-md"
                  />
                </div>

                <!-- Request Form -->
                <div class="flex-1 space-y-4">
                  <p class="text-gray-600">{{ selectedListing?.description }}</p>
                  <p class="font-medium">Price: KES {{ selectedListing?.price ?? 'N/A' }}</p>
                  <p class="font-medium">Category: {{ selectedListing?.category?.name }}</p>

                  <div class="space-y-3 mt-4">
                    <Label>Delivery Date</Label>
                    <Input type="date" v-model="requestForm.delivery_date" />

                    <Label>Price You Want to Pay</Label>
                    <Input
                      type="number"
                      v-model="requestForm.price_offered"
                      placeholder="Enter your offered price"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter class="mt-4">
                <Button variant="primary" class="w-full" @click="submitRequest">Send Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
