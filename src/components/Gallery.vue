<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import ImageLightBox from '@/components/ImageLightBox.vue';
import { useResponsive } from '@/composables/useResponsive';
import type { CloudinaryImage } from '@/types/CloudinaryTypes';

const props = defineProps({
  imagesLowDef: {
    type: Array as PropType<CloudinaryImage[]>,
    default: () => [],
  },
  imagesHighDefTablet: {
    type: Array as PropType<CloudinaryImage[]>,
    default: () => [],
  },
  imagesHighDefDesktop: {
    type: Array as PropType<CloudinaryImage[]>,
    default: () => [],
  },
});

const isDesktop = useResponsive().isDesktop;

const imagesHightDef = computed(() => {
  return isDesktop.value
    ? props.imagesHighDefDesktop
    : props.imagesHighDefTablet;
});

const imagesForLightBox = computed(() =>
  imagesHightDef.value.map((image) => ({
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

const isPostcardFront = (imageIndex: number) => {
  return props.imagesLowDef[imageIndex + 1]?.public_id?.endsWith('a');
};
const isPostcardBack = (imageIndex: number) => {
  return props.imagesLowDef[imageIndex]?.public_id?.endsWith('a');
};
</script>

<template>
  <div class="mx-auto px-4 md:px-8 lg:px-14 py-8">
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 lg:gap-14"
    >
      <template
        v-for="(image, imageIndex) in imagesLowDef"
        :key="image.public_id"
      >
        <div
          v-if="!isPostcardBack(imageIndex)"
          class="w-full aspect-square"
          @click="openLightBox(imageIndex)"
        >
          <img
            :src="
              encodeURI(
                `https://res.cloudinary.com/all-about-erik/image/upload/v${image.version}/${image.public_id}.${image.format}`
              )
            "
            alt="Image"
            class="w-full h-full object-contain bg-gray"
          />
          <div class="relative">
            <p
              class="inline-block font-bembo font-normal italic text-14px lg:text-16px pt-2"
            >
              {{
                image.public_id.split('/').pop()?.split('_').slice(-2).join(' ')
              }}
            </p>
            <p
              v-if="isPostcardFront(imageIndex)"
              class="inline-block absolute left-1/2 -translate-x-1/2 text-center font-francois-one font-normal text-14px lg:text-16px text-shadow-strong pt-2"
            >
              SEE THE BACK
            </p>
          </div>
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
