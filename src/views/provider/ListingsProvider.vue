<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'

const store = useStore()

const searchQuery = ref('')
const showAddModal = ref(false)
const newListing = ref({ title: '', description: '', price: '', category_id: '', images: [] })

const listings = computed(() => store.state.provider.listings)
const loadingListings = computed(() => store.state.provider.loadingListings)

onMounted(() => store.dispatch('provider/fetchListings'))

function handleFiles(event) {
  newListing.value.images = event.target.files
}

async function submitListing() {
  const formData = new FormData()
  formData.append('title', newListing.value.title)
  formData.append('description', newListing.value.description)
  formData.append('price', newListing.value.price)
  formData.append('category_id', newListing.value.category_id)
  for (let i = 0; i < newListing.value.images.length; i++) {
    formData.append('images[]', newListing.value.images[i])
  }
  await store.dispatch('provider/createListing', formData)
  showAddModal.value = false
  newListing.value = { title: '', description: '', price: '', category_id: '', images: [] }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">Your Listings</h1>
      <Button @click="showAddModal = true">Add Listing</Button>
    </div>

    <Input v-model="searchQuery" placeholder="Search listings..." class="w-full max-w-md mb-4 mx-auto" />

    <div v-if="loadingListings" class="text-center py-20 text-gray-500">Loading Listings...</div>
    <div v-else-if="!listings.length" class="text-center py-20 text-gray-500">No listings yet.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="listing in listings" :key="listing.id" class="hover:shadow-lg transition cursor-pointer border border-gray-200 rounded-lg overflow-hidden">
        <img v-if="listing.images?.[0]" :src="listing.images[0].image_url" class="w-full h-48 object-cover" />
        <CardContent class="p-4">
          <CardTitle class="text-lg font-semibold">{{ listing.title }}</CardTitle>
          <p class="text-gray-600 text-sm mt-1">{{ listing.description }}</p>
          <p class="mt-2 font-medium">Price: KES {{ listing.price ?? 'N/A' }}</p>
          <p class="mt-1 font-medium">Category: {{ listing.category?.name ?? 'N/A' }}</p>
          <p class="mt-1 text-sm text-gray-500">Status: <span class="capitalize">{{ listing.status }}</span></p>
        </CardContent>
      </Card>
    </div>

    <!-- Add Listing Modal -->
    <Dialog v-model="showAddModal">
      <DialogContent class="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="submitListing" class="space-y-4 mt-2">
          <Input v-model="newListing.title" placeholder="Title" />
          <Input v-model="newListing.description" placeholder="Description" />
          <Input v-model="newListing.price" type="number" placeholder="Price" />
          <Input v-model="newListing.category_id" type="number" placeholder="Category ID" />
          <Input type="file" multiple @change="handleFiles" />
          <DialogFooter>
            <Button type="submit" class="w-full">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  </div>
</template>
