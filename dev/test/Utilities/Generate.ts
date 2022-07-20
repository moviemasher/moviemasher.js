
import { visibleClipDefault } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClipFactory"
import { VisibleClipObject } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClip"
import { MashObject } from "../../../packages/moviemasher.js/src/Edited/Mash/Mash"
import { colorBlack, colorBlue, colorGreen, colorRed } from "../../../packages/moviemasher.js/src/Utility/Color"
import { assertObject, assertPopulatedArray, assertPopulatedString, assertPositive, isObject, isPopulatedArray, isPopulatedString, isPositive, isString, throwError } from "../../../packages/moviemasher.js/src/Utility/Is"
import { assertSize, DimensionsPreview, isSize, Size } from "../../../packages/moviemasher.js/src/Utility/Size"
import { TextContainerObject } from "../../../packages/moviemasher.js/src/Container/TextContainer/TextContainer"
import { ContentObject } from "../../../packages/moviemasher.js/src/Content/Content"
import { assertContainerObject, ContainerObject, isContainerObject } from "../../../packages/moviemasher.js/src/Container/Container"
import { DefinitionObjects } from "../../../packages/moviemasher.js/src/Definition/Definition"
import { assertPoint, isPoint, Point } from "../../../packages/moviemasher.js/src/Utility/Point"
import { PopulatedString } from "../../../packages/moviemasher.js/src/declarations"

enum GeneratePoint {
  TL = 'TL',
  BR = 'BR',
  TR = 'TR',
  BL = 'BL',
  M = 'M',
}
const GeneratePoints = Object.values(GeneratePoint)
export const isGeneratePoint = (value: any): value is GeneratePoint => {
  return isPopulatedString(value) && GeneratePoints.includes(value as GeneratePoint)
}

enum GenerateSize {
  H = 'H',
  F = 'F',
  D = 'D',
  Q = 'Q',
  Z = 'Z',
}
const GenerateSizes = Object.values(GenerateSize)
export const isGenerateSize = (value: any): value is GenerateSize => {
  return isPopulatedString(value) && GenerateSizes.includes(value as GenerateSize)
}

enum GenerateConstrain {
  C = 'C',
  U = 'U',
}
const GenerateConstrains = Object.values(GenerateConstrain)
export const isGenerateConstrain = (value: any): value is GenerateConstrain => {
  return isPopulatedString(value) && GenerateConstrains.includes(value as GenerateConstrain)
}
enum GenerateOpacity {
  H = '50',
  F = '100',
  Z = '0',
}
const GenerateOpacities = Object.values(GenerateOpacity)
export const isGenerateOpacity = (value: any): value is GenerateOpacity => {
  return isPopulatedString(value) && GenerateOpacities.includes(value as GenerateOpacity)
}

export enum GenerateArg {
  Content = 'content',
  Container = 'container',
  ContentSize = 'contentSize',
  ContentPoint = 'contentPoint',
  ContainerSize = 'containerSize',
  ContainerPoint = 'containerPoint',
  Opacity = 'opacity',
  Constrain = 'constrain',
}
const GenerateArgs = Object.values(GenerateArg)


export type GenerateOptions = { [index in GenerateArg]?: string | string[] }

export type GenerateContentTest = [string, string, ContentObject]
export type GenerateContainerTest = [string, string, ContainerObject]
export type PointTest = [string, ContainerObject]
export type GenerateMashTest = [string, MashObject]
export type SizeTest = [string, ContainerObject]
export type BooleanTest = [string, boolean]
export type NumberTest = [string, ContainerObject]
const textOptions = { 
  "string": "Valken",
  "intrinsicWidth": 33750,
  "intrinsicHeight": 10000,
  "intrinsicOffset": 130,
  "fontId": "font.valken"
}

type GenerateTest = GenerateContentTest | GenerateContainerTest | PointTest | SizeTest | NumberTest | BooleanTest
const isRenderTest = (value: any): value is GenerateTest => {
  return isPopulatedArray(value) && isString(value[0])
}
function assertRenderTest(value: any): asserts value is GenerateTest {
  if (!isRenderTest(value)) throwError(value, 'RenderTest')
}

type GenerateTests = { [index in GenerateArg]: GenerateTest[] }
type GenerateTestArgs = { [index in GenerateArg]: string }

interface GenerateTestObject {
  [GenerateArg.Content]: GenerateContentTest
  [GenerateArg.ContentPoint]: PointTest
  [GenerateArg.ContentSize]: SizeTest
  [GenerateArg.Container]: GenerateContainerTest
  [GenerateArg.ContainerPoint]: PointTest
  [GenerateArg.ContainerSize]: SizeTest
  [GenerateArg.Constrain]: BooleanTest
  [GenerateArg.Opacity]: NumberTest
}

