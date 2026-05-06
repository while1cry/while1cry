<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoadingScreen from '@/components/effects/LoadingScreen.vue'
import VolumeSetup from '@/components/effects/VolumeSetup.vue'

const isLoaded = ref(false)
const showVolumeSetup = ref(false)

function onLoaded() {
  isLoaded.value = true

  const setupDone = localStorage.getItem('volume-setup-done')
  if (!setupDone) {
    showVolumeSetup.value = true
  }
}

function onVolumeSetupDone() {
  showVolumeSetup.value = false
  localStorage.setItem('volume-setup-done', '1')
}

function preventContextMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('input, textarea, [contenteditable="true"]')) return
  e.preventDefault()
}

onMounted(() => {
  document.addEventListener('contextmenu', preventContextMenu)
})
</script>

<template>
  <LoadingScreen @loaded="onLoaded" />

  <VolumeSetup
    v-if="showVolumeSetup"
    @done="onVolumeSetupDone"
  />

  <div v-if="isLoaded" class="app-root">
    <DefaultLayout />
  </div>
</template>

<style>
.app-root {
  animation: app-reveal 0.6s var(--ease-out-expo) both;
}

@keyframes app-reveal {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
