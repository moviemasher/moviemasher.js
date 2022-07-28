import { mashInstance } from "../MashFactory"
import { clipDefault } from "../../../Media/Clip/ClipFactory"
import { expectArrayLength } from "../../../../../../dev/test/Utilities/Expect"

describe("FilterGraph", () => {
  describe("mash with color/rect clip", () => {
    const mash = mashInstance({ tracks: [ { clips: [{ definitionId: clipDefault.id }] }]})
    const filterGraphs = mash.filterGraphs()
    const { filterGraphVisible } = filterGraphs
    
    test("its CommandFilters are correct", () => {
  
      const { commandFilters } = filterGraphVisible
      // console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 4)
    })
  })
})
