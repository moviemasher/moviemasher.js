import type { AssetFile, ServerImageAsset, AssetFiles, AssetFunction, CacheArgs, CommandFile, CommandFiles, DataOrError, FileWriteArgs, ImageInstance, ImageInstanceObject, ServerInstance, ServerPromiseArgs, ValueRecord, VisibleCommandFileArgs, VisibleContentInstance, FileReadArgs, AssetCacheArgs, ClientRawImageAsset, Size, ClientRawImageInstance, ContainerSvgItemArgs, MaybeComplexSvgItem, ContentSvgItemArgs, Scalar, Rect } from '../types.js'

import { ImageAssetMixin, ImageInstanceMixin } from '../mixin/image.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '../mixin/visible.js'
import { $CLIENT, $FILE, $IMAGE, $RAW, $READ, $SVG, $VIDEO, $WRITE, DOT, ERROR, MOVIE_MASHER, NAMESPACE_SVG, SLASH, errorPromise, isAssetObject, isDefiniteError, namedError, svgStringClean } from '../runtime.js'
import { assertDefined } from '../utility/guards.js'
import { assertSizeNotZero, coverSize } from '../utility/rect.js'
import { isTimeRange } from '../utility/time.js'
import { ServerRawAssetClass } from '../base/server-raw-asset.js'
import { ServerInstanceClass } from '../base/server-instance.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/server-visible.js'
import { assertAbsolutePath } from '../utility/guards.js'
import { ClientRawAssetClass } from '../base/client-raw-asset.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../mixin/client-visible.js'
import { svgImagePromiseWithOptions, svgOpacity, svgSvgElement } from '../utility/svg.js'
import { ClientInstanceClass } from '../base/client-instance.js'

interface ServerRawImageAsset extends ServerImageAsset {}

interface ServerRawImageInstance extends ImageInstance, ServerInstance {
  asset: ServerRawImageAsset
}

export class ClientRawImageAssetClass extends ImageAssetMixin(
  ClientVisibleAssetMixin(VisibleAssetMixin(ClientRawAssetClass))
) implements ClientRawImageAsset {
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { visible } = args
    if (!visible) return Promise.resolve({ data: 0 })

    const requestable = this.resourceOfType($IMAGE) 
    if (!requestable) return Promise.resolve({ data: 0 })
    
    return this.imagePromise(requestable).then(icon => {
      return { data: isDefiniteError(icon) ? 0 : 1 }
    })
  }

  override assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> {
    const transcoding = this.resourceOfType($IMAGE)   
    if (!transcoding) return errorPromise(ERROR.Unavailable, 'transcoding')

    return this.assetIconPromise(transcoding, size, cover).then(orError => {
      if (isDefiniteError(orError)) return orError

      
      return { data: svgSvgElement(size, orError.data) }
    })
  }

  override instanceFromObject(object?: ImageInstanceObject | undefined): ImageInstance {
    return new ClientRawImageInstanceClass(this.instanceArgs(object))
  }
}

export const imageRawAssetFunction: AssetFunction = (object) => {
  if (!isAssetObject(object, $IMAGE, $RAW)) {
    return namedError(ERROR.Syntax, [$IMAGE, $RAW].join(SLASH))
  }
  const { context } = MOVIE_MASHER
  const imageClass = context === $CLIENT ? ClientRawImageAssetClass : ServerRawImageAssetClass

  return { data: new imageClass(object) }
}

export class ClientRawImageInstanceClass extends ImageInstanceMixin(
  ClientVisibleInstanceMixin(VisibleInstanceMixin(ClientInstanceClass))
) implements ClientRawImageInstance {
  declare asset: ClientRawImageAsset

  override containerSvgItemPromise(args: ContainerSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
    const { containerRect, opacity } = args
    return this.svgItemPromise(containerRect, opacity)
  }

  override contentSvgItemPromise(args: ContentSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
    const { contentRect: rect, opacity } = args
    return this.svgItemPromise(rect, opacity)
  }

  private get imagePromise() {
    const { asset } = this
    const resource = asset.resourceOfType($IMAGE) 
    if (!resource) return errorPromise(ERROR.Unavailable, 'resource')
    
    return asset.imagePromise(resource)
  }

  private svgItemPromise(rect: Rect, opacity?: Scalar): Promise<DataOrError<MaybeComplexSvgItem>> {
    return this.imagePromise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { src } = orError.data
      return svgImagePromiseWithOptions(src, rect).then(image => {
        const data = svgOpacity(image, opacity)
        return { data }
      })
    })
  }
}

