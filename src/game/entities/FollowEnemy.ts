import FollowPlayer from '../components/FollowPlayer'
import Knockback from '../components/Knockback'
import PlayScene from '../scenes/PlayScene'
import Enemy from './Enemy'

export default class FollowEnemy extends Enemy {
  private _followPlayerComponent: FollowPlayer | null = null
  private _knockbackComponent: Knockback

  constructor(scene: PlayScene, key: string, instance: Phaser.Physics.Arcade.Sprite) {
    super(scene, key, instance, 300, false)
    this.instance.setSize(22, 24)
    if (scene.player) this._followPlayerComponent = this.addComponent(new FollowPlayer(this, scene.player, 75, 1000, 10))
    this._knockbackComponent = this.addComponent(new Knockback(this, new Phaser.Math.Vector2(100, 100), false))
  }

  onPlayerAttack(): void {
    super.onPlayerAttack()
    const player = this.getPlayer()
    if (player) {
      const directionVector = new Phaser.Math.Vector2(1, -1)
      if (this.instance.body.center.x < player.instance.body.center.x) directionVector.x = -1
      // if (this.instance.body.center.y > player.instance.body.center.y) directionVector.y = 1
      this._knockbackComponent.setDirectionVector(directionVector)
      this._knockbackComponent.trigger()
    }
  }

  update(): void {
    super.update()
    if (this._followPlayerComponent) {
      if (this._knockbackComponent.isInProgress()) {
        if (this._followPlayerComponent?.enabled) this._followPlayerComponent.enabled = false
      }
      else {
        this._followPlayerComponent.enabled = true
      }
    }
  }
}
