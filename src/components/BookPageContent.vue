<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef, watch } from 'vue';
import BookViewer from '@/components/BookViewer.vue';
import ShootToTop from '@/components/ShootToTop.vue';
import { useResponsive } from '@/composables/useResponsive';

const videoUrl = 'https://player.vimeo.com/video/283168900';

const bookImages = {
  width: 713,
  height: 535,
  commonPathStdRes:
    'https://res.cloudinary.com/all-about-erik/image/upload/f_auto/Publications/2.%20Old-Time%20Sportsmen/Book%20Images/FullScreen/',
  commonFilenameStdRes: 'Old-Time_Sportsmen-_full',
  commonPathHiRes:
    'https://res.cloudinary.com/all-about-erik/image/upload/f_auto/Publications/2.%20Old-Time%20Sportsmen/Book%20Images/Zoomed%20sm/',
  commonFilenameHiRes: 'Old-Time_Sportsmen-zm',
  orientation: 'landscape',
  commonFilenameStartNum: 1,
  commonFilenameLastNum: 97,
};

const getBookImagesUrls = (
  urlCommon: string,
  startNum: number,
  lastNum: number
) => {
  let pages = [null] as Array<string | null>; // first element is null so that cover page appears on its own
  for (let i = startNum; i <= lastNum; i++) {
    let url = urlCommon + i + '.jpg';
    pages.push(url);
  }
  return pages;
};

const bookImagesUrlsStdRes = computed(() => {
  return getBookImagesUrls(
    bookImages.commonPathStdRes + bookImages.commonFilenameStdRes,
    bookImages.commonFilenameStartNum,
    bookImages.commonFilenameLastNum
  );
});

const bookImagesUrlsHiRes = computed(() => {
  return getBookImagesUrls(
    bookImages.commonPathHiRes + bookImages.commonFilenameHiRes,
    bookImages.commonFilenameStartNum,
    bookImages.commonFilenameLastNum
  );
});

const isBookFullscreen = ref(false);
const bookShowSinglePage = ref(false);
const bookKey = ref(0);
const mainColWidth = ref(900);

const windowWidth = useResponsive().width;
const isDesktop = useResponsive().isDesktop;

const bookVpHeight = computed(() => {
  if (bookImages === undefined) return;
  const pageWidth = bookImages.width;
  const pageHeight = bookImages.height;

  let actualHeight;
  if (isDesktop.value) {
    // show double pages
    const twoPagesWidth = 2 * pageWidth;
    let actualWidth = Math.min(twoPagesWidth, mainColWidth.value);
    actualHeight = (actualWidth / twoPagesWidth) * pageHeight;
    bookShowSinglePage.value = false;
  } else {
    // show single pages
    let actualWidth = Math.min(pageWidth, mainColWidth.value);
    actualHeight = (actualWidth / pageWidth) * pageHeight;
    bookShowSinglePage.value = true;
  }

  return actualHeight + 'px';
});

const videoFrameStyles = computed(() => {
  const maxVidWidth = 954.656;
  const maxVidHeight = 537;

  let actualWidth =
    maxVidWidth < mainColWidth.value ? maxVidWidth : mainColWidth.value;
  let actualHeight = (actualWidth / maxVidWidth) * maxVidHeight;

  return {
    width: actualWidth + 'px',
    height: actualHeight + 'px',
  };
});

const reloadBook = () => {
  bookKey.value += 1; // increment component key to force reload between toggle of fullscreen / normal-screen
};

const toggleFullscreen = () => {
  isBookFullscreen.value = !isBookFullscreen.value;
  reloadBook();
};

const updateMainColWidth = () => {
  let element = document.getElementById('mainCol');
  if (!element) return;
  let elemRect = element.getBoundingClientRect();
  mainColWidth.value = elemRect.width;
};

onMounted(() => {
  updateMainColWidth();
});

watch(windowWidth, () => {
  updateMainColWidth();
  reloadBook();
});
</script>

<template>
  <div id="mainCol">
    <section
      class="flex flex-col items-center justify-center md:my-8 p-5 lg:p-6 xl:p-8 2xl:p-12 bg-cover bg-center bg-[url(../assets/images/book-video-bg_mbl.png)] md:bg-[url(../assets/images/book-video-bg_tablet.png)] 2xl:bg-[url(../assets/images/book-video-bg_desktop.png)]"
    >
      <h2
        class="font-francois-one text-15px md:text-32px lg:text-36px 2xl:text-40px text-center text-white tracking-wide uppercase md:pt-6 lg:pt-0 pb-2 lg:pb-4 xl:pb-6 2xl:pb-8"
      >
        Watch our entertaining video about the book
      </h2>
      <iframe
        :src="videoUrl + '?autoplay=0&color=505050&title=0&byline=0&portrait=0'"
        style="max-width: 100%"
        :style="videoFrameStyles"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        title="Book Promo Video"
      >
      </iframe>
    </section>

    <section
      class="flex flex-col items-center justify-center p-5 md:pt-0 lg:p-6 lg:pt-0 xl:p-8 xl:pt-0 2xl:p-12"
    >
      <p
        class="font-bembo text-16px lg:text-20px xl:text-24px 2xl:text-32px text-justify"
      >
        In the first years of the 20th century, newly mobile American travelers,
        hunters, and fisherman headed out by horseback, buggy, car, and boat.
        Their destination? The Great Outdoors! Whether in the photo studio or
        out with their new “Brownie” cameras, successful hunters and fishers
        posed proudly with their catches, sending their photographic postcards,
        then called “postals,” back home through the US Mail. Separated by vast
        distances, before the advent of the telephone, friends and family were
        naturally excited to receive a note and photo sent from afar. In 1907 an
        estimated 656 million cards were sent in the United States alone!
      </p>
    </section>

    <section
      class="flex flex-col items-center justify-center p-7 md:pl-12 md:py-14 lg:pl-16 2xl:pl-24 2xl:pb-12 bg-cover bg-center bg-[url(../assets/images/book-reader-bg_mbl.png)] md:bg-[url(../assets/images/book-reader-bg_tablet.png)] 2xl:bg-[url(../assets/images/book-reader-bg_desktop.png)]"
    >
      <h2
        class="font-francois-one text-22px md:text-32px lg:text-36px 2xl:text-40px text-center text-white tracking-wide uppercase pt-2 pb-3 xl:pt-0"
      >
        Leaf through the pages!
      </h2>
      <div class="flex flex-row w-full h-full">
        <div class="w-full">
          <BookViewer
            v-if="bookImagesUrlsStdRes && bookImagesUrlsHiRes"
            :key="'bookViewer' + bookKey"
            :pages="bookImagesUrlsStdRes"
            :pagesHiRes="bookImagesUrlsHiRes"
            :isFullscreen="isBookFullscreen"
            :viewportHeight="bookVpHeight"
            :showSinglePage="bookShowSinglePage"
            @toggleFullscreen="toggleFullscreen()"
            @reload="reloadBook()"
          />
        </div>
      </div>
    </section>
  </div>

  <div class="mt-4">
    <ShootToTop :staticImg="true" />
  </div>
</template>
