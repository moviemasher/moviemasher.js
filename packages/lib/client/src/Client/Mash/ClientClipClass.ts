import type { ChangeActionObject, ChangePropertiesActionObject, ClientClip, ClientInstance, ClientTrack, ClientVisibleInstance, Preview, SvgItems, SvgOrImageDataOrError } from '@moviemasher/runtime-client'
import type { ContainerRectArgs, PropertyId, Scalar, ScalarsById, Size, TargetId, Time } from '@moviemasher/runtime-shared'
import type { MashPreviewArgs } from '../Masher/MashPreview/MashPreview.js'

import { ActionTypeChangeFrame, ActionTypeChangeMultiple, ClipClass, SizingContainer, SizingContent, TimingContainer, TimingContent, TimingCustom, arrayOfNumbers, assertContainerInstance, assertPopulatedString, assertSizeAboveZero, assertTrue, colorFromRgb, colorRgbDifference, colorToRgb, idGenerate } from '@moviemasher/lib-shared'
import { EventManagedAsset, MovieMasher, Panel, TypeClip } from '@moviemasher/runtime-client'
import { DotChar, POINT_ZERO, TypeAudio, assertAsset, isAudibleAssetType, isVisibleAssetType } from '@moviemasher/runtime-shared'
import { assertClientVisibleInstance } from '../ClientGuards.js'
import { isChangePropertyActionObject } from '../Masher/Actions/Action/ActionFunctions.js'
import { MashPreviewClass } from '../Masher/MashPreview/MashPreviewClass.js'
import { pixelToFrame } from '../PixelFunctions.js'
import { svgAppend, svgDefsElement, svgPatternElement, svgPolygonElement, svgSetDimensions, svgSvgElement, svgUrl } from '../SvgFunctions.js'

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

  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeActionObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyActionObject(object)) return object
    
    const name = propertyId.split(DotChar).pop()
    switch (name) {
      case 'frame': 
      case 'frames': {
        object.type = ActionTypeChangeFrame
        break
      }
      case 'containerId': 
      case 'contentId': {
        const container = name === 'containerId'
        const relevantTiming = container ? TimingContainer : TimingContent
        const relevantSizing = container ? SizingContainer : SizingContent
        const { timing, sizing, targetId } = this
        const timingBound = timing === relevantTiming
        const sizingBound = sizing === relevantSizing
        if (!(timingBound || sizingBound)) break


        const { undoValue, redoValue } = object
        assertPopulatedString(redoValue)

        const sizingId: PropertyId = `${targetId}${DotChar}sizing`
        const timingId: PropertyId = `${targetId}${DotChar}timing`
        const undoValues: ScalarsById = { 
          [timingId]: timing, 
          [sizingId]: sizing,
          [propertyId]: undoValue 
        }
        const redoValues: ScalarsById = { ...undoValues, [propertyId]: redoValue }
      
        const event = new EventManagedAsset(redoValue)
        MovieMasher.eventDispatcher.dispatch(event)
        const { asset } = event.detail
        assertAsset(asset)

        const { type } = asset
        if (timingBound && !isAudibleAssetType(type)) {
          redoValues[timingId] = TimingCustom
        }
        if (sizingBound && !isVisibleAssetType(type)) {
          redoValues[sizingId] = container ? SizingContent : SizingContainer
        }

        const actionObject: ChangePropertiesActionObject = {
          type: ActionTypeChangeMultiple,
          target: this, redoValues, undoValues
        }
        return actionObject
      }
    }
    return object
  }

  protected override shouldSelectProperty(name: string): boolean {
    switch (name) {
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

  override targetId: TargetId = TypeClip

  declare track: ClientTrack

  updateAssetId(oldId: string, newId: string): void {
    if (this.containerId === oldId) this.containerId = newId
    if (this.contentId === oldId) this.contentId = newId
  }
}
