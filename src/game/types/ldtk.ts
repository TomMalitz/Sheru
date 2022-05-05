/* eslint-disable no-use-before-define */
// To parse this data:
//
//   import { Convert, Ldtk } from "./file";
//
//   const ldtk = Convert.toLdtk(json);

/**
 * This file is a JSON schema of files created by LDtk level editor (https://ldtk.io).
 *
 * This is the root of any Project JSON file. It contains:  - the project settings, - an
 * array of levels, - a group of definitions (that can probably be safely ignored for most
 * users).
 */
export interface Ldtk {
  /**
   * Number of backup files to keep, if the `backupOnSave` is TRUE
   */
  backupLimit: number
  /**
   * If TRUE, an extra copy of the project will be created in a sub folder, when saving.
   */
  backupOnSave: boolean
  /**
   * Project background color
   */
  bgColor: string
  /**
   * Default grid size for new layers
   */
  defaultGridSize: number
  /**
   * Default background color of levels
   */
  defaultLevelBgColor: string
  /**
   * Default new level height
   */
  defaultLevelHeight: number
  /**
   * Default new level width
   */
  defaultLevelWidth: number
  /**
   * Default X pivot (0 to 1) for new entities
   */
  defaultPivotX: number
  /**
   * Default Y pivot (0 to 1) for new entities
   */
  defaultPivotY: number
  /**
   * A structure containing all the definitions of this project
   */
  defs: Definitions
  /**
   * **WARNING**: this deprecated value is no longer exported since version 0.9.3  Replaced
   * by: `imageExportMode`
   */
  exportPng?: boolean | null
  /**
   * If TRUE, a Tiled compatible file will also be generated along with the LDtk JSON file
   * (default is FALSE)
   */
  exportTiled: boolean
  /**
   * If TRUE, one file will be saved for the project (incl. all its definitions) and one file
   * in a sub-folder for each level.
   */
  externalLevels: boolean
  /**
   * An array containing various advanced flags (ie. options or other states). Possible
   * values: `DiscardPreCsvIntGrid`, `IgnoreBackupSuggest`
   */
  flags: Flag[]
  /**
   * "Image export" option when saving project. Possible values: `None`, `OneImagePerLayer`,
   * `OneImagePerLevel`
   */
  imageExportMode: ImageExportMode
  /**
   * File format version
   */
  jsonVersion: string
  /**
   * The default naming convention for level identifiers.
   */
  levelNamePattern: string
  /**
   * All levels. The order of this array is only relevant in `LinearHorizontal` and
   * `linearVertical` world layouts (see `worldLayout` value). Otherwise, you should refer to
   * the `worldX`,`worldY` coordinates of each Level.
   */
  levels: Level[]
  /**
   * If TRUE, the Json is partially minified (no indentation, nor line breaks, default is
   * FALSE)
   */
  minifyJson: boolean
  /**
   * Next Unique integer ID available
   */
  nextUid: number
  /**
   * File naming pattern for exported PNGs
   */
  pngFilePattern?: null | string
  /**
   * Height of the world grid in pixels.
   */
  worldGridHeight: number
  /**
   * Width of the world grid in pixels.
   */
  worldGridWidth: number
  /**
   * An enum that describes how levels are organized in this project (ie. linearly or in a 2D
   * space). Possible values: `Free`, `GridVania`, `LinearHorizontal`, `LinearVertical`
   */
  worldLayout: WorldLayout
}

/**
* A structure containing all the definitions of this project
*
* If you're writing your own LDtk importer, you should probably just ignore *most* stuff in
* the `defs` section, as it contains data that are mostly important to the editor. To keep
* you away from the `defs` section and avoid some unnecessary JSON parsing, important data
* from definitions is often duplicated in fields prefixed with a double underscore (eg.
* `__identifier` or `__type`).  The 2 only definition types you might need here are
* **Tilesets** and **Enums**.
*/
export interface Definitions {
  /**
   * All entities definitions, including their custom fields
   */
  entities: EntityDefinition[]
  /**
   * All internal enums
   */
  enums: EnumDefinition[]
  /**
   * Note: external enums are exactly the same as `enums`, except they have a `relPath` to
   * point to an external source file.
   */
  externalEnums: EnumDefinition[]
  /**
   * All layer definitions
   */
  layers: LayerDefinition[]
  /**
   * All custom fields available to all levels.
   */
  levelFields: FieldDefinition[]
  /**
   * All tilesets
   */
  tilesets: TilesetDefinition[]
}

