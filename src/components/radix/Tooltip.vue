<script setup>
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'radix-vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
    default: 'top',
    validator(value) {
      return ['top', 'right', 'bottom', 'left'].includes(value);
    },
  },
  offset: {
    type: Number,
    required: false,
    default: 5,
  },
  delay: {
    type: Number,
    required: false,
    default: 200,
  },
  theme: {
    type: String,
    required: false,
    default: 'light',
    validator(value) {
      return ['light', 'dark'].includes(value);
    },
  },
});
</script>

<template>
  <TooltipProvider :delay-duration="delay">
    <TooltipRoot>
      <TooltipTrigger>
        <slot></slot>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          v-if="!disabled"
          :side="location"
          :side-offset="offset"
          :class="{
            'tooltip-content': true,
            'content-light': theme === 'light',
            'content-dark': theme === 'dark',
          }"
        >
          <ul>
            {{
              text
            }}
            <TooltipArrow
              :width="30"
              :height="15"
              class="tooltip-arrow"
            />
          </ul>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style lang="scss">
.content-light {
  --content-bg-color: #6c757d;
  --content-text-color: #fff;
}

.content-dark {
  --content-bg-color: #f8f9fa;
  --content-text-color: #212529;
}

.tooltip-content {
  color: var(--content-text-color);
  background-color: var(--content-bg-color);
  padding: 0.25rem 0.5rem;
  text-align: center;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 400;
  transform-origin: var(--radix-tooltip-content-transform-origin);
  animation: scaleIn 0.2s ease-out;
}

div[data-radix-popper-content-wrapper] {
  z-index: 2000 !important;
}

.tooltip-arrow {
  fill: var(--content-bg-color);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
