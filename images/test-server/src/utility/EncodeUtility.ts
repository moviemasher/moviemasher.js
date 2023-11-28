import type { AssetObjects, ClipObject, ColorInstanceObject, DecodeOptions, Decoding, ImageAssetObject, InstanceObject, MashAssetObject, OutputOptions, Point, ShapeAssetObject, Size, StringDataOrError, TextAssetObject, TextInstanceObject, TrackObject, VideoAssetObject, VideoOutputOptions } from '@moviemasher/runtime-shared'

import { ENV_KEY, ENV, commandPromise, directoryCreatePromise, ffmpegCommand, fileMovePromise, filePathExists, fileReadPromise, fileRemovePromise, fileWritePromise, filenameAppend, fileNameFromOptions } from '@moviemasher/lib-server'
import { assertDefined, assertPoint, assertPopulatedArray, assertPopulatedString, assertSize, isPoint, isPopulatedArray, isSize, sizeScale, stringSeconds } from '@moviemasher/lib-shared'
import { EventServerDecode, EventServerEncode, MOVIEMASHER_SERVER, ServerMediaRequest } from '@moviemasher/runtime-server'
import { CONTAINER, CUSTOM, DASH, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DIRECTIONS_SIDE, DOT, DURATION, DURATION_UNKNOWN, ERROR, IMAGE, JSON, LONGEST, MASH, NONE, PROBE, RGB_BLACK, SIZE_OUTPUT, TXT, VIDEO, WIDTH, arrayUnique, errorThrow, idReset, isArray, isDefiniteError, isPopulatedString, isString, namedError, typeOutputOptions } from '@moviemasher/runtime-shared'
import path from 'path'

const colorRed = '#FF0000'
const colorBlue = '#0000FF'

const ErrorSnapshot = 'error.snapshot'
export const SizePreview = sizeScale(SIZE_OUTPUT, 0.25, 0.25)
const options: VideoOutputOptions = { ...SizePreview }//, mute: true
export const VideoOptions = typeOutputOptions(VIDEO, options) 

export const TestDirTemporary = ENV.get(ENV_KEY.OutputRoot)
const TestDirSnapshots = path.resolve(ENV.get(ENV_KEY.DirRoot), 'images/test-server/snapshots')

const SnapshotFailsBecauseTooDynamic = [
  'P_M_F_in_T_U_M_F-H_50',
  'BL_in_T_C_BR-M_F-H_100',
  'BL_in_T_C_BR-M_F-H_100-0',
  'BL_in_T_U_BR-M_F-H_100',
  'BL_in_T_U_BR-M_F-H_100-0',
  'BL_in_T_U_M_F-H_100',
  'BL_in_T_U_M_F-H_100-0',
  'BL-RE_in_T_C_BR-M_F-H_100', 
  'BL-RE_in_T_C_BR-M_F-H_100-0',
  'BL-RE_in_T_U_BR-M_F-H_100',
  'BL-RE_in_T_U_BR-M_F-H_100-0',
  'BL-RE_in_T_U_M_F-H_100',
  'BL-RE_in_T_U_M_F-H_100-0',
]
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
  CROP = 'constrain',
}
export const GenerateArgs = Object.values(GenerateArg)

export type GenerateOptions = { [index in GenerateArg]?: string | string[] }
export type GenerateContentTest = [string, string, InstanceObject]
export type GenerateContainerTest = [string, string, InstanceObject, string | undefined]
export type PointTest = [string, InstanceObject]

export type SizeTest = [string, InstanceObject]
export type BooleanTest = [string, InstanceObject]
export type NumberTest = [string, InstanceObject]

const textOptions: TextInstanceObject = { 
  string: "Lobster Wow!",
  assetId: "text",
  lock: LONGEST,
} as const

type GenerateTest = GenerateContentTest | GenerateContainerTest | PointTest | SizeTest | NumberTest | BooleanTest
const isRenderTest = (value: any): value is GenerateTest => {
  return isPopulatedArray(value) && isString(value[0])
}
function assertRenderTest(value: any): asserts value is GenerateTest {
  if (!isRenderTest(value)) errorThrow(value, 'RenderTest')
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
  [GenerateArg.CROP]: BooleanTest
  [GenerateArg.Opacity]: NumberTest
}

export const GenerateIdDelimiter = '_'
export const GenerateDelimiter = 'in'

type GenerateTestId = string 
export interface GenerateTestIds extends Array<GenerateTestId>{}


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

