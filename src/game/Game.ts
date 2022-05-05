import Phaser from 'phaser'
import LoadScene from './scenes/LoadScene'
import PlayScene from './scenes/PlayScene'
import { WorldConstants } from './types/constants'

function launch(containerId: string) {
  return new Phaser.Game({
    type: Phaser.WEBGL,
    input: {
      gamepad: true,
    },
    width: WorldConstants.BASE_ROOM_WIDTH,
    height: WorldConstants.BASE_ROOM_HEIGHT,
    scale: {
      zoom: 2,
    },
    backgroundColor: '#5f6160',
    parent: containerId,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: WorldConstants.GRAVITY },
        fps: 120,
        debug: true,
      },
    },
    scene: [LoadScene, PlayScene],
  })
}

export default launch
export { launch }
