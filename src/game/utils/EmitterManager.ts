export default class EmitterManager {
  scene: Phaser.Scene
  emitter: Phaser.Events.EventEmitter

  constructor(scene: Phaser.Scene, emitter: Phaser.Events.EventEmitter) {
    this.scene = scene
    this.emitter = emitter
  }

  /** Setup event listernes for emitter that is shared with vue instance */
  setupListeners(): void {
    this.scene.physics.world.drawDebug = false // disable debug to start
    this.emitter.on('toggle-debug', this.toggleDebug, this)
    this.emitter.on('toggle-fps', this.toggleFPS, this)
    this.emitter.on('pause-game', this.pauseGame, this)
    this.emitter.on('resume-game', this.resumeGame, this)
  }

  /** Toggle on/off rendering of debug graphics in viewport */
  private toggleDebug(): void {
    this.scene.physics.world.drawDebug = !this.scene.physics.world.drawDebug
    if (!this.scene.physics.world.drawDebug) this.scene.physics.world.debugGraphic.clear()
  }

  /** Toggle FPS between 60 and 120 */
  private toggleFPS(fps: number): void {
    this.scene.physics.world.setFPS(fps)
  }

  private pauseGame(): void {
    this.scene.game.scene.pause('play-scene')
  }

  private resumeGame(): void {
    this.scene.game.scene.resume('play-scene')
  }
}
