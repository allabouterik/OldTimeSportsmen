<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import Flipbook from './flipbook-vue/FlipBook.vue';

const props = defineProps({
  pages: {
    type: Array,
    required: true,
  },
  pagesHiRes: {
    type: Array,
    required: false,
    default: [],
  },
  startPage: {
    type: Number,
    required: false,
  },
  showSinglePage: {
    type: Boolean,
    required: false,
  },
  isFullscreen: {
    type: Boolean,
    required: false,
  },
  viewportWidth: {
    type: String,
    required: false,
    default: '100%',
  },
  viewportHeight: {
    type: String,
    required: false,
    default: '100vh',
  },
});

const emit = defineEmits(['toggleFullscreen', 'reload']);

const flipbook = ref(null);
const pageNum = ref(1);
const flipDuration = ref(1000);
const flippingToStart = ref(false);
const flippingToEnd = ref(false);
const stopFlip = ref(false);

const keyMap = {
  LEFT: 37,
  RIGHT: 39,
  ESC: 27,
};

onMounted(() => {
  if (props.startPage != null && props.startPage != undefined) {
    pageNum.value = props.startPage;
  } else {
    setPageFromHash();
  }

  if (!document) return;
  bindEvents();
});

onBeforeUnmount(() => {
  if (!document) return;
  unbindEvents();
});

function bindEvents() {
  window.addEventListener('hashchange', () => setPageFromHash(), false);
  document.addEventListener('keydown', keyDownHandler, false);
}

function unbindEvents() {
  window.removeEventListener('hashchange', () => setPageFromHash(), false);
  document.removeEventListener('keydown', keyDownHandler, false);
}

function numFlips(toPage) {
  let flips = Math.abs(toPage - flipbook.value.currentPage); // number of flips to do

  if (flipbook.value.displayedPages == 2) {
    // Is in double page mode, therefore divide flips by 2 because in each flip 2 pages are shown
    if (toPage < flipbook.value.currentPage) flips = Math.ceil(flips / 2);
    else flips = Math.floor(flips / 2);
  }
  return flips;
}

function flipToPage(toPage) {
  // not index mode
  if (toPage > flipbook.value.numPages) {
    console.error('Page out of range');
  }
  const numPages = flipbook.value.numPages;

  let pgIndex = toPage - 1; // get the page indexed by 0
  let method = pgIndex > flipbook.value.currentPage ? 'Right' : 'Left'; // Direction to go

  let flips = numFlips(toPage);

  if (flips === 0) {
    // If flips is equal to 0 it means the page is already visible
    return;
  }

  if (flips > 1) {
    // If the target page is not the next or the previous one, make the flip faster
    flipDuration.value = 300;
  }

  flipbook.value[`flip${method}`](); // make the first flip
  flips--; //subtract one flip

  if (flips > 0) {
    let interval = setInterval(() => {
      if (flipbook.value[`canFlip${method}`]) {
        flipbook.value[`flip${method}`]();
        flips--;
        if (flips == 0 || stopFlip.value) {
          clearInterval(interval);
          flipDuration.value = 1000;
          flippingToStart.value = false;
          flippingToEnd.value = false;
          stopFlip.value = false;
        }
      }
    }, 100);
  }
}

function onFlipLeftEnd(page) {
  window.location.hash = '#' + page;
}

function onFlipRightEnd(page) {
  window.location.hash = '#' + page;
}

function setPageFromHash() {
  let n = parseInt(window.location.hash.slice(1), 10);
  if (!props.pages) return;
  if (Number.isInteger(n) && n > 0 && n < props.pages.length) {
    pageNum.value = n;
  }
}

function flipToStart() {
  const toPage = 1;
  let flips = numFlips(toPage); // number of flips to do

  if (flips > 1) {
    flippingToStart.value = true;
    flipToPage(toPage);
  } else flipbook.value.flipLeft();
}

function flipToEnd() {
  let flips = numFlips(flipbook.value.numPages); // number of flips to do

  if (flips > 1) {
    flippingToEnd.value = true;
    flipToPage(flipbook.value.numPages);
  } else flipbook.value.flipRight();
}

function toggleFullscreen() {
  emit('toggleFullscreen');
}

function reload() {
  emit('reload');
}

function keyDownHandler(event) {
  switch (event.keyCode) {
    case keyMap.LEFT:
      flipbook.value.flipLeft();
      break;
    case keyMap.RIGHT:
      flipbook.value.flipRight();
      break;
    case keyMap.ESC:
      if (props.isFullscreen) toggleFullscreen();
      break;
    default:
      break;
  }
}
</script>