const GenerateTweenDelimiter = '-'
export const GenerateIdDelimiter = '_'
export const GenerateDelimiter = 'in'

type GenerateTestId = PopulatedString 
export type GenerateTestIds = GenerateTestId[]

const MashPointsDefault = {
  [GeneratePoint.TL]: { x: 0, y: 0 },
  [GeneratePoint.TR]: { x: 1, y: 0 },
  [GeneratePoint.BR]: { x: 1, y: 1 },
  [GeneratePoint.BL]: { x: 0, y: 1 },
  [GeneratePoint.M]: { x: 0.5, y: 0.5 },
}
const MashSizesDefault = {
  [GenerateSize.Z]: { width: 0, height: 0 },
  [GenerateSize.F]: { width: 1, height: 1 },
  [GenerateSize.D]: { width: 2, height: 2 },
  [GenerateSize.Q]: { width: 0.25, height: 0.25},
  [GenerateSize.H]: { width: 0.5, height: 0.5 },
}

const MashOpacityDefault = {
  [GenerateOpacity.F]: { opacity: 1 },
  [GenerateOpacity.H]: { opacity: 0.5 },
  [GenerateOpacity.Z]: { opacity: 0.0 },
}

export const generateTestArgs = (id: string): GenerateTestArgs => {
  const delimiter = [GenerateIdDelimiter, GenerateDelimiter, GenerateIdDelimiter].join('')
  const [contentIds, containerIds] = id.split(delimiter)

  const [
    content, contentPoint = GeneratePoint.M, contentSize = GenerateSize.F
  ] = contentIds.split(GenerateIdDelimiter)
  const [
    container, constrain, containerPoint, containerSize, opacity
  ] = containerIds.split(GenerateIdDelimiter)
  return {
    content, contentPoint, contentSize, 
    container, constrain, containerPoint, containerSize, opacity
  }
}

const pointsContainerObject = (...points: Point[]): ContainerObject => {
  const [point, pointEnd] = points
  assertPoint(point)

  if (!isPoint(pointEnd)) return { ...point }

  return { ...point, xEnd: pointEnd.x, yEnd: pointEnd.y }
}

const pointTest = (...mashPoints: GeneratePoint[]): PointTest => {
  const points = mashPoints.map(mashPoint => MashPointsDefault[mashPoint])
  return [mashPoints.join(GenerateTweenDelimiter), pointsContainerObject(...points)]
}


const opacitiesContainerObject = (...opacities: ContainerObject[]): ContainerObject => {
  const [opacity, opacityEnd] = opacities
  assertContainerObject(opacity)

  if (!isContainerObject(opacityEnd)) return { ...opacity }

  return { ...opacity, opacityEnd: opacityEnd.opacity }
}

const opacityTest = (...mashOpacity: GenerateOpacity[]): PointTest => {
  const opacities = mashOpacity.map(mashPoint => MashOpacityDefault[mashPoint])
  return [mashOpacity.join(GenerateTweenDelimiter), opacitiesContainerObject(...opacities)]
}
const sizesContainerObject = (...sizes: Size[]): ContainerObject => {
  const [size, sizeEnd] = sizes
  assertSize(size)

  if (!isSize(sizeEnd)) return { ...size }

  return { ...size, widthEnd: sizeEnd.width, heightEnd: sizeEnd.height }
}

const sizeTest = (...mashSizes: GenerateSize[]): SizeTest => {
  const sizes = mashSizes.map(mashSize => MashSizesDefault[mashSize])
  return [mashSizes.join(GenerateTweenDelimiter), sizesContainerObject(...sizes)]
}

export const GenerateOptionsDefault: GenerateOptions = {
  container: "R", containerPoint: GeneratePoint.M, containerSize: GenerateSize.H,
  content: "BL", contentPoint: GeneratePoint.TL, contentSize: GenerateSize.F,
  constrain: GenerateConstrain.C, opacity: GenerateOpacity.F,
}

