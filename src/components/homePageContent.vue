<script setup lang="ts">
import { computed } from 'vue';
import snarkdown from 'snarkdown';
import * as homeContent from '@/content/home.md';
import { useResponsive } from '@/composables/useResponsive.ts';
import BackToTop from '@/components/BackToTop.vue';
import FlipPostcard from '@/components/FlipPostcard.vue';
import SlideshowZoom from '@/components/SlideshowZoom.vue';

const { width: windowWidth } = useResponsive();

const frontmatter = computed(() => homeContent.frontmatter);
console.log(frontmatter.value);

const postcardSizes = [
  { width: 480, height: 297 },
  { width: 487, height: 307 },
  { width: 487, height: 309 },
  { width: 487, height: 310 },
];

const renderMarkdown = (text: string) => {
  return snarkdown(text);
};

const postcardsSidebarStyles = computed(() => {
  if (windowWidth.value < 1150) {
    return {
      flex: 0,
    };
  }
  return {};
});
</script>

<template>
  <section class="postcardHistory">
    <div class="container max-w-screen px-4">
      <div class="flex flex-row align-items-center">
        <div
          v-if="windowWidth >= 2200"
          style="padding-top: 250px"
          class="flex flex-col self-start"
        >
          <SlideshowZoom :slides="homeContent.frontmatter.people_images" />
        </div>

        <div
          v-if="homeContent.frontmatter.postcardHistory"
          class="flex flex-col"
        >
          <div class="postcardHistory__textDiv">
            <h2 class="title">{{ homeContent.frontmatter.title }}</h2>
            <div class="pb-2 pb-sm-4">
              <div
                class="pb-6 pb-xl-2 pt-4 pt-xl-0 mb-4 mb-xl-0 pl-12 pr-4"
                style="float: right"
              >
                <FlipPostcard
                  v-if="windowWidth > 850"
                  :imgFront="
                    homeContent.frontmatter.postcardHistory.postcards[0]
                      .imgFront
                  "
                  :imgBack="
                    homeContent.frontmatter.postcardHistory.postcards[0].imgBack
                  "
                  :caption="
                    homeContent.frontmatter.postcardHistory.postcards[0].caption
                  "
                  :seeTheBack="false"
                  :width="480"
                  :height="297"
                />
                <FlipPostcard
                  v-else-if="windowWidth >= 768"
                  :imgFront="
                    homeContent.frontmatter.postcardHistory.postcards[0]
                      .imgFront
                  "
                  :imgBack="
                    homeContent.frontmatter.postcardHistory.postcards[0].imgBack
                  "
                  :caption="
                    homeContent.frontmatter.postcardHistory.postcards[0].caption
                  "
                  :seeTheBack="false"
                  :width="408"
                  :height="252.45"
                />
              </div>
              <br v-if="windowWidth >= 768" />
              <span
                v-html="homeContent.frontmatter.textPt1"
                class="postcardText"
              />

              <img
                :src="homeContent.frontmatter.images[0].img"
                class="py-4 pr-4"
                style="float: left; max-width: 55%"
              />
              <span
                v-html="homeContent.frontmatter.textPt2"
                class="postcardText"
              />

              <img
                :src="homeContent.frontmatter.images[1].img"
                class="pl-4"
                style="float: right; max-width: 55%"
              />
              <span
                v-html="homeContent.frontmatter.textPt3"
                class="postcardText"
              />
            </div>
          </div>
        </div>

        <div
          v-if="windowWidth >= 2200"
          class="flex flex-col self-start"
        >
          <div
            id="postcardsSidebar"
            class="pt-4"
          >
            <FlipPostcard
              :imgFront="
                homeContent.frontmatter.postcardHistory.postcards[1].imgFront
              "
              :imgBack="
                homeContent.frontmatter.postcardHistory.postcards[1].imgBack
              "
              :imgBackLarge="
                homeContent.frontmatter.postcardHistory.postcards[1]
                  .imgBackLarge
              "
              :caption="
                homeContent.frontmatter.postcardHistory.postcards[1].caption
              "
              :width="487"
              :height="307"
              :seeTheBack="true"
              :backText="
                renderMarkdown(
                  homeContent.frontmatter.postcardHistory.postcards[1].backText
                )
              "
              :backTextIsHTML="true"
              class="sidePostcards"
            />
            <FlipPostcard
              :imgFront="
                homeContent.frontmatter.postcardHistory.postcards[2].imgFront
              "
              :imgBack="
                homeContent.frontmatter.postcardHistory.postcards[2].imgBack
              "
              :imgBackLarge="
                homeContent.frontmatter.postcardHistory.postcards[2]
                  .imgBackLarge
              "
              :caption="
                homeContent.frontmatter.postcardHistory.postcards[2].caption
              "
              :width="487"
              :height="309"
              :seeTheBack="true"
              :backText="
                renderMarkdown(
                  homeContent.frontmatter.postcardHistory.postcards[2].backText
                )
              "
              :backTextIsHTML="true"
              class="sidePostcards"
            />
            <FlipPostcard
              :imgFront="
                homeContent.frontmatter.postcardHistory.postcards[3].imgFront
              "
              :imgBack="
                homeContent.frontmatter.postcardHistory.postcards[3].imgBack
              "
              :imgBackLarge="
                homeContent.frontmatter.postcardHistory.postcards[3]
                  .imgBackLarge
              "
              :caption="
                homeContent.frontmatter.postcardHistory.postcards[3].caption
              "
              :width="487"
              :height="310"
              :seeTheBack="true"
              :backText="
                renderMarkdown(
                  homeContent.frontmatter.postcardHistory.postcards[3].backText
                )
              "
              :backTextIsHTML="true"
              class="sidePostcards"
            />
          </div>
        </div>
      </div>

      <!-- <div
        v-if="windowWidth < 2200"
        class="flex flex-row items-center justify-center"
      >
        <div
          v-if="windowWidth > 1149 && homeContent.frontmatter.people_images"
          class="flex flex-col self-start"
          style="padding-top: 250px"
        >
          <SlideshowZoom :slides="homeContent.frontmatter.people_images" />
        </div>

        <div
          v-if="homeContent.frontmatter.postcardHistory"
          class="flex flex-col self-start"
          :style="postcardsSidebarStyles"
        >
          <div
            id="postcardsSidebar"
            class="py-4"
          >
            <FlipPostcard
              v-if="windowWidth < 768"
              :imgFront="homeContent.frontmatter.postcardHistory.postcards[0].imgFront"
              :imgBack="homeContent.frontmatter.postcardHistory.postcards[0].imgBack"
              :caption="homeContent.frontmatter.postcardHistory.postcards[0].caption"
              :seeTheBack="windowWidth >= 576"
              :width="postcardSizes[0].width"
              :height="postcardSizes[0].height"
            />
            <FlipPostcard
              :imgFront="homeContent.frontmatter.postcardHistory.postcards[1].imgFront"
              :imgBack="homeContent.frontmatter.postcardHistory.postcards[1].imgBack"
              :imgBackLarge="homeContent.frontmatter.postcardHistory.postcards[1].imgBackLarge"
              :caption="homeContent.frontmatter.postcardHistory.postcards[1].caption"
              :width="postcardSizes[1].width"
              :height="postcardSizes[1].height"
              :seeTheBack="windowWidth >= 576"
              :backText="
                renderMarkdown(homeContent.frontmatter.postcardHistory.postcards[1].backText)
              "
              :backTextIsHTML="true"
              class="sidePostcards"
            />
            <FlipPostcard
              :imgFront="homeContent.frontmatter.postcardHistory.postcards[2].imgFront"
              :imgBack="homeContent.frontmatter.postcardHistory.postcards[2].imgBack"
              :imgBackLarge="homeContent.frontmatter.postcardHistory.postcards[2].imgBackLarge"
              :caption="homeContent.frontmatter.postcardHistory.postcards[2].caption"
              :width="postcardSizes[2].width"
              :height="postcardSizes[2].height"
              :seeTheBack="windowWidth >= 576"
              :backText="
                renderMarkdown(homeContent.frontmatter.postcardHistory.postcards[2].backText)
              "
              :backTextIsHTML="true"
              class="sidePostcards"
            />
            <FlipPostcard
              :imgFront="homeContent.frontmatter.postcardHistory.postcards[3].imgFront"
              :imgBack="homeContent.frontmatter.postcardHistory.postcards[3].imgBack"
              :imgBackLarge="homeContent.frontmatter.postcardHistory.postcards[3].imgBackLarge"
              :caption="homeContent.frontmatter.postcardHistory.postcards[3].caption"
              :width="postcardSizes[3].width"
              :height="postcardSizes[3].height"
              :seeTheBack="windowWidth >= 576"
              :backText="
                renderMarkdown(homeContent.frontmatter.postcardHistory.postcards[3].backText)
              "
              :backTextIsHTML="true"
              class="sidePostcards"
            />
          </div>
        </div>
      </div> -->

      <div
        v-if="homeContent.frontmatter.about"
        class="flex flex-col"
      >
        <div>
          <h2 class="title">{{ homeContent.frontmatter.about.title }}</h2>
          <span
            v-html="homeContent.frontmatter.about.text"
            class="postcardText"
          />
        </div>
      </div>

      <div class="flex flex-row mt-6">
        <div class="flex flex-col">
          <div class="postcardHistory__textDiv text-justify pt-4">
            <span class="postcardText">
              If you would like to see a large selection of the Old-Time
              Sportsmen collection, click the link below to open the gallery
              website in a new tab.
            </span>
            <div
              class="sportsmenLinkText collections_headerLinkText mx-auto"
              style="width: fit-content"
            >
              <div
                class="pt-4 pb-6"
                style="width: fit-content; max-width: 90vw"
              >
                <img
                  src="https://res.cloudinary.com/all-about-erik/image/upload/f_auto/v1587596183/Publications/2.%20Old-Time%20Sportsmen/guns-crossed_imnn0f.png"
                  alt="Guns crossed"
                  class="d-block mx-auto w-100"
                />
              </div>
            </div>
          </div>

          <BackToTop :staticImg="true" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.sportsmenLinkText {
  display: block;
  text-align: center;
  padding: 0;
  cursor: pointer;
}

