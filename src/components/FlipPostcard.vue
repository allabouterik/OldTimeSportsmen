<script setup lang="ts">
import { ref, computed } from 'vue';
import seeTheBackImg from '@/assets/images/see-the-back.png';

type PostcardImageItem = {
  img: string;
  caption?: string;
  HTMLcaption?: string;
};

const props = defineProps({
  imgFront: {
    type: String,
  },
  imgBack: {
    type: String,
  },
  imgBackLarge: {
    type: String,
    required: false,
  },
  caption: {
    type: String,
    required: false,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  seeTheBack: {
    type: Boolean,
    default: false,
    required: false,
  },
  backText: {
    type: String,
    required: false,
  },
  backTextIsHTML: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const postcardIndex = ref<number | null>(null);
const postcardImage = ref<PostcardImageItem[] | null>(null);

const dimStyles = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px',
  cursor: props.imgBackLarge ? 'pointer' : 'auto',
}));

const lightBoxOpen = () => {
  if (!props.imgBackLarge || !props.backText) return;

  if (props.backTextIsHTML) {
    postcardImage.value = [
      {
        img: props.imgBackLarge,
        HTMLcaption: props.backText,
      },
    ];
  } else {
    postcardImage.value = [
      {
        img: props.imgBackLarge,
        caption: props.backText,
      },
    ];
  }
  postcardIndex.value = 0;
};
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="flip-card"
      :style="dimStyles"
      @click="lightBoxOpen()"
    >
      <img
        v-if="seeTheBack"
        :src="seeTheBackImg.src"
        alt="See the back"
        class="flip-card-seeTheBack"
        @click="lightBoxOpen()"
      />
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img
            :src="imgFront"
            :alt="caption"
            :style="dimStyles"
          />
        </div>
        <div class="flip-card-back">
          <img
            :src="imgBack"
            :alt="caption"
            :style="dimStyles"
          />
        </div>
      </div>

      <!-- <ImageLightBox
      :images="postcardImage"
      :index="postcardIndex"
      :disable-scroll="true"
      @close="
        postcardIndex = null;
        postcardImage = null;
      "
      :centreTitle="false"
    /> -->
    </div>

    <p class="font-bembo font-normal italic text-14px text-center mt-2">
      {{ caption }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
// From: https://www.w3schools.com/howto/howto_css_flip_card.asp
.flip-card {
  position: relative;
  background-color: transparent;
}
.flip-card-seeTheBack {
  position: absolute;
  top: 0%;
  right: 0%;
  transform: translate(40%, -50%);
  width: 63px;
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}
</style>
