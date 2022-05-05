import { expectCanvasAtTime } from "../../../../../dev/test/Utilities/expectCanvas"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"
import { MashObject } from "../../Edited/Mash/Mash"
import { mashInstance } from "../../Edited/Mash/MashFactory"
import { EditorDefinitionsClass } from "../../Editor"
import { ClipObject } from "../../Mixin/Clip/Clip"
import { DefinitionType, TrackType } from "../../Setup/Enums"
import { ImageDefinitionObject } from "../Image/Image"
import { MergerObject } from "../Merger/Merger"
import { ScalerObject } from "./Scaler"

describe("Scaler", () => {
  describe("Pan", () => {
    test("visibleContext", async () => {
      const source = '../shared/image/globe.jpg'
      const definitionId = 'image'
      const definitionObject: ImageDefinitionObject = {
        source, id: definitionId, type: DefinitionType.Image, url: source
      }
      const merger: MergerObject = { definitionId: 'com.moviemasher.merger.default' }
      const scaler: ScalerObject = { definitionId: 'com.moviemasher.scaler.pan', direction: 6 }
      const clip: ClipObject = { definitionId, merger, scaler }
      const mashObject: MashObject = {
        tracks: [{ trackType: TrackType.Video, clips: [clip] }]
      }
      const definitions = new EditorDefinitionsClass([definitionObject])
      const mash = mashInstance(mashObject, definitions, new JestPreloader())
      await expectCanvasAtTime(mash)
    })
  })
})
