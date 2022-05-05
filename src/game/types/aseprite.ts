export interface AsperiteFrameData {
  sourceSize: {
    w: number
    h: number
  }
}

export interface AsperiteFrameTag {
  name: string
  from: number
  to: number
  direction: string
}

export interface AsepriteMeta {
  frameTags: AsperiteFrameTag[]
}

export interface AsperiteData {
  frames: AsperiteFrameData[]
  meta: AsepriteMeta
}

export class AsperiteDataConverter {
  public static toAsepriteData(json: string): AsperiteData {
    return JSON.parse(json)
  }
}
