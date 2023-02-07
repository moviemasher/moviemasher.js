
import { 
  colorBlack, colorBlue, colorRed,
  assertPopulatedArray, assertPopulatedString, isPopulatedArray, 
  isPopulatedString, isString,
  assertSize, SizePreview, isSize, 
  assertContainerObject, isContainerObject,
  assertPoint, isPoint, errorsThrow,
  Directions, Duration, DefaultContentId, DefaultContainerId, 
  DefaultFontId, DefinitionType
} from '@moviemasher/moviemasher.js'

const GeneratePoint = {
  TL: 'TL',
  BR: 'BR',
  TR: 'TR',
  BL: 'BL',
  M: 'M',
}
const GeneratePoints = Object.values(GeneratePoint)
export const isGeneratePoint = (value) => {
  return isPopulatedString(value) && GeneratePoints.includes(value)
}

const GenerateSize = {
  H: 'H',
  F: 'F',
  D: 'D',
  Q: 'Q',
  Z: 'Z',
}
const GenerateSizes = Object.values(GenerateSize)
export const isGenerateSize = (value) => {
  return isPopulatedString(value) && GenerateSizes.includes(value)
}

const GenerateConstrain = {
  C: 'C',
  U: 'U',
}
const GenerateConstrains = Object.values(GenerateConstrain)
export const isGenerateConstrain = (value) => {
  return isPopulatedString(value) && GenerateConstrains.includes(value)
}
const GenerateOpacity = {
  H: '50',
  F: '100',
  Z: '0',
}
const GenerateOpacities = Object.values(GenerateOpacity)
export const isGenerateOpacity = (value) => {
  return isPopulatedString(value) && GenerateOpacities.includes(value)
}

export const GenerateArg = {
  Content: 'content',
  Container: 'container',
  ContentSize: 'contentSize',
  ContentPoint: 'contentPoint',
  ContainerSize: 'containerSize',
  ContainerPoint: 'containerPoint',
  Opacity: 'opacity',
  Constrain: 'constrain',
}
export const GenerateArgs = Object.values(GenerateArg)


const textOptions = { 
  string: "Luckiest Guy",
  intrinsic: { width: 6167.01953125, height: 738, x: 0, y: 723 },
  fontId: "com.moviemasher.font.luckiest-guy"
}

const isRenderTest = (value) => {
  return isPopulatedArray(value) && isString(value[0])
}
function assertRenderTest(value) {
  if (!isRenderTest(value)) errorsThrow(value, 'RenderTest')
}

const GenerateTweenDelimiter = '-'
export const GenerateIdDelimiter = '_'
export const GenerateDelimiter = 'in'

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

const generateClips = (testId, size = SizePreview, frames = Duration.Unknown, labels = false) => {
  const generateOptions = generateTestArgs(testId)
  const renderTestObject = Object.fromEntries(GenerateArgs.map(renderTestOption => {
    const option = generateOptions[renderTestOption]
    assertPopulatedString(option)
    const renderTests = GenerateTestsDefault[renderTestOption]
    const renderTest = renderTests.find(test => test[0] === option)
    assertRenderTest(renderTest)
    return [renderTestOption, renderTest]
  }))
  
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
  const debug = {
    intrinsic: { x: 0, y: 0, width: width, height: 1000 / textHeight },
    // { width: width / textHeight, height: 500, x: 0, y: 400 }, // 738
    fontId: "com.moviemasher.font.luckiest-guy",
    // height: textHeight, 
    x: 0, y: 0.5, 
    lock: 'V',
    width: 1,
  }
  const debugClip = {
    containerId: DefaultFontId,
    content: { color: colorBlack },
    sizing: 'preview',
    timing: 'custom',
    frames,
  }
  assertPoint(containerPoint)
  assertPoint(contentPoint)

  const clip = { 
    frames, containerId, contentId,
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
    const labelClip = { 
      ...debugClip, container: { ...debug, string: testId }
    }  
    objects.push(labelClip)
  }
  
  return objects
}


