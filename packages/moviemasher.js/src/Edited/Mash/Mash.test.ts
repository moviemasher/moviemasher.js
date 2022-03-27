import fs from 'fs'
import path from 'path'

import { expectEmptyArray } from "../../../../../dev/test/Utilities/expectEmptyArray"
import { expectArrayOf } from "../../../../../dev/test/Utilities/expectArrayOf"

import { AVType, DefinitionType, GraphFileType, GraphType, LoadType, TrackType, TrackTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Definition, DefinitionObjects } from "../../Base/Definition"
import { Factory } from "../../Definitions/Factory/Factory"
import { Clip, ClipObject } from "../../Mixin/Clip/Clip"
import { idGenerate } from "../../Utility/Id"
import { Mash, MashObject } from "./Mash"
import { MashClass } from "./MashClass"

import { MashFactory } from "./MashFactory"
import { TrackClass } from "../../Media/Track/TrackClass"
import { TrackObject } from "../../Media/Track/Track"
import { GraphFilter, UnknownObject, ValueObject } from '../../declarations'
import { outputDefaultVideo } from '../../Output/OutputDefault'
import { ImageDefinitionObject } from '../../Media/Image/Image'
import { MergerObject } from '../../Media/Merger/Merger'
import { ThemeDefinitionObject } from '../../Media/Theme/Theme'
import { JestPreloader } from '../../../../../dev/test/Utilities/JestPreloader'

import themeTextJson from "../../Definitions/DefinitionObjects/theme/text.json"
import themeColorJson from "../../Definitions/DefinitionObjects/theme/color.json"
import { FilterGraphOptions } from './FilterGraph/FilterGraph'
import { FilterChain } from './FilterChain/FilterChain'

import { Image } from "../../Media/Image/Image"
import { FilterGraphsClass } from './FilterGraphs'
import { FilterGraphArgs, FilterGraphClass } from './FilterGraph/FilterGraphClass'
import { timeFromArgs, timeRangeFromArgs, timeRangeFromTimes } from '../../Helpers/Time/TimeUtilities'

