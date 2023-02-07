import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  mashInstance, 
 } from "@moviemasher/moviemasher.js"


import { 
  FilterGraphsClass, FilterGraphClass,
  filterGraphsInstance,
  filterGraphsArgs
 } from "@moviemasher/server-core"

 
import { expectArrayLength } from "../../../../../../images/tester/Utilities/Expect.mjs"


describe("FilterGraphs", () => {
  test("filterGraphsVisible returns two for two clips", () => {
    const clip1 = { frames: 60}
    const clip2 = { frames: 40 }
    const mash = mashInstance({ tracks: [{ clips: [clip1, clip2] }] })
    assertMashClass(mash)
    const { quantize, time, endTime, frames } = mash
    // console.log("quantize, time, endTime, frames", quantize, time, endTime, frames)
    assert.deepStrictEqual(time, timeFromArgs(0, quantize))
    assert.deepStrictEqual(endTime, timeFromArgs(100, quantize))

    const args = {
      avType: AVType.Both,
      size: { width: 640, height: 480 },
      videoRate: 10,
      time: mash.timeRange
    }
    const filterGraphs = filterGraphsInstance(filterGraphsArgs(mash, args))
    expectArrayLength(filterGraphs.filterGraphsVisible, 2)
  })

  test("returns expected FilterGraphs for image", async () => {
    const clip = { contentId: 'image-landscape' }

    const mash = createMash([clip]) 
    const filterGraphs = filterGraphsInstance(filterGraphArgs(mash, filterGraphsOptions))
    const { filterGraphsVisible } = filterGraphs
    expectArrayLength(filterGraphsVisible, 1)
    const filterGraph = filterGraphsVisible[0]
    assert(filterGraph instanceof FilterGraphClass)
    if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal
    await filterGraphs.loadCommandFilesPromise

    const { commandFilters, filterGraphCommandFiles: commandFiles } = filterGraph
    // console.log("commandFilters", commandFilters)
    expectArrayLength(commandFilters, 8)

    // console.log("commandFiles", commandFiles)
    expectArrayLength(commandFiles, 1)
    const [commandFile] = commandFiles
    const { type, file, input, options } = commandFile
    assert.equal(type, LoadType.Image)
    assert.equal(file, '../shared/image/cable.jpg')
    assert(input)
   
    assert(options instanceof Object)
    const { loop, framerate } = options
    assert.equal(loop, 1)
    assert.equal(framerate, 30)
  })

  test("returns multiple FilterGraphs for images", async () => {
    const mash = mashWithMultipleImageClips()
    const { quantize } = mash
    const videoTrack = mash.tracks[0]
    const clips = videoTrack.clips 
    const options = {
      ...filterGraphsOptions, graphType: GraphType.Mash,
      time: timeRangeFromTimes(filterGraphsOptions.time, mash.endTime),
    }
    const filterGraphs = filterGraphsInstance(filterGraphArgs(mash, options))
    const { filterGraphsVisible } = filterGraphs
    // console.log(filterGraphsVisible.map(g => g.time))
    expectArrayLength(filterGraphsVisible, 2)
    filterGraphsVisible.forEach(async (filterGraph, index) => {

      await mash.loadPromise(filterGraph)
      assert(filterGraph instanceof FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      const clip = clips[index]
      const timeRange = clip.timeRange(quantize)
      const { filterGraphCommandFiles: commandFiles, duration } = filterGraph
      // console.log(clip.frame, clip.frames, time, timeRange, duration, timeRange.lengthSeconds)
      assert.equal(duration, timeRange.lengthSeconds)
      assert.equal(commandFiles.length, 1)
      const [graphFile] = commandFiles
      const { type, file, input, options } = graphFile
      assert.equal(type, LoadType.Image)
      assert(input)
      
      const { definition } = clip.content
      assertPreloadableDefinition(definition)
      assert.equal(file, definition.source)

      assert(options instanceof Object)
      const { loop, framerate } = options
      assert.equal(loop, 1)
      assert.equal(framerate, 30)

    })
  })
  
  // TODO: support remote fonts in tests or use local ones...
  test.skip("returns expected FilterGraphs for text", async () => {
    const mash = createMash()
    
    addNewTextClip(mash)
    const filterGraphs = filterGraphsInstance(filterGraphArgs(mash, filterGraphsOptions))
    const {filterGraphsVisible} = filterGraphs
    expectArrayLength(filterGraphsVisible, 1)
    const [filterGraph] = filterGraphsVisible
    assert(filterGraph instanceof FilterGraphClass)
    if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

    await mash.loadPromise(filterGraph)
    const { commandFilters } = filterGraph
    // console.log("commandFilters", commandFilters)
    expectArrayLength(commandFilters, 5)
  })

  test.skip("returns expected GraphFiles for video sequence", () => {
    const expectFilterGraphAudible = (filterGraphAudible) => {
      const { commandFilters } = filterGraphAudible
      // console.log("expectFilterGraphAudible commandFilters", commandFilters)
      expectArrayLength(commandFilters, 1)

    }
    const expectClipGraphFiles = (jpgs, clip, args) => {
      jpgs ||= []
      clip ||= {}
      args ||= {}
      const clipObjects = [{ containerId: 'video-sequence', frames: 30, ...clip }] 
      const mash = createMash(clipObjects)

      mash.imageSize = { width: 480, height: 270 }
      const graphArgs = { ...filterGraphsOptions, ...args }
      const filterGraphs = filterGraphsInstance(filterGraphArgs(mash, graphArgs))
      const { filterGraphsVisible, filterGraphAudible } = filterGraphs

      if (filterGraphAudible) expectFilterGraphAudible(filterGraphAudible)
      expectArrayLength(filterGraphsVisible, 1)
      const [filterGraph] = filterGraphsVisible
      assert(filterGraph instanceof FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      const { visible, quantize, time } = filterGraph
      const graphFileArgs = { 
        editing: false, visible, quantize, time 
      }
      const files = mash.editedGraphFiles(graphFileArgs)
      const { commandFilters, duration } = filterGraph
      if (time.isRange) assert(duration).toBeGreaterThan(0)
      else assert.equal(duration, 0)

      // console.log('commandFilters', commandFilters)
      expectArrayLength(commandFilters, 10)
      assert(files instanceof Array)
      const imageFiles = files.filter(graphFile => graphFile.type === LoadType.Image)
      const audioFiles = files.filter(graphFile => graphFile.type === LoadType.Audio)
      if (time.isRange) {
        expectArrayLength(audioFiles, 1)
        const [audioFile] = audioFiles
        assert(audioFile).toBeDefined()
        const { file } = audioFile
        assert.equal(file, 'video/audio.mp3')
        // console.log('audioFile', audioFile)
      } else expectArrayLength(audioFiles, 0)
      if (imageFiles.length !== jpgs.length) console.log(imageFiles.map(f => f.file))
      expectArrayLength(imageFiles, jpgs.length)
      imageFiles.forEach((graphFile, index) => {
        assert(graphFile instanceof Object)
        const jpg = String(jpgs[index]).padStart(2, '0')
        const { file, input } = graphFile
        if (!input) console.log("graphFile", graphFile)
        assert(input)
        assert.equal(file, `video/frames/${jpg}.jpg`)
      })
    }
    expectClipGraphFiles([1])
    expectClipGraphFiles([31], { trim: 10 })
    expectClipGraphFiles([34], { trim: 10 }, { time: timeFromArgs(1, 10)})
    expectClipGraphFiles(
      [34, 35, 36, 37, 38, 39],
      { trim: 10 },
      {
        time: timeRangeFromArgs(1, 10, 2)
      }
    )
  })

  test("returns expected FilterGraphs for video", () => {
    const clipObjects = [{ contentId: 'video-rgb', frames: 30 }] 
    const mash = createMash(clipObjects)
    const graphArgs = {...filterGraphsOptions, graphType: GraphType.Mash }
    assert.equal(graphArgs.graphType, GraphType.Mash)
    const filterGraphs = filterGraphsInstance(filterGraphArgs(mash, graphArgs))
    const { filterGraphsVisible } = filterGraphs
    const [filterGraph] = filterGraphsVisible
    assert(filterGraph instanceof FilterGraphClass)
    if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

    const { commandFilters, filterGraphCommandFiles: commandFiles, duration } = filterGraph
    assert.equal(duration, 0)
    // console.log("commandFilters", commandFilters)
    expectArrayLength(commandFilters, 10)
    expectArrayLength(commandFiles, 1)
    const [graphFile] = commandFiles
    assert(graphFile instanceof Object)
    const { file, input } = graphFile
    assert(input)
    assert.equal(file, 'video.mp4')
  })

  describe("empty mash", () => {
    test("it contains no audible or visible FilterGraph", () => {
      const mash = mashInstance()
      const filterGraphs = filterGraphsInstance(filterGraphsArgs(mash))
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      assert(filterGraphs instanceof FilterGraphsClass)
      assert(!filterGraphAudible)
      assert(!filterGraphVisible)
      expectArrayLength(filterGraphsVisible, 0)
    })  
  })
  
  describe("mash with single clip", () => {
    test("it contains a single visible FilterGraph", () => {
      const mash = mashInstance({ tracks: [ { clips: [{}] }]})
      const filterGraphs = filterGraphsInstance(filterGraphArgs(mash))
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      assert(!filterGraphAudible)
      expectArrayLength(filterGraphsVisible, 1)
      assert(filterGraphVisible)
      assert(filterGraphVisible instanceof FilterGraphClass)
      assert.equal(filterGraphsVisible[0], filterGraphVisible)
    })
    
    test("its visible FilterGraph contains correct CommandFilters", () => {
      const mash = mashInstance({ tracks: [ { clips: [{}] }]})
      mash.imageSize = { width: 640, height: 480 }
      const filterGraphs = filterGraphsInstance(filterGraphArgs(mash))
      const { filterGraphAudible, filterGraphVisible, filterGraphsVisible } = filterGraphs
      const { commandFilters } = filterGraphVisible
      expectArrayLength(commandFilters, 4)
    })
  })
})
