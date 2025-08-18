<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

const props = defineProps({
  src: {},
  zoomSrc: {},
  zoom: {
    type: Number,
    default: 6,
  },
  zoomDiameter: {
    type: Number,
    default: 500,
  },
  zoomRadius: {
    default: '0%',
  },
  zoomClass: {},
  delayIn: {
    type: Number,
    default: 0,
  },
  delayOut: {
    type: Number,
    default: 0,
  },
  showCursor: {
    type: Boolean,
    default: true,
  },
  minWindowWidth: {
    type: Number,
    default: 1366,
  },
  disableZoom: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['imgloaded']);

// Refs for DOM elements
const img = ref<HTMLImageElement | null>(null);
const imgContainer = ref<HTMLElement | null>(null);
const zoom = ref<HTMLElement | null>(null);

// State
const imgRect = ref<DOMRect | null>(null);
const imgContainerRect = ref<DOMRect | null>(null);
const zoomX = ref(0);
const zoomY = ref(0);
const zoomImgWidth = ref(0);
const zoomImgHeight = ref(0);
const zoomPosition = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
const zoomInTimeoutId = ref<number | null>(null);
const zoomOutTimeoutId = ref<number | null>(null);
const zoomShow = ref(false);
const windowWidth = ref(window.innerWidth);

const magnifierStyle = computed(() => ({
  cursor: props.showCursor ? 'default' : 'none',
}));

const zoomStyle = computed(() => ({
  '--zoomDiameter': props.zoomDiameter + 'px',
  '--zoomX': zoomX.value + 'px',
  '--zoomY': zoomY.value + 'px',
  '--zoomRadius': props.zoomRadius,
}));

const zoomImgStyle = computed(() => ({
  '--zoomImgWidth': zoomImgWidth.value + 'px',
  '--zoomImgHeight': zoomImgHeight.value + 'px',
  '--zoomPositionX': -zoomPosition.x + 'px',
  '--zoomPositionY': -zoomPosition.y + 'px',
}));

function emitImageLoaded() {
  emit('imgloaded', img.value);
}

function calcZoomSize() {
  imgRect.value = img.value ? img.value.getBoundingClientRect() : null;
  imgContainerRect.value = imgContainer.value
    ? imgContainer.value.getBoundingClientRect()
    : null;
  if (imgRect.value && props.zoom) {
    zoomImgWidth.value = props.zoom * imgRect.value.width;
    zoomImgHeight.value = props.zoom * imgRect.value.height;
  }
}

function handleOver() {
  if (zoomOutTimeoutId.value !== null) clearTimeout(zoomOutTimeoutId.value);
  calcZoomSize();
  if (props.delayIn === 0) {
    zoomShow.value = true;
  } else {
    zoomInTimeoutId.value = window.setTimeout(() => {
      zoomShow.value = true;
    }, props.delayIn);
  }
}

function handleMove(e) {
  if (!imgRect.value || !imgContainerRect.value) return;
  zoomX.value = e.clientX - imgRect.value.left - props.zoomDiameter / 2;
  zoomY.value = e.clientY - imgRect.value.top - props.zoomDiameter / 2;

  // Calculate large image offset
  zoomPosition.x =
    zoomX.value * (zoomImgWidth.value / imgRect.value.width) +
    props.zoomDiameter / 2;
  zoomPosition.y =
    zoomY.value * (zoomImgHeight.value / imgRect.value.height) +
    props.zoomDiameter / 2;

  // Note: Firfox & Safari have a different size for the "imgContainer" compared to Chrome
  // Therefore, we need to add on the offset between it and the img:
  zoomX.value += imgRect.value.left - imgContainerRect.value.left;
}

function handleOut() {
  if (zoomInTimeoutId.value !== null) clearTimeout(zoomInTimeoutId.value);
  if (props.delayOut === 0) {
    zoomShow.value = false;
  } else {
    zoomOutTimeoutId.value = window.setTimeout(() => {
      zoomShow.value = false;
    }, props.delayOut);
  }
}

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', (e) => {
    windowWidth.value = window.innerWidth;
    imgRect.value = img.value && img.value.getBoundingClientRect();
    imgContainerRect.value =
      imgContainer.value && imgContainer.value.getBoundingClientRect();
    handleMove(e);
  });
  window.addEventListener('orientationchange', () => {
    windowWidth.value = window.innerWidth;
    imgRect.value = img.value && img.value.getBoundingClientRect();
    imgContainerRect.value =
      imgContainer.value && imgContainer.value.getBoundingClientRect();
  });
});
</script>

<template>
  <div
    class="image-magnifier"
    ref="imgContainer"
  >
    <!-- <For centering the img vertically in the div, https://stackoverflow.com/a/7310398/13159696 -->
    <span class="helper" />
    <img
      :src="src"
      class="image-magnifier__img"
      ref="img"
      id="img"
      @load="emitImageLoaded"
      @mouseenter="handleOver"
      @mousemove="handleMove"
      @mouseleave="handleOut"
      :style="magnifierStyle"
    />
    <div
      v-if="!disableZoom && windowWidth > minWindowWidth"
      v-show="zoomShow"
      class="image-magnifier__zoom"
      :class="zoomClass"
      :style="zoomStyle"
      ref="zoom"
    >
      <img
        class="image-magnifier__zoomImg"
        :src="zoomSrc"
        :style="zoomImgStyle"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.helper {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.image-magnifier {
  position: relative;
  width: fit-content;
  max-width: 90%;

  &__img {
    display: inline-block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    vertical-align: middle;
    padding: 0px;
  }

  &__zoom {
    width: var(--zoomDiameter);
    height: var(--zoomDiameter);
    position: absolute;
    left: var(--zoomX);
    top: var(--zoomY);
    overflow: hidden;
    z-index: 2000;
    border: 1px solid #000;
    border-radius: var(--zoomRadius);
    background-color: #000;
    pointer-events: none;
  }

  &__zoomImg {
    width: var(--zoomImgWidth);
    min-width: var(--zoomImgWidth);
    max-width: var(--zoomImgWidth);
    height: var(--zoomImgHeight);
    will-change: transform;
    transform: translate(var(--zoomPositionX), var(--zoomPositionY));
    pointer-events: none;
  }
}

/* Extra small devices (portrait phones, less than 576px) */
@media only screen and (width < 576px) {
  .image-magnifier {
    max-width: 85%;
  }
}
</style>
