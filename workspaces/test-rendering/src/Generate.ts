
import { 
  PopulatedString,
  colorBlack, colorBlue, colorGreen, colorRed,
  assertPopulatedArray, assertPopulatedString, isPopulatedArray, isPopulatedString, isString,
  assertSize, SizePreview, isSize, Size, TextContainerObject,
  ContentObject ,
  assertContainerObject, ContainerObject, isContainerObject,
  DefinitionObjects,
  assertPoint, isPoint, Point, 
  throwError,
  Directions,
  ClipObject, clipDefault, MashObject, Tracks, TrackObject, Duration
} from '@moviemasher/moviemasher.js/umd/moviemasher.js'

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
export const GenerateArgs = Object.values(GenerateArg)


export type GenerateOptions = { [index in GenerateArg]?: string | string[] }

export type GenerateContentTest = [string, string, ContentObject]
export type GenerateContainerTest = [string, string, ContainerObject]
export type PointTest = [string, ContainerObject]
export type GenerateMashTest = [string, MashObject]
export type SizeTest = [string, ContainerObject]
export type BooleanTest = [string, ContainerObject]
export type NumberTest = [string, ContainerObject]
const textOptions: TextContainerObject = { 
  string: "Luckiest Guy",
  intrinsic: { width: 6167.01953125, height: 738, x: 0, y: 723 },
  fontId: "com.moviemasher.font.luckiest-guy"
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

const generateClips = (testId: GenerateTestId, size = SizePreview, frames = Duration.Unknown, labels = false): ClipObject[] => {
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
    intrinsic: { x: 0, y: 0, width: width, height: 1000 / textHeight },
    // { width: width / textHeight, height: 500, x: 0, y: 400 }, // 738
    fontId: "com.moviemasher.font.luckiest-guy",
    // height: textHeight, 
    x: 0, y: 0.5, 
    lock: 'V',
    width: 1,
  }
  const debugClip: ClipObject = {
    containerId: 'com.moviemasher.container.text',
    content: { color: colorBlack },
    sizing: 'preview',
    timing: 'custom',
    frames,
    definitionId: clipDefault.id,
  }
  assertPoint(containerPoint)
  assertPoint(contentPoint)

  const clip: ClipObject = { 
    frames, containerId, contentId, 
    definitionId: clipDefault.id,
    content: {
      ...contentPoint, ...contentDimensions, ...contentObject,
      lock: ''
    },
    sizing: 'container',
    container: {
      ...containerPoint, ...containerDimensions, 
      ...containerObject, ...opacity, 
      ...constrained,
    }
  }  
  const objects = [clip]
  if (labels) {
    const labelClip: ClipObject = { 
      ...debugClip, container: { ...debug, string: testId }
    }  
    objects.push(labelClip)
  }
  
  return objects
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

export const GenerateOptionsDefault: GenerateOptions = {
  container: "R", containerPoint: GeneratePoint.M, containerSize: GenerateSize.F,
  content: "BL", contentPoint: GeneratePoint.TL, contentSize: GenerateSize.F,
  constrain: GenerateConstrain.C, opacity: GenerateOpacity.F,
}

export const GenerateTestsDefault: GenerateTests = {
  [GenerateArg.Container]: [
    ["R", 'com.moviemasher.container.default', {}],
    ["K", "kitten", {}],
    // ["S", 'com.moviemasher.container.test', {}],
    // ["B", 'com.moviemasher.container.broadcast', {}],
    ["S", 'com.remixicon.container.heart', {}],
    ["T", 'com.moviemasher.container.text', textOptions],
    // ["P", "puppy" , {}],
  ],
  [GenerateArg.Content]: [
    ["BL", "com.moviemasher.content.default", { color: colorBlue }],
    ["P", "puppy", {}],
    ["RGB", "rgb", {}],
    ["V", "video", {}],
    // ["BK", "com.moviemasher.content.default", { color: colorBlack }],
    // ["RE", "com.moviemasher.content.default", { color: colorRed }],
    // ["WH", "com.moviemasher.content.default", { color: colorWhite }],
    ["BL-RE", "com.moviemasher.content.default", { colorEnd: colorRed, color: colorBlue }],
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
    sizeTest(GenerateSize.F),
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
  [GenerateArg.Constrain]: [
    [GenerateConstrain.C, {}], 
    [GenerateConstrain.U, Object.fromEntries(Directions.map(direction => [`off${direction}`, true]))]
  ],
}

export const generateArgsDynamic = (renderTestOption: GenerateArg): string[] => {
  const tests = GenerateTestsDefault[renderTestOption]
  const tweenTests = tests.filter(test => test[0].includes(GenerateTweenDelimiter))
  return tweenTests.map(test => test[0])
}

export const generateArgsStatic = (renderTestOption: GenerateArg): string[] => {
  const tests = GenerateTestsDefault[renderTestOption]
  const tweenTests = tests.filter(test => !test[0].includes(GenerateTweenDelimiter))
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
    "id": "rgb",
    "type": "video",
    "source": "../shared/video/rgb.mp4",
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
    "label": "Video", "id": "video",
    "url": "../shared/video/dance.mp4",
    "source": "../shared/video/dance.mp4"
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
    const isColor = contentId === "com.moviemasher.content.default"
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

export const generateTests = (generateOptions: GenerateOptions, testId = 'all', size = SizePreview, frames = 10, labels = false): GenerateMashTest => {
  const ids = generateIds(generateOptions)
  const clips: ClipObject[] = []
  const labelClips: ClipObject[] = []
  ids.forEach(id => {
    const [clip, labelClip] = generateClips(id, size, frames, labels)
    clips.push(clip)
    if (labelClip) labelClips.push(labelClip)
  })
  const tracks: TrackObject[] = [{ clips }]
  if (labels) tracks.push({ clips: labelClips, dense: true })
  const mash: MashObject = { 
    id: testId, color: '#666666', tracks 
  }
  return [testId, mash]
}

export const generateTest = (testId: GenerateTestId, size = SizePreview, frames = Duration.Unknown, labels = false): GenerateMashTest => {
  const [clip, labelClip] = generateClips(testId, size, frames, labels)
  const tracks: TrackObject[] = [{ clips: [clip] }]
  if (labelClip) tracks.push({ clips: [labelClip], dense: true })
  const mash: MashObject = { 
    id: testId, color: '#666666', tracks 
  }
  return [testId, mash]
}
