<script setup>
import { ref, computed, onMounted } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useStore } from 'vuex'

const store = useStore()
const searchQuery = ref('')
const currentPage = ref(1)

onMounted(() => {
  store.dispatch('admin/fetchListings', currentPage.value)
})

const listings = computed(() => store.getters['admin/allListings'])
const pagination = computed(() => store.getters['admin/pagination'])

const filteredListings = computed(() => {
  if (!searchQuery.value) return listings.value
  return listings.value.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function changePage(page) {
  currentPage.value = page
  store.dispatch('admin/fetchListings', page)
}

function updateStatus(listing, newStatus) {
  const reason = listing.rejection_reason || 'Rejected by admin'
  store.dispatch('admin/updateListingStatus', { listingId: listing.id, status: newStatus, reason })
}

function deleteListing(listing) {
  if (!confirm('Are you sure you want to delete this listing?')) return
  store.dispatch('admin/deleteListing', listing.id)
}
</script>

<template>
  <div class="max-w-[85rem] mx-auto p-4 space-y-4">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h1 class="text-2xl font-semibold">Service Listings</h1>
      <Input v-model="searchQuery" placeholder="Search listings..." class="max-w-sm" />
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead class="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="listing in filteredListings" :key="listing.id">
          <TableCell>{{ listing.id }}</TableCell>
          <TableCell>{{ listing.title }}</TableCell>
          <TableCell>{{ listing.provider?.name ?? 'N/A' }}</TableCell>
          <TableCell>{{ listing.category?.name ?? 'N/A' }}</TableCell>
          <TableCell>{{ listing.price ?? 'N/A' }}</TableCell>
          <TableCell>
            <select
              v-model="listing.status"
              @change="updateStatus(listing, $event.target.value)"
              class="border rounded px-2 py-1 text-sm dark:bg-neutral-800 dark:text-neutral-200"
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </TableCell>
          <TableCell>{{ new Date(listing.created_at).toLocaleString() }}</TableCell>
          <TableCell class="text-end space-x-2">
            <Button size="sm" variant="destructive" @click="deleteListing(listing)">
              Delete
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex justify-center mt-4 space-x-2">
      <Button :disabled="pagination.current_page <= 1" @click="changePage(pagination.current_page - 1)">
        Prev
      </Button>
      <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
      <Button :disabled="pagination.current_page >= pagination.last_page" @click="changePage(pagination.current_page + 1)">
        Next
      </Button>
    </div>
  </div>
</template>
