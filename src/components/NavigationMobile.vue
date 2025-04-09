<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import {
  IconBase,
  IconBook,
  IconClose,
  IconEnvelope,
  IconGallery,
  IconHome,
} from '@/components/icons';
import type { NavItem } from './Header.vue';

const props = defineProps<{
  navItems: NavItem[];
  modelValue: boolean;
}>();

const homeItem: NavItem = {
  label: 'HOME',
  slug: '',
  icon: 'home',
};

const navItems = [homeItem, ...props.navItems];

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const currentRoute = ref(window.location.pathname);

const activePrimaryNavItemIndex = ref(
  navItems.findIndex(
    (item) =>
      item.slug === currentRoute.value ||
      (item.slug === '/gallery' && currentRoute.value === '/')
  )
);

const expandedSections = ref<Set<string>>(new Set());

const toggleSection = (label: string) => {
  if (expandedSections.value.has(label)) {
    expandedSections.value.delete(label);
  } else {
    expandedSections.value.add(label);
  }
};

const isExpanded = (label: string): boolean => {
  return expandedSections.value.has(label);
};

const closeMenu = () => {
  emit('update:modelValue', false);
};

const getIconComponent = (icon: string | undefined) => {
  switch (icon) {
    case 'home':
      return IconHome;
    case 'book':
      return IconBook;
    case 'gallery':
      return IconGallery;
    case 'envelope':
      return IconEnvelope;
    default:
      return IconEnvelope;
  }
};

const getIconDimensions = (icon: string | undefined) => {
  switch (icon) {
    case 'book':
      return { width: 25, height: 25 };
    case 'close':
      return { width: 19, height: 19 };
    case 'envelope':
      return { width: 26, height: 19 };
    case 'gallery':
      return { width: 26, height: 26 };
    case 'home':
      return { width: 24, height: 24 };
    default:
      return { width: 18, height: 19 };
  }
};
</script>