export interface EntityDefinition {
  /**
   * Base entity color
   */
  color: string
  /**
   * Array of field definitions
   */
  fieldDefs: FieldDefinition[]
  fillOpacity: number
  /**
   * Pixel height
   */
  height: number
  hollow: boolean
  /**
   * Unique String identifier
   */
  identifier: string
  /**
   * Only applies to entities resizable on both X/Y. If TRUE, the entity instance width/height
   * will keep the same aspect ratio as the definition.
   */
  keepAspectRatio: boolean
  /**
   * Possible values: `DiscardOldOnes`, `PreventAdding`, `MoveLastOne`
   */
  limitBehavior: LimitBehavior
  /**
   * If TRUE, the maxCount is a "per world" limit, if FALSE, it's a "per level". Possible
   * values: `PerLayer`, `PerLevel`, `PerWorld`
   */
  limitScope: LimitScope
  lineOpacity: number
  /**
   * Max instances count
   */
  maxCount: number
  /**
   * Pivot X coordinate (from 0 to 1.0)
   */
  pivotX: number
  /**
   * Pivot Y coordinate (from 0 to 1.0)
   */
  pivotY: number
  /**
   * Possible values: `Rectangle`, `Ellipse`, `Tile`, `Cross`
   */
  renderMode: RenderMode
  /**
   * If TRUE, the entity instances will be resizable horizontally
   */
  resizableX: boolean
  /**
   * If TRUE, the entity instances will be resizable vertically
   */
  resizableY: boolean
  /**
   * Display entity name in editor
   */
  showName: boolean
  /**
   * An array of strings that classifies this entity
   */
  tags: string[]
  /**
   * Tile ID used for optional tile display
   */
  tileId?: number | null
  /**
   * Possible values: `Cover`, `FitInside`, `Repeat`, `Stretch`
   */
  tileRenderMode: TileRenderMode
  /**
   * Tileset ID used for optional tile display
   */
  tilesetId?: number | null
  /**
   * Unique Int identifier
   */
  uid: number
  /**
   * Pixel width
   */
  width: number
}

/**
* This section is mostly only intended for the LDtk editor app itself. You can safely
* ignore it.
*/
export interface FieldDefinition {
  /**
   * Human readable value type (eg. `Int`, `Float`, `Point`, etc.). If the field is an array,
   * this field will look like `Array<...>` (eg. `Array<Int>`, `Array<Point>` etc.)
   */
  __type: string
  /**
   * Optional list of accepted file extensions for FilePath value type. Includes the dot:
   * `.ext`
   */
  acceptFileTypes?: string[] | null
  /**
   * Array max length
   */
  arrayMaxLength?: number | null
  /**
   * Array min length
   */
  arrayMinLength?: number | null
  /**
   * TRUE if the value can be null. For arrays, TRUE means it can contain null values
   * (exception: array of Points can't have null values).
   */
  canBeNull: boolean
  /**
   * Default value if selected value is null or invalid.
   */
  defaultOverride?: any
  editorAlwaysShow: boolean
  editorCutLongValues: boolean
  /**
   * Possible values: `Hidden`, `ValueOnly`, `NameAndValue`, `EntityTile`, `Points`,
   * `PointStar`, `PointPath`, `PointPathLoop`, `RadiusPx`, `RadiusGrid`
   */
  editorDisplayMode: EditorDisplayMode
  /**
   * Possible values: `Above`, `Center`, `Beneath`
   */
  editorDisplayPos: EditorDisplayPos
  /**
   * Unique String identifier
   */
  identifier: string
  /**
   * TRUE if the value is an array of multiple values
   */
  isArray: boolean
  /**
   * Max limit for value, if applicable
   */
  max?: number | null
  /**
   * Min limit for value, if applicable
   */
  min?: number | null
  /**
   * Optional regular expression that needs to be matched to accept values. Expected format:
   * `/some_reg_ex/g`, with optional "i" flag.
   */
  regex?: null | string
  /**
   * Possible values: &lt;`null`&gt;, `LangPython`, `LangRuby`, `LangJS`, `LangLua`, `LangC`,
   * `LangHaxe`, `LangMarkdown`, `LangJson`, `LangXml`
   */
  textLanguageMode?: TextLanguageMode | null
  /**
   * Internal type enum
   */
  type: any
  /**
   * Unique Int identifier
   */
  uid: number
}

