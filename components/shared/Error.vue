<template>
  <Message :severity="severity" @close="$emit('closed')">{{ msg }}</Message>
</template>

<script lang="ts" setup>
const props = defineProps({
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