<template>
  <div
    :class="[
      'xl:hidden fixed top-0 left-0 h-screen w-full max-w-sm bg-green-olive transform transition-transform duration-300 ease-in-out z-50',
      modelValue ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Close Button -->
    <button
      class="fixed top-3 left-3 w-5 h-5 m-2 focus-visible:outline-cream focus-visible:outline-2 outline-offset-2 rounded-md"
      @click="closeMenu"
    >
      <IconBase
        :width="getIconDimensions('close').width"
        :height="getIconDimensions('close').height"
        iconName="close"
        strokeColor="#E3C570"
      >
        <IconClose />
      </IconBase>
    </button>

    <!-- Navigation -->
    <div class="h-full overflow-y-auto py-16">
      <!-- Main Navigation Items -->
      <nav class="space-y-5">
        <template
          v-for="(Lvl1Item, Lvl1ItemIndex) in navItems"
          :key="Lvl1Item.label"
          class=""
        >
          <!-- Main Navigation Items with Subnav -->
          <div
            v-if="Lvl1Item.subNavItems"
            @click="toggleSection(Lvl1Item.label)"
            @keydown.enter="toggleSection(Lvl1Item.label)"
            class="grid grid-cols-[auto_minmax(auto,253px)] items-center cursor-pointer min-h-10 p-2 focus-visible:outline-cream focus-visible:outline-2 outline-offset-2"
            tabindex="0"
          >
            <IconBase
              :width="getIconDimensions(Lvl1Item.icon).width"
              :height="getIconDimensions(Lvl1Item.icon).height"
              :iconName="Lvl1Item.icon || ''"
              class="inline-block w-6 h-6 self-baseline justify-self-end mr-3 mt-1"
            >
              <component :is="getIconComponent(Lvl1Item.icon)" />
            </IconBase>
            <div>
              <span
                class="font-garage-gothic font-medium text-34px leading-none tracking-wider uppercase text-black"
                :class="{
                  'text-gold': activePrimaryNavItemIndex === Lvl1ItemIndex,
                }"
                >{{ Lvl1Item.label }}</span
              >
              <div class="w-full h-[3px] bg-gold"></div>

              <!-- Level 2 Subnav items -->
              <div
                v-if="Lvl1Item.subNavItems && isExpanded(Lvl1Item.label)"
                class="mt-4 space-y-2 -translate-x-6"
              >
                <template
                  v-for="Lvl2Item in Lvl1Item.subNavItems"
                  :key="Lvl2Item.label"
                >
                  <div
                    v-if="Lvl2Item.subNavItems"
                    @click.stop="toggleSection(Lvl2Item.label)"
                    @keydown.enter.stop="toggleSection(Lvl2Item.label)"
                    class="grid grid-cols-[auto_minmax(auto,230px)] -ml-2 p-2 focus-visible:outline-cream focus-visible:outline-2 outline-offset-2 rounded-md"
                    tabindex="0"
                  >
                    <Icon
                      icon="fa-solid:angle-right"
                      class="text-green-gray justify-self-end mt-4 mr-3 transition-transform duration-300 ease-in-out"
                      :class="{ 'rotate-90': isExpanded(Lvl2Item.label) }"
                    />
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 cursor-pointer">
                        <span
                          class="font-garage-gothic font-medium tracking-wider text-32px uppercase text-green-gray hover:text-gray-700"
                          >{{ Lvl2Item.label }}</span
                        >
                      </div>

                      <!-- Level 3 Subnav items -->
                      <div
                        v-if="isExpanded(Lvl2Item.label)"
                        class="space-y-2"
                      >
                        <template
                          v-for="Lvl3Item in Lvl2Item.subNavItems"
                          :key="Lvl3Item.label"
                        >
                          <div
                            v-if="Lvl3Item.subNavItems"
                            @click.stop="toggleSection(Lvl3Item.label)"
                            @keydown.enter.stop="toggleSection(Lvl3Item.label)"
                            class="grid grid-cols-[auto_minmax(auto,230px)] p-2 -mx-2 focus-visible:outline-cream focus-visible:outline-2 outline-offset-2 rounded-md"
                            tabindex="0"
                          >
                            <Icon
                              icon="fa-solid:angle-right"
                              class="text-white justify-self-end mt-1 mr-3 transition-transform duration-300 ease-in-out"
                              :class="{
                                'rotate-90': isExpanded(Lvl3Item.label),
                              }"
                            />
                            <div class="space-y-2">
                              <div
                                class="flex items-center gap-2 cursor-pointer"
                              >
                                <span
                                  class="font-poppins font-normal text-16px uppercase text-white hover:text-gray-700"
                                  >{{ Lvl3Item.label }}</span
                                >
                              </div>

                              <!-- Level 4 Page Links -->
                              <div
                                v-if="isExpanded(Lvl3Item.label)"
                                class="ml-4 space-y-2"
                              >
                                <a
                                  v-for="Lvl4Item in Lvl3Item.subNavItems"
                                  :key="Lvl4Item.label"
                                  :href="`/${Lvl1Item.slug}/${Lvl2Item.slug}/${Lvl3Item.slug}/${Lvl4Item.slug}`"
                                  class="block font-poppins font-normal text-16px pl-2 text-cream-light hover:text-gray-700 focus-visible:outline-cream focus-visible:outline-2 outline-offset-2 rounded-md"
                                  >{{ Lvl4Item.label }}</a
                                >
                              </div>
                            </div>
                          </div>

                          <!-- Level 3 Page Links -->
                          <a
                            v-else
                            :href="`/${Lvl1Item.slug}/${Lvl2Item.slug}/${Lvl3Item.slug}`"
                            class="block font-poppins font-normal text-16px uppercase text-white hover:text-gray-700 ml-3 p-2 focus-visible:outline-cream focus-visible:outline-2 outline-offset-2 rounded-md"
                            >{{ Lvl3Item.label }}</a
                          >
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- Level 2 Page Links -->
                  <a
                    v-else
                    :href="`/${Lvl1Item.slug}/${Lvl2Item.slug}`"
                    class="grid grid-cols-[auto_minmax(auto,230px)] items-center text-green-gray hover:text-gray-700"
                  >
                    <div></div>
                    <span
                      class="font-garage-gothic font-medium tracking-wider text-32px uppercase"
                      >{{ Lvl2Item.label }}</span
                    >
                  </a>
                </template>
              </div>
            </div>
          </div>

          <!-- Main Navigation Page Links -->
          <a
            v-else
            :href="`/${Lvl1Item.slug}`"
            class="grid grid-cols-[auto_minmax(auto,253px)] items-center p-2 focus-visible:outline-cream focus-visible:outline-2 outline-offset-2"
            :class="[
              activePrimaryNavItemIndex === Lvl1ItemIndex
                ? 'text-gold'
                : 'text-black',
            ]"
          >
            <IconBase
              :width="getIconDimensions(Lvl1Item.icon).width"
              :height="getIconDimensions(Lvl1Item.icon).height"
              :iconName="Lvl1Item.icon || ''"
              :fillColor="
                Lvl1Item.icon === 'home' ? 'currentColor' : 'transparent'
              "
              class="inline-block w-6 h-6 self-baseline justify-self-end mr-3 mt-1"
            >
              <component :is="getIconComponent(Lvl1Item.icon)" />
            </IconBase>
            <div>
              <span
                class="font-garage-gothic font-medium text-34px leading-none tracking-wider uppercase"
                >{{ Lvl1Item.label }}</span
              >
              <div class="w-full h-[3px] bg-gold"></div>
            </div>
          </a>
        </template>
      </nav>
    </div>
  </div>

  <!-- Overlay -->
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 z-40"
    @click="closeMenu"
  ></div>
</template>

<style scoped>
.bg-green-olive {
  background-color: rgb(84, 85, 70);
}
</style>
