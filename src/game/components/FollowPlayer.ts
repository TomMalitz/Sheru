import Component from '../ecs/Component'
import Enemy from '../entities/Enemy'
import Player from '../entities/Player'

export default class FollowPlayer extends Component<Enemy> {
  player: Player
  speed: number
  interval: number
  minDistance: number

  private _isFollowing = false
  private _intervalFunc: any = null

  constructor(entity: Enemy, player: Player, speed = 100, interval = 1000, minDistance = 100) {
    super(entity)
    this.player = player
    this.speed = speed
    this.interval = interval
    this.minDistance = minDistance * minDistance
  }

  OnAddedToEntity(): void {
    if (this.entity && this.entity.instance) {
      this.entity.instance.depth = 1 // following enemy should "float" above level
    }

    /** Interval will cause pause in player follow */
    this._isFollowing = true
    this._intervalFunc = setInterval(() => {
      this._isFollowing = !this._isFollowing
      if (this.getDistanceFromPlayer() <= this.minDistance) this._isFollowing = false // don't follow if we are already too close
    }, this.interval)
  }

  OnRemovedFromEntity(): void {
    clearInterval(this._intervalFunc)
  }

  update(): void {
    super.update()

    if (this._isFollowing && this.getDistanceFromPlayer() > this.minDistance) {
      this.entity.scene.physics.moveToObject(this.entity.instance, this.player.instance, this.speed)
    }
    else {
      this.entity.instance.setVelocityX(0)
      this.entity.instance.setVelocityY(0)
    }
  }

  private getDistanceFromPlayer(): number {
    return Phaser.Math.Distance.Squared(this.player.instance.x, this.player.instance.y, this.entity?.instance.x, this.entity?.instance.y)
  }
}
