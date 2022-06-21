
import { expectEmptyArray } from "../../../../../dev/test/Utilities/expectEmptyArray"
import { expectArrayLength } from "../../../../../dev/test/Utilities/expectArrayLength"

import { AVType, DefinitionType, GraphFileType, GraphType, LoadType, TrackType, TrackTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { ClipObject, isClipObject } from "../../Mixin/Clip/Clip"
import { idGenerate } from "../../Utility/Id"
import { Mash, MashObject } from "./Mash"
import { MashClass } from "./MashClass"

import { assertMashClass, mashInstance } from "./MashFactory"
import { UnknownObject, ValueObject } from '../../declarations'
import { outputDefaultVideo } from '../../Output/OutputDefault'
import { ImageDefinitionObject } from '../../Media/Image/Image'
import { JestPreloader } from '../../../../../dev/test/Utilities/JestPreloader'

import { FilterGraphsOptions } from './FilterGraphs/FilterGraphs'

import { FilterGraphClass } from './FilterGraph/FilterGraphClass'
import { timeFromArgs, timeRangeFromArgs, timeRangeFromTimes } from '../../Helpers/Time/TimeUtilities'
import { Defined } from "../../Base/Defined"
import { visibleClipDefault } from "../../Media/VisibleClip/VisibleClipFactory"
import { VisibleClip, VisibleClipObject } from "../../Media/VisibleClip/VisibleClip"
import { assertPreloadableDefinition } from "../../Mixin/Preloadable/Preloadable"
import { TrackClass } from "./Track/TrackClass"
import { isTrackObject } from "./Track/Track"
import { GraphFileArgs } from "../../MoveMe"


describe("Mash", () => {
  const globeDefinitionObject = {
    id: 'globe', type: DefinitionType.Image, source: '../shared/image/globe.jpg'
  }
  const cableDefinitionObject = {
    id: 'cable', type: DefinitionType.Image, source: '../shared/image/cable.jpg'
  }
  Defined.define(globeDefinitionObject, cableDefinitionObject)

  const addNewClip = (mash: Mash, track = 0): VisibleClip => {
    const clip = visibleClipDefault.instanceFromObject()
    expect(clip).toBeTruthy()
    mash.addClipToTrack(clip, track)
    return clip
  }

  const addNewTextClip = (mash: Mash, track = 0): VisibleClip => {
    const definitionId = 'com.moviemasher.textcontainer.default'
    const clipObject: ClipObject = {
      definitionId: visibleClipDefault.id, containerId: definitionId
    }
    const clip = visibleClipDefault.instanceFromObject(clipObject)
    expect(clip).toBeTruthy()
    mash.addClipToTrack(clip, track)
    return clip
  }

  const createMash = (clips: VisibleClipObject[] = []) => {
    const mashObject: MashObject = { tracks: [{ clips }] }
    return mashInstance({ ...mashObject, preloader: new JestPreloader() })
  }

  const mashWithMultipleImageClips = () => {
    const clip1: ClipObject = { definitionId: visibleClipDefault.id, contentId: globeDefinitionObject.id, frames: 30 }
    const clip2: ClipObject = { definitionId: visibleClipDefault.id, contentId: cableDefinitionObject.id, frames: 40 }
    return createMash([clip1, clip2])
  }

  describe("instance", () => {
    test("returns MashClass instance", () => {
      const mash = mashInstance()
      expect(mash).toBeInstanceOf(MashClass)
    })
    test("returns proper mash with minimal object", () => {
      const globeDefinitionObject = {
        id: 'globe', type: DefinitionType.Image, source: '../shared/image/globe.jpg'
      }
      const cableDefinitionObject = {
        id: 'cable', type: DefinitionType.Image, source: '../shared/image/cable.jpg'
      }
      Defined.define(globeDefinitionObject, cableDefinitionObject)
      const mashObject: MashObject = {
        tracks: [
          {
            clips: [
              { definitionId: visibleClipDefault.id, contentId: globeDefinitionObject.id },
              { definitionId: visibleClipDefault.id, contentId: cableDefinitionObject.id },
            ]
          }]
      }
      const mash = mashInstance({ ...mashObject, preloader: new JestPreloader()})

      expect(mash.tracks.length).toBe(2)
      const videoTrack = mash.trackOfTypeAtIndex(TrackType.Video)
      expect(videoTrack.dense).toBe(true)
      const { clips } = videoTrack
      expect(clips.length).toBe(2)
      const [globeClip, cableClip] = clips
      expect(globeClip.frames).toBe(30)
      expect(cableClip.frame).toBe(30)

    })
  })
  describe("addTrack", () => {
    test.each(TrackTypes)("returns new %s track", (trackType) => {
      const mash = mashInstance()
      const addedTrack = mash.addTrack(trackType)
      expect(addedTrack.dense).toBe(false)
      expect(addedTrack).toBeInstanceOf(TrackClass)
      expect(addedTrack.trackType).toEqual(trackType)
      expect(mash.trackCount(trackType)).toEqual(2)
      expect(mash.tracks.length).toBeGreaterThan(2)
      const track = mash.trackOfTypeAtIndex(trackType, mash.trackCount(trackType) - 1)
      expect(track).toBeInstanceOf(TrackClass)
      expect(track.trackType).toEqual(trackType)
      expect(addedTrack).toStrictEqual(track)
    })
  })

  describe("addClipToTrack", () => {
    test("correctly moves to new track and removes from old", () => {
      const mash = mashInstance()
      const firstTrack = mash.addTrack(TrackType.Video)
      expect(firstTrack.layer).toEqual(1)
      const secondTrack = mash.addTrack(TrackType.Video)
      expect(secondTrack.layer).toEqual(2)
      const clip = addNewClip(mash, 1)
      expect(firstTrack.clips.includes(clip)).toBeTruthy()
      expect(secondTrack.clips.includes(clip)).toBeFalsy()
      const clipTrack = mash.clipTrack(clip)

      expect(clipTrack).toEqual(firstTrack)

      mash.addClipToTrack(clip, 2)
      expect(mash.clipTrack(clip)).toStrictEqual(secondTrack)
      expect(secondTrack.clips.includes(clip)).toBeTruthy()
      expect(firstTrack.clips.includes(clip)).toBeFalsy()
    })

    test("correctly places clip in track clips", () => {
      const mash = mashInstance()
      const clip = addNewClip(mash)

      expect(mash.trackCount(TrackType.Video)).toEqual(1)
      const track = mash.trackOfTypeAtIndex(TrackType.Video, 0)

      expect(track.clips.length).toEqual(1)
      expect(track.clips[0]).toStrictEqual(clip)
      expect(mash.frames).toEqual(clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = mashInstance()
      expect(mash.quantize).toEqual(10)
      const clip1 = visibleClipDefault.instanceFromObject()
      const clip2 = visibleClipDefault.instanceFromObject()
      mash.addClipToTrack(clip1, 0)
      mash.addClipToTrack(clip2, 0, 1)
      const track = mash.trackOfTypeAtIndex(TrackType.Video, 0)

      expect(track.dense).toBeTruthy()

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
        { label: 'A', definitionId: visibleClipDefault.id, containerId: "com.moviemasher.textcontainer.default", frame: 0, frames: 100, string: "A" },
        { label: 'B', definitionId: visibleClipDefault.id, frame: 100, frames: 50, color: "blue"},
        { label: 'C', definitionId: visibleClipDefault.id, containerId: "com.moviemasher.textcontainer.default", frame: 150, frames: 100, string: "C" },
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
      const graphFiles = mash.graphFiles()
      expectArrayLength(graphFiles, 1)

    })

    test("returns font and text file from text container", () => {
      const mash = createMash()
      addNewTextClip(mash)

      const graphFiles = mash.graphFiles()
      expectArrayLength(graphFiles, 2)
      const [fontGraphFile, textGraphFile] = graphFiles
      expect(textGraphFile.type).toEqual(GraphFileType.Txt)
      expect(fontGraphFile.type).toEqual(LoadType.Font)
      expect(textGraphFile.input).toBeFalsy()
      expect(fontGraphFile.input).toBeFalsy()

      const editingGraphFiles = mash.graphFiles({ editing: true })
      expectArrayLength(editingGraphFiles, 1)
      const [editingFontGraphFile] = editingGraphFiles
      expect(editingFontGraphFile.type).toEqual(LoadType.Font)
      expect(editingFontGraphFile.input).toBeFalsy()
    })
  })
  describe("filterGraphs", () => {
    test("filterGraphsVisible returns two for two clips", () => {
      const clip1 = { definitionId: visibleClipDefault.id, frames: 60}
      const clip2 = { definitionId: visibleClipDefault.id, frames: 40 }
      const mash = mashInstance({ tracks: [{ trackType: TrackType.Video, clips: [clip1, clip2] }] })
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
      const source = '../shared/image/frog.jpg'
      const definitionId = 'image'
      const definitionObject: ImageDefinitionObject = {
        source, id: definitionId, type: DefinitionType.Image, url: source
      }
      const clip: ClipObject = { definitionId: visibleClipDefault.id, contentId: definitionId }
      const mashObject: MashObject = {
        tracks: [{ trackType: TrackType.Video, clips: [clip] }]
      }
      Defined.define(definitionObject)
      const mash = mashInstance({ ...mashObject, preloader: new JestPreloader()})
      const filterGraphs = mash.filterGraphs(filterGraphsOptions)
        const { filterGraphsVisible } = filterGraphs
      expect(filterGraphsVisible.length).toEqual(1)
      const filterGraph = filterGraphsVisible[0]
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal


      await mash.loadPromise(filterGraph)

      const { filterChains, graphFiles } = filterGraph
      expect(filterChains.length).toEqual(1)
      expect(graphFiles.length).toBe(1)
      const [graphFile] = graphFiles
      const { type, file, input, options } = graphFile
      expect(type).toEqual(LoadType.Image)
      expect(file).toEqual(source)
      expect(input).toEqual(true)
      expect(options).toBeUndefined()
    })

    test("returns multiple FilterGraphs for images", async () => {
      const mash = mashWithMultipleImageClips()
      const { quantize } = mash
      const videoTrack = mash.trackOfTypeAtIndex(TrackType.Video)
      const clips = videoTrack.clips as VisibleClip[]
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
        const { graphFiles, duration } = filterGraph
        // console.log(clip.frame, clip.frames, time, timeRange, duration, timeRange.lengthSeconds)
        expect(duration).toBe(timeRange.lengthSeconds)
        expect(graphFiles.length).toBe(1)
        const [graphFile] = graphFiles
        const { type, file, input, options } = graphFile
        expect(type).toEqual(LoadType.Image)
        expect(input).toEqual(true)
        expect(options).toBeUndefined()
        const { definition } = clip.content
        assertPreloadableDefinition(definition)
        expect(file).toBe(definition.source)
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
      const { filterChains } = filterGraph
      expect(filterChains.length).toEqual(1)
    })

    const expectClipGraphFiles = async (jpgs: number[] = [], clip: ValueObject = {}, args: UnknownObject = {}) => {
      const videoDefinition = {
        type: "videosequence",
        label: "Video Sequnce", id: "id-videosequence",
        url: 'video/frames/',
        source: 'video/source.mp4',
        audio: 'video/audio.mp3',
        duration: 3, fps: 30,
      }

      Defined.define(videoDefinition)
      const mashObject = {
        tracks: [{ clips: [{ definitionId: visibleClipDefault.id, containerId: videoDefinition.id, frames: 30, ...clip }] }]
      }
      const mash = mashInstance({ ...mashObject, preloader: new JestPreloader() })
      const graphArgs = { ...filterGraphsOptions, ...args }
      const filterGraphs = mash.filterGraphs(graphArgs)
      const { filterGraphsVisible } = filterGraphs
      expect(filterGraphsVisible.length).toBe(1)
      const [filterGraph] = filterGraphsVisible
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      await mash.loadPromise(filterGraph)
      const {  editing, visible, quantize, time } = filterGraph
      const graphFileArgs: GraphFileArgs = { editing, visible, quantize, time }
    
      const graphFiles = mash.graphFiles(graphFileArgs)
      const { filterChains, duration } = filterGraph
      if (time.isRange) expect(duration).toBeGreaterThan(0)
      else expect(duration).toBe(0)
      expect(filterChains.length).toEqual(1)
      const [clipFilterChain] = filterChains
      const { graphFilters } = clipFilterChain
      expect(graphFilters.length).toBe(0)
      // expectMergerGraphFilter(graphFilter)
      expect(graphFiles).toBeInstanceOf(Array)
      const imageFiles = graphFiles.filter(graphFile => graphFile.type === LoadType.Image)
      const audioFiles = graphFiles.filter(graphFile => graphFile.type === LoadType.Audio)
      if (time.isRange) {
        expect(audioFiles.length).toBe(1)
        const [audioFile] = audioFiles
        expect(audioFile).toBeDefined()
        const { file } = audioFile
        expect(file).toEqual(videoDefinition.audio)
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
        expect(file).toEqual(`${videoDefinition.url}${jpg}.jpg`)
      })
    }
    test.skip("returns expected GraphFiles for video sequence", () => {
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

    test.skip("returns expected FilterGraphs for video", async () => {
      const videoDefinition = {
        type: "video",
        label: "Video", id: "id-video",
        url: 'video.mp4',
        source: 'video.mp4',
        duration: 3, fps: 10,
      }

      Defined.define(videoDefinition)

      const mash = mashInstance({
       preloader: new JestPreloader,
        tracks: [{ clips: [{ definitionId: visibleClipDefault.id, contentId: videoDefinition.id, frames: 30 }] }]
      })
      const graphArgs = {...filterGraphsOptions, graphType: GraphType.Mash }
      expect(graphArgs.graphType).toEqual(GraphType.Mash)
      const filterGraphs = mash.filterGraphs(graphArgs)
      const { filterGraphsVisible } = filterGraphs
      const [filterGraph] = filterGraphsVisible
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      await mash.loadPromise(filterGraph)
      const { filterChains, graphFiles, duration } = filterGraph
      expect(duration).toBe(0)
      expect(filterChains.length).toEqual(1)

      expect(graphFiles).toBeInstanceOf(Array)
      expect(graphFiles.length).toBe(1)
      const [graphFile] = graphFiles
      expect(graphFile).toBeInstanceOf(Object)
      const { file, input } = graphFile
      expect(input).toBe(true)
      expect(file).toEqual(videoDefinition.source)
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
      const id = idGenerate()
      const mash = mashInstance({ id })
      expect(mash.id).toEqual(id)
    })

  })

  describe("removeTrack", () => {
    test.each(TrackTypes)("correctly removes just %s track", (type) => {
      const mash = mashInstance()

      mash.removeTrack(type)
      expect(mash.trackCount(type)).toEqual(0)
      expect(mash.tracks.length).toBe(1)
    })
  })

  describe("toJSON", () => {
    test("returns expected object", () => {
      const id = idGenerate()
      const mash = mashInstance({ id })
      mash.addTrack(TrackType.Video)
      const clip = addNewClip(mash, 1)

      const mashString = JSON.stringify(mash)
      const mashObject: MashObject = JSON.parse(mashString)
      expect(mashObject.id).toEqual(id)
      const tracks = mashObject.tracks!

      tracks.forEach(object => expect(isTrackObject(object)).toBeTruthy())
      const audio = tracks.filter(track => track.trackType === TrackType.Audio)
      const video = tracks.filter(track => track.trackType === TrackType.Video)

      const [audioTrack] = audio
      expectEmptyArray(audioTrack.clips)

      const [videoTrack1, videoTrack2] = video
      expectEmptyArray(videoTrack1.clips)
      expectArrayLength(videoTrack2.clips, 1)
      const clips = videoTrack2.clips!

      clips.forEach(object => expect(isClipObject(object)).toBeTruthy())
      const [clipObject] = clips
      expect(isClipObject(clipObject)).toBeTruthy()

      expect(clipObject.color).toEqual(clip.value('color'))
    })
  })

  describe("trackOfTypeAtIndex", () => {
    test("returns expected track", () => {
      const mash = mashInstance()
      TrackTypes.forEach((type) => {
        const track = mash.trackOfTypeAtIndex(type, 0)
        expect(track.trackType).toEqual(type)
      })
    })
  })

  describe("tracks", () => {
    test("returns two tracks", () => {
      const mash = mashInstance()
      const { tracks } = mash
      expect(tracks.length).toBe(2)
      tracks.forEach(track => expect(track).toBeInstanceOf(TrackClass))
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
