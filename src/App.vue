<script setup lang="ts">
import { usePiniaLocalStorage } from './composables'
// watches pinia state changes and commits them to local storage
usePiniaLocalStorage('app-state')
</script>
<template>
  <router-view />
</template>