<template>
  <div
    id="flipbookContainer"
    :class="{ fullscreenContainer: isFullscreen }"
  >
    <Flipbook
      class="flipbook"
      :class="{ fullscreen: isFullscreen }"
      :style="{ width: viewportWidth, height: viewportHeight }"
      :pages="pages"
      :pagesHiRes="pagesHiRes"
      :startPage="pageNum"
      :flipDuration="1000"
      :singlePage="showSinglePage"
      ref="flipbook"
      v-slot="flipbook"
      @flip-left-end="onFlipLeftEnd"
      @flip-right-end="onFlipRightEnd"
    >
      <span
        class="page-num pb-4"
        id="page-num-sm"
      >
        Page {{ flipbook.page }} of {{ flipbook.numPages }}
      </span>

      <div class="action-bar">
        <div
          v-show="!flippingToStart"
          id="firstpage_icon_wrapper"
        >
          <Tooltip
            text="Go to First Page"
            :disabled="!flipbook.canFlipLeft"
            :offset="3"
          >
            <Icon
              icon="material-symbols:first-page"
              class="btn"
              :class="{ disabled: !flipbook.canFlipLeft }"
              @click="flipToStart()"
              id="firstpage_icon"
            />
          </Tooltip>
        </div>

        <div
          v-show="flippingToStart"
          id="stop_icon_start_wrapper"
        >
          <Tooltip
            text="Stop"
            :offset="3"
          >
            <Icon
              icon="material-symbols:pause"
              class="btn"
              @click="stopFlip = true"
              id="stop_icon_start"
            />
          </Tooltip>
        </div>

        <div
          id="left_icon_wrapper"
          class="btn_wrapper"
        >
          <Tooltip
            text="Previous page"
            :disabled="!flipbook.canFlipLeft"
            :offset="3"
          >
            <Icon
              icon="material-symbols:chevron-left"
              class="btn"
              :class="{ disabled: !flipbook.canFlipLeft }"
              @click="flipbook.flipLeft()"
              id="left_icon"
            />
          </Tooltip>
        </div>

        <div
          id="minus_icon_wrapper"
          class="btn_wrapper"
        >
          <Tooltip
            text="Zoom out"
            :disabled="!flipbook.canZoomOut"
            :offset="3"
          >
            <Icon
              icon="material-symbols:remove"
              class="btn"
              :class="{ disabled: !flipbook.canZoomOut }"
              @click="flipbook.zoomOut"
              id="minus_icon"
            />
          </Tooltip>
        </div>

        <span
          class="page-num"
          id="page-num-lg"
        >
          Page {{ flipbook.page }} of {{ flipbook.numPages }}
        </span>

        <div
          id="plus_icon_wrapper"
          class="btn_wrapper"
        >
          <Tooltip
            text="Zoom in"
            :disabled="!flipbook.canZoomIn"
            :offset="3"
          >
            <Icon
              icon="material-symbols:add"
              class="btn"
              :class="{ disabled: !flipbook.canZoomIn }"
              @click="flipbook.zoomIn"
              id="plus_icon"
            />
          </Tooltip>
        </div>

        <div
          id="right_icon_wrapper"
          class="btn_wrapper"
        >
          <Tooltip
            text="Next page"
            :disabled="!flipbook.canFlipRight"
            :offset="3"
          >
            <Icon
              icon="material-symbols:chevron-right"
              class="btn"
              :class="{ disabled: !flipbook.canFlipRight }"
              @click="flipbook.flipRight()"
              id="right_icon"
            />
          </Tooltip>
        </div>

        <div
          v-show="!flippingToEnd"
          id="lastpage_icon_wrapper"
          class="btn_wrapper"
        >
          <Tooltip
            text="Last page"
            :disabled="!flipbook.canFlipRight"
            :offset="3"
          >
            <Icon
              icon="material-symbols:last-page"
              class="btn"
              :class="{ disabled: !flipbook.canFlipRight }"
              @click="flipToEnd()"
              id="lastpage_icon"
            />
          </Tooltip>
        </div>

        <div
          v-show="flippingToEnd"
          id="stop_icon_end_wrapper"
          class="btn_wrapper"
        >
          <Tooltip
            text="Stop"
            :offset="3"
          >
            <StopIcon
              class="btn"
              @click="stopFlip = true"
              id="stop_icon_end"
            />
          </Tooltip>
        </div>

        <div class="btn_wrapper">
          <Tooltip
            v-if="!isFullscreen"
            text="Fullscreen"
            :offset="3"
          >
            <Icon
              icon="material-symbols:fullscreen"
              class="btn"
              @click="toggleFullscreen"
              id="fullscreen_icon"
            />
          </Tooltip>

          <Tooltip
            v-if="isFullscreen"
            text="Exit fullscreen"
            location="top"
            :offset="3"
          >
            <Icon
              icon="material-symbols:fullscreen-exit"
              class="btn"
              @click="toggleFullscreen"
              id="fullscreenExit_icon"
            />
          </Tooltip>
        </div>
      </div>
    </Flipbook>
  </div>
</template>

<style lang="scss">
#flipbookContainer {
  padding-bottom: 46px; // to account for the action-bar
}

.fullscreenContainer {
  position: fixed;
  display: block;
  z-index: 1001;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
}
.fullscreen {
  width: 90vw !important;
  height: calc(100vh - 40px - 50px) !important;
  padding: 3rem 0;
  margin: 0 auto;
  z-index: 2000;
}
.fullscreen .container {
  max-width: 100%;
}

.action-bar {
  width: 100%;
  height: 30px;
  padding: 10px 0;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  .btn_wrapper {
    margin-left: 10px;
  }

  .btn {
    font-size: 30px;
    color: #999;
    padding: 0;
    cursor: pointer;

    &:not(:first-child) {
      margin-left: 10px;
    }

    &:active {
      filter: none !important;
    }

    &:hover {
      color: #ccc;
      filter: drop-shadow(1px 1px 5px #000);
    }

    &.disabled {
      pointer-events: none;
      // color: #666;

      .material-design-icon__svg {
        background-color: #666;
      }
    }

    svg {
      bottom: 0;
    }
  }

  .page-num {
    color: white;
    font-size: 1rem;
    margin-left: 30px;
    margin-right: 20px;
  }
}

.flipbook .bounding-box {
  box-shadow: 0 0 20px #000;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in;
}

/* Responsive breakpoints ref: https://getbootstrap.com/docs/4.3/layout/overview/ */
@media only screen and (max-width: 991.98px) {
  #page-num-lg {
    display: none;
  }
  #page-num-sm {
    display: block;
    text-align: center;
  }
  #flipbookContainer {
    padding-bottom: 86px; // to account for the action-bar
  }
}
@media only screen and (min-width: 992px) {
  #page-num-sm {
    display: none;
  }
}
</style>
