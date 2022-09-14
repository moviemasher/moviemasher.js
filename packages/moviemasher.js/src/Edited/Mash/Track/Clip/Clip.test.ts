import { expectArrayLength, expectEmptyArray } from "../../../../../../../dev/test/Utilities/Expect"
import { ShapeContainerClass } from "../../../../Container/ShapeContainer/ShapeContainerClass"
import { ColorContentClass } from "../../../../Content/ColorContent/ColorContentClass"
import { FilterGraphInputAudible, FilterGraphInputVisible } from "../../../../Edited/Mash/FilterGraph/FilterGraphClass"
import { timeFromArgs } from "../../../../Helpers/Time/TimeUtilities"
import { CommandFileArgs, CommandFilterArgs, CommandFilters, GraphFileArgs } from "../../../../MoveMe"
import { SizeOutput } from "../../../../Utility/Size"
import { createClip, createClipWithAudio, createClipWithImage } from "../../../../../../../dev/test/Utilities/Create"
import { ImageClass } from "../../../../Media/Image/ImageClass"
import { AudioClass } from "../../../../Media/Audio/AudioClass"
import { GraphFileType, LoadType } from "../../../../Setup/Enums"
import { Clip } from "./Clip"
import { ContentDefaultId } from "../../../../Content/Content"
import { ContainerDefaultId } from "../../../../Container/Container"

