<template>
  <div class="container flex">
    <div class="sidebar" style="width: 280px; max-width: 280px">
      <NuxtLink to="/dashboard">
        <span class="text-2xl font-bold">hrgweb</span>
      </NuxtLink>

      <ul class="list-none p-0 m-0">
        <li>
          <NuxtLink to="/dashboard">
            <i class="pi pi-home mr-2"></i>
            Dashboard</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/inventory">
            <i class="pi pi-server mr-2"></i>
            Inventory
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/orders">
            <i class="pi pi-shopping-bag mr-2"></i>
            Orders
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

    <div class="content">
      <div class="header">header</div>

      <div class="main">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sidebar {
  a {
    display: block;
    padding: 1rem;
    text-decoration: none;
    color: var(--surface-700) !important;
    // color: #fff !important;
    // border: 1px solid red;

    &:hover {
      background-color: var(--surface-100) !important;
    }
  }
}
</style>
