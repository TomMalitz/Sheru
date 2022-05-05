import Entity from '../ecs/Entity'
import PlayScene from '../scenes/PlayScene'
import { LayerInstance, Layers, Ldtk, TileInstance, TilesetDefinition } from '../types/ldtk'

export default class LevelManager {
  playScene: PlayScene
  ldtk: Ldtk

  private _foregroundTiles: Phaser.Types.Physics.Arcade.ImageWithStaticBody[] = []
  private _platformTiles: Phaser.Types.Physics.Arcade.ImageWithStaticBody[] = []

  constructor(playScene: PlayScene, ldtk: Ldtk) {
    this.playScene = playScene
    this.ldtk = ldtk
  }

  /**
   * Adds colliders for the given entity with the foreground tiles of the rooms
   * @param entity
   */
  public registerEntityWithRoomCollision(entity: Entity<any, any>, isPlayer = false) {
    const foregoundCollisionCallback = isPlayer ? this.foregroundCollisionListener : undefined
    for (let i = 0; i < this._foregroundTiles.length; i++) {
      this.playScene.physics.add.collider(entity.instance, this._foregroundTiles[i], foregoundCollisionCallback, undefined, this)
    }
    const platformCollisionCallback = isPlayer ? this.platformCollisionListener : undefined
    for (let i = 0; i < this._platformTiles.length; i++) {
      this.playScene.physics.add.collider(entity.instance, this._platformTiles[i], platformCollisionCallback, undefined, this)
    }
  }

  private foregroundCollisionListener() {
    if (this.playScene.player) {
      this.playScene.player.grounded = true
      this.playScene.player.onPlatform = false
    }
  }

  private platformCollisionListener() {
    if (this.playScene.player) {
      this.playScene.player.grounded = true
      this.playScene.player.onPlatform = true
    }
  }

  loadRoom(): void {
    const foregroundLayer = this.ldtk.levels[1].layerInstances?.filter(instance => instance.__identifier === Layers.FOREGROUND)[0]
    const platformLayer = this.ldtk.levels[1].layerInstances?.filter(instance => instance.__identifier === Layers.PLATFORMS)[0]
    if (foregroundLayer) this.loadLayer(foregroundLayer, 'test-set')
    if (platformLayer) this.loadLayer(platformLayer, 'platform-set', true)
  }

  private loadLayer(layer: LayerInstance, layerAssetKey: string, platforms?: boolean): void {
    if (layer.__tilesetDefUid) {
      const tileSetData = this.getTileSetData(layer.__tilesetDefUid)

      if (layer.gridTiles) {
        for (const gridTile of layer.gridTiles) {
          const frameIndex = this.gridTileSrcToFrameIndex(gridTile.src[0], gridTile.src[1], layer, tileSetData.__cHei)

          const tileImage = this.playScene.physics.add.staticImage(gridTile.px[0] + layer.__gridSize / 2, gridTile.px[1] + layer.__gridSize / 2, layerAssetKey, frameIndex);
          (tileImage.body as any).allowGravity = false
          tileImage.setImmovable(true)

          /** Only check for collisions where the grid tile open-face (not touching another tile) */
          const gridTileTouchingData = this.getGridTileTouchingData(gridTile, layer)
          if (gridTileTouchingData.top) tileImage.body.checkCollision.up = false
          if (gridTileTouchingData.bottom) tileImage.body.checkCollision.down = false
          if (gridTileTouchingData.left) tileImage.body.checkCollision.left = false
          if (gridTileTouchingData.right) tileImage.body.checkCollision.right = false

          /** If tiles are platforms, only enable the top side collision */
          if (platforms) {
            tileImage.body.checkCollision.down = false
            tileImage.body.checkCollision.left = false
            tileImage.body.checkCollision.right = false
            this._platformTiles.push(tileImage)
          }
          else {
            this._foregroundTiles.push(tileImage)
          }
        }
      }
    }
  }

  /**
   * Checks the passed grid tile's neighbors to the top, bottom, left, and right to see if they exist
   * @param gridTile grid tile to check neighbors for
   * @param layer layer instance data
   * @returns data indicating if the tile has a touching neighbor to the top, bottom, left, and/or right
   */
  private getGridTileTouchingData(gridTile: TileInstance, layer: LayerInstance): {top: boolean; bottom: boolean; left: boolean; right: boolean} {
    const touchingData = { top: false, bottom: false, left: false, right: false }
    const checkTileAgainstPosition = (gridTile: TileInstance, position: number[]) => {
      return gridTile.px[0] === position[0] && gridTile.px[1] === position[1]
    }
    const aboveTile2dIndex = [gridTile.px[0], gridTile.px[1] - layer.__gridSize]
    const belowTile2dIndex = [gridTile.px[0], gridTile.px[1] + layer.__gridSize]
    const leftTile2dIndex = [gridTile.px[0] - layer.__gridSize, gridTile.px[1]]
    const rightTile2dIndex = [gridTile.px[0] + layer.__gridSize, gridTile.px[1]]

    for (const otherGridTile of layer.gridTiles) {
      if (checkTileAgainstPosition(otherGridTile, aboveTile2dIndex)) touchingData.top = true
      if (checkTileAgainstPosition(otherGridTile, belowTile2dIndex)) touchingData.bottom = true
      if (checkTileAgainstPosition(otherGridTile, leftTile2dIndex)) touchingData.left = true
      if (checkTileAgainstPosition(otherGridTile, rightTile2dIndex)) touchingData.right = true
    }
    return touchingData
  }

  /**
   *
   * @param srcX x coordinate of tile from tileset image
   * @param srcY y coordinate of tile from tileset image
   * @param tileSize size in pixels of each tile from tileset
   * @param tileRows number of rows in tileset
   * @returns frame index of the correct tile given the src (x,y) coordinates from the tileset image
   */
  private gridTileSrcToFrameIndex(srcX: number, srcY: number, layer: LayerInstance, tileSheetRows: number): number {
    const i = srcX / layer.__gridSize
    const j = srcY / layer.__gridSize
    return i + tileSheetRows * j
  }

  private getTileSetData(uid: number): TilesetDefinition {
    return this.ldtk.defs.tilesets.filter(tileset => tileset.uid === uid)[0]
  }
}