/**
* Possible values: `Hidden`, `ValueOnly`, `NameAndValue`, `EntityTile`, `Points`,
* `PointStar`, `PointPath`, `PointPathLoop`, `RadiusPx`, `RadiusGrid`
*/
export enum EditorDisplayMode {
  EntityTile = 'EntityTile',
  Hidden = 'Hidden',
  NameAndValue = 'NameAndValue',
  PointPath = 'PointPath',
  PointPathLoop = 'PointPathLoop',
  PointStar = 'PointStar',
  Points = 'Points',
  RadiusGrid = 'RadiusGrid',
  RadiusPx = 'RadiusPx',
  ValueOnly = 'ValueOnly',
}

/**
* Possible values: `Above`, `Center`, `Beneath`
*/
export enum EditorDisplayPos {
  Above = 'Above',
  Beneath = 'Beneath',
  Center = 'Center',
}

export enum TextLanguageMode {
  LangC = 'LangC',
  LangHaxe = 'LangHaxe',
  LangJS = 'LangJS',
  LangJSON = 'LangJson',
  LangLua = 'LangLua',
  LangMarkdown = 'LangMarkdown',
  LangPython = 'LangPython',
  LangRuby = 'LangRuby',
  LangXML = 'LangXml',
}

/**
* Possible values: `DiscardOldOnes`, `PreventAdding`, `MoveLastOne`
*/
export enum LimitBehavior {
  DiscardOldOnes = 'DiscardOldOnes',
  MoveLastOne = 'MoveLastOne',
  PreventAdding = 'PreventAdding',
}

/**
* If TRUE, the maxCount is a "per world" limit, if FALSE, it's a "per level". Possible
* values: `PerLayer`, `PerLevel`, `PerWorld`
*/
export enum LimitScope {
  PerLayer = 'PerLayer',
  PerLevel = 'PerLevel',
  PerWorld = 'PerWorld',
}

/**
* Possible values: `Rectangle`, `Ellipse`, `Tile`, `Cross`
*/
export enum RenderMode {
  Cross = 'Cross',
  Ellipse = 'Ellipse',
  Rectangle = 'Rectangle',
  Tile = 'Tile',
}

/**
* Possible values: `Cover`, `FitInside`, `Repeat`, `Stretch`
*/
export enum TileRenderMode {
  Cover = 'Cover',
  FitInside = 'FitInside',
  Repeat = 'Repeat',
  Stretch = 'Stretch',
}

export interface EnumDefinition {
  externalFileChecksum?: null | string
  /**
   * Relative path to the external file providing this Enum
   */
  externalRelPath?: null | string
  /**
   * Tileset UID if provided
   */
  iconTilesetUid?: number | null
  /**
   * Unique String identifier
   */
  identifier: string
  /**
   * Unique Int identifier
   */
  uid: number
  /**
   * All possible enum values, with their optional Tile infos.
   */
  values: EnumValueDefinition[]
}

export interface EnumValueDefinition {
  /**
   * An array of 4 Int values that refers to the tile in the tileset image: `[ x, y, width,
   * height ]`
   */
  __tileSrcRect?: number[] | null
  /**
   * Optional color
   */
  color: number
  /**
   * Enum value
   */
  id: string
  /**
   * The optional ID of the tile
   */
  tileId?: number | null
}

