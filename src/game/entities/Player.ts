import Health from '../components/Health'
import Knockback from '../components/Knockback'
import Entity from '../ecs/Entity'
import PlayScene from '../scenes/PlayScene'
import { WorldConstants } from '../types/constants'
import InputManager from '../utils/InputManager'
import playerAsepriteJSON from '../assets/player/player.json'
import playerTopAsepriteJSON from '../assets/player/playerTop.json'
import playerBottomAsepriteJSON from '../assets/player/playerBottom.json'
import { AsperiteDataConverter } from '../types/aseprite'
import AsepriteUtil from '../utils/AsepriteUtil'

export default class Player extends Entity<PlayScene, Phaser.Physics.Arcade.Sprite> {
  // #region Initialization
  /** Attack Props */
  attackDamage = 50
  attackFrameIndex = 3 // the animation frame number where hitbox should activate

  /** Base movement props */
  walkSpeed = 125
  stickSensitivity = 0.50

  /** Dashing */
  dashSpeed = 250
  dashTime = 325

  /** Jumping and Falling props */
  jumpSpeed = 250
  doubleJumpSpeedDecrease = 0.80
  jumpInputLockTime = 200
  maxJumpCount = 2

  /** Damage and Knockback props */
  damageKnockbackVelocity = new Phaser.Math.Vector2(135, 120)
  damageVerticalKnockbackTime = 500
  minDamageLockTime = 250
  damageInvincibilityTime = 2000
  damageInvincibilityTimeFlashInterval = 125
  damageFlashTint = 0xF50000

  private _running = false
  private _dashing = false
  private _dashingBackward = false
  private _dashingForward = false
  private _canDash = true
  private _canJump = false
  private _jumpInputLocked = false
  private _jumpCount = 0
  private _ducking = false

  private _attacking = false
  private _attackHitbox: Phaser.GameObjects.Rectangle
  private _attackHitboxSize = new Phaser.Math.Vector2(22, 6)
  private _attackHitboxOffset = new Phaser.Math.Vector2(21, -2)
  private _canAttack = true

  private _topSpriteKey = 'player-top'
  private _bottomSpriteKey = 'player-bottom'
  private _spriteSize = new Phaser.Math.Vector2(18, 32)
  private _spriteFrameSize = new Phaser.Math.Vector2(96, 64)
  private _hitboxSize = new Phaser.Math.Vector2(8, 28)
  private _hitboxOffset = new Phaser.Math.Vector2((this._spriteFrameSize.x - this._spriteSize.x) / 2 + (this._spriteSize.x - this._hitboxSize.x) / 2, ((this._spriteFrameSize.y - this._hitboxSize.y) / 2) + ((this._spriteSize.y - this._hitboxSize.y) / 2))
  private _duckingHitboxSize = new Phaser.Math.Vector2(this._hitboxSize.x, 19)

  private _damageLocked = false
  private _invincibleFromDamage = false
  private _invincibleFlashTween: Phaser.Tweens.Tween | null = null
  private _spriteFlashing = false

  private _gamepad: Phaser.Input.Gamepad.Gamepad | null = null
  private _gameKeyMap: Map<string, Phaser.Input.Keyboard.Key> | null = null
  private _runSpriteTop: Phaser.GameObjects.Sprite
  private _runSpriteBottom: Phaser.GameObjects.Sprite

  private _grounded = false
  get grounded() {
    return this._grounded
  }

  set grounded(value: boolean) {
    if (value === this._grounded) return
    if (value && !this.instance.body.touching.down) return // can't ground if not touching down
    if (!value && this.instance.body.touching.down) return // can't unground if touching down
    this._grounded = value
  }

  private _onPlatform = false
  get onPlatform() {
    return this._onPlatform
  }

  set onPlatform(value: boolean) {
    this._onPlatform = value
  }

  private _healthComponent: Health
  private _knockbackComponent: Knockback

