import type { CacheArgs, DataOrError, ImageInstanceObject, InstanceArgs, IntrinsicOptions, ListenersFunction, RawImageAssetObject, ValueRecord, VisibleContentInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerRawImageAsset, ServerRawImageInstance } from '../type/ServerTypes.js'
import type { CommandFile, CommandFiles, AssetFile, AssetFiles, ServerPromiseArgs, VisibleCommandFileArgs } from '../types.js'

import { DOT, ERROR, IMAGE, NAMESPACE_SVG, RAW, SVG, VIDEO, isAssetObject, isDefiniteError, namedError, svgStringClean } from '@moviemasher/shared-lib/runtime.js'
import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerRawAssetClass } from '../base/asset-raw.js'
import { ServerVisibleAssetMixin } from '../mixin/visible.js'
import { ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { EventServerAsset } from '../runtime.js'

import { ImageAssetMixin, ImageInstanceMixin } from '@moviemasher/shared-lib/mixin/image.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { assertSizeAboveZero, sizeCover } from '@moviemasher/shared-lib/utility/rect.js'
import { isTimeRange } from '@moviemasher/shared-lib/utility/time.js'
import { assertServerVisibleInstance } from '../guard/assets.js'
import { fileReadPromise, fileWritePromise } from '../utility/File.js'

const WithAsset = VisibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithImageAsset = ImageAssetMixin(WithServerAsset)

export class ServerRawImageAssetClass extends WithImageAsset implements ServerRawImageAsset {
  constructor(args: RawImageAssetObject) {
    super(args)
    this.initializeProperties(args)
  }


  override assetFiles(args: CacheArgs): AssetFiles {
    const { visible } = args
    if (!visible) return []

    const { path: file } = this.request
    assertPopulatedString(file)

    // we handle SVG files differently - see commandFilePromise below
    const type = file.endsWith(`${DOT}${SVG}`) ? SVG : IMAGE
    const assetFile: AssetFile = { 
      type, file, asset: this, avType: VIDEO 
    }
    return [assetFile]
  }

  override instanceFromObject(object?: ImageInstanceObject): ServerRawImageInstance {
    const args = this.instanceArgs(object)
    return new ServerRawImageInstanceClass(args)
  }

  override commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { type, file } = commandFile
    if (type !== SVG) return super.commandFilePromise(args, commandFile)
    
    console.log(this.constructor.name, 'ServerRawImageAssetClass.commandFilePromise', { type, source: file })

    const { visible, size } = args
    if (!(visible && size)) return Promise.resolve({ data: 0 })
    
    // avoid pixelation by placing the svg in another of correct dimensions 
    const { probeSize } = this
    assertSizeAboveZero(probeSize)
 
    return fileReadPromise(file).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: content } = orError
      const cleaned = svgStringClean(content)
      if (!cleaned) return namedError(ERROR.Unknown, 'svgStringClean')

      const { width, height } = sizeCover(probeSize, size)
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
      const sizedPath = `${file.slice(0, -4)}-${width}x${height}.${SVG}`
      return fileWritePromise(sizedPath, svg, true).then(orError => {
        if (isDefiniteError(orError)) return orError
        
        commandFile.file = sizedPath
        return { data: 1 }
      })
    })
  }

  type = IMAGE

  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, IMAGE, RAW)) {
      detail.asset = new ServerRawImageAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for image/raw asset event
export const ServerRawImageListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerRawImageAssetClass.handleAsset
})

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithImageInstance = ImageInstanceMixin(WithServerInstance)

export class ServerRawImageInstanceClass extends WithImageInstance implements ServerRawImageInstance {
  constructor(args: ImageInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

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
