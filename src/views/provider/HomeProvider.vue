<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'

const store = useStore()

const activeTab = ref('listings')

const showAddModal = ref(false)
const newListing = ref({ title: '', description: '', price: '', category_id: '', images: [] })

const selectedRequest = ref(null)
const requestModal = ref(false)

const listings = computed(() => store.state.provider.listings)
const loadingListings = computed(() => store.state.provider.loadingListings)

const requests = computed(() => store.state.provider.requests)
const loadingRequests = computed(() => store.state.provider.loadingRequests)

const reviews = computed(() => store.state.provider.reviews)
const loadingReviews = computed(() => store.state.provider.loadingReviews)

const categories = ref([]) // [{id,name}]

onMounted(async () => {
  store.dispatch('provider/fetchListings')
  store.dispatch('provider/fetchRequests')
  store.dispatch('provider/fetchReviews')

  const res = await fetch('/api/categories')
  if (res.ok) categories.value = await res.json()
})

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

// Request handlers
async function updateRequest(requestId, status) {
  await store.dispatch('provider/updateRequest', { requestId, payload: { status } })
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-center">Service Provider Dashboard</h1>

    <!-- Tabs -->
    <div class="flex gap-4 justify-center mb-6">
      <Button :variant="activeTab === 'listings' ? 'primary' : 'outline'" @click="activeTab = 'listings'">Listings</Button>
      <Button :variant="activeTab === 'requests' ? 'primary' : 'outline'" @click="activeTab = 'requests'">Requests</Button>
      <Button :variant="activeTab === 'reviews' ? 'primary' : 'outline'" @click="activeTab = 'reviews'">Reviews</Button>
    </div>

    <!-- LISTINGS TAB -->
    <div v-if="activeTab === 'listings'">
      <Button class="mb-4" @click="showAddModal = true">Add Listing</Button>

      <div v-if="loadingListings" class="text-center py-20 text-gray-500">Loading Listings...</div>
      <div v-else-if="!listings.length" class="text-center py-20 text-gray-500">No listings yet.</div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="listing in listings" :key="listing.id" class="hover:shadow-lg transition cursor-pointer">
          <img v-if="listing.images?.[0]" :src="listing.images[0].image_url" class="w-full h-48 object-cover rounded-t-md" />
          <CardContent>
            <CardTitle>{{ listing.title }}</CardTitle>
            <p>{{ listing.description }}</p>
            <p>Price: KES {{ listing.price ?? 'N/A' }}</p>
            <p>Category: {{ listing.category?.name ?? 'N/A' }}</p>
            <p>Status: {{ listing.status }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Add Listing Modal -->
      <Dialog v-model="showAddModal">
        <DialogTrigger asChild>
          <Button>Add Listing</Button>
        </DialogTrigger>
        <DialogContent class="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
          </DialogHeader>
          <form @submit.prevent="submitListing" class="space-y-4">
            <Input v-model="newListing.title" placeholder="Title" />
            <Input v-model="newListing.description" placeholder="Description" />
            <Input v-model="newListing.price" type="number" placeholder="Price" />

            <!-- Friendly Category Dropdown -->
            <label class="block text-sm font-medium">Category</label>
            <select v-model="newListing.category_id" class="border rounded p-2 w-full">
              <option disabled value="">Select a category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>

            <Input type="file" multiple @change="handleFiles" />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- REQUESTS TAB -->
    <div v-if="activeTab === 'requests'">
      <div v-if="loadingRequests" class="text-center py-20 text-gray-500">Loading Requests...</div>
      <div v-else-if="!requests.length" class="text-center py-20 text-gray-500">No requests yet.</div>

      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Listing</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Price Offered</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="req in requests" :key="req.id">
            <TableCell>{{ req.id }}</TableCell>
            <TableCell>{{ req.listing.title }}</TableCell>
            <TableCell>{{ req.client.name }}</TableCell>
            <TableCell>{{ req.price_offered ?? 'N/A' }}</TableCell>
            <TableCell>{{ req.status }}</TableCell>
            <TableCell class="space-x-2">
              <Button size="sm" variant="success" @click="updateRequest(req.id,'accepted')">Accept</Button>
              <Button size="sm" variant="destructive" @click="updateRequest(req.id,'rejected')">Reject</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- REVIEWS TAB -->
    <div v-if="activeTab === 'reviews'">
      <div v-if="loadingReviews" class="text-center py-20 text-gray-500">Loading Reviews...</div>
      <div v-else-if="!reviews.length" class="text-center py-20 text-gray-500">No reviews yet.</div>
      <div v-else class="space-y-4">
        <Card v-for="review in reviews" :key="review.id">
          <CardContent>
            <p><strong>{{ review.client.name }}</strong> for <strong>{{ review.listing.title }}</strong></p>
            <p>Rating: {{ review.rating ?? 'N/A' }}</p>
            <p>{{ review.comment }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
