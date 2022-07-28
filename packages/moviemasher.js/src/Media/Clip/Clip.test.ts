import { expectArrayLength, expectEmptyArray } from "../../../../../dev/test/Utilities/Expect"
import { ShapeContainerClass } from "../../Container/ShapeContainer/ShapeContainerClass"
import { containerDefault } from "../../Container/ContainerFactory"
import { ColorContentClass } from "../../Content/ColorContent/ColorContentClass"
import { contentDefault } from "../../Content/ContentFactory"
import { FilterGraphInputAudible, FilterGraphInputVisible } from "../../Edited/Mash/FilterGraph/FilterGraphClass"
import { timeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { CommandFileArgs, CommandFilterArgs, CommandFilters, GraphFileArgs } from "../../MoveMe"
import { DimensionsOutput } from "../../Utility/Size"
import { createClip, createClipWithAudio, createClipWithImage } from "../../../../../dev/test/Utilities/Create"
import { ImageClass } from "../Image/ImageClass"
import { AudioClass } from "../Audio/AudioClass"
import { GraphFileType, LoadType } from "../../Setup/Enums"
import { arrayLast } from "../../Utility/Array"

describe("Clip", () => {
  const time = timeFromArgs()
  const quantize = time.fps
  const videoRate = 30
  const graphFileArgs: GraphFileArgs = { time, quantize, visible: true }
  const commandFileArgs: CommandFileArgs = { 
    time, quantize, visible: true, videoRate,
    outputSize: DimensionsOutput
  }
  const commandFilterArgs: CommandFilterArgs = {
    chainInput: FilterGraphInputVisible,
    ...commandFileArgs, commandFiles: [], track: 0
  }
  const expectCommandFilters = (commandFilters: CommandFilters, ...commands: string[]) => {
    const commandNames = commandFilters.map(commandFilter => commandFilter.ffmpegFilter)
    expect(commandNames).toEqual(commands)
  }
        
  describe("with default arguments", () => {
    const describedClip = createClip()
    test("has default content and container", () => {
      expect(describedClip.contentId).toEqual(contentDefault.id)
      expect(describedClip.containerId).toEqual(containerDefault.id)
      expect(describedClip.content).toBeInstanceOf(ColorContentClass)
      expect(describedClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("clipGraphFiles() returns empty array", () => {
      expectEmptyArray(describedClip.clipGraphFiles(graphFileArgs))
    })
    test("commandFilters() returns expected color and overlay", () => {
      const commandFiles = describedClip.commandFiles(commandFileArgs)
      expectEmptyArray(commandFiles)
      const commandFilters = describedClip.commandFilters({ ...commandFilterArgs, commandFiles })
  
      expectArrayLength(commandFilters, 3, Object)
      console.log("commandFilters", commandFilters)
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
      expect(describedClip.containerId).toEqual(containerDefault.id)
      expect(describedClip.content).toBeInstanceOf(ImageClass)
      expect(describedClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("clipGraphFiles() returns image GraphFile", () => {
      const describedClip = createClipWithImage()
      const graphFiles = describedClip.clipGraphFiles(graphFileArgs)
      expectArrayLength(graphFiles, 1, Object)
    })
    test("commandFiles() returns expected CommandFiles ", async () => {
      const describedClip = createClipWithImage()
      const commandFiles = describedClip.commandFiles(commandFileArgs)
      expectArrayLength(commandFiles, 1, Object)
      const [commandFile] = commandFiles
      // console.log("commandFile", commandFile)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createClipWithImage()

      const commandFiles = describedClip.commandFiles(commandFileArgs)
      const commandFilters = describedClip.commandFilters({...commandFilterArgs, commandFiles })
      expectArrayLength(commandFiles, 1, Object)
      expectCommandFilters(commandFilters, "color", "scale", "overlay", "crop", "copy", "overlay")
      const [colorCommand] = commandFilters
      const overlayCommand = arrayLast(commandFilters)
      expectEmptyArray(colorCommand.inputs)
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 2)
      expectEmptyArray(overlayCommand.outputs)
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
      const graphFiles = describedClip.clipGraphFiles(graphFileArgs)
      expectArrayLength(graphFiles, 1, Object)
      const [graphFile] = graphFiles
      expect(graphFile.type).toBe(LoadType.Image)
    })
    test("commandFiles() returns expected CommandFiles ", () => {
      const describedClip = createClip()
      const commandFiles = describedClip.commandFiles(commandFileArgs)
      expectArrayLength(commandFiles, 2, Object)
      expect(commandFiles.every(file => file.input)).toBe(true)
      const [imageFile, svgFile] = commandFiles
      expect(imageFile.type).toBe(LoadType.Image)
      expect(svgFile.type).toBe(GraphFileType.Svg)
    })
    test("commandFilters() returns expected CommandFilters", () => {
      const describedClip = createClip()
      const commandFiles = describedClip.commandFiles(commandFileArgs)
      expectArrayLength(commandFiles, 2, Object)
      const commandFilters = describedClip.commandFilters({...commandFilterArgs, commandFiles })
      // console.log("commandFilters", commandFilters)//.map(f => f.ffmpegFilter))
      expectCommandFilters(commandFilters, "color", "scale", "overlay", "crop", "format", "format", "alphamerge", "overlay")//"color", 
      const alphamergeCommand = commandFilters[6]
      const overlayCommand = commandFilters[7]
      
      expectArrayLength(alphamergeCommand.inputs, 2)
      expectArrayLength(alphamergeCommand.outputs, 1)

      expectArrayLength(overlayCommand.inputs, 2)
      expectEmptyArray(overlayCommand.outputs)    
    })
  })

  describe("with audio content", () => {
    const audioGraphFileArgs = { ...graphFileArgs, visible: false, audible: true }
    const audioCommandFileArgs = { ...commandFileArgs, visible: false, audible: true }
    const audioCommandFilterArgs: CommandFilterArgs = {
      chainInput: FilterGraphInputAudible,
      filterInput: 'FILTER',
      ...audioCommandFileArgs, commandFiles: [], track: 0
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
      const graphFiles = describedClip.clipGraphFiles(audioGraphFileArgs)
      expectArrayLength(graphFiles, 1, Object)
      const [graphFile] = graphFiles
      const { type, input } = graphFile
      expect(type).toBe(LoadType.Audio)
      expect(input).toBe(true)
    })
    test("commandFiles() returns expected CommandFiles ", async () => {
      const describedClip = createClipWithAudio()
      const commandFiles = describedClip.commandFiles(audioCommandFileArgs)
      expectArrayLength(commandFiles, 1, Object)
      const [audioFile] = commandFiles
      const { type, input } = audioFile
      expect(type).toBe(LoadType.Audio)
      expect(input).toBe(true)
    })
    test("commandFilters() returns expected CommandFilters", async () => {
      const describedClip = createClipWithAudio()
      const commandFiles = describedClip.commandFiles(audioCommandFileArgs)
      expectArrayLength(commandFiles, 1, Object)
      const commandFilters = describedClip.commandFilters({...audioCommandFilterArgs, commandFiles })
      console.log("commandFilters", commandFilters)
      expectCommandFilters(commandFilters, "atrim", "amix")
      const [atrimCommand, amixCommand] = commandFilters
      expectArrayLength(atrimCommand.inputs, 1)
      expectArrayLength(atrimCommand.outputs, 1)

      expectArrayLength(amixCommand.inputs, 2)
      expectEmptyArray(amixCommand.outputs)
   
    })
  })
})