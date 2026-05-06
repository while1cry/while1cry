<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { navItems } from '@/data/navigation'
import { socialLinks } from '@/data/social'
import { useActiveNav } from '@/composables/useActiveNav'
import SocialIcon from '@/components/common/SocialIcon.vue'

const { isActive } = useActiveNav()
</script>

<template>
  <footer class="footer">
    <!-- Stardust divider -->
    <div class="stardust">
      <span class="stardust-line" />
      <span class="stardust-star">✦</span>
      <span class="stardust-line" />
    </div>

    <div class="footer-inner">
      <!-- Brand -->
      <div class="footer-col brand-col">
        <RouterLink to="/" class="brand">
          <span class="brand-name">while1cry</span>
          <span class="brand-dot">.</span>
          <span class="brand-tld">me</span>
        </RouterLink>
        <p class="tagline">广袤互联网世界中无人问津的一隅</p>
      </div>

      <!-- Navigation -->
      <div class="footer-col nav-col">
        <span class="col-label">导航</span>
        <nav class="footer-nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="footer-nav-link"
            :class="{ 'is-active': isActive(item.to) }"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>

      <!-- Social -->
      <div class="footer-col social-col">
        <span class="col-label">联络</span>
        <div class="social-list">
          <component
            :is="link.url ? 'a' : 'span'"
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url || undefined"
            :target="link.url ? '_blank' : undefined"
            :rel="link.url ? 'noopener noreferrer' : undefined"
            class="social-link"
            :class="{ 'is-disabled': !link.url }"
            :aria-label="link.name"
          >
            <SocialIcon :name="link.icon" :size="16" />
            <span class="social-name">{{ link.handle || link.name }}</span>
          </component>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <span class="copyright">
        &copy; {{ new Date().getFullYear() }} while1cry
      </span>
      <RouterLink to="/secret" class="secret-gate" aria-label="秘密空间">
        <span class="secret-pulse" />
        <span class="secret-symbol">✦</span>
      </RouterLink>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding: 0 var(--space-lg) var(--space-xl);
}

/* ── Stardust Divider ─────────── */

.stardust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.stardust-line {
  flex: 1;
  max-width: 120px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-nebula-weak) 40%,
    var(--color-nebula-weak) 60%,
    transparent 100%
  );
  opacity: 0.5;
}

.stardust-star {
  font-size: var(--text-xs);
  color: var(--color-nebula-dim);
  opacity: 0.6;
  animation: star-twinkle 4s ease-in-out infinite;
}

/* ── Footer Inner ─────────────── */

.footer-inner {
  max-width: var(--content-wide-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: var(--space-2xl);
  padding-bottom: var(--space-xl);
  border-bottom: var(--border-subtle);
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.col-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-xs);
  font-family: var(--font-sans);
}

/* ── Brand Column ─────────────── */

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  font-family: var(--font-serif);
  width: fit-content;
}

.brand-name {
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  transition: color var(--duration-fast);
}

.brand-dot {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
}

.brand-tld {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.brand:hover .brand-name {
  color: var(--color-starlight);
}

.tagline {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  max-width: 220px;
}

/* ── Nav Column ───────────────── */

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-nav-link {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: color var(--duration-fast) var(--ease-out-quart);
  width: fit-content;
  position: relative;
}

.footer-nav-link::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-starlight);
  transition: width var(--duration-normal) var(--ease-out-expo);
}

.footer-nav-link:hover,
.footer-nav-link.is-active {
  color: var(--color-starlight);
}

.footer-nav-link:hover::after,
.footer-nav-link.is-active::after {
  width: 100%;
}

/* ── Social Column ────────────── */

.social-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: color var(--duration-fast) var(--ease-out-quart);
  width: fit-content;
}

.social-link:hover {
  color: var(--color-starlight);
}

.social-link.is-disabled {
  cursor: default;
  opacity: 0.6;
}

.social-name {
  transition: transform var(--duration-fast) var(--ease-out-quart);
}

.social-link:hover .social-name {
  transform: translateX(2px);
}

/* ── Bottom Bar ───────────────── */

.footer-bottom {
  max-width: var(--content-wide-max-width);
  margin: 0 auto;
  padding-top: var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copyright {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-sans);
}

/* ── Secret Gate ──────────────── */

.secret-gate {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--color-text-muted);
  transition: color var(--duration-slow) var(--ease-out-expo);
  user-select: none;
}

.secret-symbol {
  position: relative;
  z-index: 1;
  font-size: var(--text-sm);
  line-height: 1;
}

.secret-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid transparent;
  transition:
    border-color var(--duration-slow) var(--ease-out-expo),
    box-shadow var(--duration-slow) var(--ease-out-expo);
}

.secret-gate:hover {
  color: var(--color-starlight);
}

.secret-gate:hover .secret-pulse {
  border-color: rgba(232, 213, 183, 0.15);
  box-shadow: 0 0 12px rgba(232, 213, 183, 0.08);
  animation: secret-breathe 2.5s ease-in-out infinite;
}

@keyframes secret-breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.1;
  }
}

/* ── Responsive ───────────────── */

@media (max-width: 640px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    text-align: center;
    justify-items: center;
  }

  .footer-col {
    align-items: center;
    width: 100%;
  }

  .brand {
    justify-content: center;
    width: auto;
    margin: 0 auto;
  }

  .tagline {
    max-width: none;
    text-align: center;
  }

  .col-label {
    margin-left: auto;
    margin-right: auto;
  }

  .footer-nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: var(--space-sm) var(--space-lg);
  }

  .footer-nav-link {
    margin: 0 auto;
  }

  .social-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: var(--space-sm) var(--space-md);
  }

  .social-link {
    justify-content: center;
    width: auto;
    margin: 0 auto;
  }

  .footer-bottom {
    padding-top: var(--space-md);
    flex-direction: column;
    gap: var(--space-md);
  }

  .copyright {
    text-align: center;
  }
}
</style>
