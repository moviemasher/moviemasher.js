import { describe, test } from 'node:test'
import assert from 'assert'

import { mashInstance, SizeOutput, Defined } from "@moviemasher/moviemasher.js"
import { expectArrayLength } from "../../../../../../images/tester/Utilities/Expect.mjs"
import { generateTest, GenerateDefinitionObjects } from "../../../../../../images/tester/Utilities/Generate.mjs"

describe("FilterGraph", () => {
  describe("mash with color/rect clip", () => {
    test("its CommandFilters are correct", () => {
      const mash = mashInstance({ tracks: [ { clips: [{}] }]})
      mash.imageSize = { width: 480, height: 270 }
      const filterGraphs = mash.filterGraphs()
      const { filterGraphVisible } = filterGraphs
      
      const { commandFilters } = filterGraphVisible
      // console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 4)
    })
  })
  describe("something", () => {
    test("else", async () => {
      const id = 'P_M_F_in_S_U_M_H_100'
      const [testId, test] = generateTest(id)
      const { tracks } = test
      const [track] = tracks
      const {clips: trackClips} = track
      Defined.define(...GenerateDefinitionObjects)
      GenerateDefinitionObjects.forEach(object => {
        const { id } = object
        assert(Defined.installed(id), `${id} installed`)
      })
      console.log('trackClips', trackClips)
      const mash = mashInstance({ mash: test })
      mash.loadCommandFilesPromise()
      const filterGraphs = mash.filterGraphs(args)
      await filterGraphs.loadCommandFilesPromise
      const args = {
        visible: true,
        background: test.color,
        mash,
        size: SizeOutput,
        time: mash.timeRange,
        videoRate: 30,
      }
      
      assert(false, 'CONSOLE')
    })
  })
})