export interface LayerDefinition {
  /**
   * Type of the layer (*IntGrid, Entities, Tiles or AutoLayer*)
   */
  __type: string
  /**
   * Contains all the auto-layer rule definitions.
   */
  autoRuleGroups: AutoLayerRuleGroup[]
  autoSourceLayerDefUid?: number | null
  /**
   * Reference to the Tileset UID being used by this auto-layer rules. WARNING: some layer
   * *instances* might use a different tileset. So most of the time, you should probably use
   * the `__tilesetDefUid` value from layer instances.
   */
  autoTilesetDefUid?: number | null
  /**
   * Opacity of the layer (0 to 1.0)
   */
  displayOpacity: number
  /**
   * An array of tags to forbid some Entities in this layer
   */
  excludedTags: string[]
  /**
   * Width and height of the grid in pixels
   */
  gridSize: number
  /**
   * Unique String identifier
   */
  identifier: string
  /**
   * An array that defines extra optional info for each IntGrid value. The array is sorted
   * using value (ascending).
   */
  intGridValues: IntGridValueDefinition[]
  /**
   * X offset of the layer, in pixels (IMPORTANT: this should be added to the `LayerInstance`
   * optional offset)
   */
  pxOffsetX: number
  /**
   * Y offset of the layer, in pixels (IMPORTANT: this should be added to the `LayerInstance`
   * optional offset)
   */
  pxOffsetY: number
  /**
   * An array of tags to filter Entities that can be added to this layer
   */
  requiredTags: string[]
  /**
   * If the tiles are smaller or larger than the layer grid, the pivot value will be used to
   * position the tile relatively its grid cell.
   */
  tilePivotX: number
  /**
   * If the tiles are smaller or larger than the layer grid, the pivot value will be used to
   * position the tile relatively its grid cell.
   */
  tilePivotY: number
  /**
   * Reference to the Tileset UID being used by this Tile layer. WARNING: some layer
   * *instances* might use a different tileset. So most of the time, you should probably use
   * the `__tilesetDefUid` value from layer instances.
   */
  tilesetDefUid?: number | null
  /**
   * Type of the layer as Haxe Enum Possible values: `IntGrid`, `Entities`, `Tiles`,
   * `AutoLayer`
   */
  type: Type
  /**
   * Unique Int identifier
   */
  uid: number
}

export interface AutoLayerRuleGroup {
  active: boolean
  collapsed: boolean
  isOptional: boolean
  name: string
  rules: AutoLayerRuleDefinition[]
  uid: number
}

/**
* This complex section isn't meant to be used by game devs at all, as these rules are
* completely resolved internally by the editor before any saving. You should just ignore
* this part.
*/
export interface AutoLayerRuleDefinition {
  /**
   * If FALSE, the rule effect isn't applied, and no tiles are generated.
   */
  active: boolean
  /**
   * When TRUE, the rule will prevent other rules to be applied in the same cell if it matches
   * (TRUE by default).
   */
  breakOnMatch: boolean
  /**
   * Chances for this rule to be applied (0 to 1)
   */
  chance: number
  /**
   * Checker mode Possible values: `None`, `Horizontal`, `Vertical`
   */
  checker: Checker
  /**
   * If TRUE, allow rule to be matched by flipping its pattern horizontally
   */
  flipX: boolean
  /**
   * If TRUE, allow rule to be matched by flipping its pattern vertically
   */
  flipY: boolean
  /**
   * Default IntGrid value when checking cells outside of level bounds
   */
  outOfBoundsValue?: number | null
  /**
   * Rule pattern (size x size)
   */
  pattern: number[]
  /**
   * If TRUE, enable Perlin filtering to only apply rule on specific random area
   */
  perlinActive: boolean
  perlinOctaves: number
  perlinScale: number
  perlinSeed: number
  /**
   * X pivot of a tile stamp (0-1)
   */
  pivotX: number
  /**
   * Y pivot of a tile stamp (0-1)
   */
  pivotY: number
  /**
   * Pattern width & height. Should only be 1,3,5 or 7.
   */
  size: number
  /**
   * Array of all the tile IDs. They are used randomly or as stamps, based on `tileMode` value.
   */
  tileIds: number[]
  /**
   * Defines how tileIds array is used Possible values: `Single`, `Stamp`
   */
  tileMode: TileMode
  /**
   * Unique Int identifier
   */
  uid: number
  /**
   * X cell coord modulo
   */
  xModulo: number
  /**
   * Y cell coord modulo
   */
  yModulo: number
}

/**
* Checker mode Possible values: `None`, `Horizontal`, `Vertical`
*/
export enum Checker {
  Horizontal = 'Horizontal',
  None = 'None',
  Vertical = 'Vertical',
}

/**
* Defines how tileIds array is used Possible values: `Single`, `Stamp`
*/
export enum TileMode {
  Single = 'Single',
  Stamp = 'Stamp',
}

/**
* IntGrid value definition
*/
export interface IntGridValueDefinition {
  color: string
  /**
   * Unique String identifier
   */
  identifier?: null | string
  /**
   * The IntGrid value itself
   */
  value: number
}

/**
* Type of the layer as Haxe Enum Possible values: `IntGrid`, `Entities`, `Tiles`,
* `AutoLayer`
*/
export enum Type {
  AutoLayer = 'AutoLayer',
  Entities = 'Entities',
  IntGrid = 'IntGrid',
  Tiles = 'Tiles',
}

