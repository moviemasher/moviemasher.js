import { describe, test } from 'node:test'
import assert from 'assert'

import { expectArrayLength, expectEmptyArray } from "../../../../../images/tester/Utilities/Expect.mjs"

import { 
  AVType, idGenerateString, MashClass, 
  mashMedia, outputDefaultVideo, 
  timeFromArgs, timeRangeFromArgs, isClipObject, 
  TrackClass, AssetCollection, 
  fontDefault,
  ImageType, FONT, 
} from "@moviemasher/lib-shared"


// TODO: create a text container asset
const TextContainerId = 'text-container-id'

describe("Mash Asset", () => {
  const media = new AssetCollection()
  media.define({
    id: 'image-square', type: ImageType, 
    decodings: [{ type: 'probe', data: { width: 640, height: 480 } }],
    source: '../shared/image/globe.jpg'
  })
  media.define({
    id: 'image-landscape', type: ImageType, 
    decodings: [{ type: 'probe', data: { width: 640, height: 480 } }],
    source: '../shared/image/cable.jpg'
  })
  media.define({
    type: "videosequence",
    label: "Video Sequence", id: "video-sequence",
    url: 'video/frames/',
    source: 'video/source.mp4',
    audio: 'video/audio.mp3',
    decodings: [{ type: 'probe', data: { width: 640, height: 480 } }],
    duration: 3, fps: 30, 
  })
  media.define({
    type: "video",
    label: "Video", id: "video-rgb",
    url: 'video.mp4',
    source: 'video.mp4',
    decodings: [{ type: 'probe', data: { width: 640, height: 480 } }],
    duration: 3, fps: 10,
    
  })
  fontDefault.url = fontDefault.source

  const addNewClip = (mash, track = 0) => {
    const clip = mash.clipInstance()
    assert(clip)
    mash.addClipToTrack(clip, track)
    return clip
  }

  const addNewTextClip = (mash, track = 0) => {
    const clipObject = { containerId: TextContainerId }
    const clip = mash.clipInstance(clipObject)
    assert(clip)
    mash.addClipToTrack(clip, track)
    return clip
  }

  const createMash = (clips = []) => {
    const mashObject = { tracks: [{ clips }] }
    const mash = mashMedia(mashObject)
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
      const mash = createMash()
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
      const mash = createMash()
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
      const mash = createMash()
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
      const mash = createMash()
      const clip = addNewClip(mash)
      expectArrayLength(mash.tracks, 1)
      const track = mash.tracks[0]
      expectArrayLength(track.clips, 1)
      assert.strictEqual(track.clips[0], clip)
      assert.equal(mash.frames, clip.frames)
    })

    test("correctly sorts clips", () => {
      const mash = createMash()
      assert.equal(mash.quantize, 10)
      const track = mash.tracks[0]
      assert(track.dense)

      const clip1 = mash.clipInstance()
      const clip2 = mash.clipInstance()
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
      const mash = mashMedia({ tracks: [{ clips }, { clips }, { clips }] })
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
      assert.equal(fontGraphFile.type, FONT)
      assert(!fontGraphFile.input)

      const editingGraphFiles = mash.editedGraphFiles({ editing: true })
      expectArrayLength(editingGraphFiles, 1)
      const [editingFontGraphFile] = editingGraphFiles
      assert.equal(editingFontGraphFile.type, FONT)
      assert(!editingFontGraphFile.input)
    })
  })

  describe("frames", () => {
    test("returns 0 from empty mash", () => {
      const mash = createMash()
      assert.equal(mash.frames, 0)
    })
  })

  describe("id", () => {
    test("returns what is provided to constructor", () => {
      const id = idGenerateString()
      const mash = mashMedia({ id })
      assert.equal(mash.id, id)
    })
  })

  describe("removeTrack", () => {
    test("correctly removes track", () => {
      const mash = createMash()

      mash.removeTrack()
      expectEmptyArray(mash.tracks)
    })
  })

  describe("toJSON", () => {
    test("returns expected object", () => {
      const id = idGenerateString()
      const mash = mashMedia({ id })
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
      const mash = createMash()
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