export class ServerRawImageAssetClass extends ImageAssetMixin(
  ServerVisibleAssetMixin(VisibleAssetMixin(ServerRawAssetClass))
) implements ServerRawImageAsset {
  override assetFiles(args: CacheArgs): AssetFiles {
    const { visible } = args
    if (!visible) return []

    const { request } = this
    if (!request) return []

    const { path: file } = request
    assertDefined(file)

    // we handle $SVG files differently - see commandFilePromise below
    const type = String(file).endsWith(`${DOT}${$SVG}`) ? $SVG : $IMAGE
    const assetFile: AssetFile = { type, file, asset: this, avType: $VIDEO }
    return [assetFile]
  }

  override commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { type, file } = commandFile
    if (type !== $SVG) return super.commandFilePromise(args, commandFile)
    
    console.log(this.constructor.name, 'ServerRawImageAssetClass.commandFilePromise', { type, source: file })

    const { visible, size } = args
    if (!(visible && size)) return Promise.resolve({ data: 0 })
    
    // avoid pixelation by placing the svg in another of correct dimensions 
    const { probeSize } = this
    assertSizeNotZero(probeSize)
 
    const fileArgs: FileReadArgs = { path: file, type: $READ }
    return MOVIE_MASHER.promise(fileArgs, $FILE).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: content } = orError
      const cleaned = svgStringClean(content)
      if (!cleaned) return namedError(ERROR.Unknown, 'svgStringClean')

      const { width, height } = coverSize(probeSize, size)
      const dims = `width='${width}' height='${height}'`
      const outBox = `viewBox='0 0 ${width} ${height}'`
      const inBox = `viewBox='0 0 ${probeSize.width} ${probeSize.height}'`
      
      // remove viewBox and width/height attributes from svg tag
      const unboxed = cleaned.replace(/viewBox=["'][^"']*["']/i, '')
      const unwidth = unboxed.replace(/width=["'][^"']*["']/i, '')
      const unattributed = unwidth.replace(/height=["'][^"']*["']/i, '')

      // add the new width/height and intrinsic viewBox attributes
      const tag = unattributed.replace(/<svg/, `<svg ${inBox} ${dims}`)

      // wrap in another svg tag with the output viewBox and width/height
      const svg = `<svg xmlns='${NAMESPACE_SVG}' ${outBox} ${dims}>${tag}</svg>`

      // save file with new dimensions
      const sizedPath = `${file.slice(0, -4)}-${width}x${height}.${$SVG}`
      assertAbsolutePath(sizedPath)

      const fileArgs: FileWriteArgs = { path: sizedPath, content: svg, dontReplace: true, type: $WRITE }
      return MOVIE_MASHER.promise(fileArgs, $FILE).then(orError => {
        if (isDefiniteError(orError)) return orError
        
        commandFile.file = sizedPath
        return { data: 1 }
      })
    })
  }

  override instanceFromObject(object?: ImageInstanceObject): ServerRawImageInstance {
    const args = this.instanceArgs(object)
    return new ServerRawImageInstanceClass(args)
  }

  type = $IMAGE
}

export class ServerRawImageInstanceClass extends ImageInstanceMixin(
  ServerVisibleInstanceMixin(VisibleInstanceMixin(ServerInstanceClass))
) implements ServerRawImageInstance {
  declare asset: ServerRawImageAsset

  override visibleCommandFiles(args: VisibleCommandFileArgs, content?: VisibleContentInstance): CommandFiles {
    const commandFiles: CommandFiles = super.visibleCommandFiles(args, content)
    const { time, videoRate } = args
    const { id: inputId } = this
    const files = this.asset.assetFiles({ visible: true })
    const [file] = files
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const inputOptions: ValueRecord = { loop: 1, framerate: videoRate }
    if (duration) inputOptions.t = duration

    // TODO: set options.itsoffset!

    const commandFile: CommandFile = { ...file, inputId, inputOptions }
    // console.log(this.constructor.name, 'commandFiles', id)
    commandFiles.push(commandFile)
   
    return commandFiles
  }
}