.postcardHistory {
  position: relative;
  background-color: transparent;
  width: 100%;

  &__textDiv {
    width: 1058px;
    margin: 0 auto;

    .title {
      font-family: 'Francois One', sans-serif;
      font-feature-settings: 'liga';
      font-weight: 400;
      font-size: 2.5rem;
      line-height: 2.75rem;
      letter-spacing: 0.8px;
      text-align: center;
      text-transform: uppercase;
      margin: 0;
      padding: 24px 0;
    }

    .postcardText {
      font-family: 'Crimson Text', serif;
      font-feature-settings: 'liga';
      font-weight: 600;
      font-size: 1.3125rem;
      line-height: 1.5625rem;
      text-align: left;
      margin: 0px;
      padding: 0px;
    }

    .caption {
      font-family: 'Crimson Text', serif;
      font-feature-settings: 'liga';
      font-style: italic;
      font-weight: 600;
      font-size: 1.125rem;
      line-height: 1.375rem;
      letter-spacing: 1px;
      text-align: left;
      margin: 0px;
      padding: 12px 0;
    }
  }
}

.postcardHistory:after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  background-color: #e6e5df;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.sidePostcards {
  margin: 70px 0;
}

/* Responsive breakpoints ref: https://getbootstrap.com/docs/4.3/layout/overview/ */

/* Extra small devices (portrait phones, less than 576px) */
@media only screen and (max-width: 575.98px) {
  .sportsmenLinkText {
    width: fit-content;
    margin: 0 auto;
  }
  .postcardHistory {
    &__textDiv {
      width: 90%;
    }
  }
}

/* Small devices (landscape phones, 576px and up) */
@media only screen and (min-width: 576px) and (max-width: 1199.98px) {
  .postcardHistory {
    &__textDiv {
      width: 90%;
    }
  }
}
</style>
