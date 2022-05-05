import Health from '../components/Health'
import Entity from '../ecs/Entity'
import PlayScene from '../scenes/PlayScene'
import Player from './Player'

export default abstract class Enemy extends Entity<PlayScene, Phaser.Physics.Arcade.Sprite> {
  collideDamage = 25
  playerTouchKnockbackVelocity: Phaser.Math.Vector2 | null = null

  private _player: Player | null
  private _playerAttackCollider: Phaser.Physics.Arcade.Collider | null = null
  private _touchPlayerCollider: Phaser.Physics.Arcade.Collider | null = null
  private _canBeHit = true

  constructor(scene: PlayScene, key: string, instance: Phaser.Physics.Arcade.Sprite, health = 100, gravity = true) {
    super(scene, key, instance)
    this.instance.depth = -3
    if (!gravity) (this.instance.body as any).allowGravity = false
    this._player = scene.player

    this.addComponent(new Health(this, health))
  }

  getPlayer(): Player | null {
    return this._player
  }

  /** Fired when player has attacked the enemy */
  onPlayerAttack(): void { }

  onAddedToScene(): void {
    if (this._player) {
      if (this._player.getAttackHitbox()) {
        this._playerAttackCollider = this.scene.physics.add.overlap(this._player.getAttackHitbox(), this.instance, this.handlePlayerAttackOverlap, undefined, this)
      }
      this._touchPlayerCollider = this.scene.physics.add.overlap(this._player.instance, this.instance, this.handleTouchPlayerOverlap, undefined, this)
    }
  }

  onRemovedFromScene(): void {
    this._playerAttackCollider?.destroy()
    this._touchPlayerCollider?.destroy()
  }

  /** Behavior for when enemy is hit by player attack */
  handlePlayerAttackOverlap() {
    const healthComponent = this.getComponent(Health)
    if (healthComponent && this._player && this._canBeHit) {
      this._canBeHit = false
      healthComponent.takeDamage(this._player.attackDamage)
      this.onPlayerAttack()
      if (healthComponent.health <= 0) this.destroy()
    }
  }

  /** Behavior for when enemy touches player */
  handleTouchPlayerOverlap(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    const directionVector = new Phaser.Math.Vector2(1, -1)
    if (enemy.body.center.x > player.body.center.x) directionVector.x = -1
    this._player?.takeDamage(this.collideDamage, directionVector, this.playerTouchKnockbackVelocity)
  }

  update(): void {
    super.update()
    if (!this._player?.isAttacking()) {
      this._canBeHit = true
    }
  }
}
