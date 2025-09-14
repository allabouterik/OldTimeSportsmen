<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import LeftChevron from '@/assets/icons/LeftChevron.vue';
import RightChevron from '@/assets/icons/RightChevron.vue';
import ImageMagnifier from '@/components/ImageMagnifier.vue';

const keyMap = {
  LEFT: 37,
  RIGHT: 39,
  ESC: 27,
};

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    default: 0,
  },
  background: {
    type: String,
    default: 'rgba(0, 0, 0, 0.8)',
  },
  interfaceColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.8)',
  },
  isOldTime: {
    type: Boolean,
    default: false,
  },
  minWindowWidthForZoom: {
    type: Number,
    default: 1366,
  },
  disableScroll: {
    type: Boolean,
    default: false,
  },
  disableZoom: {
    type: Boolean,
    default: false,
  },
});

const currentIndex = ref(props.index);
const isImageLoaded = ref(false);
const bodyOverflowStyle = ref('');
const touch = reactive({
  count: 0,
  x: 0,
  y: 0,
  multitouch: false,
  flag: false,
});
const headerHeight = ref(0);
const windowWidth = ref(0.0);
const interval = ref(null);
const currentImageWidth = ref(0);
const resizeObserver = ref(null);

const formattedImages = computed(() => {
  return props.images.map((image) =>
    typeof image === 'string' ? [{ img: image }] : image
  );
});

const viewerStyles = computed(() => {
  return {
    '--headerHeight': headerHeight.value + 'px',
    '--arrowOffset': dynamicArrowOffset.value,
  };
});

const dynamicArrowOffset = computed(() => {
  if (currentImageWidth.value === 0 || windowWidth.value === 0) {
    return '8.5%'; // fallback to default
  }

  // Calculate the space on each side of the image
  const availableSpace = (windowWidth.value - currentImageWidth.value) / 2;

  // Position arrows halfway between image edge and viewport edge
  const idealOffset = availableSpace / 2;

  // But no more than 100px from the image edge
  // This means the arrow should be at most 100px away from the image edge
  const maxDistanceFromImage = 100;
  const maxOffset = Math.min(idealOffset, maxDistanceFromImage);

  // The offset from the viewport edge is: availableSpace - maxOffset
  const offsetFromViewportEdge = availableSpace - maxOffset;

  // Convert to percentage of viewport width
  const offsetPercentage = (offsetFromViewportEdge / windowWidth.value) * 100;

  // Ensure minimum offset for usability (minimum distance from viewport edge)
  return Math.max(offsetPercentage, 3) + '%';
});

function clearTheInterval() {
  clearInterval(interval.value);
}
function prev() {
  if (currentIndex.value === 0) return;
  currentIndex.value -= 1;
}
function next() {
  if (currentIndex.value === props.images.length - 1) return;
  currentIndex.value += 1;
}
function imageLoaded(img_el, imageIndex) {
  img_el.classList.add('loaded');
  if (imageIndex === currentIndex.value) {
    isImageLoaded.value = !img_el ? false : img_el.classList.contains('loaded');
    // Update current image width when the current image loads
    // Add a small delay to ensure the image has settled into its final dimensions
    setTimeout(updateCurrentImageWidth, 50);
  }
}

function updateCurrentImageWidth() {
  // Find the current image element
  const currentImageContainer = document.querySelector(
    '[data-current="true"] .image-magnifier img'
  );
  if (currentImageContainer) {
    // Use requestAnimationFrame to ensure we get the post-layout dimensions
    requestAnimationFrame(() => {
      const rect = currentImageContainer.getBoundingClientRect();
      if (rect.width > 0) {
        currentImageWidth.value = rect.width;
      } else {
        // If width is still 0, try again after a short delay
        setTimeout(() => {
          const retryRect = currentImageContainer.getBoundingClientRect();
          if (retryRect.width > 0) {
            currentImageWidth.value = retryRect.width;
          }
        }, 100);
      }
    });
  }
}

