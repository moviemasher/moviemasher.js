import { describe, test } from 'node:test'
import assert from 'assert'

import { expectArrayLength, expectEmptyArray } from "../../../../../images/tester/Utilities/Expect.mjs"
import { JestPreloader } from '../../../../../images/tester/Utilities/JestPreloader.mjs'

import { 
  AVType, GraphType, LoadType, Errors, idGenerateString, MashClass, 
  assertMashClass, mashInstance, outputDefaultVideo, FilterGraphClass, 
  timeFromArgs, timeRangeFromArgs, timeRangeFromTimes, isClipObject, 
  assertPreloadableDefinition, TrackClass, Defined, DefinitionType,
  fontDefault,
  TextContainerId
} from "@moviemasher/moviemasher.js"


describe("Mash", () => {
  Defined.define({
    id: 'image-square', type: DefinitionType.Image, 
    source: '../shared/image/globe.jpg',  sourceSize: { width: 640, height: 480 }
  })
  Defined.define({
    id: 'image-landscape', type: DefinitionType.Image, 
    source: '../shared/image/cable.jpg', sourceSize: { width: 640, height: 480 }
  })
  Defined.define({
    type: "videosequence",
    label: "Video Sequence", id: "video-sequence",
    url: 'video/frames/',
    source: 'video/source.mp4',
    audio: 'video/audio.mp3',
    duration: 3, fps: 30, sourceSize: { width: 640, height: 480 }
  })
  Defined.define({
    type: "video",
    label: "Video", id: "video-rgb",
    url: 'video.mp4',
    source: 'video.mp4',
    duration: 3, fps: 10, sourceSize: { width: 640, height: 480 }
    
  })
  fontDefault.url = fontDefault.source

  const addNewClip = (mash, track = 0) => {
    const clip = clipInstance()
    assert(clip)
    mash.addClipToTrack(clip, track)
    return clip
  }

  const addNewTextClip = (mash, track = 0) => {
    const clipObject = { containerId: TextContainerId }
    const clip = clipInstance(clipObject)
    assert(clip)
    mash.addClipToTrack(clip, track)
    return clip
  }

  const createMash = (clips = []) => {
    const mashObject = { tracks: [{ clips }] }
    const mash = mashInstance(mashObject)
    mash.imageSize = { width: 480, height: 270 }
    return mash
  }

  const mashWithMultipleImageClips = () => {
    const clip1 = { contentId: 'image-square', frames: 30 }
    const clip2 = { contentId: 'image-landscape', frames: 40 }
    return createMash([clip1, clip2])
  }

  describe("instance", () => {
    test("returns MashClass instance", () => {
      const mash = mashInstance()
      assert(mash instanceof MashClass)
    })

    test("returns proper mash with minimal object", () => {
      const clipObjects = [
        { contentId: 'image-square' },
        { contentId: 'image-landscape' },
      ]
      const mash = createMash(clipObjects)
      expectArrayLength(mash.tracks, 1)
      const videoTrack = mash.tracks[0]
      assert(videoTrack.dense)
      const { clips } = videoTrack
      expectArrayLength(clips, 2)
      
      const [globeClip, cableClip] = clips
      assert.equal(globeClip.frames, 30)
      assert.equal(cableClip.frame, 30)

    })
  })

  describe("addTrack", () => {
    test.each([true, false])("returns new track with dense = %s", (tf) => {
      const mash = mashInstance()
      const addedTrack = mash.addTrack({ dense: tf })
      assert.equal(addedTrack.dense, tf)
      assert(addedTrack instanceof TrackClass)
      expectArrayLength(mash.tracks, 2)
      const track = mash.tracks[mash.tracks.length - 1]
      assert(track instanceof TrackClass)
      assert.strictEqual(addedTrack, track)
    })
  })

  describe("addClipToTrack", () => {
    test("correctly moves to new track and removes from old", () => {
      const mash = mashInstance()
      const firstTrack = mash.addTrack()
      assert.equal(firstTrack.index, 1)
      const secondTrack = mash.addTrack()
      assert.equal(secondTrack.index, 2)
      const clip = addNewClip(mash, 1)
      assert(firstTrack.clips.includes(clip))
      assert(!secondTrack.clips.includes(clip))
      const clipTrack = clip.track

      assert.strictEqual(clipTrack, firstTrack)

      mash.addClipToTrack(clip, 2)
      assert.strictEqual(clip.track, secondTrack)
      assert(secondTrack.clips.includes(clip))
      assert(!firstTrack.clips.includes(clip))
    })

    test("correctly places clip in track clips", () => {
      const mash = mashInstance()
      const clip = addNewClip(mash)
      expectArrayLength(mash.tracks, 1)
      const track = mash.tracks[0]
      expectArrayLength(track.clips, 1)
      assert.strictEqual(track.clips[0], clip)
      assert.equal(mash.frames, clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = mashInstance()
      assert.equal(mash.quantize, 10)
      const track = mash.tracks[0]
      assert(track.dense)

      const clip1 = clipInstance()
      const clip2 = clipInstance()
      mash.addClipToTrack(clip1, 0)
      assert.equal(mash.tracks.length, 1)
      mash.addClipToTrack(clip2, 0, 1)

      assert.equal(mash.tracks.length, 1)

      assert.notEqual(clip1.frame, clip2.frame)

      assert.equal(mash.frames, 60)

      expectArrayLength(track.clips, 2)
      assert.strictEqual(track.clips[0], clip1)
      assert.strictEqual(track.clips[1], clip2)
    })

  })

  describe("clips", () => {
    test("returns proper clips", () => {
      const clips = [
        { label: 'A', containerId: TextContainerId, frame: 0, frames: 100, string: "A" },
        { label: 'B', frame: 100, frames: 50, color: "blue"},
        { label: 'C', containerId: TextContainerId, frame: 150, frames: 100, string: "C" },
      ]
      const mash = mashInstance({ tracks: [{ clips }, { clips }, { clips }] })
      expectArrayLength(mash.clips, clips.length * 3)
    })
  })

  describe("clipsInTimeOfType", () => {
    test("returns expected", () => {
      const mash = mashWithMultipleImageClips()
      const scaled = timeRangeFromArgs(0, 10, 30)
      const clips = mash.clipsInTimeOfType(scaled)
      assert.equal(clips.length, 1)
    })
  })

  describe("fileUrls", () => {
    test("returns image file from first frame only", () => {
      const mash = mashWithMultipleImageClips()
      expectArrayLength(mash.editedGraphFiles(), 1)
    })

    test("returns font file from text container", () => {
      const mash = createMash()
      addNewTextClip(mash)

      const files = mash.editedGraphFiles()
      expectArrayLength(files, 1)
      const [fontGraphFile] = files
      assert.equal(fontGraphFile.type, LoadType.Font)
      assert(!fontGraphFile.input)

      const editingGraphFiles = mash.editedGraphFiles({ editing: true })
      expectArrayLength(editingGraphFiles, 1)
      const [editingFontGraphFile] = editingGraphFiles
      assert.equal(editingFontGraphFile.type, LoadType.Font)
      assert(!editingFontGraphFile.input)
    })
  })

  describe("filterGraphs", () => {
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
      const filterGraphs = mash.filterGraphs(args)
      expectArrayLength(filterGraphs.filterGraphsVisible, 2)
    })

    test("returns expected FilterGraphs for image", async () => {
      const clip = { contentId: 'image-landscape' }
 
      const mash = createMash([clip]) 
      const filterGraphs = mash.filterGraphs(filterGraphsOptions)
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
      const filterGraphs = mash.filterGraphs(options)
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
      const filterGraphs = mash.filterGraphs(filterGraphsOptions)
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
        const filterGraphs = mash.filterGraphs(graphArgs)
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
      const filterGraphs = mash.filterGraphs(graphArgs)
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
  })

  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      const mash = mashInstance()
      assert.equal(mash.frames, 0)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = idGenerateString()
      const mash = mashInstance({ id })
      assert.equal(mash.id, id)
    })
  })

  describe("removeTrack", () => {
    test("correctly removes track", () => {
      const mash = mashInstance()

      mash.removeTrack()
      expectEmptyArray(mash.tracks)
    })
  })

  describe("toJSON", () => {
    test("returns expected object", () => {
      const id = idGenerateString()
      const mash = mashInstance({ id })
      mash.addTrack()
      const clip = addNewClip(mash, 1)

      const mashString = JSON.stringify(mash)
      const mashObject = JSON.parse(mashString)
      assert.equal(mashObject.id, id)
      const tracks = mashObject.tracks

      expectArrayLength(tracks, 2, Object)

      const [videoTrack1, videoTrack2] = tracks
      expectEmptyArray(videoTrack1.clips)
      expectArrayLength(videoTrack2.clips, 1)
      const clips = videoTrack2.clips

      clips.forEach(object => assert(isClipObject(object)))
      const [clipObject] = clips
      assert(isClipObject(clipObject))

      assert.equal(clipObject.color, clip.value('color'))
    })
  })

  describe("tracks", () => {
    test("returns a single dense track", () => {
      const mash = mashInstance()
      const { tracks } = mash
      expectArrayLength(tracks, 1)
      const [track] = tracks
      assert(track instanceof TrackClass)
      const { dense } = track
      assert(dense)
    })
  })
  const output = outputDefaultVideo()
  const time = timeFromArgs(0, 10)
  const size = { width: output.width, height: output.height }
  const videoRate = output.videoRate
  const filterGraphsOptions = {
    avType: AVType.Video, size, videoRate, time
  }
})
