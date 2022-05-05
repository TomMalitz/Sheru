<script setup lang="ts">

import { phaserEmitter } from '@/game/scenes/PlayScene'

const debugActive = ref(false)
const toggleDebug = () => {
  debugActive.value = !debugActive.value
  phaserEmitter.emit('toggle-debug')
}

const fps = ref(120)
const toggleFPS = (framesPerSecond: number) => {
  fps.value = framesPerSecond
  phaserEmitter.emit('toggle-fps', fps.value)
}

const gamePaused = ref(false)
const toggleGamePause = () => {
  gamePaused.value = !gamePaused.value
  if (gamePaused.value) phaserEmitter.emit('pause-game')
  else phaserEmitter.emit('resume-game')
}

</script>

<template>
  <div class="text-center w-full h-full flex flex-col justify-center items-center bg-black">
    <div class="flex h-10 my-auto my-6">
      <button class="bg-emerald-800 text-white px-3 rounded focus:outline-none mr-6" @click="toggleDebug()">
        {{ debugActive ? 'Disable Debug' : 'Enable Debug' }}
      </button>

      <div class="flex mr-6">
        <button :class="fps == 60 ? 'toggle-selected' : 'toggle-unselected'" class="focus:outline-none rounded-l border-l px-3" @click="toggleFPS(60)">
          60fps
        </button>
        <button :class="fps == 120 ? 'toggle-selected' : 'toggle-unselected'" class="focus:outline-none rounded-r border-r px-3" @click="toggleFPS(120)">
          120fps
        </button>
      </div>

      <div class="flex">
        <button class="text-white border border-white rounded px-3 w-24" @click="toggleGamePause()">
          {{ gamePaused ? 'Resume' : 'Pause' }}
        </button>
      </div>
    </div>
    <phaser-game></phaser-game>
  </div>
</template>

<style scoped>

.toggle-selected {
  @apply text-emerald-800 border-emerald-800 border;
}

.toggle-unselected {
  @apply text-white border-white border-t border-b;
}

</style>