const pointsContainerObject = (...points) => {
  const [point, pointEnd] = points
  assertPoint(point)

  if (!isPoint(pointEnd)) return { ...point }

  return { ...point, xEnd: pointEnd.x, yEnd: pointEnd.y }
}

const pointTest = (...mashPoints) => {
  const points = mashPoints.map(mashPoint => MashPointsDefault[mashPoint])
  return [mashPoints.join(GenerateTweenDelimiter), pointsContainerObject(...points)]
}


const opacitiesContainerObject = (...opacities) => {
  const [opacity, opacityEnd] = opacities
  assertContainerObject(opacity)

  if (!isContainerObject(opacityEnd)) return { ...opacity }

  return { ...opacity, opacityEnd: opacityEnd.opacity }
}

const opacityTest = (...mashOpacity) => {
  const opacities = mashOpacity.map(mashPoint => MashOpacityDefault[mashPoint])
  return [mashOpacity.join(GenerateTweenDelimiter), opacitiesContainerObject(...opacities)]
}
const sizesContainerObject = (...sizes) => {
  const [size, sizeEnd] = sizes
  assertSize(size)

  if (!isSize(sizeEnd)) return { ...size }

  return { ...size, widthEnd: sizeEnd.width, heightEnd: sizeEnd.height }
}

const sizeTest = (...mashSizes) => {
  const sizes = mashSizes.map(mashSize => MashSizesDefault[mashSize])
  return [mashSizes.join(GenerateTweenDelimiter), sizesContainerObject(...sizes)]
}

