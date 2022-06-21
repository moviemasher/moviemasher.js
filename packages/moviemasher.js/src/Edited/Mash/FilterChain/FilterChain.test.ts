import { mashInstance } from "../MashFactory"
import { visibleClipDefault } from "../../../Media/VisibleClip/VisibleClipFactory"
import { expectArrayLength } from "../../../../../../dev/test/Utilities/expectArrayLength"


describe("FilterChain", () => {
  describe("mash with color/rect clip", () => {
    const mash = mashInstance({ tracks: [ { clips: [{ definitionId: visibleClipDefault.id }] }]})
    const filterGraphs = mash.filterGraphs()
    const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
    const { filterChains } = filterGraphVisible
    const [filterChain] = filterChains
    test("its single FilterGraph contains a single FilterChain", () => {
      expect(filterGraphAudible).toBeUndefined()
      expectArrayLength(filterGraphsVisible, 1)
      expectArrayLength(filterChains, 1)
      expect(filterChain).toBeDefined()

    })
    test("its FilterChain...", () => {
     
      const { commandFilters } = filterChain
      
      expectArrayLength(commandFilters, 3)
    })
  })
})
