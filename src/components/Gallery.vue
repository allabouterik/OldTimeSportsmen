<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import FlipPostcard from '@/components/FlipPostcard.vue';
import ImageLightBox from '@/components/ImageLightBox.vue';
import type { CloudinaryImage } from '@/types/CloudinaryTypes';

const props = defineProps({
  images: {
    type: Array as PropType<CloudinaryImage[]>,
    default: () => [],
  },
});

const imagesForLightBox = computed(() =>
  props.images.map((image) => ({
    ...image,
    img: encodeURI(
      `https://res.cloudinary.com/all-about-erik/image/upload/v${image.version}/${image.public_id}.${image.format}`
    ),
    caption: image.public_id.split('/').pop()?.split('_').slice(-2).join(' '),
  }))
);

const lightboxImageIndex = ref<number | undefined>(undefined);

const openLightBox = (index: number) => {
  lightboxImageIndex.value = index;
};

const closeLightBox = () => {
  lightboxImageIndex.value = undefined;
};
</script>

<template>
  <div class="mx-auto px-4 md:px-8 lg:px-14 py-8">
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 lg:gap-14"
    >
      <template
        v-for="(image, imageIndex) in images"
        :key="image.public_id"
      >
        <div
          v-if="images[imageIndex + 1]?.public_id?.endsWith('a')"
          class="w-full"
        >
          <FlipPostcard
            :imgFront="
              encodeURI(
                `https://res.cloudinary.com/all-about-erik/image/upload/v${image.version}/${image.public_id}.${image.format}`
              )
            "
            :imgBack="
              encodeURI(
                `https://res.cloudinary.com/all-about-erik/image/upload/v${
                  images[imageIndex + 1]?.version
                }/${images[imageIndex + 1]?.public_id}.${
                  images[imageIndex + 1]?.format
                }`
              )
            "
            :caption="
              image.public_id.split('/').pop()?.split('_').slice(-2).join(' ')
            "
            captionAlign="left"
            :captionContainWithinCard="true"
            :seeTheBack="true"
            :aspectRatio="`${image.width}/${image.height}`"
            :reverseBackDims="image.width === images[imageIndex + 1].height"
            :disableFlip="true"
            @click="openLightBox(imageIndex + 1)"
          />
        </div>

        <div
          v-else-if="!image.public_id.endsWith('a')"
          class="w-full"
          @click="openLightBox(imageIndex)"
        >
          <img
            :src="
              encodeURI(
                `https://res.cloudinary.com/all-about-erik/image/upload/v${image.version}/${image.public_id}.${image.format}`
              )
            "
            alt="Image"
            class="w-full h-auto object-cover"
          />
          <p class="font-bembo font-normal italic text-14px lg:text-16px pt-2">
            {{
              image.public_id.split('/').pop()?.split('_').slice(-2).join(' ')
            }}
          </p>
        </div>
      </template>
    </div>
  </div>

  <ImageLightBox
    :images="imagesForLightBox"
    :index="lightboxImageIndex"
    :disable-scroll="true"
    :centreTitle="false"
    @close="closeLightBox"
  />
</template>
