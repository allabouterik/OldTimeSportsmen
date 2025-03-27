<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import riflesImg from '@/assets/images/shoot-to-top-rifles.png';

const props = defineProps({
  staticImg: {
    type: Boolean,
    default: false,
  },
});

const onClickScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// For the dynamic button (not static image)
onMounted(() => {
  if (!props.staticImg) {
    window.addEventListener('scroll', myScrollFunc);
  }
});

const scrollPosY = ref(0);

const addBtnToDOM = computed(() => {
  return scrollPosY.value >= 799;
});

const myScrollFunc = () => {
  scrollPosY.value = window.scrollY;
  const btnElement = document.getElementById('scrollToTopBtn');
  if (btnElement !== null) {
    if (scrollPosY.value >= 800) {
      btnElement.classList.add('show');
    } else {
      btnElement.classList.remove('hide');
    }
  }
};
</script>

<template>
  <div v-if="staticImg">
    <div
      id="backToTopStaticDiv"
      class="flex flex-col"
      @click="onClickScrollToTop"
    >
      <span
        class="font-francois-one font-normal text-15px text-center uppercase"
      >
        Shoot to the Top
      </span>
      <!-- <img
        immediate
        alt="back to top"
        :src="riflesImg.src"
        class="hideOnHover"
      />
      <img
        immediate
        alt="back to top"
        :src="riflesImg.src"
        class="showOnHover"
      /> -->
      <img
        alt="back to top"
        :src="riflesImg.src"
      />
    </div>
  </div>

  <div
    v-else-if="addBtnToDOM"
    id="backToTopContainer"
  >
    <button
      id="scrollToTopBtn"
      class="hide flex flex-col"
      @click="onClickScrollToTop"
    >
      <span
        class="font-francois-one font-normal text-15px text-center uppercase"
      >
        Shoot to the Top
      </span>
      <img
        immediate
        alt="back to top"
        :src="riflesImg.src"
      />
    </button>
  </div>
</template>

<style scoped lang="scss">
#backToTopStaticDiv {
  cursor: pointer;
  img {
    display: block;
    width: 247px;
    max-width: 90vw;
    margin: 0 auto;
  }
}

#backToTopContainer {
  position: relative;
  top: 0;
  right: 0;
  left: 0;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

#scrollToTopBtn {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);

  padding: 15px;
  z-index: 999;

  background: rgba(20, 20, 20, 1);
  border: 0px solid rgba(56, 56, 56, 1);
  outline: none;
  color: rgb(203, 203, 201);
  border-radius: 5px;

  transition: visibility 0.8s, opacity 0.8s;
  visibility: visible;

  img {
    max-width: 150px;
  }
}

.showOnHover,
#scrollToTopBtn:hover .hideOnHover {
  display: none;
}
#scrollToTopBtn:hover .showOnHover {
  display: inline;
}

.hide {
  opacity: 0;
}
.show {
  opacity: 1;
}

/* Responsive breakpoints ref: https://getbootstrap.com/docs/4.3/layout/overview/ */

/* Extra small devices (portrait phones, less than 576px) */
@media only screen and (max-width: 575.98px) {
  button {
    font-size: 10px;
    padding: 10.5px;
    border-radius: 4px;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media only screen and (min-width: 576px) and (max-width: 767.98px) {
  button {
    font-size: 12px;
    padding: 12.75px;
    border-radius: 4.5px;
  }
}
</style>