describe("Clip", () => {
  const time = timeFromArgs()
  const quantize = time.fps
  const videoRate = 30
  const graphFileArgs = (clip: Clip): GraphFileArgs => {
    return { time, quantize, visible: true, clipTime: clip.timeRange(quantize) }
  } 
  const commandFileArgs = (clip: Clip): CommandFileArgs => {
    return { 
      time, quantize, visible: true, videoRate,
      outputSize: SizeOutput, clipTime: clip.timeRange(quantize)
    }
  } 
  const commandFilterArgs = (clip: Clip): CommandFilterArgs => {
    return {
      chainInput: FilterGraphInputVisible,
      ...commandFileArgs(clip), commandFiles: [], track: 0
    }
  } 
  const expectCommandFilters = (commandFilters: CommandFilters, ...commands: string[]) => {
    const commandNames = commandFilters.map(commandFilter => commandFilter.ffmpegFilter)
    expect(commandNames).toEqual(commands)
  }
        
  describe("with default arguments", () => {
    const describedClip = createClip()
    test("has default content and container", () => {
      expect(describedClip.contentId).toEqual(ContentDefaultId)
      expect(describedClip.containerId).toEqual(ContainerDefaultId)
      expect(describedClip.content).toBeInstanceOf(ColorContentClass)
      expect(describedClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("clipGraphFiles() returns empty array", () => {
      expectEmptyArray(describedClip.clipGraphFiles(graphFileArgs(describedClip)))
    })
    test("commandFilters() returns expected color and overlay", () => {
      const commandFiles = describedClip.commandFiles(commandFileArgs(describedClip))
      expectEmptyArray(commandFiles)
      const commandFilters = describedClip.commandFilters({ 
        ...commandFilterArgs(describedClip), commandFiles 
      })
  
      expectArrayLength(commandFilters, 3, Object)
      // console.log("commandFilters", commandFilters)
      const [colorCommand, copyCommand, overlayCommand] = commandFilters
      expect(colorCommand.ffmpegFilter).toEqual('color')
      expect(copyCommand.ffmpegFilter).toEqual('copy')
      expect(overlayCommand.ffmpegFilter).toEqual('overlay')
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 2)
      expectEmptyArray(overlayCommand.outputs)
    })
  })

  describe("with image content", () => {
    // const describedClip = createClipWithImage()
    // console.log("describedClip", describedClip.content)
    test("has image content and default container", () => {
      const describedClip = createClipWithImage()
      expect(describedClip.contentId).toEqual('image')
      expect(describedClip.containerId).toEqual(ContainerDefaultId)
      expect(describedClip.content).toBeInstanceOf(ImageClass)
      expect(describedClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("clipGraphFiles() returns image GraphFile", () => {
      const describedClip = createClipWithImage()
      const files = describedClip.clipGraphFiles(graphFileArgs(describedClip))
      expectArrayLength(files, 1, Object)
    })
    test("commandFiles() returns expected CommandFiles ", () => {
      const describedClip = createClipWithImage()
      const commandFiles = describedClip.commandFiles(commandFileArgs(describedClip))
      expectArrayLength(commandFiles, 1, Object)
      const [commandFile] = commandFiles
      // console.log("commandFile", commandFile)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createClipWithImage()

      const commandFiles = describedClip.commandFiles(commandFileArgs(describedClip))
      const commandFilters = describedClip.commandFilters({
        ...commandFilterArgs(describedClip), commandFiles 
      })
      expectArrayLength(commandFiles, 1, Object)
      expectArrayLength(commandFilters)
    })
  })

  describe("with image content scaled and positioned within container", () => {
    const containerId = "com.moviemasher.container.chat"
    const createClip = () => createClipWithImage({ 
      containerId, container: { width: 0.5, height: 0.5, x: 0.5, y: 0.5 } 
    })
    test("has image content and shape container", () => {
      const describedClip = createClip()
      expect(describedClip.contentId).toEqual('image')
      expect(describedClip.containerId).toEqual(containerId)
      expect(describedClip.content).toBeInstanceOf(ImageClass)
      expect(describedClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("clipGraphFiles() returns image GraphFile", () => {
      const describedClip = createClip()
      const files = describedClip.clipGraphFiles(graphFileArgs(describedClip))
      expectArrayLength(files, 1, Object)
      const [graphFile] = files
      expect(graphFile.type).toBe(LoadType.Image)
    })
    test("commandFiles() returns expected CommandFiles ", () => {
      const describedClip = createClip()
      const commandFiles = describedClip.commandFiles(commandFileArgs(describedClip))
      expectArrayLength(commandFiles, 2, Object)
      expect(commandFiles.every(file => file.input)).toBe(true)
      const [imageFile, svgFile] = commandFiles
      expect(imageFile.type).toBe(LoadType.Image)
      expect(svgFile.type).toBe(GraphFileType.Svg)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createClip()
      const commandFiles = describedClip.commandFiles(commandFileArgs(describedClip))
      expectArrayLength(commandFiles, 2, Object)
      const commandFilters = describedClip.commandFilters({
        ...commandFilterArgs(describedClip), commandFiles 
      })
      // console.log("commandFilters", commandFilters)//.map(f => f.ffmpegFilter))
      expectArrayLength(commandFilters)
      
    })
  })

  describe("with audio content", () => {
    const audioGraphFileArgs = (clip: Clip) => {
      return { ...graphFileArgs(clip), visible: false, audible: true }
    }
    const audioCommandFileArgs = (clip: Clip) => {
      return { ...commandFileArgs(clip), visible: false, audible: true }
    } 
    const audioCommandFilterArgs = (clip: Clip): CommandFilterArgs => {
      return {
        chainInput: FilterGraphInputAudible,
        filterInput: 'FILTER',
        ...audioCommandFileArgs(clip), commandFiles: [], track: 0
      }
    } 

    test("has audio content and undefined container", () => {
      const describedClip = createClipWithAudio()
      expect(describedClip.contentId).toEqual('audio')
      expect(describedClip.containerId).toBeUndefined()
      expect(describedClip.content).toBeInstanceOf(AudioClass)
      expect(describedClip.container).toBeUndefined()
    })
    test("clipGraphFiles() returns audio input GraphFile", () => {
      const describedClip = createClipWithAudio()
      const files = describedClip.clipGraphFiles(audioGraphFileArgs(describedClip))
      expectArrayLength(files, 1, Object)
      const [graphFile] = files
      const { type, input } = graphFile
      expect(type).toBe(LoadType.Audio)
      expect(input).toBe(true)
    })
    test("commandFiles() returns expected CommandFiles ", () => {
      const describedClip = createClipWithAudio()
      const commandFiles = describedClip.commandFiles(audioCommandFileArgs(describedClip))
      expectArrayLength(commandFiles, 1, Object)
      const [audioFile] = commandFiles
      const { type, input } = audioFile
      expect(type).toBe(LoadType.Audio)
      expect(input).toBe(true)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createClipWithAudio()
      const commandFiles = describedClip.commandFiles(audioCommandFileArgs(describedClip))
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