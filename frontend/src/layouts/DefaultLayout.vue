<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import DeepStarfield from '@/components/effects/DeepStarfield.vue'
</script>

<template>
  <div class="layout">
    <DeepStarfield />
    <AppHeader />
    <main class="main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.main {
  flex: 1;
  padding-top: var(--header-height);
  display: flex;
  flex-direction: column;
}

/* ── Page Transition ──────────── */

.page-enter-active,
.page-leave-active {
  transition:
    opacity var(--duration-normal) var(--ease-out-expo),
    transform var(--duration-normal) var(--ease-out-expo);
  backface-visibility: hidden;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 769px) {
  .page-enter-from {
    transform: translateX(20px);
  }

  .page-leave-to {
    transform: translateX(-20px);
  }
}
</style>
