
import { expectArrayLength, expectEmptyArray } from "../../../../../dev/test/Utilities/Expect"

import { AVType, GraphFileType, GraphType, LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { idGenerate, idGenerateString } from "../../Utility/Id"
import { Mash, MashObject } from "./Mash"
import { MashClass } from "./MashClass"

import { assertMashClass, mashInstance } from "./MashFactory"
import { UnknownObject, ValueObject } from '../../declarations'
import { outputDefaultVideo } from '../../Output/OutputDefault'
import { JestPreloader } from '../../../../../dev/test/Utilities/JestPreloader'

import { FilterGraphsOptions } from './FilterGraphs/FilterGraphs'

import { FilterGraphClass } from './FilterGraph/FilterGraphClass'
import { timeFromArgs, timeRangeFromArgs, timeRangeFromTimes } from '../../Helpers/Time/TimeUtilities'
import { isClipObject, Clip, ClipObject } from "../../Edited/Mash/Track/Clip/Clip"
import { assertPreloadableDefinition } from "../../Mixin/Preloadable/Preloadable"
import { TrackClass } from "./Track/TrackClass"
import { GraphFileOptions } from "../../MoveMe"
import { containerTextId } from "../../../../../dev/test/Setup/Constants"
import { FilterGraph } from "./FilterGraph/FilterGraph"
import { clipDefault } from "./Track/Clip/ClipFactory"


describe("Mash", () => {

  const addNewClip = (mash: Mash, track = 0): Clip => {
    const clip = clipDefault.instanceFromObject()
    expect(clip).toBeTruthy()
    mash.addClipToTrack(clip, track)
    return clip
  }

  const addNewTextClip = (mash: Mash, track = 0): Clip => {
    const clipObject = {
      definitionId: clipDefault.id, containerId: containerTextId
    }
    const clip = clipDefault.instanceFromObject(clipObject)
    expect(clip).toBeTruthy()
    mash.addClipToTrack(clip, track)
    return clip
  }

  const createMash = (clips: ClipObject[] = []) => {
    const mashObject: MashObject = { tracks: [{ clips }] }
    const preloader = new JestPreloader()
    preloader.server = true
    return mashInstance({ ...mashObject, preloader })
  }

  const mashWithMultipleImageClips = () => {
    const clip1 = { definitionId: clipDefault.id, contentId: 'image-square', frames: 30 }
    const clip2 = { definitionId: clipDefault.id, contentId: 'image-landscape', frames: 40 }
    return createMash([clip1, clip2])
  }

  describe("instance", () => {
    test("returns MashClass instance", () => {
      const mash = mashInstance()
      expect(mash).toBeInstanceOf(MashClass)
    })

    test("returns proper mash with minimal object", () => {
      const clipObjects = [
        { definitionId: clipDefault.id, contentId: 'image-square' },
        { definitionId: clipDefault.id, contentId: 'image-landscape' },
      ]
      const mash = createMash(clipObjects)

      expect(mash.tracks.length).toBe(1)
      const videoTrack = mash.tracks[0]
      expect(videoTrack.dense).toBe(true)
      const { clips } = videoTrack
      expect(clips.length).toBe(2)
      const [globeClip, cableClip] = clips
      expect(globeClip.frames).toBe(30)
      expect(cableClip.frame).toBe(30)

    })
  })

  describe("addTrack", () => {
    test.each([true, false])("returns new track with dense = %s", (tf) => {
      const mash = mashInstance()
      const addedTrack = mash.addTrack({ dense: tf })
      expect(addedTrack.dense).toBe(tf)
      expect(addedTrack).toBeInstanceOf(TrackClass)
      expect(mash.tracks.length).toEqual(2)
      const track = mash.tracks[mash.tracks.length - 1]
      expect(track).toBeInstanceOf(TrackClass)
      expect(addedTrack).toStrictEqual(track)
    })
  })

  describe("addClipToTrack", () => {
    test("correctly moves to new track and removes from old", () => {
      const mash = mashInstance()
      const firstTrack = mash.addTrack()
      expect(firstTrack.index).toEqual(1)
      const secondTrack = mash.addTrack()
      expect(secondTrack.index).toEqual(2)
      const clip = addNewClip(mash, 1)
      expect(firstTrack.clips.includes(clip)).toBeTruthy()
      expect(secondTrack.clips.includes(clip)).toBeFalsy()
      const clipTrack = clip.track

      expect(clipTrack).toEqual(firstTrack)

      mash.addClipToTrack(clip, 2)
      expect(clip.track).toStrictEqual(secondTrack)
      expect(secondTrack.clips.includes(clip)).toBeTruthy()
      expect(firstTrack.clips.includes(clip)).toBeFalsy()
    })

    test("correctly places clip in track clips", () => {
      const mash = mashInstance()
      const clip = addNewClip(mash)

      expect(mash.tracks.length).toEqual(1)
      const track = mash.tracks[0]

      expect(track.clips.length).toEqual(1)
      expect(track.clips[0]).toStrictEqual(clip)
      expect(mash.frames).toEqual(clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = mashInstance()
      expect(mash.quantize).toEqual(10)
      const track = mash.tracks[0]
      expect(track.dense).toBeTruthy()

      const clip1 = clipDefault.instanceFromObject()
      const clip2 = clipDefault.instanceFromObject()
      mash.addClipToTrack(clip1, 0)
      expect(mash.tracks.length).toBe(1)
      mash.addClipToTrack(clip2, 0, 1)

      expect(mash.tracks.length).toBe(1)

      expect(clip1.frame).not.toEqual(clip2.frame)

      expect(mash.frames).toEqual(60)

      expect(track.clips.length).toEqual(2)
      expect(track.clips[0]).toStrictEqual(clip1)
      expect(track.clips[1]).toStrictEqual(clip2)
    })

  })

  describe("clips", () => {
    test("returns proper clips", () => {
      const clips = [
        { label: 'A', definitionId: clipDefault.id, containerId: containerTextId, frame: 0, frames: 100, string: "A" },
        { label: 'B', definitionId: clipDefault.id, frame: 100, frames: 50, color: "blue"},
        { label: 'C', definitionId: clipDefault.id, containerId: containerTextId, frame: 150, frames: 100, string: "C" },
      ]
      const mash = mashInstance({ tracks: [{ clips }, { clips }, { clips }] })
      expect(mash.clips.length).toEqual(clips.length * 3)
    })
  })

  describe("clipsInTimeOfType", () => {
    test("returns expected", () => {
      const mash = mashWithMultipleImageClips()
      const scaled = timeRangeFromArgs(0, 10, 30)
      const clips = mash.clipsInTimeOfType(scaled)
      expect(clips.length).toBe(1)
    })
  })

  describe("graphFiles", () => {
    test("returns image file from first frame only", () => {
      const mash = mashWithMultipleImageClips()
      expectArrayLength(mash.editedGraphFiles(), 1)

    })

    test("returns font and text file from text container", () => {
      const mash = createMash()
      addNewTextClip(mash)

      const files = mash.editedGraphFiles()
      expectArrayLength(files, 2)
      const [fontGraphFile, textGraphFile] = files
      expect(textGraphFile.type).toEqual(GraphFileType.Txt)
      expect(fontGraphFile.type).toEqual(LoadType.Font)
      expect(textGraphFile.input).toBeFalsy()
      expect(fontGraphFile.input).toBeFalsy()

      const editingGraphFiles = mash.editedGraphFiles({ editing: true })
      expectArrayLength(editingGraphFiles, 1)
      const [editingFontGraphFile] = editingGraphFiles
      expect(editingFontGraphFile.type).toEqual(LoadType.Font)
      expect(editingFontGraphFile.input).toBeFalsy()
    })
  })

  describe("filterGraphs", () => {
    test("filterGraphsVisible returns two for two clips", () => {
      const clip1 = { definitionId: clipDefault.id, frames: 60}
      const clip2 = { definitionId: clipDefault.id, frames: 40 }
      const mash = mashInstance({ tracks: [{ clips: [clip1, clip2] }] })
      assertMashClass(mash)
      const { quantize, time, endTime, frames } = mash
      // console.log("quantize, time, endTime, frames", quantize, time, endTime, frames)
      expect(time).toEqual(timeFromArgs(0, quantize))
      expect(endTime).toEqual(timeFromArgs(100, quantize))

      const args: FilterGraphsOptions = {
        avType: AVType.Both,
        size: { width: 640, height: 480 },
        videoRate: 10,
        time: mash.timeRange
      }
      const filterGraphs = mash.filterGraphs(args)
      expect(filterGraphs.filterGraphsVisible.length).toBe(2)
    })

    test("returns expected FilterGraphs for image", async () => {
      const clip = { definitionId: clipDefault.id, contentId: 'image-landscape' }
 
      const mash = createMash([clip]) 
      const filterGraphs = mash.filterGraphs(filterGraphsOptions)
        const { filterGraphsVisible } = filterGraphs
      expect(filterGraphsVisible.length).toEqual(1)
      const filterGraph = filterGraphsVisible[0]
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal
      await filterGraphs.loadPromise

      // await mash.loadPromise(filterGraph)

      const { commandFilters, commandFiles } = filterGraph
      // console.log("commandFilters", commandFilters)
      expect(commandFilters.length).toEqual(7)

      // console.log("commandFiles", commandFiles)
      expect(commandFiles.length).toBe(1)
      const [commandFile] = commandFiles
      const { type, file, input, options } = commandFile
      expect(type).toEqual(LoadType.Image)
      expect(file).toEqual('../shared/image/cable.jpg')
      expect(input).toEqual(true)
     
      expect(options).toBeInstanceOf(Object)
      const { loop, framerate } = options!
      expect(loop).toBe(1)
      expect(framerate).toBe(30)
    })

    test("returns multiple FilterGraphs for images", async () => {
      const mash = mashWithMultipleImageClips()
      const { quantize } = mash
      const videoTrack = mash.tracks[0]
      const clips = videoTrack.clips as Clip[]
      const options: FilterGraphsOptions = {
        ...filterGraphsOptions, graphType: GraphType.Mash,
        time: timeRangeFromTimes(filterGraphsOptions.time!, mash.endTime),
      }
      const filterGraphs = mash.filterGraphs(options)
      const { filterGraphsVisible } = filterGraphs
      // console.log(filterGraphsVisible.map(g => g.time))
      expect(filterGraphsVisible.length).toEqual(2)
      filterGraphsVisible.forEach(async (filterGraph, index) => {

        await mash.loadPromise(filterGraph)
        expect(filterGraph).toBeInstanceOf(FilterGraphClass)
        if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

        const clip = clips[index]
        const timeRange = clip.timeRange(quantize)
        const { commandFiles: graphFiles, duration } = filterGraph
        // console.log(clip.frame, clip.frames, time, timeRange, duration, timeRange.lengthSeconds)
        expect(duration).toBe(timeRange.lengthSeconds)
        expect(graphFiles.length).toBe(1)
        const [graphFile] = graphFiles
        const { type, file, input, options } = graphFile
        expect(type).toEqual(LoadType.Image)
        expect(input).toEqual(true)
        
        const { definition } = clip.content
        assertPreloadableDefinition(definition)
        expect(file).toBe(definition.source)

        expect(options).toBeInstanceOf(Object)
        const { loop, framerate } = options!
        expect(loop).toBe(1)
        expect(framerate).toBe(30)

      })
    })
    
    test("returns expected FilterGraphs for text", async () => {
      const mash = createMash()
      addNewTextClip(mash)
      const filterGraphs = mash.filterGraphs(filterGraphsOptions)
      const {filterGraphsVisible} = filterGraphs
      expect(filterGraphsVisible.length).toEqual(1)
      const [filterGraph] = filterGraphsVisible
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      await mash.loadPromise(filterGraph)
      const { commandFilters } = filterGraph
      // console.log("commandFilters", commandFilters)
      expect(commandFilters.length).toEqual(5)
    })

    test.skip("returns expected GraphFiles for video sequence", () => {
      const expectFilterGraphAudible = (filterGraphAudible: FilterGraph) => {
        const { commandFilters } = filterGraphAudible
        // console.log("expectFilterGraphAudible commandFilters", commandFilters)
        expect(commandFilters.length).toBe(1)

      }
      const expectClipGraphFiles = (jpgs: number[] = [], clip: ValueObject = {}, args: UnknownObject = {}) => {
  
        const clipObjects = [{ definitionId: clipDefault.id, containerId: 'video-sequence', frames: 30, ...clip }] 
        const mash = createMash(clipObjects)
        const graphArgs = { ...filterGraphsOptions, ...args }
        const filterGraphs = mash.filterGraphs(graphArgs)
        const { filterGraphsVisible, filterGraphAudible } = filterGraphs

        if (filterGraphAudible) expectFilterGraphAudible(filterGraphAudible)
        expect(filterGraphsVisible.length).toBe(1)
        const [filterGraph] = filterGraphsVisible
        expect(filterGraph).toBeInstanceOf(FilterGraphClass)
        if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

        // await mash.loadPromise(filterGraph)
        const { visible, quantize, time } = filterGraph
        const graphFileArgs: GraphFileOptions = { 
          editing: false, visible, quantize, time 
        }
        const files = mash.editedGraphFiles(graphFileArgs)
        const { commandFilters, duration } = filterGraph
        if (time.isRange) expect(duration).toBeGreaterThan(0)
        else expect(duration).toBe(0)

        // console.log('commandFilters', commandFilters)
        expect(commandFilters.length).toEqual(10)
        expect(files).toBeInstanceOf(Array)
        const imageFiles = files.filter(graphFile => graphFile.type === LoadType.Image)
        const audioFiles = files.filter(graphFile => graphFile.type === LoadType.Audio)
        if (time.isRange) {
          expect(audioFiles.length).toBe(1)
          const [audioFile] = audioFiles
          expect(audioFile).toBeDefined()
          const { file } = audioFile
          expect(file).toEqual('video/audio.mp3')
          // console.log('audioFile', audioFile)
        } else expect(audioFiles.length).toBe(0)
        if (imageFiles.length !== jpgs.length) console.log(imageFiles.map(f => f.file))
        expect(imageFiles.length).toBe(jpgs.length)
        imageFiles.forEach((graphFile, index) => {
          expect(graphFile).toBeInstanceOf(Object)
          const jpg = String(jpgs[index]).padStart(2, '0')
          const { file, input } = graphFile
          if (!input) console.log("graphFile", graphFile)
          expect(input).toBe(true)
          expect(file).toEqual(`video/frames/${jpg}.jpg`)
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
      const clipObjects = [{ definitionId: clipDefault.id, contentId: 'video-rgb', frames: 30 }] 
      const mash = createMash(clipObjects)
      const graphArgs = {...filterGraphsOptions, graphType: GraphType.Mash }
      expect(graphArgs.graphType).toEqual(GraphType.Mash)
      const filterGraphs = mash.filterGraphs(graphArgs)
      const { filterGraphsVisible } = filterGraphs
      const [filterGraph] = filterGraphsVisible
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      const { commandFilters, commandFiles: graphFiles, duration } = filterGraph
      expect(duration).toBe(0)
      // console.log("commandFilters", commandFilters)
      expect(commandFilters.length).toEqual(9)
      expect(graphFiles).toBeInstanceOf(Array)
      expect(graphFiles.length).toBe(1)
      const [graphFile] = graphFiles
      expect(graphFile).toBeInstanceOf(Object)
      const { file, input } = graphFile
      expect(input).toBe(true)
      expect(file).toEqual('video.mp4')
    })
  })

  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      const mash = mashInstance()
      expect(mash.frames).toEqual(0)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = idGenerateString()
      const mash = mashInstance({ id })
      expect(mash.id).toEqual(id)
    })
  })

  describe("removeTrack", () => {
    test("correctly removes track", () => {
      const mash = mashInstance()

      mash.removeTrack()
      expect(mash.tracks.length).toEqual(0)
    })
  })

  describe("toJSON", () => {
    test("returns expected object", () => {
      const id = idGenerateString()
      const mash = mashInstance({ id })
      mash.addTrack()
      const clip = addNewClip(mash, 1)

      const mashString = JSON.stringify(mash)
      const mashObject: MashObject = JSON.parse(mashString)
      expect(mashObject.id).toEqual(id)
      const tracks = mashObject.tracks!

      expectArrayLength(tracks, 2, Object)

      const [videoTrack1, videoTrack2] = tracks
      expectEmptyArray(videoTrack1.clips)
      expectArrayLength(videoTrack2.clips, 1)
      const clips = videoTrack2.clips!

      clips.forEach(object => expect(isClipObject(object)).toBeTruthy())
      const [clipObject] = clips
      expect(isClipObject(clipObject)).toBeTruthy()

      expect(clipObject.color).toEqual(clip.value('color'))
    })
  })

  describe("tracks", () => {
    test("returns a single dense track", () => {
      const mash = mashInstance()
      const { tracks } = mash
      expect(tracks.length).toBe(1)
      const [track] = tracks
      expect(track).toBeInstanceOf(TrackClass)
      const { dense } = track
      expect(dense).toBe(true)
    })
  })
  const output = outputDefaultVideo()
  const time = timeFromArgs(0, 10)
  const size = { width: output.width!, height: output.height! }
  const videoRate = output.videoRate!
  const filterGraphsOptions: FilterGraphsOptions = {
    avType: AVType.Video, size, videoRate, time
  }
})
