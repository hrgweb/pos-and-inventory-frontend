<template>
  <div class="login">
    <form method="POST" @submit.prevent="signIn">
      <SharedError v-if="Object.keys(err).length" :msg="err?.message"/>

      <div class="flex flex-column gap-2">
        <label for="email">Email</label>
        <InputText id="email" v-model="form.email" />
      </div>
      <br />

      <div class="flex flex-column gap-2">
        <label for="password">Password</label>
        <InputText id="password" type="password" v-model="form.password" />
      </div>
      <br />

      <Button label="Login" severity="info" type="submit" />
    </form>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false, middleware: 'sanctum:guest' })

const { login } = useSanctumAuth()

type Form = {
  email: string
  password: string
}

const form: Form = reactive({
  email: '',
  password: ''
})

const client = useSanctumClient()

const err: any = reactive({})

async function signIn() {
  try {
    await useAsyncData('sanctum', () => client('/sanctum/csrf-cookie'))

    await login(form)
  } catch (error: any) {
    Object.assign(err, error.data)
  }
}
</script>

<style lang="scss">
form {
  background: #fff;
  width: 450px;
  height: auto;
  margin: 5rem auto;
  padding: 2rem;
  border-radius: 0.55555rem;
}
</style>
