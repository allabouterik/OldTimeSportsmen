<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import ImageLightBox from '@/components/ImageLightBox.vue';
import { useResponsive } from '@/composables/useResponsive';
import {
  getImageNumber,
  getImageTitle,
  isPostcardBackImg,
  type CloudinaryImageWithCaption,
} from '@/utils/cloudinaryUtils';

const props = defineProps({
  imagesLowDef: {
    type: Array as PropType<CloudinaryImageWithCaption[]>,
    default: () => [],
  },
  imagesMblDef: {
    type: Array as PropType<CloudinaryImageWithCaption[]>,
    default: () => [],
  },
  imagesHighDefTablet: {
    type: Array as PropType<CloudinaryImageWithCaption[]>,
    default: () => [],
  },
  imagesHighDefDesktop: {
    type: Array as PropType<CloudinaryImageWithCaption[]>,
    default: () => [],
  },
});

const isTablet = useResponsive().isTablet;
const isDesktop = useResponsive().isDesktop;

const imagesHightDef = computed(() => {
  return isDesktop.value
    ? props.imagesHighDefDesktop
    : isTablet.value
    ? props.imagesHighDefTablet
    : props.imagesMblDef;
});

const imagesForLightBox = computed(() =>
  imagesHightDef.value.map((image) => ({
    ...image,
    img: encodeURI(
      `https://res.cloudinary.com/all-about-erik/image/upload/v${image.version}/${image.public_id}.${image.format}`
    ),
    caption: getImageTitle(image),
    // htmlCaption: `<p>${getImageTitle(image)}</p>`,
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
  const thisImageNumber = getImageNumber(props.imagesLowDef[imageIndex]);
  const nextImage = props.imagesLowDef[imageIndex + 1];
  if (!nextImage) return false; // No next image to compare with
  const nextImageNumber = getImageNumber(nextImage);
  return (
    nextImage &&
    thisImageNumber === nextImageNumber &&
    isPostcardBack(imageIndex + 1)
  );
};

const isPostcardBack = (imageIndex: number) =>
  isPostcardBackImg(props.imagesLowDef[imageIndex]?.public_id || '');

const galleryThumbnails = computed(() =>
  isTablet.value || isDesktop.value ? props.imagesMblDef : props.imagesLowDef
);
</script>

<template>
  <div class="mx-auto px-4 md:px-8 lg:px-14 pt-8">
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8 lg:gap-14 justify-items-center-safe"
    >
      <template
        v-for="(image, imageIndex) in galleryThumbnails"
        :key="image.public_id"
      >
        <div
          v-if="!isPostcardBack(imageIndex)"
          class="w-full aspect-square max-w-[541px]"
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
              {{ getImageTitle(image) }}
            </p>
            <button
              v-if="isPostcardFront(imageIndex)"
              class="inline-block absolute left-1/2 -translate-x-1/2 text-center font-francois-one font-normal text-14px lg:text-16px text-shadow-strong rounded-md outline-gold outline-sold outline-0 focus-visible:outline-2 p-1 my-1"
              @click.stop="openLightBox(imageIndex + 1)"
            >
              SEE THE BACK
            </button>
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
