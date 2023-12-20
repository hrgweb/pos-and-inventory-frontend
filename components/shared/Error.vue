<template>
  <Message :severity="severity">{{ msg }}</Message>
</template>

<script lang="ts" setup>
defineProps({
  msg: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    default: 'error'
  }
})
</script>
