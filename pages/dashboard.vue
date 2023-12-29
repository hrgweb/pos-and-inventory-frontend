<template>
  <div>
    <h3>Dashboard</h3>

    <pre>{{ user }}</pre>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: 'sanctum:auth' })

interface User {
  id: number
  login: string
  custom_metadata: {
    group: string
    role: string
  }
}

const user = useSanctumUser<User>()
// const client = useSanctumClient()

// onMounted(async () => {
//   const { data, pending, error, refresh } = await useAsyncData('user', () =>
//     client('/api/user')
//   )

//   console.log(data.value)
// })
</script>