export const generateTestArgs = (id) => {
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

export const GenerateOptionsDefault = {
  container: "R", containerPoint: GeneratePoint.M, containerSize: GenerateSize.F,
  content: "BL", contentPoint: GeneratePoint.TL, contentSize: GenerateSize.F,
  constrain: GenerateConstrain.C, opacity: GenerateOpacity.F,
}

export const GenerateTestsDefault = {
  [GenerateArg.Container]: [
    ["R", DefaultContainerId, {}],
    ["K", "kitten", {}],
    // ["S", 'com.moviemasher.container.test', {}],
    // ["B", 'com.moviemasher.container.broadcast', {}],
    ["S", 'com.remixicon.image.heart', {}],
    ["T", textOptions.fontId, textOptions],
    // ["P", "puppy" , {}],
  ],
  [GenerateArg.Content]: [
    ["BL", DefaultContentId, { color: colorBlue }],
    ["P", "puppy", {}],
    ["RGB", "rgb", {}],
    ["V", "video", {}],
    // ["BK", DefaultContentId, { color: colorBlack }],
    // ["RE", DefaultContentId, { color: colorRed }],
    // ["WH", DefaultContentId, { color: colorWhite }],
    ["BL-RE", DefaultContentId, { colorEnd: colorRed, color: colorBlue }],
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

export const generateArgsDynamic = (renderTestOption) => {
  const tests = GenerateTestsDefault[renderTestOption]
  const tweenTests = tests.filter(test => test[0].includes(GenerateTweenDelimiter))
  return tweenTests.map(test => test[0])
}

export const generateArgsStatic = (renderTestOption) => {
  const tests = GenerateTestsDefault[renderTestOption]
  const tweenTests = tests.filter(test => !test[0].includes(GenerateTweenDelimiter))
  return tweenTests.map(test => test[0])
}

export const GenerateDefinitionObjects = [
  {
    id: "puppy",
    type: "image",
    request: { endpoint: { pathname: "../shared/image/puppy/image.jpg" } },
    decodings: [{width: 3024, height: 4032}]
  },
  {
    "id": "rgb",
    "type": "video",
    request: { endpoint: { pathname: "../shared/video/rgb.mp4" } },
    decodings: [{width: 512, height: 288, audible: true }]
  },
  {
    "id": "kitten",
    "type": "image",
    request: { endpoint: { pathname: "../shared/image/kitten/image.jpg" } },
    decodings: [{width: 4592, height: 3056}]
  },
  {
    "id": "font.valken",
    "type": "font",
    "label": "Valken",
    request: { endpoint: { pathname: "../shared/font/valken/valken.ttf" } },
    transcodings: [
      { type: DefinitionType.Font, request: { endpoint: { pathname: "../shared/font/valken/valken.woff2" } }}
    ]
  },
  {
    "type": "video",
    "label": "Video", "id": "video",
    request: { endpoint: { pathname: "../shared/video/dance.mp4" } },
  }
]

export const generateIds = (generateOptions = {}) => {
  const limitedOptions = (option, ids) => {
    const renderTests = GenerateTestsDefault[option]
    const idsOrNot = ids || generateOptions[option] 
    const idArray = isPopulatedString(idsOrNot) ? [idsOrNot] : idsOrNot
    if (!isPopulatedArray(idArray)) return renderTests

    return renderTests.filter(renderTest => idArray.includes(String(renderTest[0])))
  }
  const mashIds = []
  const limitedContents = limitedOptions(GenerateArg.Content) 
  assertPopulatedArray(limitedContents, 'limitedContents')
  limitedContents.forEach(([contentLabel, contentId]) => {
    const isColor = contentId === DefaultContentId
    const limitedContainers = limitedOptions(GenerateArg.Container) 
    assertPopulatedArray(limitedContainers, 'limitedContainers')
    limitedContainers.forEach(([containerLabel]) => {
      const limitedContainerPoints = limitedOptions(GenerateArg.ContainerPoint) 
      const point = isColor ? GeneratePoint.M : undefined
      const limitedContentPoints = limitedOptions(GenerateArg.ContentPoint, point) 
      assertPopulatedArray(limitedContentPoints, 'limitedContentPoints')
      limitedContentPoints.forEach(([contentPointName]) => {
        const size = isColor ? GenerateSize.F : undefined
        const limitedContentSizes = limitedOptions(GenerateArg.ContentSize, size) 
        assertPopulatedArray(limitedContentSizes, 'limitedContentSizes')
        limitedContentSizes.forEach(([contentDimensionName]) => {
          const limitedOpacities = limitedOptions(GenerateArg.Opacity) 
          assertPopulatedArray(limitedOpacities, 'limitedOpacities')
          limitedOpacities.forEach(([opacityLabel]) => {
            const limitedContainerSizes = limitedOptions(GenerateArg.ContainerSize) 
            assertPopulatedArray(limitedContainerSizes, 'limitedContainerSizes')
            limitedContainerSizes.forEach(([containerDimensionName]) => {
              assertPopulatedArray(limitedContainerPoints, 'limitedContainerPoints')
              limitedContainerPoints.forEach(([containerPointName]) => {
                const containerCentered = containerPointName === GeneratePoint.M
                const constrain = containerCentered ? GenerateConstrain.U : undefined
                const limitedConstrains = limitedOptions(GenerateArg.Constrain, constrain) 
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

export const generateTests = (generateOptions, testId = 'all', size = SizePreview, frames = 10, labels = false) => {
  const ids = generateIds(generateOptions)
  const clips = []
  const labelClips = []
  ids.forEach(id => {
    const [clip, labelClip] = generateClips(id, size, frames, labels)
    clips.push(clip)
    if (labelClip) labelClips.push(labelClip)
  })
  const tracks = [{ clips }]
  if (labels) tracks.push({ clips: labelClips, dense: true })
  const mash = { 
    id: testId, color: '#666666', tracks 
  }
  return [testId, mash]
}

export const generateTest = (testId, size = SizePreview, frames = Duration.Unknown, labels = false) => {
  const [clip, labelClip] = generateClips(testId, size, frames, labels)
  const tracks = [{ clips: [clip] }]
  if (labelClip) tracks.push({ clips: [labelClip], dense: true })
  const mash = { 
    id: testId, color: '#666666', tracks 
  }
  return [testId, mash]
}