<script setup lang="ts">

let gameInstance: Phaser.Game | null = null
const gameDownloaded = ref(false)
const containerId = 'game-container'

const downloadGame = async(): Promise<void> => {
  const game = await import('@/game/Game')
  gameDownloaded.value = true
  nextTick(() => {
    gameInstance = game.launch(containerId)
  })
}

onMounted(() => {
  downloadGame()
})

onUnmounted(() => {
  gameInstance?.destroy(false)
})

</script>

<template>
  <div v-if="gameDownloaded" :id="containerId"></div>
</template>

<style>

#game-container canvas:first-child {
  border-radius: 10px;
}

</style>
