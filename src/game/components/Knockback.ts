import Component from '../ecs/Component'
import Enemy from '../entities/Enemy'
import Player from '../entities/Player'
import { WorldConstants } from '../types/constants'

export default class Knockback extends Component<Enemy | Player> {
  velocity: Phaser.Math.Vector2
  gravity: boolean
  duration = 500 // duration for non-gravity affected knockbacks

  private _isInProgress = false
  private _directionVector = new Phaser.Math.Vector2(1, -1)
  private _knockingUpward = false
  private _velocityApplied = false

  constructor(entity: Enemy | Player, velocity: Phaser.Math.Vector2, gravity = false) {
    super(entity)
    this.velocity = velocity
    this.gravity = gravity
  }

  isInProgress() {
    return this._isInProgress
  }

  setDirectionVector(directionVector: Phaser.Math.Vector2) {
    this._directionVector = directionVector
  }

  trigger(): void {
    this._isInProgress = true
    this._knockingUpward = true
    /** For gravity based, stop knocking upward after time based on velocity */
    if (this.gravity) this.entity?.scene.time.delayedCall(this.velocity.y * 3, this.stopKnockingUpward, [], this)
    /** For non gravity based, stop knocking back after a set duration */
    else this.entity?.scene.time.delayedCall(this.duration, this.stop, [], this)
  }

  stop(): void {
    this._isInProgress = false
    this._velocityApplied = false
  }

  private stopKnockingUpward() {
    this._knockingUpward = false
  }

  update(): void {
    super.update()

    if (this._isInProgress) {
      // apply knockback velocity
      if (!this._velocityApplied) {
        this.entity.instance.setVelocityY((this._directionVector.y * this.velocity.y))
        this.entity.instance.setVelocityX((this._directionVector.x * this.velocity.x))
        this._velocityApplied = true
      }

      // downward phase of gravity enabled knockback
      if (this.gravity && !this._knockingUpward) {
        if (this.entity?.instance.body.velocity.y < 0) {
          this.entity.instance.setVelocityY(0)
        }

        if (this.entity?.instance.body.velocity.y > WorldConstants.TERMINAL_VELOCITY) {
          this.entity.instance.setVelocityY(WorldConstants.TERMINAL_VELOCITY)
        }
      }
    }
  }
}
