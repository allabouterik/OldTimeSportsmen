<script setup lang="ts">
import { EventBus } from '@/composables/event-bus';
import Tooltip from '@/components/radix/Tooltip.vue';
import musicBanjoImage from '@/assets/images/playmusic-banjo.png';
import musicPlayThatBanjoImage from '@/assets/images/playmusic-play-that-banjo.png';
import musicStopThatBanjoImage from '@/assets/images/playmusic-stop-that-banjo.png';
import MusicIcon from '@/assets/icons/MusicIcon.vue';
import { useResponsive } from '@/composables/useResponsive';

import {
  ref,
  computed,
  watch,
  onMounted,
  onUpdated,
  onBeforeUnmount,
} from 'vue';

const props = defineProps({
  audioFile: String,
  audioDuration: Number,
  audioFadeInDuration: {
    type: Number,
    default: 5,
  },
  audioFadeOutDuration: {
    type: Number,
    default: 5,
  },
  maxVolume: {
    type: Number,
    default: 1.0,
  },
  playMusic: {
    type: Boolean,
    default: true,
  },
});

const isLessThanXl = useResponsive().isLessThanXl;

const audio = ref<HTMLAudioElement | null>(null);
const audioEl = ref<HTMLAudioElement | null>(null);
const audioPlaying = ref(false);
const audioMuted = ref(true);
const audioFinished = ref(false);
const leavingPage = ref(false);
const pageFadeOutDuration = 1.4; // secs
const audioTimeAtStartPageLeave = ref(0); // secs

const LOCAL_STORAGE_MUTED_KEY = 'backgroundMusicMuted';

const tooltipText = computed(() => {
  if (audioPlaying.value && !audioMuted.value) {
    return 'Mute background music';
  } else if (audioPlaying.value && audioMuted.value) {
    return 'Unmute background music';
  }
  return 'Play background music';
});

function getAudioElement() {
  audio.value = audioEl.value;
}

function clickAudioIcon() {
  if (!audio.value) return;

  if (!audioPlaying.value) {
    playAndFadeAudio();
  } else {
    audio.value.muted = !audio.value.muted;
    audioMuted.value = !audioMuted.value;
  }
}

function playAndFadeAudio() {
  if (!audio.value) return;

  let promise = audio.value.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        audioPlaying.value = true;
        audioMuted.value = false;
        getSoundAndFadeAudio();
      })
      .catch((error) => {
        console.error('Error playing background audio: ', error);
        audioPlaying.value = false;
        audioMuted.value = false;
      });
  } else {
    audioPlaying.value = false;
    audioMuted.value = false;
  }
}

function getSoundAndFadeAudio() {
  if (!audio.value) return;

  if (audioPlaying.value) {
    audio.value.volume = 0.0;
    audio.value.currentTime = 0;

    // Fade In
    let fadeAudioIn = setInterval(() => {
      if (
        audio.value!.currentTime < props.audioFadeInDuration &&
        audio.value!.volume != props.maxVolume
      ) {
        audio.value!.volume = Math.min(
          (audio.value!.currentTime / props.audioFadeInDuration) *
            props.maxVolume,
          props.maxVolume
        );
      }
      if (
        audio.value!.currentTime >= props.audioFadeInDuration ||
        audio.value!.volume >= props.maxVolume
      ) {
        clearInterval(fadeAudioIn);
        audio.value!.volume = props.maxVolume;
      }
    }, 200);

    // Fade Out
    let fadeOutPoint = (props.audioDuration ?? 0) - props.audioFadeOutDuration;
    let fadeAudioOut = setInterval(() => {
      audioFinished.value = false;
      if (
        audio.value!.currentTime >= fadeOutPoint &&
        audio.value!.volume != 0.0
      ) {
        audio.value!.volume = Math.max(
          0.0,
          Math.min(
            props.maxVolume,
            ((props.audioDuration ?? 0) - audio.value!.currentTime) /
              props.audioFadeOutDuration
          )
        );
      } else if (leavingPage.value) {
        audio.value!.volume = Math.max(
          0.0,
          Math.min(
            props.maxVolume,
            (audioTimeAtStartPageLeave.value +
              pageFadeOutDuration -
              audio.value!.currentTime) /
              pageFadeOutDuration
          )
        );
      }

      if (audio.value!.volume < 0.05 && audio.value!.currentTime > 1) {
        if (!audioMuted.value && !leavingPage.value) {
          audioPlaying.value = false;
          audioFinished.value = true;
          clearInterval(fadeAudioOut);
        } else if (leavingPage.value) {
          audioPlaying.value = false;
          audioFinished.value = false;
          audio.value!.pause();
          audio.value!.currentTime = 0.0;
          clearInterval(fadeAudioOut);
        }
      }
    }, 200);
  }
}

