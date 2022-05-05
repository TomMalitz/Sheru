import { AsperiteData } from '../types/aseprite'

export default class AsepriteUtil {
  asepriteData: AsperiteData

  constructor(asepriteData: AsperiteData) {
    this.asepriteData = asepriteData
  }

  getAnimStartEnd(animName: string): {start: number; end: number} {
    const startEnd = { start: 0, end: 0 }
    const matchingFrameTag = this.asepriteData.meta.frameTags.filter(frameTag => frameTag.name === animName)[0]
    if (matchingFrameTag) {
      startEnd.start = matchingFrameTag.from
      startEnd.end = matchingFrameTag.to
    }
    return startEnd
  }
}