function observeImageResize() {
  // Set up ResizeObserver to monitor current image size changes
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLImageElement;
        const currentImage = document.querySelector(
          '[data-current="true"] .image-magnifier img'
        );
        if (target === currentImage && entry.contentRect.width > 0) {
          currentImageWidth.value = entry.contentRect.width;
        }
      }
    });

    // Observe all image-magnifier images
    const images = document.querySelectorAll('.image-magnifier img');
    images.forEach((img) => observer.observe(img));

    return observer;
  }
  return null;
}
function bindEvents() {
  document.addEventListener('keydown', keyDownHandler, false);
}
function unbindEvents() {
  document.removeEventListener('keydown', keyDownHandler, false);
}
function touchstartHandler(event) {
  touch.count += 1;
  if (touch.count > 1) {
    touch.multitouch = true;
  }
  touch.x = event.changedTouches[0].pageX;
  touch.y = event.changedTouches[0].pageY;
}
function touchmoveHandler(event) {
  if (touch.flag || touch.multitouch) return;
  const touchEvent = event.touches[0] || event.changedTouches[0];
  if (touchEvent.pageX - touch.x > 40) {
    touch.flag = true;
    prev();
  } else if (touchEvent.pageX - touch.x < -40) {
    touch.flag = true;
    next();
  }
}
function touchendHandler() {
  touch.count -= 1;
  if (touch.count <= 0) {
    touch.multitouch = false;
  }
  touch.flag = false;
}
function keyDownHandler(event) {
  switch (event.keyCode) {
    case keyMap.LEFT:
      prev();
      break;
    case keyMap.RIGHT:
      next();
      break;
    default:
      break;
  }
}
function getElementOffset(el) {
  let top = 0;
  let left = 0;
  let element = el;
  do {
    top += element?.offsetTop || 0;
    left += element?.offsetLeft || 0;
    element = element?.offsetParent;
  } while (element);
  return {
    top,
    left,
  };
}
function observeNavLinksPosition() {
  interval.value = setInterval(() => {
    let navLinksEl = document.getElementById('navLinksRow');
    headerHeight.value = getElementOffset(navLinksEl).top;
  }, 500);
}

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
    let navLinksEl = document.getElementById('navLinksRow');
    headerHeight.value = getElementOffset(navLinksEl).top;
    // Update image width on resize
    setTimeout(updateCurrentImageWidth, 100);
  });
  window.addEventListener('orientationchange', () => {
    windowWidth.value = window.innerWidth;
    let navLinksEl = document.getElementById('navLinksRow');
    headerHeight.value = getElementOffset(navLinksEl).top;
    // Update image width on orientation change
    setTimeout(updateCurrentImageWidth, 100);
  });
  if (!document) return;
  observeNavLinksPosition();
  setTimeout(() => {
    clearTheInterval();
  }, 8000);
  bodyOverflowStyle.value = document.body.style.overflow;
  bindEvents();

  // Set up ResizeObserver for better image dimension tracking
  resizeObserver.value = observeImageResize();
});

