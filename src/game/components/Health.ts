import Component from '../ecs/Component'
import Entity from '../ecs/Entity'
import ECSScene from '../ecs/Scene'

export default class Health extends Component<Entity<ECSScene, any>> {
  health: number

  constructor(entity: Entity<ECSScene, any>, health: number) {
    super(entity)
    this.health = health
  }

  takeDamage(damage: number): void {
    this.health -= damage
    if (this.health < 0)
      this.health = 0
  }
}