/**
* The `Tileset` definition is the most important part among project definitions. It
* contains some extra informations about each integrated tileset. If you only had to parse
* one definition section, that would be the one.
*/
export interface TilesetDefinition {
  /**
   * Grid-based height
   */
  __cHei: number
  /**
   * Grid-based width
   */
  __cWid: number
  /**
   * The following data is used internally for various optimizations. It's always synced with
   * source image changes.
   */
  cachedPixelData?: { [key: string]: any } | null
  /**
   * An array of custom tile metadata
   */
  customData: { [key: string]: any }[]
  /**
   * Tileset tags using Enum values specified by `tagsSourceEnumId`. This array contains 1
   * element per Enum value, which contains an array of all Tile IDs that are tagged with it.
   */
  enumTags: { [key: string]: any }[]
  /**
   * Unique String identifier
   */
  identifier: string
  /**
   * Distance in pixels from image borders
   */
  padding: number
  /**
   * Image height in pixels
   */
  pxHei: number
  /**
   * Image width in pixels
   */
  pxWid: number
  /**
   * Path to the source file, relative to the current project JSON file
   */
  relPath: string
  /**
   * Array of group of tiles selections, only meant to be used in the editor
   */
  savedSelections: { [key: string]: any }[]
  /**
   * Space in pixels between all tiles
   */
  spacing: number
  /**
   * Optional Enum definition UID used for this tileset meta-data
   */
  tagsSourceEnumUid?: number | null
  tileGridSize: number
  /**
   * Unique Intidentifier
   */
  uid: number
}

export enum Flag {
  DiscardPreCSVIntGrid = 'DiscardPreCsvIntGrid',
  IgnoreBackupSuggest = 'IgnoreBackupSuggest',
}

/**
* "Image export" option when saving project. Possible values: `None`, `OneImagePerLayer`,
* `OneImagePerLevel`
*/
export enum ImageExportMode {
  None = 'None',
  OneImagePerLayer = 'OneImagePerLayer',
  OneImagePerLevel = 'OneImagePerLevel',
}

/**
* This section contains all the level data. It can be found in 2 distinct forms, depending
* on Project current settings:  - If "*Separate level files*" is **disabled** (default):
* full level data is *embedded* inside the main Project JSON file, - If "*Separate level
* files*" is **enabled**: level data is stored in *separate* standalone `.ldtkl` files (one
* per level). In this case, the main Project JSON file will still contain most level data,
* except heavy sections, like the `layerInstances` array (which will be null). The
* `externalRelPath` string points to the `ldtkl` file.  A `ldtkl` file is just a JSON file
* containing exactly what is described below.
*/
export interface Level {
  /**
   * Background color of the level (same as `bgColor`, except the default value is
   * automatically used here if its value is `null`)
   */
  __bgColor: string
  /**
   * Position informations of the background image, if there is one.
   */
  __bgPos?: LevelBackgroundPosition | null
  /**
   * An array listing all other levels touching this one on the world map. In "linear" world
   * layouts, this array is populated with previous/next levels in array, and `dir` depends on
   * the linear horizontal/vertical layout.
   */
  __neighbours: NeighbourLevel[]
  /**
   * Background color of the level. If `null`, the project `defaultLevelBgColor` should be
   * used.
   */
  bgColor?: null | string
  /**
   * Background image X pivot (0-1)
   */
  bgPivotX: number
  /**
   * Background image Y pivot (0-1)
   */
  bgPivotY: number
  /**
   * An enum defining the way the background image (if any) is positioned on the level. See
   * `__bgPos` for resulting position info. Possible values: &lt;`null`&gt;, `Unscaled`,
   * `Contain`, `Cover`, `CoverDirty`
   */
  bgPos?: BgPos | null
  /**
   * The *optional* relative path to the level background image.
   */
  bgRelPath?: null | string
  /**
   * This value is not null if the project option "*Save levels separately*" is enabled. In
   * this case, this **relative** path points to the level Json file.
   */
  externalRelPath?: null | string
  /**
   * An array containing this level custom field values.
   */
  fieldInstances: FieldInstance[]
  /**
   * Unique String identifier
   */
  identifier: string
  /**
   * An array containing all Layer instances. **IMPORTANT**: if the project option "*Save
   * levels separately*" is enabled, this field will be `null`.<br/>  This array is **sorted
   * in display order**: the 1st layer is the top-most and the last is behind.
   */
  layerInstances?: LayerInstance[] | null
  /**
   * Height of the level in pixels
   */
  pxHei: number
  /**
   * Width of the level in pixels
   */
  pxWid: number
  /**
   * Unique Int identifier
   */
  uid: number
  /**
   * If TRUE, the level identifier will always automatically use the naming pattern as defined
   * in `Project.levelNamePattern`. Becomes FALSE if the identifier is manually modified by
   * user.
   */
  useAutoIdentifier: boolean
  /**
   * World X coordinate in pixels
   */
  worldX: number
  /**
   * World Y coordinate in pixels
   */
  worldY: number
}

