<script setup>
import {
  reactive,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  useTemplateRef,
  watch,
} from 'vue';
import {
  IconBase,
  IconChevronLeft,
  IconChevronRight,
  IconCloseGallery,
} from '@/components/icons';

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
    type: [Number, undefined],
    default: undefined,
  },
  disableScroll: {
    type: Boolean,
    default: false,
  },
  background: {
    type: String,
    default: 'rgba(0, 0, 0, 1)',
  },
  interfaceColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.8)',
  },
  centreTitle: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close', 'slide']);

// Reactive state
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
const windowWidth = ref(0);
const windowHeight = ref(0);
const imageWidth = ref(0);
const iconHover = ref('');

// Computed properties
const formattedImages = computed(() =>
  props.images.map((image) =>
    typeof image === 'string' ? { url: image } : image
  )
);

const containerFactor = computed(() =>
  formattedImages.value[currentIndex.value].hasOwnProperty('HTMLcaption')
    ? 0.6
    : 0.8
);

const imageContainerCss = computed(() => ({
  width: containerFactor.value * windowWidth.value + 'px',
  height: containerFactor.value * windowHeight.value + 'px',
}));

const imageTitleCss = computed(() => {
  let css = {};
  if (props.centreTitle) {
    css.textAlign = 'center';
    css.marginTop = '20px';
  } else {
    let containerWidth = containerFactor.value * windowWidth.value;
    let containerHeight = containerFactor.value * windowHeight.value;
    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = 1502.22 / 845.0;
    const heightGoverns = containerAspectRatio >= imageAspectRatio;

    const actualImgHeight = heightGoverns
      ? containerHeight
      : containerWidth / imageAspectRatio;
    const actualImgWidth = heightGoverns
      ? actualImgHeight * imageAspectRatio
      : containerWidth;

    css.position = 'absolute';
    css.padding = 0;
    css.bottom = (containerHeight - actualImgHeight) / 2 - 40 + 'px';
    css.left = (containerWidth - actualImgWidth) / 2 + 'px';
  }
  return css;
});

const htmlCaptionCss = computed(() => {
  let css = {};
  if (props.centreTitle) {
    css.textAlign = 'center';
    css.marginTop = '20px';
  } else {
    if (isImageLoaded.value) {
      updateImageWidth();
      css.width = imageWidth.value + 'px';
    }
    css.textAlign = 'left';
    css.margin = '40px auto 0 auto';
    css.maxWidth = '600px';
  }
  return css;
});

// Methods
const close = () => {
  emit('close');
};

const prev = () => {
  if (currentIndex.value === 0) return;
  currentIndex.value -= 1;
  emit('slide', { index: currentIndex.value });
};

const next = () => {
  if (currentIndex.value === props.images.length - 1) return;
  currentIndex.value += 1;
  emit('slide', { index: currentIndex.value });
};

const imgRefs = useTemplateRef('imageRefs');

const getImageElByIndex = (index) => {
  if (!imgRefs.value) return null;
  return imgRefs.value[index];
};

const setImageLoaded = (index) => {
  const el = getImageElByIndex(index);
  isImageLoaded.value = !el ? false : el.classList.contains('loaded');
};

const imageLoaded = ($event, imageIndex) => {
  const { target } = $event;
  target.classList.add('loaded');
  if (imageIndex === currentIndex.value) {
    setImageLoaded(imageIndex);
  }
  updateImageWidth();
};

const shouldPreload = (index) => {
  const el = getImageElByIndex(index);
  const src = el?.src;
  const shouldPreload =
    !!src ||
    index === currentIndex.value ||
    index === currentIndex.value - 1 ||
    index === currentIndex.value + 1;
  return shouldPreload;
};

const updateImageWidth = () => {
  if (isImageLoaded.value) {
    let el = document.getElementById('img' + currentIndex.value);
    imageWidth.value = el.width;
  }
};

// Touch handlers
const touchstartHandler = (event) => {
  touch.count += 1;
  if (touch.count > 1) {
    touch.multitouch = true;
  }
  touch.x = event.changedTouches[0].pageX;
  touch.y = event.changedTouches[0].pageY;
};

