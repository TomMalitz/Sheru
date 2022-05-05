import { Scene } from 'phaser'
import testTileset from '@/game/assets/environment/tilesets/testSet.png'
import platformTileset from '@/game/assets/environment/tilesets/platformSet.png'
import player from '@/game/assets/player/player.png'
import playerTop from '@/game/assets/player/playerTop.png'
import playerBottom from '@/game/assets/player/playerBottom.png'
import testEnemy from '@/game/assets/enemies/test-enemy.png'
import xEnemy from '@/game/assets/enemies/x-enemy.png'

export default class LoadScene extends Scene {
  constructor() {
    super({ key: 'load-scene' })
  }

  preload(): void {
    this.load.spritesheet('test-set', testTileset, { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('platform-set', platformTileset, { frameWidth: 16, frameHeight: 16 })

    this.load.spritesheet('player', player, { frameWidth: 96, frameHeight: 64 })
    this.load.spritesheet('player-top', playerTop, { frameWidth: 96, frameHeight: 64 })
    this.load.spritesheet('player-bottom', playerBottom, { frameWidth: 96, frameHeight: 64 })

    this.load.spritesheet('test-enemy', testEnemy, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('x-enemy', xEnemy, { frameWidth: 32, frameHeight: 32 })
  }

  create() {
    this.scene.start('play-scene')
  }
}