function eventBusListener() {
  if (audio.value != null && audioPlaying.value && !audioMuted.value) {
    audio.value.muted = true;
    audioMuted.value = true;
  }
}

watch(audio, (val) => {
  if (val && props.playMusic && !audioPlaying.value && !!!audioMuted.value) {
    playAndFadeAudio();
  }
});
watch(audioFinished, (val) => {
  if (val) {
    playAndFadeAudio();
  }
});
watch(audioMuted, (val) => {
  if (!val && audioPlaying.value) {
    EventBus.$emit('backgroundMusicPlaying');
    localStorage.setItem(LOCAL_STORAGE_MUTED_KEY, 'false');
  } else {
    localStorage.setItem(LOCAL_STORAGE_MUTED_KEY, 'true');
  }
});
watch(audioPlaying, (val) => {
  if (val && !audioMuted.value) {
    EventBus.$emit('backgroundMusicPlaying');
  }
});

onMounted(() => {
  getAudioElement();
  EventBus.$on('audioPlaying', eventBusListener);
  EventBus.$on('lightboxMediaLoaded', eventBusListener);

  // Restore mute state from localStorage
  const storedMuted = localStorage.getItem(LOCAL_STORAGE_MUTED_KEY);
  if (storedMuted === 'true') {
    audioMuted.value = true;
  } else {
    audioMuted.value = false;
  }
});

onUpdated(() => {
  getAudioElement();
});

onBeforeUnmount(() => {
  leavingPage.value = true;
  audioTimeAtStartPageLeave.value = audio.value?.currentTime ?? 0;
  EventBus.$off('audioPlaying', eventBusListener);
  EventBus.$off('lightboxMediaLoaded', eventBusListener);
});

defineExpose({
  clickAudioIcon,
  audioEl,
  audioPlaying,
  audioMuted,
  tooltipText,
  audioFile: props.audioFile,
});
</script>

<template>
  <div v-if="audioFile">
    <Tooltip
      :text="tooltipText"
      location="bottom"
      theme="light"
    >
      <MusicIcon
        v-if="isLessThanXl"
        alt="Play background music"
        class="w-[24px] h-auto sm:w-[32px] transition-colors"
        :class="{
          'text-green-olive': !audioPlaying || audioMuted,
          'text-black': audioPlaying && !audioMuted,
        }"
        @click="clickAudioIcon()"
      />

      <div
        v-else
        class="relative w-[164.8px] h-[163.6px] bg-cover bg-[url(../assets/images/playmusic-background.png)]"
      >
        <img
          alt=""
          :src="musicBanjoImage.src"
          class="absolute top-[22%] left-[20%]"
          width="103.2"
        />
        <img
          v-if="audioPlaying && !audioMuted"
          alt="Mute background music"
          :src="musicStopThatBanjoImage.src"
          class="absolute top-[13%] left-[15%]"
          width="90"
          @click="clickAudioIcon()"
        />
        <img
          v-else
          alt="Play background music"
          :src="musicPlayThatBanjoImage.src"
          class="absolute top-[44%] left-[44%]"
          width="72"
          @click="clickAudioIcon()"
        />
      </div>
    </Tooltip>

    <audio
      controls
      ref="audioEl"
      style="display: none"
    >
      <source
        :src="audioFile"
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>