const touchmoveHandler = (event) => {
  if (touch.flag || touch.multitouch) return;
  const touchEvent = event.touches[0] || event.changedTouches[0];
  if (touchEvent.pageX - touch.x > 40) {
    touch.flag = true;
    prev();
  } else if (touchEvent.pageX - touch.x < -40) {
    touch.flag = true;
    next();
  }
};

const touchendHandler = () => {
  touch.count -= 1;
  if (touch.count <= 0) {
    touch.multitouch = false;
  }
  touch.flag = false;
};

// Keyboard handler
const keyDownHandler = (event) => {
  switch (event.keyCode) {
    case keyMap.LEFT:
      prev();
      break;
    case keyMap.RIGHT:
      next();
      break;
    case keyMap.ESC:
      close();
      break;
  }
};

// Watch effects
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
  (val) => {
    setImageLoaded(val);
  }
);

// Lifecycle hooks
onMounted(() => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;

  nextTick(() => {
    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth;
      windowHeight.value = window.innerHeight;
      updateImageWidth();
    });
  });

  if (!document) return;
  bodyOverflowStyle.value = document.body.style.overflow;
  document.addEventListener('keydown', keyDownHandler, false);
});

onBeforeUnmount(() => {
  if (!document) return;
  if (props.disableScroll) {
    document.body.style.overflow = bodyOverflowStyle.value;
  }
  document.removeEventListener('keydown', keyDownHandler, false);
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="typeof index === 'number'"
      class="image-lightbox"
      @touchstart.passive="touchstartHandler"
      @touchmove.passive="touchmoveHandler"
      @touchend.passive="touchendHandler"
    >
      <div
        class="image-lightbox__modal"
        :style="`background: ${background}`"
      >
        <div
          class="image-lightbox__spinner"
          :class="{ hide: isImageLoaded }"
        >
          <div
            class="image-lightbox__dot"
            :style="`border-color: ${interfaceColor}`"
          />
          <div
            class="image-lightbox__dot"
            :style="`border-color: ${interfaceColor}`"
          />
          <div
            class="image-lightbox__dot"
            :style="`border-color: ${interfaceColor}`"
          />
        </div>
        <div class="image-lightbox__container">
          <ul class="image-lightbox__content">
            <li
              v-for="(image, imageIndex) in formattedImages"
              :key="imageIndex"
              :style="`transform: translate3d(${
                currentIndex * -100
              }%, 0px, 0px);`"
              class="image-lightbox__image-container"
            >
              <div
                class="image-lightbox__image"
                :style="imageContainerCss"
              >
                <img
                  ref="imageRefs"
                  :id="'img' + imageIndex"
                  :src="shouldPreload(imageIndex) ? image.img : false"
                  @load="imageLoaded($event, imageIndex)"
                  class="m-auto"
                />

                <div
                  v-show="(image.caption || image.title) && isImageLoaded"
                  class="image-lightbox__text"
                  :style="imageTitleCss"
                >
                  {{ image.caption || image.title }}
                </div>

                <div
                  v-show="image.HTMLcaption && isImageLoaded"
                  class="image-lightbox__HTMLtext"
                  :style="htmlCaptionCss"
                  v-html="image.HTMLcaption"
                />
              </div>
            </li>
          </ul>
        </div>

        <div
          id="leftArrowContainer"
          v-if="currentIndex > 0"
          @mouseenter="iconHover = 'left'"
          @mouseleave="iconHover = ''"
          @click="prev()"
        >
          <IconBase
            width="20"
            height="33"
            iconName="close"
            :strokeColor="iconHover === 'left' ? '#e3c570' : '#ebe0c0'"
            class="image-lightbox__prev"
          >
            <IconChevronLeft />
          </IconBase>
        </div>

        <div
          id="rightArrowContainer"
          v-if="currentIndex + 1 < images.length"
          @mouseenter="iconHover = 'right'"
          @mouseleave="iconHover = ''"
          @click="next()"
        >
          <IconBase
            width="20"
            height="33"
            iconName="close"
            :strokeColor="iconHover === 'right' ? '#e3c570' : '#ebe0c0'"
            class="image-lightbox__next"
          >
            <IconChevronRight />
          </IconBase>
        </div>

        <div
          @mouseenter="iconHover = 'close'"
          @mouseleave="iconHover = ''"
          @click="close()"
        >
          <IconBase
            width="21.5"
            height="21.5"
            iconName="close"
            :strokeColor="iconHover === 'close' ? '#e3c570' : '#ebe0c0'"
            class="image-lightbox__close"
          >
            <IconCloseGallery />
          </IconBase>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Crimson+Text:600,600i&display=swap');

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

.image-lightbox {
  &__modal {
    position: fixed;
    display: block;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
    z-index: 1002;
    display: block;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
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
      display: inline-block;
      position: relative;
      margin: 0 auto;
      max-width: 100%;
      max-height: 100%;
    }
    & img {
      & {
        max-width: 100%;
        max-height: 100%;
        height: 100%;
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
    // position: absolute;
    z-index: 1000;
    display: block;
    margin: 0 auto;
    box-sizing: border-box;

    color: #ffffff;
    font-family: 'NeueHaasGroteskText Pro55', sans-serif;
    font-feature-settings: 'liga';
    font-size: 1.3125rem; /* 21px with 16px default size */
    font-weight: 400;
    letter-spacing: 5px;
    text-transform: uppercase;
    text-rendering: auto;
    // transition: all  .5s ease .0s;
    line-height: 1.3125rem; /* 21px with 16px default size */
    white-space: normal;
    // see imageTitleCss() in computed for further properties
  }
  &__HTMLtext {
    z-index: 1000;
    display: block;
    // margin: 0 auto;
    box-sizing: border-box;

    color: #ffffff;
    font-family: 'Crimson Text', serif;
    font-feature-settings: 'liga';
    font-size: 1.125rem; /* 18px with 16px default size */
    font-weight: 600;
    // font-style: italic;
    letter-spacing: 1px;
    text-align: left;
    text-rendering: auto;
    line-height: 1.375rem; /* 22px with 16px default size */
    white-space: normal;
  }

  &__next,
  &__prev,
  &__close {
    position: absolute;
    z-index: 1002;
    display: block;
    background: transparent;
    border: 0;
    line-height: 0;
    outline: none;
    cursor: pointer;
  }
  &__next {
    top: 50%;
    transform: translate(0, -50%);
    right: 8.5%;
    vertical-align: middle;
  }
  &__prev {
    top: 50%;
    transform: translate(0, -50%);
    left: 8.5%;
  }
  &__close {
    top: 40px;
    right: 60px;
  }
  &__spinner {
    & {
      position: absolute;
      z-index: 1003;
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
// transition fade on opening / closing of lightbox
.fade-enter-active,
.fade-leave-active {
  position: fixed;
  z-index: 1000;
  // transition: opacity 0.2s;
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  position: fixed;
  opacity: 0;
  z-index: 1000;
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

/* Responsive breakpoints ref: https://getbootstrap.com/docs/4.3/layout/overview/ */

/* Extra small devices (portrait phones, less than 576px) */
@media only screen and (max-width: 575.98px) {
  .image-lightbox {
    &__text {
      font-size: 0.8125rem; /* 13px with 16px default size */
    }
    &__next {
      right: 1.5%;
    }
    &__prev {
      left: 1.5%;
    }
    &__close {
      top: 10px;
      right: 20px;
    }
  }
}

/* Small devices (landscape phones, 576px and up) */
@media only screen and (min-width: 576px) and (max-width: 767.98px) {
  .image-lightbox {
    &__text {
      font-size: 0.9375rem; /* 15px with 16px default size */
    }
    &__next {
      right: 3%;
    }
    &__prev {
      left: 3%;
    }
    &__close {
      top: 20px;
      right: 30px;
    }
  }
}

/* Medium devices (tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 991.98px) {
  .image-lightbox {
    &__text {
      font-size: 1.0625rem; /* 17px with 16px default size */
    }
    &__next {
      right: 4.5%;
    }
    &__prev {
      left: 4.5%;
    }
    &__close {
      top: 30px;
      right: 40px;
    }
  }
}

/* Large devices (desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .image-lightbox {
    &__text {
      font-size: 1.1875rem; /* 19px with 16px default size */
    }
    &__next {
      right: 6.5%;
    }
    &__prev {
      left: 6.5%;
    }
    &__close {
      top: 40px;
      right: 50px;
    }
  }
}
</style>