const generateClips = (testId: GenerateTestId, size = SizePreview, frames = DURATION_UNKNOWN, labels = false): ClipObject[] => {
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

  const content: ColorInstanceObject = { color: RGB_BLACK }

  assertPoint(containerPoint)
  assertPoint(contentPoint)

  const clip: ClipObject = { 
    frames, containerId, contentId, 
    content: {
      ...contentPoint, ...contentDimensions, ...contentObject,
      lock: NONE
    },
    sizing: CONTAINER,
    timing: CUSTOM,
    container: {
      ...containerPoint, ...containerDimensions, 
      ...containerObject, ...opacity, 
      ...constrained,
    }
  }  
  const objects = [clip]
  if (labels) {
    const labelClip: ClipObject = { 
      container: { 
        // intrinsic: { x: 0, y: 0, width: width, height: TEXT_HEIGHT / textHeight },
        // { width: width / textHeight, height: 500, x: 0, y: 400 }, // 738
        assetId: "font.valken",
        // height: textHeight, 
        x: 0, y: 0.5, 
        lock: WIDTH,
        width: 1, 
        string: testId 
      } as TextInstanceObject,
      containerId: 'font.valken',
      content,
      sizing: CONTAINER,
      timing: CUSTOM,
      frames
    }  
    objects.push(labelClip)
  }
  
  return objects
}

const pointsContainerObject = (...points: Point[]): InstanceObject => {
  const [point, pointEnd] = points
  assertPoint(point)

  if (!isPoint(pointEnd)) return { ...point }

  return { ...point, xEnd: pointEnd.x, yEnd: pointEnd.y }
}

const pointTest = (...mashPoints: GeneratePoint[]): PointTest => {
  const points = mashPoints.map(mashPoint => MashPointsDefault[mashPoint])
  return [mashPoints.join(DASH), pointsContainerObject(...points)]
}

const opacitiesContainerObject = (...opacities: InstanceObject[]): InstanceObject => {
  const [opacity, opacityEnd] = opacities
  if (!opacityEnd) return { ...opacity }

  return { ...opacity, opacityEnd: opacityEnd.opacity }
}

const opacityTest = (...mashOpacity: GenerateOpacity[]): PointTest => {
  const opacities = mashOpacity.map(mashPoint => MashOpacityDefault[mashPoint])
  return [mashOpacity.join(DASH), opacitiesContainerObject(...opacities)]
}
const sizesContainerObject = (...sizes: Size[]): InstanceObject => {
  const [size, sizeEnd] = sizes
  assertSize(size)

  if (!isSize(sizeEnd)) return { ...size }

  return { ...size, widthEnd: sizeEnd.width, heightEnd: sizeEnd.height }
}

const sizeTest = (...mashSizes: GenerateSize[]): SizeTest => {
  const sizes = mashSizes.map(mashSize => MashSizesDefault[mashSize])
  return [mashSizes.join(DASH), sizesContainerObject(...sizes)]
}

