import Scene from '../ecs/Scene'
import Player from '../entities/Player'
import InputManager from '../utils/InputManager'
import testLdtkJSON from '../assets/environment/rooms/test-room.json'
import { LdtkConverter } from '../types/ldtk'
import EmitterManager from '../utils/EmitterManager'
import LevelManager from '../utils/LevelManager'
import CameraManager from '../utils/CameraManager'
import Enemy from '../entities/Enemy'
import FollowEnemy from '../entities/FollowEnemy'
import Entity from '../ecs/Entity'

export const phaserEmitter = new Phaser.Events.EventEmitter()

export default class PlayScene extends Scene {
  player: Player | null = null
  level: Phaser.Physics.Arcade.Image | null = null
  gamepad: Phaser.Input.Gamepad.Gamepad | null = null
  gameKeyMap: Map<string, Phaser.Input.Keyboard.Key> | null = null
  cameraManager: CameraManager | null = null
  levelManager: LevelManager | null = null

  constructor() {
    super({ key: 'play-scene' } as any)
  }

  create() {
    const emitterManager = new EmitterManager(this, phaserEmitter)
    emitterManager.setupListeners()

    this.gamepad = InputManager.getGamepad(this)
    this.gameKeyMap = InputManager.getGameKeyMap(this)

    this.levelManager = new LevelManager(this, LdtkConverter.toLdtk(JSON.stringify(testLdtkJSON)))
    this.levelManager.loadRoom()

    this.player = new Player(this, 'player', this.physics.add.sprite(200, 100, 'player'))
    this.addEntity(this.player, true)

    this.cameraManager = new CameraManager(this)

    const followEnemy = new FollowEnemy(this, 'x-enemy', this.physics.add.sprite(150, 510, 'x-enemy'))
    this.addEntity(followEnemy)

    // const staticEnemy = new Enemy(this, 'x-enemy', this.physics.add.sprite(150, 100, 'x-enemy'), 100, true)
    // this.addEntity(staticEnemy)
  }

  update() {
    /** Update all active entities in the scene */
    for (const entity of this.entities)
      entity.update()

    this.cameraManager?.update()
  }

  /** For play scene, add entity and also register it with room collision if gravity is enabled */
  addEntity<T extends Phaser.GameObjects.GameObject>(entity: Entity<PlayScene, T>, isPlayer = false): void {
    super.addEntity(entity)
    if ((entity.instance.body as any).allowGravity) {
      this.levelManager?.registerEntityWithRoomCollision(entity, isPlayer)
    }
  }
}
