import { expectArrayLength } from "../../../../../dev/test/Utilities/expectArrayLength"
import { expectEmptyArray } from "../../../../../dev/test/Utilities/expectEmptyArray"
import { ShapeContainerClass } from "../../Container/ShapeContainer/ShapeContainerClass"
import { shapeContainerDefault } from "../../Container/ShapeContainer/ShapeContainerFactory"
import { ColorContentClass } from "../../Content/ColorContent/ColorContentClass"
import { colorContentDefault } from "../../Content/ColorContent/ColorContentFactory"
import { FilterGraphInput } from "../../Edited/Mash/FilterGraph/FilterGraphClass"
import { timeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { ChainArgs, GraphFileArgs } from "../../MoveMe"
import { Dimensions, DimensionsDefault } from "../../Setup/Dimensions"
import { visibleClip, visibleClipWithImage } from "../../../../../dev/test/Utilities/VisibleClip"
import { ImageClass } from "../Image/ImageClass"

describe("VisibleClip", () => {
  const time = timeFromArgs()
  const quantize = time.fps
  const videoRate = 30
  const graphFileArgs: GraphFileArgs = { time, quantize, visible: true }
  const chainArgs: ChainArgs = { 
    inputCount: 0,
    previousOutput: FilterGraphInput,
    time, quantize, visible: true,
    outputDimensions: DimensionsDefault, videoRate,
    outputRequired: false
  }
        
  describe("with default arguments", () => {
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
    test("chain() returns expected color and overlay CommandFilters", () => {
      const chain = itClip.chain(chainArgs)
      expect(chain).toBeInstanceOf(Object)
      const { commandFiles, commandFilters } = chain
      expectEmptyArray(commandFiles)
      // console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 2)
      const [colorCommand, overlayCommand] = commandFilters
      const { ffmpegFilter: colorId } = colorCommand
      expect(colorCommand.ffmpegFilter).toEqual('color')
      expect(overlayCommand.ffmpegFilter).toEqual('overlay')
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 1)
      expect(overlayCommand.outputs).toBeUndefined
    })
  })
  describe("with image content", () => {
    const itClip = visibleClipWithImage()
    test("has image content and default container", () => {
      expect(itClip.contentId).toEqual('image')
      expect(itClip.containerId).toEqual(shapeContainerDefault.id)
      expect(itClip.content).toBeInstanceOf(ImageClass)
      expect(itClip.container).toBeInstanceOf(ShapeContainerClass)
    })
    test("graphFiles() returns image GraphFile", () => {
      const graphFiles = itClip.graphFiles(graphFileArgs)
      expectArrayLength(graphFiles, 2, Object)
    })
    test("chain() returns expected color and overlay CommandFilters", () => {
      const chain = itClip.chain(chainArgs)
      expect(chain).toBeInstanceOf(Object)
      const { commandFiles, commandFilters } = chain
      expectArrayLength(commandFiles, 2, Object)
      console.log("commandFilters", commandFilters)
      expectArrayLength(commandFilters, 2)
      const [colorCommand, overlayCommand] = commandFilters
      const { ffmpegFilter: colorId } = colorCommand
      expect(colorCommand.ffmpegFilter).toEqual('color')
      expect(overlayCommand.ffmpegFilter).toEqual('overlay')
      expectArrayLength(colorCommand.outputs, 1)
      expectArrayLength(overlayCommand.inputs, 1)
      expect(overlayCommand.outputs).toBeUndefined
    })
  })
})