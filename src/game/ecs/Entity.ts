import ECSScene from '../ecs/Scene'
import Component from './Component'

/** Constructor Type used to compare component instance types */
type ComponentConstructor<T> = new (...args: any[]) => T

export default abstract class Entity<S extends ECSScene, T extends Phaser.GameObjects.GameObject> {
  static idGenerator = 0

  /** Scene the entity belongs to */
  scene: S

  /** Key for the entity */
  key: string

  /** Unique id for the entity */
  id: number

  /** Phaser game object instance of the entity */
  instance: T

  /** Component list for the entity */
  components: Component<any>[] = []

  constructor(scene: S, key: string, instance: T) {
    this.scene = scene
    this.key = key
    this.id = Entity.idGenerator++
    this.instance = instance
    // this.onAddedToScene()
  }

  /** Fired after entity is added to the scene */
  onAddedToScene(): void { }

  /** Fired after entity is remove from the scene */
  onRemovedFromScene(): void { }

  /** Update all components for entity */
  update(): void {
    for (const component of this.components) {
      if (component.enabled) component.update()
    }
  }

  /**
   * Adds component to entity component list
   * @param component The component to add
   * @returns the component that was added
   */
  addComponent<ComponentType extends Component<any>>(component: ComponentType): ComponentType {
    this.components.push(component)
    component.OnAddedToEntity()
    return component
  }

  /**
   * Removes the first component matching the passed component type
   * @param componentClass component class
   * @returns the component matching the given component type
   */
  removeComponent<ComponentType extends Component<any>>(componentClass: ComponentConstructor<ComponentType>): void {
    if (this.components.length) {
      for (let i = 0; i < this.components.length; i++) {
        if (this.components[i] instanceof componentClass) {
          this.components[i].OnRemovedFromEntity()
          this.components.splice(i, 1)
        }
      }
    }
  }

  /**
   * Get the first component matching the passed component type
   * @param componentClass component class
   * @returns the component matching the given component type
   */
  getComponent<ComponentType extends Component<any>>(componentClass: ComponentConstructor<ComponentType>): ComponentType | null {
    if (this.components.length) {
      for (let i = 0; i < this.components.length; i++) {
        if (this.components[i] instanceof componentClass) {
          return this.components[i] as ComponentType
        }
      }
    }
    return null
  }

  /** Removes entity from scene entity list and destroys phaser game object instance */
  destroy(): void {
    // Fire component removed events
    for (const component of this.components) {
      component.OnRemovedFromEntity()
    }
    this.scene.removeEntity(this)
    this.instance.destroy()
  }
}
