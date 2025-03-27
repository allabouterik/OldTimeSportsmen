<script setup lang="ts">
import { ref, computed, onBeforeMount, onUnmounted, type PropType } from 'vue';

type Slide = {
  img: string;
  scaleFrom?: number;
  scaleTo?: number;
};

const props = defineProps({
  slides: {
    default: () => [],
    type: Array as PropType<Slide[]>,
  },
  maxHeightInPx: {
    default: undefined,
    type: Number,
  },
});

const activeIndex = ref(0);
const time = ref(0);
const translateFactor = ref(1.5);
const intervalClock = ref<number | null>(null);

const images = computed(() =>
  props.slides.map((a: Slide) => {
    if (props.maxHeightInPx) {
      return a.img.replace('/f_auto/', `/f_auto/h_${props.maxHeightInPx}/`);
    }
    return a.img;
  })
);

onBeforeMount(() => {
  createKeyFrames();
  goToIndex(0);
  startInterval();
});

onUnmounted(() => {
  // Clear the interval if the component is destroyed to prevent memory leaks
  if (intervalClock.value) {
    clearInterval(intervalClock.value);
  }
});

const goToIndex = (index: number) => {
  activeIndex.value = index;
  time.value = interval(index);
};

const imgStyle = (index: number) => {
  return {
    animationName: 'keyframe-' + (index + 1),
    transformOrigin: 'center',
  };
};

const scaleFrom = (index: number) => {
  return props.slides[index]?.hasOwnProperty('scaleFrom')
    ? props.slides[index].scaleFrom
    : 0.8;
};

const scaleTo = (index: number) => {
  return props.slides[index].hasOwnProperty('scaleTo')
    ? props.slides[index].scaleTo
    : 1.0;
};

const startInterval = () => {
  const precision = 100;
  intervalClock.value = setInterval(() => {
    time.value -= precision;
    if (time.value <= 0) {
      next();
    }
  }, precision);
};

const interval = (index: number) => {
  // return 1000*this.slides[index].duration
  return 5000;
};

const next = () => {
  let nextIndex = activeIndex.value + 1;
  // Go to the first image if the active image ist the last one
  if (!images.value[nextIndex]) {
    nextIndex = 0;
  }
  goToIndex(nextIndex);
};

const createKeyFrames = () => {
  for (let i = 0; i < props.slides.length; i++) {
    let startPos = [0, 0, 0]; // x, y, z   (center)
    const num = i + 1;
    const scaleFromNum = scaleFrom(i);
    const scaleToNum = scaleTo(i);
    const Tx = translateFactor.value * startPos[0];
    const Ty = translateFactor.value * startPos[1];
    let style = document.createElement('style');
    const keyFrame =
      '\
        @keyframes keyframe-' +
      num +
      ' {\
          0% {\
            transform: scale3d(' +
      scaleFromNum +
      ', ' +
      scaleFromNum +
      ', 1) translate3d(' +
      Tx +
      '%, ' +
      Ty +
      '%, 0);\
          }\
          100% {\
            transform: scale3d(' +
      scaleToNum +
      ', ' +
      scaleToNum +
      ', 1) translate3d(0, 0, 0);\
          }\
        }';
    style.innerHTML = keyFrame;
    document.head.appendChild(style);
  }
};
</script>

<template>
  <div
    class="SlideshowZoom"
    :style="{ height: `${maxHeightInPx}px` }"
  >
    <!-- https://vuejs.org/v2/guide/transitions.html#List-Transitions -->
    <transition-group
      tag="div"
      enter-active-class="SlideshowZoom__enterActive"
      enter-class="SlideshowZoom__enter"
      leave-active-class="SlideshowZoom__leaveActive"
      leave-to-class="SlideshowZoom__leaveTo"
      class="SlideshowZoom__slides"
    >
      <img
        v-for="(image, index) in images"
        v-show="index === activeIndex"
        :key="image"
        :src="image"
        class="SlideshowZoom__image"
        :style="imgStyle(index)"
        alt=""
      />
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.SlideshowZoom {
  --translateFactor: 1.5%;
  background-color: transparent;

  &__slides {
    position: relative;
    display: flex;
    justify-content: center;
    height: 100%;
  }

  &__image {
    position: absolute;
    width: auto;
    height: auto;
    overflow: hidden;
    animation-duration: 8s;
    animation-fill-mode: forwards; // The element will retain the style values that is set by the last keyframe
  }

  &__enterActive,
  &__leaveActive {
    transition: opacity 2s linear;
  }

  &__enterFrom,
  &__leaveTo {
    opacity: 0;
  }
}
</style>
