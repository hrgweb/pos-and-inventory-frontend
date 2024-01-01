<template>
  <div>
    <h2>Index</h2>
    <br />

    <pre>{{ user }}</pre>

    <NuxtLink to="/dashboard">Go to dashboard</NuxtLink>
    <Button label="Logout" @click.prevent="signout" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false, middleware: 'sanctum:auth' })

const { user, logout } = useSanctumAuth()

async function signout() {
  if (!user.value) return

  await logout()
}
</script>
