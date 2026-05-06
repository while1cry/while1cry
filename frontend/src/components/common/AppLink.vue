<script setup lang="ts">
interface Props {
  to: string
  external?: boolean
}

defineProps<Props>()
</script>

<template>
  <a
    v-if="external"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
    class="app-link"
  >
    <slot />
  </a>
  <RouterLink v-else :to="to" class="app-link">
    <slot />
  </RouterLink>
</template>

<style scoped>
.app-link {
  color: var(--color-text-secondary);
  transition: color var(--duration-fast) var(--ease-out-quart);
  position: relative;
}

.app-link:hover {
  color: var(--color-starlight);
}

.app-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-starlight);
  transition: width var(--duration-normal) var(--ease-out-expo);
}

.app-link:hover::after {
  width: 100%;
}
</style>
