import { FilterGraphsClass } from "./FilterGraphsClass"
import { mashInstance } from "../MashFactory"
import { clipDefault } from "../../../Edited/Mash/Track/Clip/ClipFactory"
import { FilterGraphClass } from "../FilterGraph/FilterGraphClass"
import { expectArrayLength } from "../../../../../../dev/test/Utilities/Expect"


describe("FilterGraphs", () => {
  describe("empty mash", () => {
    test("it contains no audible or visible FilterGraph", () => {
      const mash = mashInstance()
      const filterGraphs = mash.filterGraphs()
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      expect(filterGraphs).toBeInstanceOf(FilterGraphsClass)
      expect(filterGraphAudible).toBeUndefined()
      expect(filterGraphVisible).toBeUndefined()
      expectArrayLength(filterGraphsVisible, 0)
    })  
  })
  
  describe("mash with single clip", () => {
    
    test("it contains a single visible FilterGraph", () => {
      const mash = mashInstance({ tracks: [ { clips: [{ definitionId: clipDefault.id }] }]})
    const filterGraphs = mash.filterGraphs()
    const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      expect(filterGraphAudible).toBeUndefined()
      expectArrayLength(filterGraphsVisible, 1)
      expect(filterGraphVisible).toBeDefined()
      expect(filterGraphVisible).toBeInstanceOf(FilterGraphClass)
      expect(filterGraphsVisible[0]).toEqual(filterGraphVisible)
    })
    
    test("its visible FilterGraph contains correct CommandFilters", () => {
      const mash = mashInstance({ tracks: [ { clips: [{ definitionId: clipDefault.id }] }]})
      const filterGraphs = mash.filterGraphs()
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      const { commandFilters } = filterGraphVisible
      expectArrayLength(commandFilters, 4)
    })
  })
})
