import { expectCanvasAtTime } from "../../../../../dev/test/Utilities/expectCanvas"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"
import { MashObject } from "../../Edited/Mash/Mash"
import { mashInstance } from "../../Edited/Mash/MashFactory"
import { EditorDefinitionsClass } from "../../Editor"
import { ClipObject } from "../../Mixin/Clip/Clip"
import { DefinitionType, TrackType } from "../../Setup/Enums"
import { ImageDefinitionObject } from "../Image/Image"
import { ScalerObject } from "../Scaler/Scaler"
import { MergerObject } from "./Merger"

describe("Merger", () => {
  describe("Center", () => {
    test("draws correctly", async () => {

      const source = '../shared/image/globe.jpg'
      const definitionId = 'image'
      const definitionObject: ImageDefinitionObject = {
        source, id: definitionId, type: DefinitionType.Image, url: source
      }
      const merger: MergerObject = { definitionId: 'com.moviemasher.merger.center' }
      const scaler: ScalerObject = { definitionId: 'com.moviemasher.scaler.default' }
      const clip: ClipObject = { definitionId, merger, scaler }
      const mashObject: MashObject = {
        tracks: [{ trackType: TrackType.Video, clips: [clip] }]
      }
      const definitions = new EditorDefinitionsClass([definitionObject])
      const mash = mashInstance({ ...mashObject, definitions, preloader: new JestPreloader() })
      await expectCanvasAtTime(mash)
    })
  })
})
