<script setup lang="ts">
import { ref, computed } from 'vue';
import ImageLightBox from '@/components/ImageLightBox.vue';
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
  captionAlign: {
    type: String,
    required: false,
    default: 'center',
  },
  captionContainWithinCard: {
    type: Boolean,
    default: false,
    required: false,
  },
  width: {
    type: [Number, String],
    required: false,
    default: '100%',
  },
  height: {
    type: [Number, String],
    required: false,
    default: 'auto',
  },
  aspectRatio: {
    type: String,
    required: false,
  },
  reverseBackDims: {
    type: Boolean,
    default: false,
    required: false,
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
  classAppend: {
    type: String,
    required: false,
  },
  disableFlip: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const postcardIndex = ref<number | undefined>(undefined);
const postcardImage = ref<PostcardImageItem[] | undefined>(undefined);

const dimStylesFront = computed(() => ({
  width: typeof props.width === 'number' ? props.width + 'px' : props.width,
  height: typeof props.height === 'number' ? props.height + 'px' : props.height,
  aspectRatio: props.aspectRatio,
  cursor: props.imgBackLarge ? 'pointer' : 'auto',
}));

const dimStylesBack = computed(() => ({
  width: props.reverseBackDims ? props.width : props.height,
  height: props.reverseBackDims ? props.height : props.width,
  aspectRatio: props.reverseBackDims
    ? props.aspectRatio?.split('/').reverse().join('/')
    : props.aspectRatio,
}));

const captionStyles = computed(() => {
  if (props.captionContainWithinCard) {
    return {
      width: typeof props.width === 'number' ? props.width + 'px' : props.width,
      textAlign: props.captionAlign,
    };
  } else {
    return {
      textAlign: props.captionAlign,
      alignSelf:
        props.captionAlign === 'left'
          ? 'flex-start'
          : props.captionAlign === 'right'
          ? 'flex-end'
          : 'center',
    };
  }
});

const includeLightBox = computed(() => {
  return props.imgBackLarge && props.backText;
});

const lightBoxOpen = () => {
  if (!includeLightBox.value) return;

  if (props.backTextIsHTML) {
    postcardImage.value = [
      {
        img: props.imgBackLarge || '',
        HTMLcaption: props.backText,
      },
    ];
  } else {
    postcardImage.value = [
      {
        img: props.imgBackLarge || '',
        caption: props.backText,
      },
    ];
  }
  postcardIndex.value = 0;
};
</script>

<template>
  <div
    class="flex flex-col items-center"
    :class="classAppend"
  >
    <div
      class="flip-card"
      :class="{ 'flip-card__flip': !disableFlip }"
      :style="dimStylesFront"
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
            :style="dimStylesFront"
          />
        </div>
        <div
          v-if="!disableFlip"
          class="flip-card-back"
        >
          <img
            :src="imgBack"
            :alt="caption"
            :style="dimStylesBack"
          />
        </div>
      </div>

      <!-- <div
        v-if="captionContainWithinCard"
        class="font-bembo font-normal italic text-14px pt-2"
        :style="{ textAlign: captionAlign }"
      >
        {{ caption }}
      </div> -->

      <ImageLightBox
        v-if="includeLightBox"
        :images="postcardImage"
        :index="postcardIndex"
        :disable-scroll="true"
        @close="
          postcardIndex = undefined;
          postcardImage = undefined;
        "
        :centreTitle="false"
      />
    </div>

    <p
      class="font-bembo font-normal italic text-14px lg:text-16px pt-2"
      :style="captionStyles"
    >
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
.flip-card__flip:hover .flip-card-inner {
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
  background-color: #000;
  color: white;
  transform: rotateY(180deg);
}
</style>