onBeforeUnmount(() => {
  if (!document) return;
  if (props.disableScroll) {
    document.body.style.overflow = bodyOverflowStyle.value;
  }
  clearTheInterval();
  unbindEvents();

  // Clean up ResizeObserver
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

watch(
  () => props.index,
  (val) => {
    if (!document) return;
    currentIndex.value = val;
    if (props.disableScroll && typeof val === 'number') {
      document.body.style.overflow = 'hidden';
    } else if (props.disableScroll && !val) {
      document.body.style.overflow = bodyOverflowStyle.value;
    }
  }
);

watch(
  () => currentIndex.value,
  () => {
    // Update image width when current index changes
    setTimeout(updateCurrentImageWidth, 100);
  }
);
</script>

<template>
  <div
    v-if="typeof index === 'number'"
    class="collection-viewer"
    @touchstart.passive="touchstartHandler"
    @touchmove.passive="touchmoveHandler"
    @touchend.passive="touchendHandler"
    :style="viewerStyles"
  >
    <div
      class="collection-viewer__modal"
      :style="`background: ${background}`"
    >
      <div :class="['collection-viewer__spinner', !isImageLoaded || 'hide']">
        <div
          class="collection-viewer__dot"
          :style="`border-color: ${interfaceColor}`"
        />
        <div
          class="collection-viewer__dot"
          :style="`border-color: ${interfaceColor}`"
        />
        <div
          class="collection-viewer__dot"
          :style="`border-color: ${interfaceColor}`"
        />
      </div>

      <div
        id="navLinksRow"
        class="w-full text-center px-0"
      >
        <div
          v-if="!disableZoom && windowWidth > minWindowWidthForZoom"
          class="collection-viewer__text"
        >
          HOVER OVER IMAGE FOR CLOSE-UP
        </div>
      </div>

      <div class="collection-viewer__container">
        <ul class="collection-viewer__content">
          <li
            v-for="(image, imageIndex) in formattedImages"
            :key="imageIndex"
            :style="`transform: translate3d(${
              currentIndex * -100
            }%, 0px, 0px);`"
            class="collection-viewer__image-container"
            :data-current="imageIndex === currentIndex"
          >
            <div
              class="collection-viewer__image"
              style="position: relative"
              :class="{ 'lg:mt-8!': disableZoom }"
            >
              <ImageMagnifier
                :src="image.img"
                :zoom-src="image.img"
                :zoom="2"
                :zoom-diameter="500"
                zoom-radius="50%"
                :show-cursor="true"
                :min-window-width="minWindowWidthForZoom"
                :disable-zoom="disableZoom"
                @imgloaded="imageLoaded($event, imageIndex)"
              />

              <div
                v-if="isOldTime"
                class="collections_headerLinkText"
              >
                <span>READ ALL ABOUT IT</span>
                <br />
                <span>KEEP SCROLLING</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <LeftChevron
        v-if="currentIndex > 0"
        alt="Left arrow, click for previous image"
        class="prevArrow arrowImg h-auto transition-colors text-white hover:text-gold-light"
        @click="prev()"
      />

      <RightChevron
        v-if="currentIndex + 1 < images.length"
        alt="Left arrow, click for previous image"
        class="nextArrow arrowImg h-auto transition-colors text-white hover:text-gold-light"
        @click="next()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: NeueHaasGroteskText Pro55;
  src: url('../assets/fonts/nhaasgrotesktxpro-55rg.eot'); /* IE9 Compat Modes */
  src: url('../assets/fonts/nhaasgrotesktxpro-55rg.eot?#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */ url('../assets/fonts/nhaasgrotesktxpro-55rg.woff')
      format('woff'),
    /* Pretty Modern Browsers */
      url('../assets/fonts/nhaasgrotesktxpro-55rg.svg#NHaasGroteskTXPro-55Rg')
      format('svg'); /* Legacy iOS */
  font-weight: normal;
}

.collection-viewer {
  &__modal {
    position: relative;
    display: block;
    z-index: 41;
    left: 0;
    width: 100%;
    height: calc(100vh - var(--headerHeight));
    overflow: hidden;
  }
  &__content {
    height: 100%;
    width: 100%;
    white-space: nowrap;
    padding: 0;
    margin: 0;
  }
  &__container {
    position: absolute;
    z-index: 42;
    display: block;
    width: 100%;
    left: 50%;
    transform: translate(-50%, 0);
    text-align: center;
    height: 100%;
  }
  &__image-container {
    display: inline-table;
    vertical-align: middle;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: left 0.4s ease, transform 0.4s ease, -webkit-transform 0.4s ease;
  }
  &__image {
    & {
      display: flex;
      position: relative;
      max-width: 90%;
      max-height: 100%;
      height: calc(100vh - var(--headerHeight) - 20px);
      margin: 0 auto;
      padding: 20px 0 80px 0;
      justify-content: center;
    }
    & img {
      & {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        object-fit: contain;
        opacity: 0;
        transition: opacity 0.2s;
      }
      &.loaded {
        opacity: 1;
      }
    }
  }
  &__text {
    color: #fff;
    font-family: 'Francois One', sans-serif;
    font-feature-settings: 'liga';
    font-weight: 400;
    text-align: center;
    font-size: 1rem;
    line-height: 1.25;
    letter-spacing: 3%;
    margin: 14px 0 0 0;
    padding: 0px 20px;
  }
  &__spinner {
    & {
      position: absolute;
      z-index: 43;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      display: block;
      height: 15px;
      width: auto;
      box-sizing: border-box;
      text-align: center;
    }
    &.hide {
      display: none;
    }
  }
  &__dot {
    & {
      float: left;
      margin: 0 calc(15px / 2);
      width: 15px;
      height: 15px;
      border: calc(15px / 5) solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      transform: scale(0);
      box-sizing: border-box;
      animation: spinner-animation 1000ms ease infinite 0ms;
    }
    &:nth-child(1) {
      animation-delay: calc(300ms * 1);
    }
    &:nth-child(2) {
      animation-delay: calc(300ms * 2);
    }
    &:nth-child(3) {
      animation-delay: calc(300ms * 3);
    }
  }
}

@keyframes spinner-animation {
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.arrowImg {
  width: 5%;
  max-width: 24px;
  min-width: 15px;
  padding: 0;
  position: absolute;
  top: 50%;
  z-index: 1002;
  display: block;
  background: transparent;
  border: 0;
  line-height: 0;
  outline: none;
  cursor: pointer;
}
.nextArrow {
  right: var(--arrowOffset);
  transform: translate(50%, -100%);
}
.prevArrow {
  left: var(--arrowOffset);
  transform: translate(-50%, -100%);
}

.collections_headerLinkText {
  display: block;
  color: #fff;
  font-family: 'Francois One', sans-serif;
  font-feature-settings: 'liga';
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.25;
  letter-spacing: 3%;
  text-align: center;
  margin: 0 auto;
  padding: 0px;
  width: 100%;
  position: absolute;
  bottom: 35px;
  left: 0;
}
.collections_headerLinkText > span:nth-of-type(2) {
  font-size: 0.8125rem;
  bottom: 25px;
}

/* special breakpoint */
@media only screen and (width < 339px) {
  .collection-viewer {
    &__text {
      letter-spacing: 3px;
    }
  }
}

.collection-viewer {
  @media only screen and (width < 1366px) {
    --min-height: calc(
      58px + (0.714 * (100vw - (2 * 20px))) + (41.5px + 20px) + 20px
    );
    &__modal {
      height: calc(100vh - var(--headerHeight) - 20px);
      min-height: var(--min-height);
    }
    &__image {
      & {
        min-height: calc(var(--min-height) - 20px);
        padding-bottom: 60px;
      }
    }
  }

  .collections_headerLinkText {
    @media only screen and (width < 576px) {
      bottom: 42px;
    }

    @media only screen and (width >= 576px) and (width < 768px) {
      bottom: calc(42px + 10px);
    }

    @media only screen and (width >= 768px) and (width < 1366px) {
      bottom: calc(42px + 24px);
    }
  }
}
</style>
