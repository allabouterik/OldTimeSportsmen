<template>
  <div class="SlideshowZoom">
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

<script>
export default {
  name: 'SlideshowZoom',

  props: {
    slides: {
      default: () => [],
      type: Array,
    },
  },

  data() {
    return {
      activeIndex: 0,
      time: 0,
      translateFactor: 1.5,
      intervalClock: null,
    };
  },

  computed: {
    images() {
      return this.slides.map((a) => a.img);
    },
  },

  beforeMount() {
    this.createKeyFrames();
    this.goToIndex(0);
    this.startInterval();
  },

  unmounted() {
    // Clear the interval if the component is destroyed to prevent memory leaks
    clearInterval(this.intervalClock);
  },

  methods: {
    goToIndex(index) {
      this.activeIndex = index;
      this.time = this.interval(index);
    },

    imgStyle(index) {
      let css = {};
      css.animationName = 'keyframe-' + (index + 1);
      css.transformOrigin = 'center';
      return css;
    },

    scaleFrom(index) {
      return this.slides[index].hasOwnProperty('scaleFrom')
        ? this.slides[index].scaleFrom
        : 0.8;
    },

    scaleTo(index) {
      return this.slides[index].hasOwnProperty('scaleTo')
        ? this.slides[index].scaleTo
        : 1.0;
    },

    startInterval() {
      const precision = 100;
      this.intervalClock = setInterval(() => {
        this.time -= precision;
        if (this.time <= 0) {
          this.next();
        }
      }, precision);
    },

    interval(index) {
      // return 1000*this.slides[index].duration
      return 5000;
    },

    next() {
      let nextIndex = this.activeIndex + 1;
      // Go to the first image if the active image ist the last one
      if (!this.images[nextIndex]) {
        nextIndex = 0;
      }
      this.goToIndex(nextIndex);
    },

    createKeyFrames() {
      for (let i = 0; i < this.slides.length; i++) {
        let startPos = [0, 0, 0]; // x, y, z   (center)
        const num = i + 1;
        const scaleFrom = this.scaleFrom(i);
        const scaleTo = this.scaleTo(i);
        const Tx = this.translateFactor * startPos[0];
        const Ty = this.translateFactor * startPos[1];
        let style = document.createElement('style');
        const keyFrame =
          '\
        @keyframes keyframe-' +
          num +
          ' {\
          0% {\
            transform: scale3d(' +
          scaleFrom +
          ', ' +
          scaleFrom +
          ', 1) translate3d(' +
          Tx +
          '%, ' +
          Ty +
          '%, 0);\
          }\
          100% {\
            transform: scale3d(' +
          scaleTo +
          ', ' +
          scaleTo +
          ', 1) translate3d(0, 0, 0);\
          }\
        }';
        style.innerHTML = keyFrame;
        document.head.appendChild(style);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.SlideshowZoom {
  --translateFactor: 1.5%;
  background-color: transparent;

  &__slides {
    position: relative;
    display: flex;
    justify-content: center;
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
