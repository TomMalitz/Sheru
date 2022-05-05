import { Scene } from 'phaser'
import Entity from './Entity'

export default class ECSScene extends Scene {
  /** List of active entities in the scene */
  entities: Entity<any, any>[] = []

  constructor(config: string | Phaser.Types.Scenes.SettingsObject) {
    super(config)
  }

  /**
   * Add entity to the scene
   * @param entity Entity to add
   */
  addEntity<T extends Phaser.GameObjects.GameObject>(entity: Entity<any, T>): void {
    this.entities.push(entity)
    entity.onAddedToScene()
  }

  /**
   * Removes entity from the scene
   * @param entity Entity to remove
   */
  removeEntity<T extends Phaser.GameObjects.GameObject>(entity: Entity<any, T>): void {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].id === entity.id) {
        this.entities[i].onRemovedFromScene()
        this.entities.splice(i, 1)
      }
    }
  }
}