/**
* Level background image position info
*/
export interface LevelBackgroundPosition {
  /**
   * An array of 4 float values describing the cropped sub-rectangle of the displayed
   * background image. This cropping happens when original is larger than the level bounds.
   * Array format: `[ cropX, cropY, cropWidth, cropHeight ]`
   */
  cropRect: number[]
  /**
   * An array containing the `[scaleX,scaleY]` values of the **cropped** background image,
   * depending on `bgPos` option.
   */
  scale: number[]
  /**
   * An array containing the `[x,y]` pixel coordinates of the top-left corner of the
   * **cropped** background image, depending on `bgPos` option.
   */
  topLeftPx: number[]
}

/**
* Nearby level info
*/
export interface NeighbourLevel {
  /**
   * A single lowercase character tipping on the level location (`n`orth, `s`outh, `w`est,
   * `e`ast).
   */
  dir: string
  levelUid: number
}

export enum BgPos {
  Contain = 'Contain',
  Cover = 'Cover',
  CoverDirty = 'CoverDirty',
  Unscaled = 'Unscaled',
}

export interface FieldInstance {
  /**
   * Field definition identifier
   */
  __identifier: string
  /**
   * Type of the field, such as `Int`, `Float`, `Enum(my_enum_name)`, `Bool`, etc.
   */
  __type: string
  /**
   * Actual value of the field instance. The value type may vary, depending on `__type`
   * (Integer, Boolean, String etc.)<br/>  It can also be an `Array` of those same types.
   */
  __value: any
  /**
   * Reference of the **Field definition** UID
   */
  defUid: number
  /**
   * Editor internal raw values
   */
  realEditorValues: any[]
}

export interface LayerInstance {
  /**
   * Grid-based height
   */
  __cHei: number
  /**
   * Grid-based width
   */
  __cWid: number
  /**
   * Grid size
   */
  __gridSize: number
  /**
   * Layer definition identifier
   */
  __identifier: string
  /**
   * Layer opacity as Float [0-1]
   */
  __opacity: number
  /**
   * Total layer X pixel offset, including both instance and definition offsets.
   */
  __pxTotalOffsetX: number
  /**
   * Total layer Y pixel offset, including both instance and definition offsets.
   */
  __pxTotalOffsetY: number
  /**
   * The definition UID of corresponding Tileset, if any.
   */
  __tilesetDefUid?: number | null
  /**
   * The relative path to corresponding Tileset, if any.
   */
  __tilesetRelPath?: null | string
  /**
   * Layer type (possible values: IntGrid, Entities, Tiles or AutoLayer)
   */
  __type: string
  /**
   * An array containing all tiles generated by Auto-layer rules. The array is already sorted
   * in display order (ie. 1st tile is beneath 2nd, which is beneath 3rd etc.).<br/><br/>
   * Note: if multiple tiles are stacked in the same cell as the result of different rules,
   * all tiles behind opaque ones will be discarded.
   */
  autoLayerTiles: TileInstance[]
  entityInstances: EntityInstance[]
  gridTiles: TileInstance[]
  /**
   * **WARNING**: this deprecated value will be *removed* completely on version 0.10.0+
   * Replaced by: `intGridCsv`
   */
  intGrid?: IntGridValueInstance[]
  /**
   * A list of all values in the IntGrid layer, stored from left to right, and top to bottom
   * (ie. first row from left to right, followed by second row, etc). `0` means "empty cell"
   * and IntGrid values start at 1. This array size is `__cWid` x `__cHei` cells.
   */
  intGridCsv: number[]
  /**
   * Reference the Layer definition UID
   */
  layerDefUid: number
  /**
   * Reference to the UID of the level containing this layer instance
   */
  levelId: number
  /**
   * An Array containing the UIDs of optional rules that were enabled in this specific layer
   * instance.
   */
  optionalRules: number[]
  /**
   * This layer can use another tileset by overriding the tileset UID here.
   */
  overrideTilesetUid?: number | null
  /**
   * X offset in pixels to render this layer, usually 0 (IMPORTANT: this should be added to
   * the `LayerDef` optional offset, see `__pxTotalOffsetX`)
   */
  pxOffsetX: number
  /**
   * Y offset in pixels to render this layer, usually 0 (IMPORTANT: this should be added to
   * the `LayerDef` optional offset, see `__pxTotalOffsetY`)
   */
  pxOffsetY: number
  /**
   * Random seed used for Auto-Layers rendering
   */
  seed: number
  /**
   * Layer instance visibility
   */
  visible: boolean
}