const generateTestArgs = (id: string): GenerateTestArgs => {
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
const { assetId: textAssetId } = textOptions
assertPopulatedString(textAssetId)

export const GenerateTestsDefault: GenerateTests = {

  [GenerateArg.Container]: [
    ["R", DEFAULT_CONTAINER_ID, {}, 'rect'],
    ["K", "image", {}],
    ["A", "text-rect", {lock: LONGEST,}],
    // ["S", 'com.moviemasher.container.test', {}],
    // ["B", 'com.moviemasher.container.broadcast', {}],
    ["S", 'shape', {}],
    ["T", textAssetId, textOptions],
    // ["P", "puppy" , {}],
  ],
  [GenerateArg.Content]: [
    ["BL", DEFAULT_CONTENT_ID, { color: colorBlue } as InstanceObject],
    ["P", "puppy", {}],
    ["RGB", "rgb", {}],
    ["V", "video", {}],
    // ["BK", DEFAULT_CONTENT_ID, { color: RGB_BLACK }],
    // ["RE", DEFAULT_CONTENT_ID, { color: colorRed }],
    // ["WH", DEFAULT_CONTENT_ID, { color: RGB_WHITE }],
    ["BL-RE", DEFAULT_CONTENT_ID, { colorEnd: colorRed, color: colorBlue } as InstanceObject],
    // ["K", "image", {}],
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
    opacityTest(GenerateOpacity.H),
    opacityTest(GenerateOpacity.F, GenerateOpacity.Z),
    opacityTest(GenerateOpacity.F),
  ],
  [GenerateArg.CROP]: [
    [GenerateConstrain.U, {}], 
    [GenerateConstrain.C, Object.fromEntries(DIRECTIONS_SIDE.map(direction => [`${direction}CROP`, true]))]
  ],
}

export const generateArgsDynamic = (renderTestOption: GenerateArg): string[] => {
  const tests = GenerateTestsDefault[renderTestOption]
  
  const tweenTests = tests.filter(test => test[0].includes(DASH))
  return tweenTests.map(test => test[0])
}

export const GenerateAssetObjects: AssetObjects = [
  {
    id: "puppy",
    source: 'raw',
    type: "image",
    request: { endpoint: { pathname: "/app/dev/shared/image/puppy/image.jpg" } },
    decodings: [{ id: '', type: PROBE, data: {width: 3024, height: 4032} }]
  } as ImageAssetObject,
  {
    id: "rgb",
    source: 'raw',
    type: "video",
    request: { endpoint: { pathname: "/app/dev/shared/video/rgb.mp4" } },
    decodings: [{ id: '', type: PROBE, data: { width: 512, height: 288, audible: true, duration: 3 } }]
  } as VideoAssetObject,
  {
    id: "image",
    source: 'raw',
    type: "image",
    request: { endpoint: { pathname: "/app/dev/shared/image/kitten/image.jpg" } },
    decodings: [{ id: '', type: PROBE, data: { width: 4592, height: 3056 } } as Decoding]
  } as ImageAssetObject,
  {
    id: "text",
    source: 'text',
    type: IMAGE,
    label: "Lobster",
    request: { endpoint: "/app/dev/shared/font/lobster/lobster.ttf" },
    // transcodings: [
    //   { type: FONT, request: { endpoint: { pathname: "/app/dev/shared/font/lobster/lobster.woff2" } }}
    // ]
  } as TextAssetObject,
  {
    id: "font.valken",
    source: 'text',
    type: IMAGE,
    label: "Valken",
    request: { endpoint: "/app/dev/shared/font/valken/valken.ttf" },
    // transcodings: [
    //   { type: FONT, request: { endpoint: { pathname: "/app/dev/shared/font/valken/valken.woff2" } }}
    // ]
  } as TextAssetObject,
  // same size as text ^
  { 
    "label": "Text Rect",
    "type": "image",
    "source": "shape",
    "id": "text-rect",
    "pathWidth": 5248,
    "pathHeight": 992,
    "path": "M0 0 L5168 0 L5168 992 L0 992 Z"
  } as ShapeAssetObject,
  {
    type: "video",
    source: 'raw',
    label: "Video", 
    id: "video",
    request: { endpoint: { pathname: "/app/dev/shared/video/dance.mp4" } },
  } as VideoAssetObject,
  {
    "label": "Movie Masher Logo",
    "type": "image",
    "source": "shape",
    "id": "shape",
    "pathWidth": 44,
    "pathHeight": 24,
    "path": "M 9.16 2.00 C 8.62 2.00 8.13 2.18 7.73 2.57 L 7.73 2.57 L 1.19 8.91 C 0.77 9.34 0.55 9.82 0.53 10.39 L 0.53 10.39 C 0.53 10.91 0.72 11.37 1.13 11.76 L 1.13 11.76 C 1.56 12.15 2.05 12.31 2.60 12.28 L 2.60 12.28 C 3.17 12.31 3.64 12.13 4.03 11.70 L 4.03 11.70 L 9.16 6.90 L 13.67 11.28 C 14.33 11.87 14.67 12.20 14.73 12.24 L 14.73 12.24 C 15.12 12.63 15.60 12.81 16.14 12.81 L 16.14 12.81 C 16.69 12.85 17.20 12.66 17.63 12.28 L 17.63 12.28 C 17.67 12.26 18.01 11.93 18.63 11.28 L 18.63 11.28 C 19.29 10.65 20.07 9.93 20.93 9.12 L 20.93 9.12 C 21.82 8.23 22.57 7.51 23.20 6.90 L 23.20 6.90 L 31.34 14.86 C 31.74 15.25 32.21 15.47 32.72 15.51 L 32.72 15.51 L 38.29 15.51 L 38.23 19.10 L 44.00 13.55 L 38.29 7.90 L 38.29 11.54 L 33.65 11.48 L 24.63 2.63 C 24.22 2.28 23.74 2.09 23.20 2.09 L 23.20 2.09 C 22.65 2.07 22.16 2.24 21.71 2.63 L 21.71 2.63 L 16.20 8.01 L 11.64 3.63 C 10.98 2.96 10.64 2.61 10.60 2.57 L 10.60 2.57 C 10.18 2.18 9.75 2.00 9.28 2.00 L 9.28 2.00 C 9.24 2.00 9.20 2.00 9.16 2.00 M 7.70 11.61 L 2.58 16.53 L 0.00 14.05 L 0.00 21.91 L 8.15 21.91 L 5.49 19.38 C 5.53 19.38 5.56 19.36 5.60 19.32 L 5.60 19.32 L 9.19 15.88 L 14.75 21.28 C 15.14 21.67 15.62 21.85 16.16 21.85 L 16.16 21.85 C 16.73 21.89 17.22 21.72 17.65 21.33 L 17.65 21.33 L 23.16 15.88 L 28.78 21.43 C 29.18 21.78 29.67 21.96 30.21 21.96 L 30.21 21.96 L 34.34 22.00 C 34.93 21.98 35.42 21.78 35.83 21.43 L 35.83 21.43 C 36.23 21.04 36.44 20.56 36.44 19.95 L 36.44 19.95 C 36.44 19.39 36.23 18.91 35.83 18.53 L 35.83 18.53 C 35.46 18.17 34.99 18.01 34.40 18.01 L 34.40 18.01 L 31.10 17.95 L 24.65 11.67 C 24.25 11.32 23.76 11.13 23.22 11.13 L 23.22 11.13 C 22.67 11.11 22.18 11.28 21.75 11.67 L 21.75 11.67 L 16.16 16.99 L 10.56 11.61 C 10.15 11.22 9.69 11.04 9.19 11.04 L 9.19 11.04 C 8.64 11.04 8.15 11.22 7.70 11.61"
  },
  {
    "label": "Heart: Remix Icons",
    "type": "image",
    "source": "shape",
    "id": "com.remixicon.image.heart",
    "pathWidth": 24,
    "pathHeight": 24,
    "path": "M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"
  } as ShapeAssetObject,
  { 
    "label": "Butcherman",
    "id": "com.moviemasher.font.butcherman",
    "type": "image",
    "source": "text",
    "request": { 
      "endpoint": { 
        "protocol": "https:",
        "hostname": "fonts.googleapis.com", 
        "pathname": "/css2", 
        "search": "?family=Butcherman" 
      }
    }
  } as TextAssetObject
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
    const isColor = contentId === DEFAULT_CONTENT_ID
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
                const limitedConstrains = limitedOptions(GenerateArg.CROP, constrain) as BooleanTest[]
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

export const generateTest = (testId: GenerateTestId, size = SizePreview, frames = DURATION_UNKNOWN, labels = false): MashAssetObject => {
  const [clip, labelClip] = generateClips(testId, size, frames, labels)
  const tracks: TrackObject[] = [{ clips: [clip] }]
  if (labelClip) tracks.push({ clips: [labelClip], dense: true })

  
  const mash: MashAssetObject = { 
    type: VIDEO,
    source: MASH,
    id: testId, color: '#666666', tracks,
    assets: GenerateAssetObjects,
  }
  return mash
}

export const mashObjectFromId = (id: string, duration = DURATION_UNKNOWN, labels = false): MashAssetObject => {
  const mashObject = generateTest(id, SizePreview, duration, labels)
  const { tracks } = mashObject
  assertPopulatedArray(tracks)
  const { clips } = tracks[0]
  assertPopulatedArray(clips)  
  
  const fatMashObject = { ...mashObject, assets: GenerateAssetObjects }
  return fatMashObject
}

const checkSnapshot = async (id: string, outputPath: string): Promise<StringDataOrError> => {
  const snapshotPath = path.join(TestDirSnapshots, [id, TXT].join(DOT))
  const fileOrError = await fileReadPromise(snapshotPath)
  const existingSnapshot = isDefiniteError(fileOrError) ? '' : fileOrError.data
  const command = ffmpegCommand() 
  command.input(outputPath)
  command.addOption('-f', 'hash')
  command.output(snapshotPath)
  const ffmepgOrError = await commandPromise(command)
  if (isDefiniteError(ffmepgOrError)) return ffmepgOrError

  const writtenOrError = await fileReadPromise(snapshotPath)
  const newSnapshot = isDefiniteError(writtenOrError) ? '' : writtenOrError.data
  if (!existingSnapshot || existingSnapshot === newSnapshot) return { data: 'OK' }

  await fileWritePromise(path.join(TestDirSnapshots, [id, 'prev', TXT].join(DOT)), existingSnapshot)
  // return { data: 'OK' }
 return namedError(ErrorSnapshot, `${id} ${snapshotPath} ${outputPath}`)
}

export const encodeId = async (id: string, outputOptions: OutputOptions, duration = DURATION_UNKNOWN, labels = false) => {
  const fatMashObject = mashObjectFromId(id, duration, labels)
  const fileName = fileNameFromOptions(outputOptions, VIDEO)
  const outputPath = path.join(TestDirTemporary, 'shared', id, fileName) 
  const previousPath = filenameAppend(outputPath, 'prev')
  const encodedPreviously = filePathExists(outputPath)
  if (encodedPreviously) {
    if (filePathExists(previousPath)) await fileRemovePromise(previousPath)
    await fileMovePromise(outputPath, filenameAppend(outputPath, 'prev'))
  }
  const event = new EventServerEncode(VIDEO, fatMashObject, 'shared', id, outputOptions)
  MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
  const { promise } = event.detail
  assertDefined(promise)
  const orError = await promise
  if (isDefiniteError(orError)) return orError

  const snapshotOrError = await checkSnapshot(id, outputPath)
  if (isDefiniteError(snapshotOrError)) {
    if (!SnapshotFailsBecauseTooDynamic.includes(id)) return snapshotOrError
  } else if (encodedPreviously) await fileRemovePromise(previousPath)
  return { data: 'OK' }
}

export const encodeIds = async (ids: GenerateTestIds, force = false) => {
  // const TestTemporary = ENV.get(ENV_KEY.OutputRoot) 
  // const renderIds = force ? ids : ids.filter(id => { 
  //   const idPath = path.join(TestTemporary, id, `video.${ExtensionLoadedInfo}`)
  //   return !filePathExists(idPath)
  // })
  for (const id of ids) {
    idReset()
    const result = await encodeId(id, VideoOptions, 10)
    if (isDefiniteError(result)) return result
  }
  return { data: 'OK' }
}

export const combineIds = async (ids: GenerateTestIds, id:string, force = false): Promise<StringDataOrError> => {
  // console.log('renderAndCombine', name, orError)
  const fileName = fileNameFromOptions(VideoOptions, VIDEO)
  const sources: string[] = ids.map(id => {
    return path.resolve(TestDirTemporary, id, fileName)
  })
  if (!sources.length) return namedError(ERROR.Ffmpeg, 'no ids')
  const hasVideo = true
  const hasAudio = false
  const destination = path.resolve(TestDirTemporary, id, fileName)
  const destinationDirectory = path.dirname(destination)
  const dirOrError = await directoryCreatePromise(destinationDirectory)
  // console.log('renderingTestIdsPromise directoryCreatePromise', orError)
  if (isDefiniteError(dirOrError)) return dirOrError

  const maxSeconds = 60 * 60 * 1000
  const srtString = ids.map((id, index) => {
    const start = index
    const end = start + 1
    return [
      `${index + 1}`,
      `${stringSeconds(start, 1000, maxSeconds, ',')} --> ${stringSeconds(end, 1000, maxSeconds, ',')}`,
      id,
    ].join('\n')
  }).join('\n\n')

  const srtPath = path.join(destinationDirectory, 'ids.srt')
  const srtOrError = await fileWritePromise(srtPath, srtString)
  if (isDefiniteError(srtOrError)) return srtOrError

  const command = ffmpegCommand()
  sources.forEach(source => command.input(source))
  command.output(destination)
  command.complexFilter([
    {
      inputs: sources.map((_, index) => `[${index}:v]`),
      filter: 'concat',
      options: {
        n: sources.length, v: hasVideo ? 1 : 0, a: hasAudio ? 1 : 0
      },
      outputs: ['concat-0'],
    },
    {
      inputs: ['concat-0'],
      filter: 'subtitles',
      options: { filename: srtPath, wrap_unicode: 0, force_style: "'Fontsize=24'" }
    },
  ])

  const ffmepgOrError = await commandPromise(command)

  if (isDefiniteError(ffmepgOrError)) return ffmepgOrError
  const infoPath = path.join(destinationDirectory, `${PROBE}.${JSON}`)
  // const decodingId = idGenerate('decoding')
  const request: ServerMediaRequest = { endpoint: destination, path: destination }
  const decodeOptions: DecodeOptions = { types: [DURATION] }
  const event = new EventServerDecode(PROBE, VIDEO, request, 'shared', id, decodeOptions)
  MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
  const { promise } = event.detail
  assertDefined(promise)

  const decodeOrError = await promise
  if (isDefiniteError(decodeOrError)) return decodeOrError

  return { data: destination }
}

export const encodeAndCombine = async (name: string, options?: GenerateOptions | GenerateTestIds, force = false) => {
  const ids = (isArray(options) ? options : generateIds(options))//.slice(0, 2)
  const orError = await encodeIds(ids, force)
  if (isDefiniteError(orError)) return orError

  const combineOrError = await combineIds(ids, name, force)
  return combineOrError

}

const generateArgsStatic = (renderTestOption: GenerateArg): string[] => {
  const tests = GenerateTestsDefault[renderTestOption]
  const tweenTests = tests.filter(test => !test[0].includes(DASH))
  return tweenTests.map(test => test[0])
}

export const staticGenerateOptions: GenerateOptions = { 
  // ...GenerateOptionsDefault, 
  // container: "T", content: '', 
  containerPoint: generateArgsStatic(GenerateArg.ContainerPoint).pop(),
  containerSize: generateArgsStatic(GenerateArg.ContainerSize).pop(),
  contentSize: generateArgsStatic(GenerateArg.ContentSize).pop(),
  contentPoint: generateArgsStatic(GenerateArg.ContentPoint).pop(),
  opacity: generateArgsStatic(GenerateArg.Opacity).pop(),
}
export const dynamicGenerateOptions: GenerateOptions = { 
  // ...GenerateOptionsDefault, 
  // container: "T", content: '', 
  containerPoint: generateArgsDynamic(GenerateArg.ContainerPoint).pop(),
  containerSize: generateArgsDynamic(GenerateArg.ContainerSize).pop(),
  contentSize: generateArgsDynamic(GenerateArg.ContentSize).pop(),
  contentPoint: generateArgsDynamic(GenerateArg.ContentPoint).pop(),
  opacity: generateArgsDynamic(GenerateArg.Opacity).pop(),
}

export const encodingIds = (overrides: GenerateOptions = {}) => {
  const args = GenerateArgs.filter(arg => {
    switch (arg) {
      case GenerateArg.Container:
      case GenerateArg.Content:
      case GenerateArg.CROP: return false
    }
    return true
  })

  const ids = args.flatMap(arg => {
    const dynamicOptions = {
      ...staticGenerateOptions, [arg]: dynamicGenerateOptions[arg],
      ...overrides
    }
    const staticOptions = {
      ...dynamicGenerateOptions, [arg]: staticGenerateOptions[arg],
      ...overrides
    }     
    return [...generateIds(dynamicOptions), ...generateIds(staticOptions)]
  })
  const uniqueIds = arrayUnique(ids)
  return uniqueIds
}

export const encodingName = (overrides: GenerateOptions = {}) => {
  const names = Object.entries(overrides).map(([key, value]) => {
    const tests = GenerateTestsDefault[key as GenerateArg] 
    const test = tests.find(test => test[0] === value)
    assertDefined(test)
    return test[3] || test[1]
  })
  names.unshift('all')
  return names.join('-') 
}
/**
 * Encodes all generated mashes and combines into a single output. Any 
 * provided overrides will limit the generated mashes to those options.
 */
export const encodeCombined = async (overrides: GenerateOptions = {}) => {
  const name = encodingName(overrides)
  const idsToEncode = encodingIds(overrides)
  const dynamicOrError = await encodeAndCombine(name, idsToEncode)
  if (isDefiniteError(dynamicOrError)) return dynamicOrError
  return { data: 'OK' }
}

// const renderingFilePath = (path: string): string => {
//   const regExp = /%0([0-9])d/
//   const matches = path.match(regExp)
//   if (matches) {
//     return path.replace(regExp, '0'.repeat(Number(matches[1]) - 1) + '1')
//   }
//   return path
// }

// const renderingFileExists = (filePath: string): boolean => {
//   const checkPath = renderingFilePath(filePath)
//   const fileExists = fs.existsSync(checkPath)
//   return fileExists
// }
