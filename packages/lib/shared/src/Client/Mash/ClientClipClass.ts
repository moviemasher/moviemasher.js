import type { Actions, ClientClip, ClientInstance, ClientTrack, ClientVisibleInstance, Preview, Selectables, SelectedProperties, SelectedProperty, SvgItems, SvgOrImageDataOrError } from '@moviemasher/runtime-client'
import type { ContainerRectArgs, PropertyId, Scalar, Size, Strings, TargetId, Time } from '@moviemasher/runtime-shared'
import type { ChangePropertyActionObject } from '../Masher/Actions/Action/ActionTypes.js'
import type { MashPreviewArgs } from '../Masher/MashPreview/MashPreview.js'
import { DotChar, TypeAudio } from '@moviemasher/runtime-shared'
import { Panel, TypeClip } from '@moviemasher/runtime-client'
import { assertContainerInstance } from '../../Helpers/Container/ContainerGuards.js'
import { svgAppend, svgDefsElement, svgPatternElement, svgPolygonElement, svgSetDimensions, svgSvgElement, svgUrl } from '../SvgFunctions.js'
import { colorFromRgb, colorRgbDifference, colorToRgb } from '../../Helpers/Color/ColorFunctions.js'
import { ActionTypeChange, ActionTypeChangeFrame } from '../../Setup/ActionTypeConstants.js'
import { TimingCustom } from '../../Setup/TimingConstants.js'
import { ClipClass } from '../../Shared/Mash/Clip/ClipClass.js'
import { assertDefined, assertPopulatedString, assertTrue } from '../../Shared/SharedGuards.js'
import { arrayOfNumbers } from '../../Utility/ArrayFunctions.js'
import { idGenerate } from '../../Utility/IdFunctions.js'
import { POINT_ZERO } from '../../Utility/PointConstants.js'
import { rectsEqual } from '../../Utility/RectFunctions.js'
import { assertSizeAboveZero } from '../../Utility/SizeFunctions.js'
import { assertClientVisibleInstance } from '../ClientGuards.js'
import { MashPreviewClass } from '../Masher/MashPreview/MashPreviewClass.js'
import { pixelToFrame } from '../PixelFunctions.js'


export class ClientClipClass extends ClipClass implements ClientClip {
  backgroundNode = (size: Size, patternedSize: Size, spacing = 0) => {
    const { width, height } = size
    const { color: fill } = this.track.mash
    const rgb = colorToRgb(fill)
    const differenceRgb = colorRgbDifference(rgb)
    const forecolor = colorFromRgb(differenceRgb)
    const framePolygon = svgPolygonElement(size, '', fill)
    const spaceRect = { x: width, y: 0, width: spacing, height }
    const spacePolygon = svgPolygonElement(spaceRect, '', forecolor)
    const patternSize = { width: width + spacing, height }
    const patternId = idGenerate('pattern')
    const patternItems = [framePolygon, spacePolygon]
    const pattern = svgPatternElement(patternSize, patternId, patternItems)
    const defsElement = svgDefsElement([pattern])
    const patternedPolygon = svgPolygonElement(patternedSize, '', svgUrl(patternId))
    return svgSvgElement(patternedSize, [defsElement, patternedPolygon])
  }

  clipIcon(frameSize: Size, size: Size, scale: number, gap = 1): Promise<SvgOrImageDataOrError> {
    const { container } = this
    assertContainerInstance(container, 'clipIcon')

    const { mash } = this.track

    const widthAndBuffer = frameSize.width + gap
    const cellCount = Math.ceil(size.width / widthAndBuffer)
    const clipTime = this.timeRange
    const { startTime } = clipTime
    const numbers = arrayOfNumbers(cellCount)
    // console.log(this.constructor.name, 'clipIcon', cellCount, numbers)
    let pixel = 0
    const previews = numbers.map(() => {
      const { copy: time } = startTime
      const previewArgs: MashPreviewArgs = {
        mash, time, clip: this, size: frameSize
      }
      const preview = new MashPreviewClass(previewArgs)

      pixel += widthAndBuffer
      startTime.frame = clipTime.frame + pixelToFrame(pixel, scale, 'floor')
      return preview
    })

    let svgItemsPromise = Promise.resolve([] as SvgItems)
    previews.forEach(preview => {
      svgItemsPromise = svgItemsPromise.then(items => {
        return preview.svgItemsPromise.then(svgItems => {
          return [...items, ...svgItems]
        })
      })
    })

    return svgItemsPromise.then(svgItems => {
      // console.log(this.constructor.name, 'clipIcon svgItems', svgItems.length)
      const point = { ...POINT_ZERO }
      const containerSvg = svgSvgElement(size)

      svgItems.forEach(groupItem => {
        svgSetDimensions(groupItem, point)
        svgAppend(containerSvg, groupItem)
        point.x += widthAndBuffer
      })
      return { data: containerSvg }
    })
  }

  override get container(): ClientVisibleInstance { return super.container as ClientVisibleInstance }

  override get content(): ClientInstance { return super.content as ClientInstance }

  clipPreviewPromise(size: Size, time: Time, component: Panel): Promise<Preview> {
    assertSizeAboveZero(size)


    const { container, content } = this
    assertContainerInstance(container)

    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange: this.timeRange, editing: true,
    }
    const containerRects = this.rects(containerRectArgs)
    assertTrue(containerRects.length === 1)

    const [containerRect] = containerRects
    assertClientVisibleInstance(content)
    return container.clippedPreviewPromise(content, containerRect, size, time, component)
  }

  selectables(): Selectables { return [this, ...this.track.mash.selectables()] }

  selectedProperties(actions: Actions, propertyNames: Strings): SelectedProperties {
    const names = this.selectorTypesPropertyNames(propertyNames, this.targetId)
    const filtered = names.filter(name => this.shouldSelectProperty(name))

    return filtered.map(name => {
      const property = this.propertyFind(name)
      assertDefined(property)

      const { targetId } = property
      const propertyId = [targetId, name].join(DotChar) as PropertyId
      const isFrames = name === 'frames' || name === 'frame'
      const undoValue = this.value(name)
      const selectedProperty: SelectedProperty = {
        value: undoValue,
        propertyId, property,
        changeHandler: (property: string, redoValue?: Scalar) => {
          assertPopulatedString(property)

          const options: ChangePropertyActionObject = {
            property, target: this, redoValue, undoValue,
            type: isFrames ? ActionTypeChangeFrame : ActionTypeChange,
            redoSelection: actions.selection,
            undoSelection: actions.selection,
          }
          actions.create(options)
        }
      }
      return selectedProperty
    })
  }

  private shouldSelectProperty(name: string): boolean {
    switch (name) {
      case 'containerId':
      case 'contentId': return false
      case 'sizing': return this.content.asset.type !== TypeAudio
      case 'timing': {
        if (this.content.hasIntrinsicTiming) break
        return !!this.container?.hasIntrinsicSizing
      }
      case 'frame': return !this.track.dense
      case 'frames': return this.timing === TimingCustom
    }
    return true
  }
  targetId: TargetId = TypeClip
  declare track: ClientTrack
}
