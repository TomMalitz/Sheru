import Player from '../entities/Player'
import PlayScene from '../scenes/PlayScene'
import { WorldConstants } from '../types/constants'

export default class CameraManager {
  playScene: PlayScene
  player: Player | null

  constructor(playScene: PlayScene) {
    this.playScene = playScene
    this.player = playScene.player
    this.create()
  }

  create(): void {
    // this.playScene.cameras.main.setRoundPixels(true)

    this.playScene.cameras.main.setBounds(
      0, 0, WorldConstants.BASE_ROOM_WIDTH * 2,
      WorldConstants.BASE_ROOM_HEIGHT * 2,
    )

    this.playScene.physics.world.setBounds(
      0, 0, WorldConstants.BASE_ROOM_WIDTH * 2,
      WorldConstants.BASE_ROOM_HEIGHT * 2,
    )

    if (this.player)
      this.playScene.cameras.main.startFollow(this.player.instance)
  }

  update(): void {
    // console.log(this.playScene.cameras.main.worldView.x, this.playScene.cameras.main.worldView.y)
    // if (this.player) {
    //   console.log(this.playScene.cameras.main.worldView.centerX % (WorldConstants.BASE_ROOM_WIDTH / 2))
    //   if (this.playScene.cameras.main.worldView.centerX % (WorldConstants.BASE_ROOM_WIDTH / 2) === 0) {
    //     console.log('NOT FOLLOWING')
    //     this.playScene.cameras.main.stopFollow()
    //   }

    //   else {
    //     console.log('FOLLOWING')
    //     this.playScene.cameras.main.startFollow(this.player.instance)
    //   }
    // }
  }
}
