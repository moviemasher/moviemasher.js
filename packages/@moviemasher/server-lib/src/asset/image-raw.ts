import type { AssetFile, AssetFiles, AssetFunction, CacheArgs, CommandFile, CommandFiles, DataOrError, ImageInstance, ImageInstanceObject, ServerInstance, ServerPromiseArgs, ValueRecord, VisibleCommandFileArgs, VisibleContentInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerImageAsset } from '../type/ServerAssetTypes.js'

import { ImageAssetMixin, ImageInstanceMixin } from '@moviemasher/shared-lib/mixin/image.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $IMAGE, $RAW, $SVG, $VIDEO, DOT, ERROR, NAMESPACE_SVG, SLASH, isAssetObject, isDefiniteError, namedError, svgStringClean } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeNotZero, coverSize } from '@moviemasher/shared-lib/utility/rect.js'
import { isTimeRange } from '@moviemasher/shared-lib/utility/time.js'
import { ServerRawAssetClass } from '@moviemasher/shared-lib/base/server-raw-asset.js'
import { ServerInstanceClass } from '@moviemasher/shared-lib/base/server-instance.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/server-visible.js'
import { fileReadPromise, fileWritePromise } from '../module/file-write.js'
import { assertAbsolutePath } from '../utility/guard.js'

interface ServerRawImageAsset extends ServerImageAsset {}

interface ServerRawImageInstance extends ImageInstance, ServerInstance {
  asset: ServerRawImageAsset
}

const WithAsset = VisibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithImageAsset = ImageAssetMixin(WithServerAsset)

export class ServerRawImageAssetClass extends WithImageAsset implements ServerRawImageAsset {
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
 
    return fileReadPromise(file).then(orError => {
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
      return fileWritePromise(sizedPath, svg, true).then(orError => {
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

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithImageInstance = ImageInstanceMixin(WithServerInstance)

export class ServerRawImageInstanceClass extends WithImageInstance implements ServerRawImageInstance {
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

export const serverImageRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $IMAGE, $RAW)) {
    return namedError(ERROR.Syntax, [$IMAGE, $RAW].join(SLASH))
  }
  return { data: new ServerRawImageAssetClass(assetObject) }
}
