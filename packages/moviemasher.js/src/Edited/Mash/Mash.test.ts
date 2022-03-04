import fs from 'fs'

import { AVType, DefinitionType, GraphFileType, GraphType, LoadType, TrackType, TrackTypes } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Definition } from "../../Base/Definition"
import { Factory } from "../../Definitions/Factory/Factory"
import { Clip, ClipObject } from "../../Mixin/Clip/Clip"
import { idGenerate } from "../../Utility/Id"
import { Mash, MashObject } from "./Mash"
import { MashClass } from "./MashClass"
import { expectEmptyArray } from "../../../../../dev/test/Utilities/expectEmptyArray"
import { expectArrayOf } from "../../../../../dev/test/Utilities/expectArrayOf"

import themeTextJson from "../../Definitions/DefinitionObjects/theme/text.json"
import themeColorJson from "../../Definitions/DefinitionObjects/theme/color.json"
import { MashFactory } from "./MashFactory"
import { TrackClass } from "../../Media/Track/TrackClass"
import { TrackObject } from "../../Media/Track/Track"
import path from 'path/posix'
import { FilterGraphArgs } from '../../declarations'
import { outputDefaultVideo } from '../../Output/OutputDefault'
import { ImageDefinitionObject } from '../../Media/Image/Image'
import { MergerObject } from '../../Media/Merger/Merger'
import { TimeRange } from '../../Helpers/TimeRange'
import { ThemeDefinitionObject } from '../../Media/Theme/Theme'
import { JestPreloader } from '../../../../../dev/test/JestPreloader'

describe("MashFactory", () => {
  describe("instance", () => {
    test("returns MashClass instance", () => {
      const mash = MashFactory.instance()
      expect(mash).toBeInstanceOf(MashClass)
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
  const output = outputDefaultVideo() //as VideoOutputObject // { avType: AVType.Video }
  // const { output } = Default.mash
  const timeRange = TimeRange.fromArgs(0, 10)
  const size = { width: output.width!, height: output.height! }
  const videoRate = output.videoRate!
  const graphType = GraphType.Cast
  const segmentOptions: FilterGraphArgs = {
    justGraphFiles: false,
    avType: AVType.Both,
    graphType, size, videoRate, timeRange
  }

  describe("filterGraphs", () => {
    test("returns properly for image", () => {
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
      const filterGraphs = mash.filterGraphs(segmentOptions)
      expect(filterGraphs.length).toEqual(1)
      const filterGraph = filterGraphs[0]
      expect(filterGraph).toBeInstanceOf(Object)
      const { filterChains } = filterGraph
      expect(filterChains.length).toEqual(2)
      const [filterChain1, filterChain2] = filterChains
      const { graphFiles: graphFiles1 } = filterChain1
      expect(graphFiles1.length).toBe(0)
      const { graphFiles: graphFiles2 } = filterChain2
      expect(graphFiles2.length).toBe(1)
      const [graphFile] = graphFiles2
      const { type, file, input, options } = graphFile
      expect(type).toEqual(LoadType.Image)
      expect(file).toEqual(source)
      expect(input).toEqual(true)
      expect(options).toBeDefined()

      const segmentJson = JSON.stringify(filterGraph)
      // console.log("segmentJson", segmentJson)
      expect(segmentJson).not.toContain('mm_')
      expect(segmentJson).toContain('loop')
    })

    test("returns properly for text theme", () => {

      const definitionObject: ThemeDefinitionObject = themeTextJson
      const source = definitionObject.source
      const definitionId = definitionObject.id

      const merger: MergerObject = { definitionId: 'com.moviemasher.merger.center' }
      const clip: ClipObject = { definitionId, merger }
      const mashObject: MashObject = {
        tracks: [{ trackType: TrackType.Video, clips: [clip] }]
      }
      const mash = MashFactory.instance(mashObject, [definitionObject], new JestPreloader())
      const filterGraphs = mash.filterGraphs(segmentOptions)
      expect(filterGraphs.length).toEqual(1)
      const filterGraph = filterGraphs[0]
      expect(filterGraph).toBeInstanceOf(Object)
      const { filterChains } = filterGraph
      expect(filterChains.length).toEqual(2)
      const [filterChain1, filterChain2] = filterChains
      const { graphFiles: graphFiles1 } = filterChain1
      expect(graphFiles1.length).toBe(0)
      const { graphFiles: graphFiles2 } = filterChain2
      expect(graphFiles2.length).toBe(2)
      const [graphFile2, graphFile1] = graphFiles2
      expect(graphFile1.type).toEqual(GraphFileType.Txt)
      expect(graphFile2.type).toEqual(LoadType.Font)
      expect(graphFile1.input).toBeFalsy()
      expect(graphFile2.input).toBeFalsy()
      const segmentJson = JSON.stringify(filterGraph)
      // console.log("segmentJson", segmentJson)
      expect(segmentJson).not.toContain('mm_')
    })

    test("returns expected FilterGraphs", () => {
      const videoDefinition = {
        type: "video",
        label: "Video", id: "id-video",
        url: 'video.mp4',
        source: 'video/original.mp4',
        duration: 3, fps: 10,
      }
      const mash = MashFactory.instance({
        tracks: [{ clips: [{ definitionId: videoDefinition.id, frames: 30 }] }]
      }, [videoDefinition], new JestPreloader())
      const filterGraph = mash.filterGraphs(segmentOptions)[0]
      expect(filterGraph).toBeInstanceOf(Object)
      const { filterChains, duration } = filterGraph
      expect(duration).toBeGreaterThan(0)
      expect(filterChains.length).toEqual(2)
      const [baseFilterChain, layer] = filterChains
      expect(baseFilterChain.graphFilter).toBeUndefined()
      const { graphFilters: baseFilters } = baseFilterChain
      expect(baseFilters.length).toBe(1)
      const [baseFilter] = baseFilters
      expect(baseFilter.outputs?.length).toBe(1)
      const { graphFilter: merger } = layer
      expect(merger).toBeDefined()
      if (!merger) throw 'merger'

      const { inputs, outputs } = merger
      expect(inputs).toBeDefined()
      expect(outputs).toBeUndefined()
    })
  })
  const dir = './dev/test/MashObjects'
  const ext = '.json'

  const files = fs.readdirSync(dir)

  const jsonFiles = files.filter(file => file.endsWith(ext))
  const names = jsonFiles.map(file => path.basename(file, ext))

  describe.each(names)("%s", name => {
    const mashObject: MashObject = fs.readFileSync(`${dir}/${name}${ext}`).toJSON()

    test("returns something", () => {
      const mash = MashFactory.instance(mashObject, [], new JestPreloader({prefix: dir}))
      const result = mash.filterGraphs(segmentOptions)
      // console.log(result.filterChains.flatMap(layer => layer.filters))
      expect(result).toBeInstanceOf(Array)
    })
  })
})