export const GenerateTestsDefault: GenerateTests = {
  [GenerateArg.Container]: [
    ["K", "kitten", {}],
    ["R", 'com.moviemasher.shapecontainer.default', {}],
    // ["S", 'com.moviemasher.shapecontainer.test', {}],
    // ["B", 'com.moviemasher.shapecontainer.broadcast', {}],
    ["S", 'com.moviemasher.shapecontainer.chat', {}],
    ["T", 'com.moviemasher.textcontainer.default', textOptions],
    // ["P", "puppy" , {}],
  ],
  [GenerateArg.Content]: [
    ["P", "puppy", {}],
    ["BL", "com.moviemasher.colorcontent.default", { color: colorBlue }],
    // ["BK", "com.moviemasher.colorcontent.default", { color: colorBlack }],
    // ["RE", "com.moviemasher.colorcontent.default", { color: colorRed }],
    // ["WH", "com.moviemasher.colorcontent.default", { color: colorWhite }],
    ["BL-RE", "com.moviemasher.colorcontent.default", { colorEnd: colorRed, color: colorBlue }],
    // ["K", "kitten", {}],
  ],
  [GenerateArg.ContainerPoint]: [
    pointTest(GeneratePoint.TL),
    pointTest(GeneratePoint.TL, GeneratePoint.BR),
    pointTest(GeneratePoint.BR, GeneratePoint.M),
    pointTest(GeneratePoint.M),
  ], 
  [GenerateArg.ContentPoint]: [
    pointTest(GeneratePoint.TL),
    pointTest(GeneratePoint.TL, GeneratePoint.BR),
    pointTest(GeneratePoint.BR, GeneratePoint.M),
    pointTest(GeneratePoint.M),
  ],
  [GenerateArg.ContainerSize]: [
    sizeTest(GenerateSize.Q),
    sizeTest(GenerateSize.Q, GenerateSize.F),
    sizeTest(GenerateSize.F, GenerateSize.H),
    sizeTest(GenerateSize.H),
  ],
  [GenerateArg.ContentSize]: [
    sizeTest(GenerateSize.F),
    sizeTest(GenerateSize.F, GenerateSize.D),
    sizeTest(GenerateSize.D, GenerateSize.F),
  ],
  [GenerateArg.Opacity]: [
    opacityTest(GenerateOpacity.F),
    opacityTest(GenerateOpacity.F, GenerateOpacity.Z),
    opacityTest(GenerateOpacity.H),
  ],
  [GenerateArg.Constrain]: [[GenerateConstrain.C, true], [GenerateConstrain.U, false]],
}

export const generateArgsTween = (renderTestOption: GenerateArg): string[] => {
  const tests = GenerateTestsDefault[renderTestOption]
  const tweenTests = tests.filter(test => test[0].includes(GenerateTweenDelimiter))
  
  return tweenTests.map(test => test[0])
}

export const GenerateDefinitionObjects: DefinitionObjects = [
  {
    "id": "puppy",
    "type": "image",
    "source": "../shared/image/puppy/image.jpg",
    "width": 3024, "height": 4032
  },
  {
    "id": "kitten",
    "type": "image",
    "source": "../shared/image/kitten/image.jpg",
    "width": 4592, "height": 3056
  },
  {
    "id": "font.valken",
    "type": "font",
    "label": "Valken",
    "url": "../shared/font/valken/valken.woff2",
    "source": "../shared/font/valken/valken.ttf"
  },
  {
    "type": "video",
    "label": "Video", "id": "video-rgb",
    "url": "../shared/video/rgb.mp4",
    "source": "../shared/video/rgb.mp4",
    "duration": 3, "fps": 10
  }
]

export const generateIds = (generateOptions: GenerateOptions = {}): GenerateTestIds => {
  const limitedOptions = (option: GenerateArg, ids?: string | string[]) => {
    const renderTests = GenerateTestsDefault[option]
    const idsOrNot = ids || generateOptions[option] 
    const idArray = isPopulatedString(idsOrNot) ? [idsOrNot] : idsOrNot
    if (!isPopulatedArray(idArray)) return renderTests

    return renderTests.filter(renderTest => idArray.includes(String(renderTest[0])))
  }
  const mashIds: GenerateTestIds = []
  const limitedContents = limitedOptions(GenerateArg.Content) as GenerateContentTest[]
  assertPopulatedArray(limitedContents, 'limitedContents')
  limitedContents.forEach(([contentLabel, contentId]) => {
    const isColor = contentId === "com.moviemasher.colorcontent.default"
    const limitedContainers = limitedOptions(GenerateArg.Container) as GenerateContainerTest[]
    assertPopulatedArray(limitedContainers, 'limitedContainers')
    limitedContainers.forEach(([containerLabel]) => {
      const limitedContainerPoints = limitedOptions(GenerateArg.ContainerPoint) as PointTest[]
      const point = isColor ? GeneratePoint.M : undefined
      const limitedContentPoints = limitedOptions(GenerateArg.ContentPoint, point) as PointTest[]
      assertPopulatedArray(limitedContentPoints, 'limitedContentPoints')
      limitedContentPoints.forEach(([contentPointName]) => {
        const size = isColor ? GenerateSize.F : undefined
        const limitedContentSizes = limitedOptions(GenerateArg.ContentSize, size) as SizeTest[]
        assertPopulatedArray(limitedContentSizes, 'limitedContentSizes')
        limitedContentSizes.forEach(([contentDimensionName]) => {
          const limitedOpacities = limitedOptions(GenerateArg.Opacity) as NumberTest[]
          assertPopulatedArray(limitedOpacities, 'limitedOpacities')
          limitedOpacities.forEach(([opacityLabel]) => {
            const limitedContainerSizes = limitedOptions(GenerateArg.ContainerSize) as SizeTest[]
            assertPopulatedArray(limitedContainerSizes, 'limitedContainerSizes')
            limitedContainerSizes.forEach(([containerDimensionName]) => {
              assertPopulatedArray(limitedContainerPoints, 'limitedContainerPoints')
              limitedContainerPoints.forEach(([containerPointName]) => {
                const containerCentered = containerPointName === GeneratePoint.M
                const constrain = containerCentered ? GenerateConstrain.U : undefined
                const limitedConstrains = limitedOptions(GenerateArg.Constrain, constrain) as BooleanTest[]
                limitedConstrains.forEach(([constrainedLabel]) => {
                  const names = [contentLabel]
                  if (!isColor) names.push(contentPointName, contentDimensionName)
                  names.push(GenerateDelimiter, containerLabel)
                  names.push(constrainedLabel, containerPointName, containerDimensionName, opacityLabel)
                  const testId = names.join(GenerateIdDelimiter)
                  assertPopulatedString(testId)
                  mashIds.push(testId)
                })
              })
            })
          })
        })
      })
    })
  })
  return mashIds
}

