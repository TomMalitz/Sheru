import Entity from './Entity'
import ECSScene from './Scene'

export default abstract class Component<E extends Entity<ECSScene, any>> {
  /** The entity this component is attached to */
  entity: E

  /** Indicates whether the component is enabled. If the component is not enabled it's update method will not be called */
  private _enabled = true
  get enabled() {
    return this._enabled
  }

  set enabled(value: boolean) {
    if (this._enabled !== value) {
      this._enabled = value
    }
    if (this._enabled) this.onEnabled()
    else this.onDisabled()
  }

  constructor(entity: E) {
    this.entity = entity
  }

  /** Fired when the component is enabled */
  onEnabled(): void { }

  /** Fired when the component is disabled */
  onDisabled(): void { }

  /** Fired when component is added to entity */
  OnAddedToEntity(): void { }

  /** Fired when component is removed from entity  */
  OnRemovedFromEntity(): void { }

  /** Method containing update logic for this component */
  update(): void { }
}
