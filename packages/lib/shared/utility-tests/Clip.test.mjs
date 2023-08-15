import { describe, test } from 'node:test'
import assert from 'assert'

import { expectArrayLength, expectEmptyArray } from "../../../../../../../images/tester/Utilities/Expect.mjs"
import { createClip, createClipWithAudio, createClipWithImage } from "../../../../../../../images/tester/Utilities/Create.mjs"

import { 
  ShapeContainerClass, ColorContentClass, FilterGraphInputAudible, 
  FilterGraphInputVisible, timeFromArgs, ImageClass, AudioClass, 
  GraphFileType, DefaultContentId, DefaultContainerId, AssetCollection
} from "@moviemasher/lib-shared"
import {SIZE_OUTPUT, TypeAudio, TypeImage, } from '@moviemasher/runtime-shared'

describe("Clip", () => {
  const media = new AssetCollection()
  const time = timeFromArgs()
  const quantize = time.fps
  const videoRate = 30
  const graphFileArgs = (clip) => {
    return { time, quantize, visible: true, clipTime: clip.timeRange }
  } 
  const commandFileArgs = (clip) => {
    return { 
      time, quantize, visible: true, videoRate,
      outputSize: SIZE_OUTPUT, clipTime: clip.timeRange
    }
  } 
  const commandFilterArgs = (clip) => {
    return {
      chainInput: FilterGraphInputVisible,
      ...commandFileArgs(clip), commandFiles: [], track: 0
    }
  } 
  const expectCommandFilters = (commandFilters, ...commands) => {
    const commandNames = commandFilters.map(commandFilter => commandFilter.ffmpegFilter)
    assert.deepStrictEqual(commandNames, commands)
  }
        
  describe("with default arguments", () => {
    const describedClip = createClip()
    test("has default content and container", () => {
      assert.equal(describedClip.contentId, DefaultContentId)
      assert.equal(describedClip.containerId, DefaultContainerId)
      assert(describedClip.content instanceof ColorContentClass)
      assert(describedClip.container instanceof ShapeContainerClass)
    })
 
    test("commandFilters() returns expected color and overlay", () => {
      const commandFiles = describedClip.clipCommandFiles(commandFileArgs(describedClip))
      expectEmptyArray(commandFiles)
      const commandFilters = describedClip.commandFilters({ 
        ...commandFilterArgs(describedClip), commandFiles 
      })
  
      expectArrayLength(commandFilters, 3, Object)
      // console.log("commandFilters", commandFilters)
      const [colorCommand, copyCommand, overlayCommand] = commandFilters
      assert.equal(colorCommand.ffmpegFilter, 'color')
      assert.equal(copyCommand.ffmpegFilter, 'copy')
      assert.equal(overlayCommand.ffmpegFilter, 'overlay')
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 2)
      expectEmptyArray(overlayCommand.outputs)
    })
  })

  describe("with image content", () => {
    // const describedClip = createClipWithImage(media)
    // console.log("describedClip", describedClip.content)
    test("has image content and default container", () => {
      const describedClip = createClipWithImage(media)
      assert.equal(describedClip.contentId, 'image')
      assert.equal(describedClip.containerId, DefaultContainerId)
      assert(describedClip.content instanceof ImageClass)
      assert(describedClip.container instanceof ShapeContainerClass)
    })

    test("clipCommandFiles() returns expected CommandFiles ", () => {
      const describedClip = createClipWithImage(media)
      const commandFiles = describedClip.clipCommandFiles(commandFileArgs(describedClip))
      expectArrayLength(commandFiles, 1, Object)
      const [commandFile] = commandFiles
      // console.log("commandFile", commandFile)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createClipWithImage(media)

      const commandFiles = describedClip.clipCommandFiles(commandFileArgs(describedClip))
      const commandFilters = describedClip.commandFilters({
        ...commandFilterArgs(describedClip), commandFiles 
      })
      expectArrayLength(commandFiles, 1, Object)
      expectArrayLength(commandFilters)
    })
  })

  describe("with image content scaled and positioned within container", () => {
    const containerId = "devicons.container.apple"
    const createImageClip = () => createClipWithImage(media, { 
      containerId, container: { width: 0.5, height: 0.5, x: 0.5, y: 0.5 } 
    })
    test("has image content and shape container", () => {
      const describedClip = createImageClip()
      assert.equal(describedClip.contentId, 'image')
      assert.equal(describedClip.containerId, containerId)
      assert(describedClip.content instanceof ImageClass)
      assert(describedClip.container instanceof ShapeContainerClass)
    })

    test("clipCommandFiles() returns expected CommandFiles ", () => {
      const describedClip = createImageClip(media)
      const commandFiles = describedClip.clipCommandFiles(commandFileArgs(describedClip))
      expectArrayLength(commandFiles, 2, Object)
      assert.equal(commandFiles.every(file => file.input), true)
      const [imageFile, svgFile] = commandFiles
      assert.equal(imageFile.type, TypeImage)
      assert.equal(svgFile.type, GraphFileType.Svg)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createImageClip(media)
      const commandFiles = describedClip.clipCommandFiles(commandFileArgs(describedClip))
      expectArrayLength(commandFiles, 2, Object)
      const commandFilters = describedClip.commandFilters({
        ...commandFilterArgs(describedClip), commandFiles 
      })
      // console.log("commandFilters", commandFilters)//.map(f => f.ffmpegFilter))
      expectArrayLength(commandFilters)
      
    })
  })

  describe("with audio content", () => {
    const audioGraphFileArgs = (clip) => {
      return { ...graphFileArgs(clip), visible: false, audible: true }
    }
    const audioCommandFileArgs = (clip) => {
      return { ...commandFileArgs(clip), visible: false, audible: true }
    } 
    const audioCommandFilterArgs = (clip) => {
      return {
        chainInput: FilterGraphInputAudible,
        filterInput: 'FILTER',
        ...audioCommandFileArgs(clip), commandFiles: [], track: 0
      }
    } 

    test("has audio content and undefined container", () => {
      const describedClip = createClipWithAudio(media)
      assert.equal(describedClip.contentId, 'audio')
      assert.equal(describedClip.containerId, undefined)
      assert(describedClip.content instanceof AudioClass)
      assert.equal(describedClip.container, undefined)
    })

    test("clipCommandFiles() returns expected CommandFiles ", () => {
      const describedClip = createClipWithAudio(media)
      const commandFiles = describedClip.clipCommandFiles(audioCommandFileArgs(describedClip))
      expectArrayLength(commandFiles, 1, Object)
      const [audioFile] = commandFiles
      const { type, input } = audioFile
      assert.equal(type, TypeAudio)
      assert.equal(input, true)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createClipWithAudio(media)
      const commandFiles = describedClip.clipCommandFiles(audioCommandFileArgs(describedClip))
      expectArrayLength(commandFiles, 1, Object)
      const commandFilters = describedClip.commandFilters({
        ...audioCommandFilterArgs(describedClip), commandFiles 
      })
      // console.log("commandFilters", commandFilters)
      expectCommandFilters(commandFilters, "atrim", "amix")
      const [atrimCommand, amixCommand] = commandFilters
      expectArrayLength(atrimCommand.inputs, 1)
      expectArrayLength(atrimCommand.outputs, 1)

      expectArrayLength(amixCommand.inputs, 2)
      expectEmptyArray(amixCommand.outputs)
   
    })
  })
})