export const generateTests = (generateOptions: GenerateOptions, testId = 'all', size = DimensionsPreview, frames = 10): GenerateMashTest => {
  const ids = generateIds(generateOptions)
  const clips: VisibleClipObject[] = []
  const labelClips: VisibleClipObject[] = []
  ids.forEach(id => {
    const [clip, labelClip] = generateClips(id, size, frames)
    clips.push(clip)
    labelClips.push(labelClip)
  })
  const mash: MashObject = { 
    id: testId, backcolor: colorGreen,
    tracks: [ 
      { clips }, { clips: labelClips, dense: true },
    ] 
  }
  return [testId, mash]
}

export const generateTest = (testId: GenerateTestId, size = DimensionsPreview, frames = 10): GenerateMashTest => {
  const [clip, labelClip] = generateClips(testId, size, frames)
  const mash: MashObject = { 
    id: testId, backcolor: colorGreen,
    tracks: [ 
      { clips: [clip] }, { clips: [labelClip], dense: true },
    ] 
  }
  return [testId, mash]
}

type VisibleClipObjectTuple = [VisibleClipObject, VisibleClipObject]
const generateClips = (testId: GenerateTestId, size = DimensionsPreview, frames = 10): VisibleClipObjectTuple => {
  const generateOptions = generateTestArgs(testId)
  const renderTestObject = Object.fromEntries(GenerateArgs.map(renderTestOption => {
    const option = generateOptions[renderTestOption]
    assertPopulatedString(option)
    const renderTests = GenerateTestsDefault[renderTestOption]
    const renderTest = renderTests.find(test => test[0] === option)
    assertRenderTest(renderTest)
    return [renderTestOption, renderTest]
  })) as unknown as GenerateTestObject
  
  const {
    content: [contentLabel, contentId, contentObject], 
    contentPoint: [contentPointName, contentPoint],
    contentSize: [contentDimensionName, contentDimensions],
    container: [containerLabel, containerId, containerObject],
    containerPoint: [containerPointName, containerPoint],
    containerSize: [containerDimensionName, containerDimensions],
    constrain: [constrainedLabel, constrained],
    opacity: [opacityLabel, opacity],

  } = renderTestObject

  const { width, height } = size
  const textHeight = 0.1
  const debug: TextContainerObject = {
    fontId: 'font.valken', height: textHeight, 
    constrainX: true, constrainY: true,
    x: 0, y: 0.5,
    intrinsicWidth: width / textHeight, intrinsicHeight: height,
  }
  const debugClip: VisibleClipObject = {
    containerId: 'com.moviemasher.textcontainer.default',
    content: { color: colorBlack },
    frames,
    definitionId: visibleClipDefault.id,
  }
  assertPoint(containerPoint)
  assertPoint(contentPoint)

  const clip: VisibleClipObject = { 
    frames, containerId, contentId, 
    definitionId: visibleClipDefault.id,
    content: {
      ...contentPoint, ...contentDimensions, ...contentObject,
    },
    container: {
      ...containerPoint, ...containerDimensions, 
      ...containerObject, ...opacity, 
      constrainX: constrained, constrainY: constrained,
    }
  }  
  const labelClip: VisibleClipObject = { 
    ...debugClip, container: { ...debug, string: testId }
  }
  return [clip, labelClip] 
}