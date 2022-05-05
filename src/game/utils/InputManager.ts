import { Scene } from 'phaser'

export default class InputManager {
  static getGamepad(scene: Scene): Phaser.Input.Gamepad.Gamepad | null {
    if (!scene.input.gamepad) return null
    if (!scene.input.gamepad.gamepads.length) return null
    return scene.input.gamepad.gamepads[0]
  }

  static isGamepadConnected(scene: Scene): boolean | undefined {
    const gamepad = this.getGamepad(scene)
    return gamepad != null && this.getGamepad(scene)?.connected
  }

  static getGameKeyMap(scene: Scene): Map<string, Phaser.Input.Keyboard.Key> {
    const gameKeyMap = new Map<string, Phaser.Input.Keyboard.Key>()

    gameKeyMap.set('W', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W))
    gameKeyMap.set('A', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A))
    gameKeyMap.set('S', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S))
    gameKeyMap.set('D', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D))
    gameKeyMap.set('Q', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q))
    gameKeyMap.set('E', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))
    gameKeyMap.set('J', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J))
    gameKeyMap.set('K', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K))
    gameKeyMap.set('L', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L))

    gameKeyMap.set('LEFT', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT))
    gameKeyMap.set('RIGHT', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT))
    gameKeyMap.set('UP', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP))
    gameKeyMap.set('DOWN', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN))

    gameKeyMap.set('ENTER', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER))
    gameKeyMap.set('ESC', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC))
    gameKeyMap.set('SPACE', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))
    gameKeyMap.set('SHIFT', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT))
    gameKeyMap.set('FORWARD_SLASH', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH))
    gameKeyMap.set('PERIOD', scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD))

    return gameKeyMap
  }
}
