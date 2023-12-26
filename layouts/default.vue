<template>
  <div class="container surface-ground flex">
    <div class="sidebar" style="width: 280px; max-width: 280px">
      <NuxtLink to="/dashboard">
        <span class="text-2xl font-bold">hrgweb</span>
      </NuxtLink>

      <ul class="list-none p-0 m-0">
        <li>
          <NuxtLink to="/dashboard">
            <i class="pi pi-home mr-2"></i>
            Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/products">
            <i class="pi pi-shopping-bag mr-2"></i>
            Products
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/inventory">
            <i class="pi pi-server mr-2"></i>
            Inventory
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/suppliers">
            <i class="pi pi-user mr-2"></i>
            Suppliers
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/customers">
            <i class="pi pi-users mr-2"></i>
            Customers
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/revenue">
            <i class="pi pi-dollar mr-2"></i>
            Revenue
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/growth">
            <i class="pi pi-chart-bar mr-2"></i>
            Growth
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/reports">
            <i class="pi pi-chart-line mr-2"></i>
            Reports
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/settings">
            <i class="pi pi-cog mr-2"></i>
            Settings
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="content flex-1">
      <div class="header">
        <!-- <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="search" placeholder="Search" />
        </span> -->

        <p>Header</p>
      </div>

      <div class="main">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const search = ref('')
</script>

<style lang="scss">
.container {
  margin: -0.5rem;
}

.sidebar {
  a {
    display: block;
    padding: 1rem 1.2rem;
    text-decoration: none;

    &:hover {
      background-color: var(--surface-100) !important;
    }
  }
}

.header {
  padding: 1rem 0;
}

.main {
  background: #fff;
  padding: 1rem 1.2rem;
  border-radius: 6px;

  h3 {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    padding-bottom: 1rem;
  }
}
</style>
