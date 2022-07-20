import { mashInstance } from "../MashFactory"
import { visibleClipDefault } from "../../../Media/VisibleClip/VisibleClipFactory"
import { expectArrayLength } from "../../../../../../dev/test/Utilities/Expect"

describe("FilterGraph", () => {
  describe("mash with color/rect clip", () => {
    const mash = mashInstance({ tracks: [ { clips: [{ definitionId: visibleClipDefault.id }] }]})
    const filterGraphs = mash.filterGraphs()
    const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
    
    test("its CommandFilters are correct", () => {
  
      const { commandFilters } = filterGraphVisible
      // console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 3)
    })
  })
})
