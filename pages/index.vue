<template>
  <div>
    <h2>Index</h2>
    <br />

    <NuxtLink to="/dashboard">Go to dashboard</NuxtLink>
    <Button label="Logout" @click.prevent="signout" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false, middleware: 'sanctum:auth' })

const { logout } = useSanctumAuth()

async function signout() {
  await logout()
}
</script>