describe("MashFactory", () => {
  describe("instance", () => {
    test("returns MashClass instance", () => {
      const mash = MashFactory.instance()
      expect(mash).toBeInstanceOf(MashClass)
    })
    test("returns proper mash with minimal object", () => {
      const globeDefinitionObject = {
        id: 'globe', type: DefinitionType.Image, source: '../shared/image/globe.jpg'
      }
      const cableDefinitionObject = {
        id: 'cable', type: DefinitionType.Image, source: '../shared/image/cable.jpg'
      }
      const definitionObjects = [globeDefinitionObject, cableDefinitionObject]
      const mashObject: MashObject = {
        tracks: [
          {
            clips: [
              { definitionId: globeDefinitionObject.id },
              { definitionId: cableDefinitionObject.id },

            ]
          }]
      }
      const mash = MashFactory.instance(mashObject, definitionObjects, new JestPreloader())

      expect(mash.tracks.length).toBe(2)
      const videoTrack = mash.trackOfTypeAtIndex(TrackType.Video)
      expect(videoTrack.dense).toBe(true)
      const { clips } = videoTrack
      expect(clips.length).toBe(2)
      const [globeClip, cableClip] = clips
      expect(globeClip.frames).toBe(20)
      expect(cableClip.frame).toBe(20)

    })
    test("timeRanges", () => {
      const clip1 = { definitionId: 'com.moviemasher.theme.color', frames: 30}
      const clip2 = { definitionId: 'com.moviemasher.theme.color', frames: 40 }
      const mash = MashFactory.instance({ tracks: [{ clips: [clip1, clip2] }] })
      expect(mash).toBeInstanceOf(MashClass)
      if (!(mash instanceof MashClass)) throw Errors.invalid
      const { time, endTime } = mash
      const { quantize } = mash
      expect(time).toEqual(timeFromArgs(0, quantize))
      expect(endTime).toEqual(timeFromArgs(70, quantize))

      const args: FilterGraphOptions = {
        avType: AVType.Both,
        size: { width: 640, height: 480 },
        videoRate: 10,
        time: mash.timeRange
      }

      const times = mash.timeRanges(args)
      expect(times.length).toBe(2)
      const [time1, time2] = times

      // console.log(times)

    })
  })
})
describe("Mash", () => {
  const colorDefinition = () => Factory.theme.definition(themeColorJson)
  const textDefinition = () => Factory.theme.definition(themeTextJson)

  describe("addTrack", () => {
    test.each(TrackTypes)("returns new %s track", (trackType) => {
      const mash = MashFactory.instance()
      const addedTrack = mash.addTrack(trackType)
      expect(addedTrack.dense).toBe(false)
      expect(addedTrack).toBeInstanceOf(TrackClass)
      expect(addedTrack.trackType).toEqual(trackType)
      expect(mash.trackCount(trackType)).toEqual(trackType === TrackType.Transition ? 1 : 2)
      expect(mash.tracks.length).toBeGreaterThan(2)
      const track = mash.trackOfTypeAtIndex(trackType, mash.trackCount(trackType) - 1)
      expect(track).toBeInstanceOf(TrackClass)
      expect(track.trackType).toEqual(trackType)
      expect(addedTrack).toStrictEqual(track)
    })
  })

  describe("addClipToTrack", () => {
    const addNewClip = (mash : Mash, definition : Definition, track = 0) : Clip => {
      const clip = <Clip> definition.instance
      expect(clip).toBeTruthy()
      mash.addClipToTrack(clip, track)
      return clip
    }

    test("correctly moves to new track and removes from old", () => {
      const mash = MashFactory.instance()
      const firstTrack = mash.addTrack(TrackType.Video)
      expect(firstTrack.layer).toEqual(1)
      const secondTrack = mash.addTrack(TrackType.Video)
      expect(secondTrack.layer).toEqual(2)
      const clip = addNewClip(mash, colorDefinition(), 1)
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
      const mash = MashFactory.instance()
      const clip = addNewClip(mash, colorDefinition())

      expect(mash.trackCount(TrackType.Video)).toEqual(1)
      const track = mash.trackOfTypeAtIndex(TrackType.Video, 0)

      expect(track.clips.length).toEqual(1)
      expect(track.clips[0]).toStrictEqual(clip)
      expect(mash.frames).toEqual(clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = MashFactory.instance()
      expect(mash.quantize).toEqual(10)
      const clip1 = colorDefinition().instance
      const clip2 = colorDefinition().instance
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

    test("updates definition", () => {
      const mash = MashFactory.instance()
      const clip = colorDefinition().instance
      mash.addClipToTrack(clip, 0)
      // console.log("mash.definition", mash.definition)
      expect(mash.definitions.includes(colorDefinition())).toBeTruthy()
    })
  })

  describe("clips", () => {
    test("returns proper clips", () => {
      const clips = [
        { label: 'A', definitionId: "com.moviemasher.theme.text", frame: 0, frames: 100, string: "A" },
        { label: 'B', definitionId: "com.moviemasher.theme.color", frame: 100, frames: 50, color: "blue"},
        { label: 'C', definitionId: "com.moviemasher.theme.text", frame: 150, frames: 100, string: "C" },
      ]
      const mash = MashFactory.instance({ tracks: [{ clips }, { clips }, { clips }] })
      expect(mash.clips.length).toEqual(clips.length * 3)
    })
  })
  const mashWithMultipleClips = () => {
    const globeDefinitionObject = {
      id: 'globe', type: DefinitionType.Image, source: '../shared/image/globe.jpg'
    }
    const cableDefinitionObject = {
      id: 'cable', type: DefinitionType.Image, source: '../shared/image/cable.jpg'
    }
    const clip1: ClipObject = { definitionId: globeDefinitionObject.id, frames: 30 }
    const clip2: ClipObject = { definitionId: cableDefinitionObject.id, frames: 40 }
    const mashObject: MashObject = { tracks: [{ clips: [clip1, clip2] }] }
    const definitionObjects: DefinitionObjects = [globeDefinitionObject, cableDefinitionObject]
    const mash = MashFactory.instance(mashObject, definitionObjects, new JestPreloader())
    return mash
  }

  describe("clipsInTimeOfType", () => {
    test("returns expected", () => {
      const mash = mashWithMultipleClips()
      const scaled = timeRangeFromArgs(0, 10, 30)
      const clips = mash.clipsInTimeOfType(scaled)
      expect(clips.length).toBe(1)
    })
  })

  describe("filterGraphs", () => {
    const expectBackgroundFilterChain = (filterChain?: FilterChain) => {
      expect(filterChain).toBeDefined()
      expect(filterChain).toBeInstanceOf(Object)
      const { graphFilters, graphFilter } = filterChain!
      expect(graphFilter).toBeUndefined()
      expect(graphFilters.length).toBe(1)
      const [colorFilter] = graphFilters
      expect(colorFilter).toBeInstanceOf(Object)
      const { inputs, outputs, filter, options } = colorFilter!
      expect(filter).toEqual('color')
      expect(options).toBeInstanceOf(Object)
      expect(inputs).toBeUndefined()
      expect(outputs).toBeInstanceOf(Array)
      expect(outputs!.length).toBe(1)
    }
    const expectMergerGraphFilter = (merger?: GraphFilter) => {
      expect(merger).toBeDefined()
      expect(merger).toBeInstanceOf(Object)
      const { inputs, outputs } = merger!
      // console.log(inputs)
      expect(inputs).toBeDefined()
      expect(inputs).toBeInstanceOf(Array)
      expect(inputs?.length).toBe(0)
      expect(outputs).toBeUndefined()
    }


    test("returns expected FilterGraphs for image", () => {
      const source = 'image.jpg'
      const definitionId = 'image'
      const definitionObject: ImageDefinitionObject = {
        source, id: definitionId, type: DefinitionType.Image, url: source
      }
      const merger: MergerObject = { definitionId: 'com.moviemasher.merger.center' }
      const clip: ClipObject = { definitionId, merger }
      const mashObject: MashObject = {
        tracks: [{ trackType: TrackType.Video, clips: [clip] }]
      }
      const mash = MashFactory.instance(mashObject, [definitionObject], new JestPreloader())
      const filterGraphs = mash.filterGraphs(filterGraphArgs)
        const { filterGraphsVisible } = filterGraphs
      expect(filterGraphsVisible.length).toEqual(1)
      const filterGraph = filterGraphsVisible[0]
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      const { filterChain, filterChains, graphFiles } = filterGraph
      expectBackgroundFilterChain(filterChain)
      expect(filterChains.length).toEqual(1)
      const [filterChain2] = filterChains
      expect(graphFiles.length).toBe(1)
      const [graphFile] = graphFiles
      const { type, file, input, options } = graphFile
      expect(type).toEqual(LoadType.Image)
      expect(file).toEqual(source)
      expect(input).toEqual(true)
      expect(options).toBeUndefined()
    })

    test("returns multiple FilterGraphs for images", () => {
      const mash = mashWithMultipleClips()
      const { quantize } = mash
      const videoTrack = mash.trackOfTypeAtIndex(TrackType.Video)
      const clips = videoTrack.clips as Image[]
      const filterGraphOptions: FilterGraphOptions = {
        ...filterGraphArgs, graphType: GraphType.Mash,
        time: timeRangeFromTimes(filterGraphArgs.time!, mash.endTime),
      }
      const filterGraphs = mash.filterGraphs(filterGraphOptions)
      const { filterGraphsVisible } = filterGraphs
      // console.log(filterGraphsVisible.map(g => g.time))
      expect(filterGraphsVisible.length).toEqual(2)
      filterGraphsVisible.forEach((filterGraph, index) => {
        expect(filterGraph).toBeInstanceOf(FilterGraphClass)
        if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

        const clip = clips[index]
        const timeRange = clip.timeRange(quantize)
        const { graphFiles, duration, time } = filterGraph
        // console.log(clip.frame, clip.frames, time, timeRange, duration, timeRange.lengthSeconds)
        expect(duration).toBe(timeRange.lengthSeconds)
        expect(graphFiles.length).toBe(1)
        const [graphFile] = graphFiles
        const { type, file, input, options } = graphFile
        expect(type).toEqual(LoadType.Image)
        expect(input).toEqual(true)
        expect(options).toBeUndefined()
        expect(file).toBe(clip.definition.source)
      })
    })


    test("returns expected FilterGraphs for text theme", () => {
      const definitionObject: ThemeDefinitionObject = themeTextJson
      const definitionId = definitionObject.id

      const merger: MergerObject = { definitionId: 'com.moviemasher.merger.center' }
      const clip: ClipObject = { definitionId, merger }
      const mashObject: MashObject = {
        tracks: [{ trackType: TrackType.Video, clips: [clip] }]
      }
      const mash = MashFactory.instance(mashObject, [definitionObject], new JestPreloader())
      const filterGraphs = mash.filterGraphs(filterGraphArgs)
      const {filterGraphsVisible} = filterGraphs
      expect(filterGraphsVisible.length).toEqual(1)
      const filterGraph = filterGraphsVisible[0]
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      const { filterChain, filterChains, graphFiles } = filterGraph
      expectBackgroundFilterChain(filterChain)
      expect(filterChains.length).toEqual(1)
      expect(graphFiles.length).toBe(2)
      const [graphFile2, graphFile1] = graphFiles
      expect(graphFile1.type).toEqual(GraphFileType.Txt)
      expect(graphFile2.type).toEqual(LoadType.Font)
      expect(graphFile1.input).toBeFalsy()
      expect(graphFile2.input).toBeFalsy()
    })

    const expectClipGraphFiles = (jpgs: number[] = [], clip: ValueObject = {}, args: UnknownObject = {}) => {
      const videoDefinition = {
        type: "videosequence",
        label: "Video Sequnce", id: "id-videosequence",
        url: 'video/frames/',
        source: 'video/source.mp4',
        audio: 'video/audio.mp3',
        duration: 3, fps: 30,
      }
      const mash = MashFactory.instance({
        tracks: [{ clips: [{ definitionId: videoDefinition.id, frames: 30, ...clip }] }]
      }, [videoDefinition], new JestPreloader())
      const graphArgs = { ...filterGraphArgs, ...args }
      const filterGraphs = mash.filterGraphs(graphArgs)
      const { filterGraphsVisible } = filterGraphs
      expect(filterGraphsVisible.length).toBe(1)
      const [filterGraph] = filterGraphsVisible
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      const { filterChain, filterChains, graphFiles, duration, time } = filterGraph
      if (time.isRange) expect(duration).toBeGreaterThan(0)
      else expect(duration).toBe(0)
      expect(filterChains.length).toEqual(1)
      const [clipFilterChain] = filterChains
      expectBackgroundFilterChain(filterChain)
      const { graphFilter, graphFilters } = clipFilterChain
      expect(graphFilters.length).toBe(2)
      const [scaleFilter, setSarFilter] = graphFilters
      expect(scaleFilter.filter).toEqual('scale')
      expect(setSarFilter.filter).toEqual('setsar')
      graphFilters.forEach(graphFilter => {
        const { outputs, inputs } = graphFilter
        expect(outputs?.length).toBe(1)
        expect(inputs?.length).toBe(1)
      })
      expectMergerGraphFilter(graphFilter)
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
    test("returns expected GraphFiles for video sequence", () => {
      expectClipGraphFiles([1])
      expectClipGraphFiles([31], { trim: 10 })
      expectClipGraphFiles([34], { trim: 10 }, { time: timeFromArgs(1, 10)})
      expectClipGraphFiles(
        [34, 35, 36, 37, 38, 39],
        { trim: 10 },
        {
          preloading: true, time: timeRangeFromArgs(1, 10, 2)
        }
      )
    })

    test("returns expected FilterGraphs for video", () => {
      const videoDefinition = {
        type: "video",
        label: "Video", id: "id-video",
        url: 'video/url.mp4',
        source: 'video/source.mp4',
        duration: 3, fps: 10,
      }
      const mash = MashFactory.instance({
        tracks: [{ clips: [{ definitionId: videoDefinition.id, frames: 30 }] }]
      }, [videoDefinition], new JestPreloader())
      const graphArgs = {...filterGraphArgs, graphType: GraphType.Mash}//, avType: AVType.Audio
      expect(graphArgs.graphType).toEqual(GraphType.Mash)
      const filterGraphs = mash.filterGraphs(graphArgs)
      const { filterGraphsVisible } = filterGraphs
      const [filterGraph] = filterGraphsVisible
      expect(filterGraph).toBeInstanceOf(FilterGraphClass)
      if (!(filterGraph instanceof FilterGraphClass)) throw Errors.internal

      const { filterChain, filterChains, graphFiles, duration } = filterGraph
      expect(duration).toBe(0)
      expect(filterChain).toBeDefined()
      expect(filterChains.length).toEqual(1)
      const [clipFilterChain] = filterChains
      expectBackgroundFilterChain(filterChain)

      const { graphFilter, graphFilters } = clipFilterChain
      if (graphArgs.avType !== AVType.Audio) expectMergerGraphFilter(graphFilter)
      expect(graphFiles).toBeInstanceOf(Array)
      expect(graphFiles.length).toBe(1)
      const [graphFile] = graphFiles
      expect(graphFile).toBeInstanceOf(Object)
      const { file, input } = graphFile
      expect(input).toBe(true)
      expect(file).toEqual(videoDefinition.source)
      expect(graphFilters.length).toBe(6)
      const [trimFilter, fpsFilter, setptsFilter, setsarFilter, scaleFilter, setSarFilter] = graphFilters
      expect(trimFilter.filter).toEqual('trim')
      expect(fpsFilter.filter).toEqual('fps')
      expect(setptsFilter.filter).toEqual('setpts')
      expect(setsarFilter.filter).toEqual('setsar')
      expect(scaleFilter.filter).toEqual('scale')
      expect(setSarFilter.filter).toEqual('setsar')
      graphFilters.forEach(graphFilter => {
        const { outputs, inputs } = graphFilter
        expect(outputs?.length).toBe(1)
        expect(inputs?.length).toBe(1)
      })
    })
  })

  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      const mash = MashFactory.instance()
      expect(mash.frames).toEqual(0)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = idGenerate()
      const mash = MashFactory.instance({ id })
      expect(mash.id).toEqual(id)
    })

  })

  describe("removeTrack", () => {
    test.each(TrackTypes)("correctly removes just %s track", (type) => {
      if (type === TrackType.Transition) return
      const mash = MashFactory.instance()

      mash.removeTrack(type)
      expect(mash.trackCount(type)).toEqual(0)
      expect(mash.tracks.length).toBe(1)
    })
  })

  describe("toJSON", () => {
    test("returns expected object", () => {
      const id = idGenerate()
      const mash = MashFactory.instance({ id })
      const clip = colorDefinition().instance
      mash.addTrack(TrackType.Video)
      mash.addClipToTrack(clip, 1)

      const mashString = JSON.stringify(mash)
      // console.log(mashString)
      const mashObject = JSON.parse(mashString)
      expect(mashObject.id).toEqual(id)
      const { tracks } = mashObject
      const audio = tracks.filter((track:TrackObject) => track.trackType === TrackType.Audio)
      const video = tracks.filter((track:TrackObject) => track.trackType === TrackType.Video)

      expectArrayOf(audio, Object, 1)
      let track = <TrackObject> audio[0]

      expectEmptyArray(track.clips)

      expectArrayOf(video, Object, 2)

      track = video[0]
      expectEmptyArray(track.clips)

      track = video[1]
      expectArrayOf(track.clips, Object, 1)
      if (!track.clips) throw Errors.internal + 'track.clips'

      const clipObject = track.clips[0]
      if (!clipObject) throw Errors.internal + 'clipObject'

      expect(clipObject).toBeInstanceOf(Object)
      expect(clipObject.color).toEqual(clip.color)
    })
  })

  describe("trackOfTypeAtIndex", () => {
    test("returns expected track", () => {
      const mash = MashFactory.instance()
      TrackTypes.forEach((type) => {
        const track = mash.trackOfTypeAtIndex(type, 0)
        if (type === TrackType.Transition) expect(track).toBeUndefined()
        else expect(track.trackType).toEqual(type)
      })
    })
  })

  describe("tracks", () => {
    test("returns two tracks", () => {
      const mash = MashFactory.instance()
      const { tracks } = mash
      expect(tracks.length).toBe(2)
      tracks.forEach(track => expect(track).toBeInstanceOf(TrackClass))
    })
  })
  const output = outputDefaultVideo()
  const time = timeFromArgs(0, 10)
  const size = { width: output.width!, height: output.height! }
  const videoRate = output.videoRate!
  const graphType = GraphType.Canvas
  const filterGraphArgs: FilterGraphOptions = {
    preloading: true,
    avType: AVType.Both,
    graphType, size, videoRate, time,
  }
})