  constructor(scene: PlayScene, key: string, instance: Phaser.Physics.Arcade.Sprite) {
    super(scene, key, instance)

    this._gamepad = this.scene.gamepad
    this._gameKeyMap = this.scene.gameKeyMap

    // create run sprites
    this._runSpriteTop = this.scene.add.sprite(0, 0, this._topSpriteKey)
    this._runSpriteBottom = this.scene.add.sprite(0, 0, this._bottomSpriteKey)

    // set sprite draw depth
    this.instance.depth = 2
    this._runSpriteTop.depth = 2
    this._runSpriteBottom.depth = 1

    // Setup collisions for base
    this.instance.setBounce(0)
    this.instance.body.setSize(this._hitboxSize.x, this._hitboxSize.y)
    this.instance.body.setOffset(this._hitboxOffset.x, this._hitboxOffset.y)
    this.instance.setCollideWorldBounds(true)

    // Setup hitbox for attacks
    this._attackHitbox = this.scene.add.rectangle(
      this.instance.body.position.x,
      this.instance.body.position.y,
      this._attackHitboxSize.x,
      this._attackHitboxSize.y, 0)
    this._attackHitbox.visible = false
    this.scene.physics.add.existing(this._attackHitbox);
    (this._attackHitbox.body as any).allowGravity = false;
    (this._attackHitbox.body as any).enabled = false

    // Components
    this._healthComponent = this.addComponent(new Health(this, 100))
    this._knockbackComponent = this.addComponent(new Knockback(this, this.damageKnockbackVelocity, true))

    // Setup animations
    const playerAsepriteUtil = new AsepriteUtil(AsperiteDataConverter.toAsepriteData(JSON.stringify(playerAsepriteJSON)))
    const playerTopAsepriteUtil = new AsepriteUtil(AsperiteDataConverter.toAsepriteData(JSON.stringify(playerTopAsepriteJSON)))
    const playerBottomAsepriteUtil = new AsepriteUtil(AsperiteDataConverter.toAsepriteData(JSON.stringify(playerBottomAsepriteJSON)))

    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('idle')),
      frameRate: 4,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'duck_idle',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('duck_idle')),
      frameRate: 4,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'take_damage',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('take_damage')),
      repeat: -1,
    })

    const jumpStartEnd = playerAsepriteUtil.getAnimStartEnd('jump')
    this.scene.anims.create({
      key: 'jump',
      frames: this.scene.anims.generateFrameNumbers(this.key, { frames: [jumpStartEnd.start, jumpStartEnd.start, jumpStartEnd.start, jumpStartEnd.start, jumpStartEnd.end] }),
      frameRate: 12,
      repeat: 0,
    })

    this.scene.anims.create({
      key: 'fall',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('fall')),
      frameRate: 12,
      repeat: 0,
    })

    this.scene.anims.create({
      key: 'dash_backward',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('dash_backward')),
      frameRate: 16,
      repeat: 0,
    })

    this.scene.anims.create({
      key: 'dash_forward',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('dash_forward')),
      frameRate: 16,
      repeat: 0,
    })

    const attackFrameRate = 18
    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('attack')),
      frameRate: attackFrameRate,
      repeat: 0,
    })

    this.scene.anims.create({
      key: 'jump_attack',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('jump_attack')),
      frameRate: attackFrameRate,
      repeat: 0,
    })

    this.scene.anims.create({
      key: 'duck_attack',
      frames: this.scene.anims.generateFrameNumbers(this.key, playerAsepriteUtil.getAnimStartEnd('duck_attack')),
      frameRate: attackFrameRate,
      repeat: 0,
    })

    this.scene.anims.create({
      key: 'run_attack_top',
      frames: this.scene.anims.generateFrameNumbers(this._topSpriteKey, playerTopAsepriteUtil.getAnimStartEnd('run_attack_top')),
      frameRate: attackFrameRate,
      repeat: 0,
    })

    this.scene.anims.create({
      key: 'run_top',
      frames: this.scene.anims.generateFrameNumbers(this._topSpriteKey, playerTopAsepriteUtil.getAnimStartEnd('run')),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'run_legs',
      frames: this.scene.anims.generateFrameNumbers(this._bottomSpriteKey, playerBottomAsepriteUtil.getAnimStartEnd('run')),
      frameRate: 10,
      repeat: -1,
    })

    // register animation listeners
    this.instance.on('animationcomplete', this.onBaseAnimationComplete)
    this._runSpriteTop.on('animationcomplete', this.onTopAnimationComplete)

    // start with anim animation
    this.instance.anims.play('idle', true)
  }
  // #endregion

  // #region Update
  update = () => {
    super.update()
    this._gamepad = InputManager.getGamepad(this.scene)
    this.handleMovement()
    this.handleAttacks()
    this.updateHitbox()
    this.updateAnimations()
  }
  // #endregion

  // #region Collisions

  private updateHitbox() {
    // make hitbox smaller when ducking
    if (this._ducking && this.instance.body.height === this._hitboxSize.y) {
      this.instance.body.setSize(this._duckingHitboxSize.x, this._duckingHitboxSize.y)
      this.instance.body.setOffset(this._hitboxOffset.x, this._hitboxOffset.y + (this._hitboxSize.y - this._duckingHitboxSize.y))
    }
    // correct hitbox for when standing
    if (!this._ducking && this.instance.body.height !== this._hitboxSize.y) {
      this.instance.body.setSize(this._hitboxSize.x, this._hitboxSize.y)
      this.instance.body.setOffset(this._hitboxOffset.x, this._hitboxOffset.y)
    }
  }

  takeDamage(damage: number, directionVector: Phaser.Math.Vector2, knockbackVelocity?: Phaser.Math.Vector2 | null) {
    if (!this._damageLocked && !this._invincibleFromDamage) {
      if (knockbackVelocity) this.damageKnockbackVelocity = knockbackVelocity
      this._healthComponent.takeDamage(damage)
      this._knockbackComponent.setDirectionVector(directionVector)
      this._knockbackComponent.trigger()
      this.enableDamageLockState()
      this.scene.time.delayedCall(this.damageInvincibilityTime, this.stopDamageInvincibility, [], this)
      this.applyDamageFlashTween()
    }
  }

  private enableDamageLockState() {
    this._grounded = false
    this._damageLocked = true
    this._invincibleFromDamage = true
    this._dashing = false
    this._running = false
    this._attacking = false
    this._canAttack = false
    this._canJump = false
    this._canDash = false
  }

  private disableDamageLockState() {
    this._knockbackComponent.stop()
    this._damageLocked = false
    this._canAttack = true
    this._canDash = true
    this._canJump = true
  }

  private renableBottomCollision(): void {
    this.instance.body.checkCollision.down = true
  }

  private applyDamageFlashTween() {
    const tint = this.damageFlashTint
    this.instance.setTint(tint)
    this._runSpriteTop.setTint(tint)
    this._runSpriteBottom.setTint(tint)

    this._invincibleFlashTween = this.scene.tweens.add({
      targets: [this.instance, this._runSpriteTop, this._runSpriteBottom],
      loop: -1, // infinite loop
      loopDelay: this.damageInvincibilityTimeFlashInterval,
      onLoop(tween, targets: Phaser.Physics.Arcade.Sprite[]) {
        for (const target of targets) {
          if (target.isTinted) target.clearTint()
          else target.setTint(tint)
        }
      },
    })

    // this._spriteFlashing = true

    // this._invincibleFlashTween = this.scene.tweens.add({
    //   targets: [this.instance, this._runSpriteTop, this._runSpriteBottom],
    //   loop: -1, // infinite loop
    //   loopDelay: this.damageInvincibilityTimeFlashInterval,
    //   onLoop: () => {
    //     this._spriteFlashing = !this._spriteFlashing
    //   },
    // })
  }

  private stopDamageInvincibility() {
    this._invincibleFromDamage = false
    if (this._invincibleFlashTween) {
      this.scene.tweens.remove(this._invincibleFlashTween)
      this.instance.clearTint()
      this._runSpriteTop.clearTint()
      this._runSpriteBottom.clearTint()
      // this._spriteFlashing = false
    }
  }

  // #endregion

  // #region Attack

  getAttackHitbox() {
    return this._attackHitbox
  }

  isAttacking() {
    return this._attacking
  }

  private handleAttacks = () => {
    if (!this._dashing && this._canAttack && this.attackPressed()) {
      this._attacking = true
      this._canAttack = false
    }

    if (!this.attackPressed() && !this._attacking && !this._damageLocked)
      this._canAttack = true

    const atAttackFrameIndex = this.instance.anims.currentFrame?.index === this.attackFrameIndex || this._runSpriteTop.anims.currentFrame?.index === this.attackFrameIndex
    if (this._attacking && atAttackFrameIndex) this.toggleAttackHitBox(true)

    else this.toggleAttackHitBox(false)
  }

  private toggleAttackHitBox = (enable: boolean): void => {
    if (enable && !(this._attackHitbox.body as any).enable) {
      (this._attackHitbox.body as any).enable = true
      const direction = this.instance.flipX ? -1 : 1
      this._attackHitbox.x = this.instance.x + (this._attackHitboxOffset.x * direction)
      const duckOffset = this._ducking ? 10 : 0
      this._attackHitbox.y = this.instance.y + this._attackHitboxOffset.y + duckOffset
    }
    else {
      if ((this._attackHitbox.body as any).enable)
        (this._attackHitbox.body as any).enable = false
    }
  }
  // #endregion

  // #region Movement
  private handleMovement = () => {
    // HORIZONTAL MOVEMENT //
    // round x pos if needed so that half (0.5) pos does not occurr
    // (camera rendering problem occurs with half position)
    if (!this._damageLocked) {
      if (this.instance.body.velocity.x === 0 && (parseFloat(this.instance.body.position.x.toPrecision(5)) % 0.50) === 0)
        this.instance.body.position.x += 0.1

      if (!this._dashing) {
        // ducking
        this._ducking = this.duckPressed() && this._grounded
        if (this._ducking) {
          this._running = false
          this.instance.setVelocityX(0)
          if (this.isMovingLeft()) this.instance.flipX = true
          if (this.isMovingRight()) this.instance.flipX = false
        }
        // standing
        else {
          // moving
          if (this.isMovingLeft() || this.isMovingRight()) {
            const direction = this.isMovingLeft() ? -1 : 1
            this.instance.setVelocityX(direction * this.walkSpeed)
            if (!this._attacking || this._grounded) this.instance.flipX = this.isMovingLeft()
            this._running = this._grounded
          }
          // idle
          else {
            this._running = false
            this.instance.setVelocityX(0)
          }
        }
      }

      // dashing
      if (this._canDash && (this.leftDashPressed() || this.rightDashPressed())) {
        if (this.leftDashPressed()) {
          this.instance.setVelocityX(-1 * this.dashSpeed)
          if (this.instance.flipX)
            this._dashingForward = true
          else
            this._dashingBackward = true
        }
        if (this.rightDashPressed()) {
          this.instance.setVelocityX(this.dashSpeed)
          if (this.instance.flipX)
            this._dashingBackward = true
          else
            this._dashingForward = true
        }
        this._running = false
        this._dashing = true
        this._canDash = false
        this._attacking = false
        this._ducking = false
        this.scene.time.delayedCall(this.dashTime, this.stopDashing, [], this)
      }
      if (this._grounded && !this._dashing && !this.leftDashPressed() && !this.rightDashPressed())
        this._canDash = true

      // VERTICAL MOVEMENT //
      if (!this.instance.body.touching.down) {
        this._grounded = false
        this._onPlatform = false
      }

      // jumping
      if (this._grounded && !this.jumpPressed()) {
        this._jumpCount = 0
        this._canJump = true
      }

      // fall through platform
      if (this._grounded && this._onPlatform && this.jumpPressed() && this._ducking) {
        this.instance.body.checkCollision.down = false
        this._canJump = false
        this.scene.time.delayedCall(200, this.renableBottomCollision, undefined, this)
      }

      if (this._canJump && this._jumpCount < this.maxJumpCount && this.jumpPressed() && !this._jumpInputLocked) {
        // count a falling jump
        if (!this._grounded && this._jumpCount === 0)
          this._jumpCount++

        this._jumpInputLocked = true
        this.scene.time.delayedCall(this.jumpInputLockTime, this.unlockJumpInput, [], this)
        const speed = this._jumpCount >= 1 ? this.jumpSpeed * this.doubleJumpSpeedDecrease : this.jumpSpeed
        this.instance.setVelocityY(-1 * speed)
        this._canJump = false
        this._jumpCount++
      }
    }

    // falling
    if (!this._grounded) {
      // released jump
      if ((!this.jumpPressed() && !this._damageLocked)) {
        if (this.maxJumpCount > 1)
          this._canJump = true

        if (this.instance.body.velocity.y < 0)
          this.instance.setVelocityY(0)

        // don't fall faster than terminal velocity
        if (this.instance.body.velocity.y > WorldConstants.TERMINAL_VELOCITY)
          this.instance.setVelocityY(WorldConstants.TERMINAL_VELOCITY)
      }

      // cancel gravity and y velocity when dashing
      if (this._dashing) {
        (this.instance.body as any).allowGravity = false
        this.instance.setVelocityY(0)
      }
      else {
        (this.instance.body as any).allowGravity = true
      }
    }

    if (this._grounded && this._damageLocked) {
      this.disableDamageLockState()
    }

    this.syncSpritePositions()
  }

  /** sync run sprites with base sprite positioning and flipX */
  private syncSpritePositions = () => {
    this._runSpriteTop.flipX = this.instance.flipX
    this._runSpriteBottom.flipX = this.instance.flipX
    this._runSpriteTop.setPosition(
      this.instance.body.position.x + this._hitboxSize.x / 2,
      this.instance.body.position.y + this._hitboxSize.y / 2 - (this._spriteSize.y - this._hitboxSize.y) / 2,
    )
    this._runSpriteBottom.setPosition(
      this.instance.body.position.x + this._hitboxSize.x / 2,
      this.instance.body.position.y + this._hitboxSize.y / 2 - (this._spriteSize.y - this._hitboxSize.y) / 2,
    )
  }

  private unlockJumpInput = () => {
    this._jumpInputLocked = false
  }

  private stopDashing = () => {
    this._dashing = false
    this._dashingForward = false
    this._dashingBackward = false
    this.instance.setVelocityX(0)
  }

  private wasGroundedThisFrame = (): boolean => {
    return this.instance.body.wasTouching.down === false && this.instance.body.touching.down === true
  }
  // #endregion

  // #region Animations
  private updateAnimations = () => {
    // toggle sprites based on if running or not
    if (this._running) {
      this.instance.visible = false
      this._runSpriteTop.visible = !this._spriteFlashing
      this._runSpriteBottom.visible = !this._spriteFlashing
    }
    else { // show base sprite
      this.instance.visible = !this._spriteFlashing
      this._runSpriteTop.visible = false
      this._runSpriteBottom.visible = false
    }

    // lock damage animation if damage locked
    if (this._damageLocked) {
      this.instance.anims.play('take_damage', true)
      return
    }

    // dashing anims
    if (this._dashing) {
      if (this._dashingForward)
        this.instance.anims.play('dash_forward', true)

      if (this._dashingBackward)
        this.instance.anims.play('dash_backward', true)
    }
    else {
      if (!this._attacking) {
        // grounded anims
        if (this._grounded) {
          this.instance.anims.play('idle', true) // play idle no matter what so fall anim gets interrupted
          if (this._ducking)
            this.instance.anims.play('duck_idle', true)

          if (this._running) {
            this.instance.anims.stop()
            const currRunFrame = this.getCurrentAnimationFrame(this._runSpriteBottom.anims, 'run_legs')
            this._runSpriteTop.anims.play({ key: 'run_top', startFrame: currRunFrame })
            this._runSpriteBottom.anims.play({ key: 'run_legs', startFrame: 0 }, true)
          }
          else {
            this.stopRunAnimations()
          }
        }

        // jumping / falling anims
        if (!this._grounded) {
          if (this.instance.body.velocity.y <= 0 && this.instance.anims.currentAnim.key !== 'jump')
            this.instance.anims.play('jump')
          if (this.instance.body.velocity.y > 0 && this.instance.anims.currentAnim.key !== 'fall')
            this.instance.anims.play('fall', true)
        }
      }

      // attack animations
      if (this._attacking) {
        // start on current frame if changing states while attacking (jumping, grounded, running, etc.)
        const currAttackFrame = this.getCurrentAnimationFrame(this.instance.anims, 'attack')
          || this.getCurrentAnimationFrame(this._runSpriteTop.anims, 'attack')
        if (this._running) {
          this.instance.anims.stop()
          this._runSpriteTop.anims.play({ key: 'run_attack_top', startFrame: currAttackFrame }, true)
          this._runSpriteBottom.anims.play('run_legs', true)
        }
        else {
          this.stopRunAnimations()
          if (this._grounded) {
            const idleAttackAnimKey = this._ducking ? 'duck_attack' : 'attack'
            this.instance.anims.play({ key: idleAttackAnimKey, startFrame: currAttackFrame }, true)
          }

          else { this.instance.anims.play({ key: 'jump_attack', startFrame: currAttackFrame }, true) }
        }
      }
    }
  }

  private onBaseAnimationComplete = () => {
    if (this.instance && this.instance.anims && this.instance.anims.currentAnim)
      if (this.instance.anims.currentAnim.key.includes('attack')) this._attacking = false
  }

  private onTopAnimationComplete = () => {
    if (this._runSpriteTop && this._runSpriteTop.anims && this._runSpriteTop.anims.currentAnim)
      if (this._runSpriteTop.anims.currentAnim.key.includes('attack')) this._attacking = false
  }

  private getCurrentAnimationFrame(animState: Phaser.Animations.AnimationState, keyFilter: string): number {
    if (!animState || !animState.currentFrame || !animState.isPlaying) return 0
    if (!animState.currentAnim.key.includes(keyFilter)) return 0
    return animState.currentFrame.index - 1
  }

  private stopRunAnimations(): void {
    this._runSpriteTop.anims.stop()
    this._runSpriteBottom.stop()
  }

  // #endregion

  // #region Input Helpers
  private isMovingLeft = (): boolean => {
    return this.boolWrap((this._gameKeyMap?.get('A')?.isDown || (this._gamepad?.leftStick.x && this._gamepad?.leftStick.x < (-1 * this.stickSensitivity)) || this._gamepad?.left))
  }

  private isMovingRight = (): boolean => {
    return this.boolWrap((this._gameKeyMap?.get('D')?.isDown || (this._gamepad?.leftStick.x && this._gamepad?.leftStick.x > this.stickSensitivity) || this._gamepad?.right))
  }

  private leftDashPressed = (): boolean => {
    return this.boolWrap((this._gameKeyMap?.get('J')?.isDown || this._gamepad?.L2 === 1))
  }

  private rightDashPressed = (): boolean => {
    return this.boolWrap((this._gameKeyMap?.get('L')?.isDown || this._gamepad?.R2 === 1))
  }

  private jumpPressed = (): boolean => {
    return this.boolWrap((this._gameKeyMap?.get('W')?.isDown || this._gameKeyMap?.get('SPACE')?.isDown || this._gamepad?.A))
  }

  private duckPressed = (): boolean => {
    const stickInput = this._gamepad?.leftStick?.y ? this._gamepad?.leftStick?.y : 0
    const ducking = (this._gameKeyMap?.get('S')?.isDown || this._gamepad?.down || (stickInput > this.stickSensitivity))
    if (typeof ducking === 'undefined') return false
    return ducking
  }

  private attackPressed = (): boolean => {
    return this.boolWrap((this._gameKeyMap?.get('K')?.isDown || this._gamepad?.X))
  }

  private boolWrap(val: boolean | undefined) {
    if (val) return val
    return false
  }

  // #endregion
}
