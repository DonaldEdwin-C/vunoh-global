<script setup>
import { useAuth } from '@/composables/useAuth'
import { reactive } from 'vue'
import {
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'
import {
  Sidebar,
  SidebarContent,

  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: 'icon' },
  class: { type: null, required: false },
})

const { user, logout } = useAuth()
const data = reactive({

  teams: [
    {
      name: 'Vunoh Global',
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: 'Services',
      url: '/admin/services',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Service Listings',
      url: '/admin/listings',
      icon: Bot,
    },
    { title: 'Users', url: '/admin/users', icon: Settings2 },
  ],
  projects: [
    { name: 'Service Listings', url: '#', icon: Frame },
    { name: 'Reviews', url: '#', icon: PieChart },
    { name: 'Travel', url: '#', icon: Map },
  ],
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavProjects :projects="data.projects" />
    </SidebarContent>

    <div v-if="user" class="flex justify-end p-3">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button class="min-w-full" variant="outline"> {{ user.name }} </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="destructive" @click="logout">Log out</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <SidebarRail />
  </Sidebar>
</template>
