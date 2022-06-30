import { expectArrayLength } from "../../../../../dev/test/Utilities/expectArrayLength"
import { expectEmptyArray } from "../../../../../dev/test/Utilities/expectEmptyArray"
import { ShapeContainerClass } from "../../Container/ShapeContainer/ShapeContainerClass"
import { shapeContainerDefault } from "../../Container/ShapeContainer/ShapeContainerFactory"
import { ColorContentClass } from "../../Content/ColorContent/ColorContentClass"
import { colorContentDefault } from "../../Content/ColorContent/ColorContentFactory"
import { FilterGraphInput } from "../../Edited/Mash/FilterGraph/FilterGraphClass"
import { timeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { CommandFileArgs, CommandFilterArgs, GraphFileArgs } from "../../MoveMe"
import { DimensionsDefault } from "../../Setup/Dimensions"
import { visibleClip, visibleClipWithImage } from "../../../../../dev/test/Utilities/VisibleClip"
import { ImageClass } from "../Image/ImageClass"
import { CommandFilters } from "../../../dist/moviemasher"
import { JestPreloader } from "../../../../../dev/test/Utilities/JestPreloader"

describe("VisibleClip", () => {
  const time = timeFromArgs()
  const quantize = time.fps
  const videoRate = 30
  const graphFileArgs: GraphFileArgs = { time, quantize, visible: true }
  const commandFileArgs: CommandFileArgs = { 
    time, quantize, visible: true,
    outputDimensions: DimensionsDefault, 
  }
  const commandFilterArgs: CommandFilterArgs = {
    chainInput: FilterGraphInput,
    ...commandFileArgs, commandFiles: [], videoRate
  }
  const expectCommandFilters = (commandFilters: CommandFilters, ...commands: string[]) => {
    const commandNames = commandFilters.map(commandFilter => commandFilter.ffmpegFilter)
    expect(commandNames).toEqual(commands)
  }
        
  describe.skip("with default arguments", () => {
    const itClip = visibleClip()
    
    test("has default content and container", () => {
      expect(itClip.contentId).toEqual(colorContentDefault.id)
      expect(itClip.containerId).toEqual(shapeContainerDefault.id)
      expect(itClip.content).toBeInstanceOf(ColorContentClass)
      expect(itClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("graphFiles() returns empty array", () => {
      expectEmptyArray(itClip.graphFiles(graphFileArgs))
    })
    test("commandFilters() returns expected color and overlay", () => {
      const commandFiles = itClip.commandFiles(commandFileArgs)
      expectEmptyArray(commandFiles)
      const commandFilters = itClip.commandFilters({ ...commandFilterArgs, commandFiles })
  
      expectArrayLength(commandFilters, 2, Object)
      console.log("commandFilters", commandFilters)
      const [colorCommand, overlayCommand] = commandFilters
      expect(colorCommand.ffmpegFilter).toEqual('color')
      expect(overlayCommand.ffmpegFilter).toEqual('overlay')
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 2)
      expectEmptyArray(overlayCommand.outputs)
    })
  })
  describe("with image content", () => {
    const preloader = new JestPreloader()
    const itClip = visibleClipWithImage()
    test("has image content and default container", () => {
      expect(itClip.contentId).toEqual('image')
      expect(itClip.containerId).toEqual(shapeContainerDefault.id)
      expect(itClip.content).toBeInstanceOf(ImageClass)
      expect(itClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("graphFiles() returns image GraphFile", () => {
      const graphFiles = itClip.graphFiles(graphFileArgs)
      expectArrayLength(graphFiles, 1, Object)
    })
    test("commandFiles() returns expected CommandFiles ", async () => {
      const commandFiles = itClip.commandFiles(commandFileArgs)
      expectArrayLength(commandFiles, 1, Object)
      const [commandFile] = commandFiles
      console.log("commandFile", commandFile)
    })
    test("commandFilters() returns expected CommandFilters", async () => {
      const commandFiles = itClip.commandFiles(commandFileArgs)
      await preloader.loadFilesPromise(commandFiles)
      const commandFilters = itClip.commandFilters({...commandFilterArgs, commandFiles })
      expectArrayLength(commandFiles, 1, Object)
      console.log("commandFilters", commandFilters)
      expectCommandFilters(commandFilters, "setpts", "scale", "crop", "setsar", "color", "alphamerge", "overlay")
      const [setptsCommand, scaleCommand, cropCommand, setsarCommand, colorCommand, alphamergeCommand, overlayCommand] = commandFilters
      expectEmptyArray(colorCommand.inputs)
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 2)
      expectEmptyArray(overlayCommand.outputs)
    })
  })
  describe("with image content scaled and positioned", () => {
    const preloader = new JestPreloader()
    const containerId = "com.moviemasher.shapecontainer.chat"
    const itClip = visibleClipWithImage({ containerId, container: { width: 0.5, height: 0.5, x: 0.5, y: 0.5 } })
    test("has image content and default container", () => {
      expect(itClip.contentId).toEqual('image')
      expect(itClip.containerId).toEqual(containerId)
      expect(itClip.content).toBeInstanceOf(ImageClass)
      expect(itClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("graphFiles() returns image GraphFile", () => {
      const graphFiles = itClip.graphFiles(graphFileArgs)
      expectArrayLength(graphFiles, 1, Object)
    })
    test("commandFiles() returns expected CommandFiles ", async () => {
      const commandFiles = itClip.commandFiles(commandFileArgs)
      expectArrayLength(commandFiles, 2, Object)
      const [commandFile, commandFile2] = commandFiles
      console.log("commandFiles", commandFile, commandFile2)
    })
    test("commandFilters() returns expected CommandFilters", async () => {
      const commandFiles = itClip.commandFiles(commandFileArgs)
      await preloader.loadFilesPromise(commandFiles)
      const commandFilters = itClip.commandFilters({...commandFilterArgs, commandFiles })
      expectArrayLength(commandFiles, 2, Object)
      console.log("commandFilters", commandFilters)
      expectCommandFilters(commandFilters, "setpts", "scale", "crop", "setsar", "color", "alphamerge", "overlay")
      const [setptsCommand, scaleCommand, cropCommand, setsarCommand, colorCommand, alphamergeCommand, overlayCommand] = commandFilters
      expectEmptyArray(colorCommand.inputs)
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 2)
      expectEmptyArray(overlayCommand.outputs)
    })
  })
})