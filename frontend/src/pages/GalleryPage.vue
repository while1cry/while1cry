<script setup lang="ts">
import { ref } from 'vue'
import { galleryImages } from '@/data/gallery'
import type { GalleryImage } from '@/types'

const images = ref<GalleryImage[]>(galleryImages)

const lightboxImage = ref<GalleryImage | null>(null)
const lightboxIndex = ref(0)

function openLightbox(img: GalleryImage) {
  lightboxImage.value = img
  lightboxIndex.value = images.value.findIndex((i) => i.id === img.id)
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxImage.value = null
  lightboxIndex.value = 0
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
}

function showNext() {
  if (images.value.length === 0) return
  lightboxIndex.value = (lightboxIndex.value + 1) % images.value.length
  lightboxImage.value = images.value[lightboxIndex.value] ?? null
}

function showPrev() {
  if (images.value.length === 0) return
  lightboxIndex.value = (lightboxIndex.value - 1 + images.value.length) % images.value.length
  lightboxImage.value = images.value[lightboxIndex.value] ?? null
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') showNext()
  if (e.key === 'ArrowLeft') showPrev()
}
</script>

<template>
  <section class="page">
    <h1 class="page-title">画廊</h1>
    <p class="page-desc">镜头截取的光，凝固在深空之中。</p>

    <div class="grid">
      <div
        v-for="(img, index) in images"
        :key="img.id"
        class="gallery-item"
        :style="{ animationDelay: `${index * 80}ms` }"
        @click="openLightbox(img)"
      >
        <div class="gallery-image-wrapper">
          <img
            :src="img.thumbnail"
            :alt="img.title || ''"
            loading="lazy"
            class="gallery-image"
          />
        </div>
        <div class="gallery-overlay">
          <span class="overlay-title">{{ img.title }}</span>
          <span class="overlay-desc">{{ img.description }}</span>
        </div>
        <div class="gallery-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>
      </div>
    </div>

    <Transition name="lightbox">
      <div
        v-if="lightboxImage"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="图片预览"
        @click="closeLightbox"
      >
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox" aria-label="关闭">
            ✕
          </button>

          <button
            v-if="images.length > 1"
            class="lightbox-nav lightbox-prev"
            aria-label="上一张"
            @click.stop="showPrev"
          >
            ‹
          </button>
          <button
            v-if="images.length > 1"
            class="lightbox-nav lightbox-next"
            aria-label="下一张"
            @click.stop="showNext"
          >
            ›
          </button>

          <img
            :src="lightboxImage.src"
            :alt="lightboxImage.title || ''"
            loading="lazy"
            class="lightbox-image"
          />
          <div class="lightbox-info">
            <h2 class="lightbox-title">{{ lightboxImage.title }}</h2>
            <p class="lightbox-desc">{{ lightboxImage.description }}</p>
            <p class="lightbox-counter">
              {{ lightboxIndex + 1 }} / {{ images.length }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.page {
  max-width: var(--content-wide-max-width);
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg);
  min-height: calc(100vh - var(--header-height));
}

.page-title {
  font-size: var(--text-3xl);
  color: var(--color-starlight);
  text-align: center;
  margin-bottom: var(--space-sm);
}

.page-desc {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3xl);
  font-family: var(--font-serif);
}

/* ── Grid ─────────────────────── */

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}

/* ── Gallery Item ─────────────── */

.gallery-item {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
  background: var(--color-space);
  border: 1px solid rgba(123, 143, 199, 0.06);
  animation: fade-in-up var(--duration-slow) var(--ease-out-expo) both;
  transition:
    transform var(--duration-normal) var(--ease-out-quart),
    border-color var(--duration-normal) var(--ease-out-quart),
    box-shadow var(--duration-normal) var(--ease-out-quart);
}

.gallery-item:hover {
  transform: translateY(-2px);
  border-color: rgba(123, 143, 199, 0.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.gallery-image-wrapper {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-space) 0%,
    var(--color-deep-space) 100%
  );
  position: relative;
  overflow: hidden;
}

.gallery-image-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(123, 143, 199, 0.06) 50%,
    transparent 100%
  );
  animation: shimmer 2s ease-in-out infinite;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
  transition:
    transform var(--duration-slow) var(--ease-out-expo),
    opacity var(--duration-slow) var(--ease-out-quart);
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-lg);
  background: linear-gradient(transparent 30%, rgba(6, 6, 14, 0.9) 100%);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out-quart);
  pointer-events: none;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.overlay-title {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-family: var(--font-serif);
}

.overlay-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-top: 4px;
  opacity: 0.8;
}

.gallery-hint {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: rgba(6, 6, 14, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity var(--duration-fast) var(--ease-out-quart),
    transform var(--duration-fast) var(--ease-out-quart);
  pointer-events: none;
}

.gallery-item:hover .gallery-hint {
  opacity: 1;
  transform: scale(1);
}

/* ── Lightbox ─────────────────── */

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 6, 14, 0.94);
  backdrop-filter: blur(16px);
  padding: var(--space-xl);
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: var(--radius-md);
  object-fit: contain;
  box-shadow: 0 4px 48px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  padding: var(--space-xs);
  transition: color var(--duration-fast);
  z-index: 1;
}

.lightbox-close:hover {
  color: var(--color-starlight);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.5rem;
  color: var(--color-text-secondary);
  padding: var(--space-sm) var(--space-md);
  transition: color var(--duration-fast);
  z-index: 1;
  line-height: 1;
}

.lightbox-nav:hover {
  color: var(--color-starlight);
}

.lightbox-prev {
  left: -48px;
}

.lightbox-next {
  right: -48px;
}

@media (max-width: 640px) {
  .lightbox-prev {
    left: 0;
  }
  .lightbox-next {
    right: 0;
  }
  .lightbox-nav {
    font-size: 2rem;
    padding: var(--space-xs);
  }
}

.lightbox-info {
  text-align: center;
  margin-top: var(--space-lg);
}

.lightbox-title {
  font-size: var(--text-xl);
  color: var(--color-starlight);
  margin-bottom: var(--space-xs);
  font-family: var(--font-serif);
}

.lightbox-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-family: var(--font-serif);
  max-width: 480px;
  line-height: var(--leading-relaxed);
}

.lightbox-counter {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-top: var(--space-sm);
}

/* ── Lightbox transition ──────── */

.lightbox-enter-active {
  transition: opacity 0.25s var(--ease-out-quart);
}
.lightbox-leave-active {
  transition: opacity 0.15s var(--ease-out-quart);
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active .lightbox-image {
  animation: lightbox-zoom 0.35s var(--ease-out-expo) both;
}

@keyframes lightbox-zoom {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
