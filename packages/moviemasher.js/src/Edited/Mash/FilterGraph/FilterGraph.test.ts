import { mashInstance } from "../MashFactory"
import { clipDefault } from "../../../Edited/Mash/Track/Clip/ClipFactory"
import { expectArrayLength } from "../../../../../../dev/test/Utilities/Expect"

describe("FilterGraph", () => {
  describe("mash with color/rect clip", () => {
    test("its CommandFilters are correct", () => {
      const mash = mashInstance({ tracks: [ { clips: [{ definitionId: clipDefault.id }] }]})
      mash.imageSize = { width: 480, height: 270 }
      const filterGraphs = mash.filterGraphs()
      const { filterGraphVisible } = filterGraphs
      
      const { commandFilters } = filterGraphVisible
      // console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 4)
    })
  })
})
