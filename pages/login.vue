<template>
  <div class="login">
    <form method="POST" @submit.prevent="signIn">
      <div class="flex flex-column gap-2">
        <label for="email">Email</label>
        <InputText id="email" v-model="form.email" />
      </div>
      <br />

      <div class="flex flex-column gap-2">
        <label for="password">Password</label>
        <InputText id="password" v-model="form.password" />
      </div>
      <br />

      <Button label="Login" severity="info" type="submit" />
    </form>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const form = reactive({
  email: '',
  password: ''
})

function signIn() {
  alert('about to signin')
}
</script>

<style lang="scss">
form {
    background: #fff;
    width: 450px;
    height: auto;
    margin: 5rem auto;
    padding: 2rem;
    border-radius: .55555rem;
}
</style>