/**
* This structure represents a single tile from a given Tileset.
*/
export interface TileInstance {
  /**
   * Internal data used by the editor.<br/>  For auto-layer tiles: `[ruleId, coordId]`.<br/>
   * For tile-layer tiles: `[coordId]`.
   */
  d: number[]
  /**
   * "Flip bits", a 2-bits integer to represent the mirror transformations of the tile.<br/>
   * - Bit 0 = X flip<br/>   - Bit 1 = Y flip<br/>   Examples: f=0 (no flip), f=1 (X flip
   * only), f=2 (Y flip only), f=3 (both flips)
   */
  f: number
  /**
   * Pixel coordinates of the tile in the **layer** (`[x,y]` format). Don't forget optional
   * layer offsets, if they exist!
   */
  px: number[]
  /**
   * Pixel coordinates of the tile in the **tileset** (`[x,y]` format)
   */
  src: number[]
  /**
   * The *Tile ID* in the corresponding tileset.
   */
  t: number
}

export interface EntityInstance {
  /**
   * Grid-based coordinates (`[x,y]` format)
   */
  __grid: number[]
  /**
   * Entity definition identifier
   */
  __identifier: string
  /**
   * Pivot coordinates  (`[x,y]` format, values are from 0 to 1) of the Entity
   */
  __pivot: number[]
  /**
   * Optional Tile used to display this entity (it could either be the default Entity tile, or
   * some tile provided by a field value, like an Enum).
   */
  __tile?: EntityInstanceTile | null
  /**
   * Reference of the **Entity definition** UID
   */
  defUid: number
  /**
   * An array of all custom fields and their values.
   */
  fieldInstances: FieldInstance[]
  /**
   * Entity height in pixels. For non-resizable entities, it will be the same as Entity
   * definition.
   */
  height: number
  /**
   * Pixel coordinates (`[x,y]` format) in current level coordinate space. Don't forget
   * optional layer offsets, if they exist!
   */
  px: number[]
  /**
   * Entity width in pixels. For non-resizable entities, it will be the same as Entity
   * definition.
   */
  width: number
}

/**
* Tile data in an Entity instance
*/
export interface EntityInstanceTile {
  /**
   * An array of 4 Int values that refers to the tile in the tileset image: `[ x, y, width,
   * height ]`
   */
  srcRect: number[]
  /**
   * Tileset ID
   */
  tilesetUid: number
}

/**
* IntGrid value instance
*/
export interface IntGridValueInstance {
  /**
   * Coordinate ID in the layer grid
   */
  coordId: number
  /**
   * IntGrid value
   */
  v: number
}

/**
* An enum that describes how levels are organized in this project (ie. linearly or in a 2D
* space). Possible values: `Free`, `GridVania`, `LinearHorizontal`, `LinearVertical`
*/
export enum WorldLayout {
  Free = 'Free',
  GridVania = 'GridVania',
  LinearHorizontal = 'LinearHorizontal',
  LinearVertical = 'LinearVertical',
}

/** Custom project layers defined in Ldtk project */
export enum Layers {
  ENTITIES = 'ENTITIES',
  PLATFORMS = 'PLATFORMS',
  FOREGROUND = 'FOREGROUND',
  BACKGROUND = 'BACKGROUND'
}

// Converts JSON strings to/from your types
export class LdtkConverter {
  public static toLdtk(json: string): Ldtk {
    return JSON.parse(json)
  }

  public static ldtkToJson(value: Ldtk): string {
    return JSON.stringify(value)
  }
}
