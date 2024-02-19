import type { ClipObject, ClipObjects, Data, EncodeArgs, MashAssetObject, OutputOptions } from '@moviemasher/shared-lib/types.js'

import { $ENCODE, $MASH, $VIDEO, MOVIEMASHER, isDefiniteError, typeOutputOptions } from '@moviemasher/shared-lib/runtime.js'
import assert from 'node:assert'
import { describe, test } from 'node:test'
import { encode } from '../../../packages/@moviemasher/server-lib/src/module/encode.js'
import { GenerateArg, VideoOptions, combineIds, encodeId, encodeIds, encodingIds, encodingName } from './utility/EncodeUtility.js'
import { fileReadJsonPromise } from '../../../packages/@moviemasher/server-lib/src/utility/file.js'

await MOVIEMASHER.importPromise()

function failIfError<T = any>(orError: any): asserts orError is T {
  if (isDefiniteError(orError)) {
    console.log('ERROR', orError.error)
    assert.fail(orError.error.message)
  }
}

describe.skip('Problematic', () => {
  test('simplest', async () => {
    const clip: ClipObject = { container: { x: 0, y: 0, xEnd: 1, yEnd: 1, width: 0.5, height: 0.5 } }
    const clips: ClipObjects = [clip]
    const mash: MashAssetObject = {
      type: $VIDEO, source: $MASH, id: 'mash',
      tracks: [{ clips }],
      assets: [],
    }
    
    const encoded = await encode(mash)
    
    if (!isDefiniteError(encoded)) {
      const { data: filePath } = encoded
      // console.log('encoded to', filePath)
    }
    failIfError(encoded)
  })

  // test('rects of text and same sized shape match', async () => {
  //   const ids = [
  //     'P_M_F_in_A_U_M_F-H_50',
  //     'P_M_F_in_T_U_M_F-H_50',
  //   ]
  //   const mashObjects = ids.map(id => mashObjectFromId(id))

  //   const mashes = mashObjects.map(mash => {
  //     const event = new EventServerManagedAsset(mash)
  //     MOVIEMASHER.dispatch(event)
  //     const { asset } = event.detail
  //     assertAsset(asset)

  //     return asset
  //   })
  //   const [shapeMash, textMash] = mashes

  //   assert(isServerMashAsset(shapeMash))
  //   assert(isServerMashAsset(textMash))

  //   assert.notEqual(shapeMash.totalFrames, DURATION_UNKNOWN, 'shape mash total frames')
  //   assert.notEqual(textMash.totalFrames, DURATION_UNKNOWN, 'text mash total frames')

  //   await shapeMash.assetCachePromise({ visible: true })
  //   await textMash.assetCachePromise({ visible: true })

  //   const shapeClip = shapeMash.tracks[0].clips[0]
  //   const textClip = textMash.tracks[0].clips[0]

  //   assert(isClip(shapeClip))
  //   assert(isClip(textClip))

  //   assert(shapeClip.intrinsicsKnown({ size: true, duration: true }))
  //   assert(!textClip.intrinsicsKnown({ size: true, duration: true }))

  //   const timeRange = timeRangeFromArgs(0, shapeMash.quantize, shapeMash.totalFrames)
  //   const args: ContainerRectArgs = {
  //     outputSize: SizePreview, time: timeRange, timeRange
  //   }
  //   const shapeRects = shapeClip.clipRects({...args})
  //   const textRects = textClip.clipRects({...args})
  //   assert([...shapeRects, ...textRects].every(sizeNotZero), 'container rects valid')

  //   const [startShapeRect, endShapeRect] = shapeRects
  //   const [startTextRect, endTextRect] = textRects

  //   assert.notDeepStrictEqual(startShapeRect, endShapeRect, 'shape tweening')
  //   assert.notDeepStrictEqual(startTextRect, endTextRect, 'text tweening')

  //   assert.deepStrictEqual(shapeRects, textRects, 'container rects match')
  // })
  
  test('audio encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-audio-id-${Date.now()}`
    const inputPath = '/app/images/test-server/src/json/mash-audio.json'
    const orError = await fileReadJsonPromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIEMASHER.promise($ENCODE, encodeArgs, { id, user: 'shared' })
    failIfError(await promise)
  })

  test('color encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-color-id-${Date.now()}`
    const inputPath = '/app/images/test-server/src/json/mash_color.json'
    const orError = await fileReadJsonPromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIEMASHER.promise($ENCODE, encodeArgs, { id, user: 'shared' })
    failIfError(await promise)
  })

  test('video encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-video-id-${Date.now()}`
    const inputPath = '/app/images/test-server/src/json/mash_video.json'
    const orError = await fileReadJsonPromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIEMASHER.promise($ENCODE, encodeArgs, { id, user: 'shared' })
    failIfError(await promise)
  })

  test('text encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-text-id-${Date.now()}`
    const inputPath = '/app/images/test-server/src/json/mash_text.json'
    const orError = await fileReadJsonPromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIEMASHER.promise($ENCODE, encodeArgs, { id, user: 'shared' })
    failIfError(await promise)
  })  

  test('shape encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-shape-id-${Date.now()}`
    const inputPath = '/app/images/test-server/src/json/mash_shape.json'
    const orError = await fileReadJsonPromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIEMASHER.promise($ENCODE, encodeArgs, { id, user: 'shared' })
    failIfError(await promise)
  })

  test('problematic permutations encode as video', async () => {
    const ids = [
      'BL_in_K_U_M_H_50',
      'BL_in_T_U_BR-M_F-H_100-0',
      'BL_in_T_U_M_F-H_100-0',
      'BL-RE_in_K_U_M_F_100-0', 
      'BL-RE_in_K_U_M_H_100-0', 
      'BL-RE_in_K_U_M_H_50',
      'BL-RE_in_S_U_M_F_100-0',
      'P_M_D-F_in_S_U_BR-M_F-H_100-0',
      'P_M_F_in_A_C_M_F-H_50',
      'P_M_F_in_A_U_TL_F-H_50',
      'P_M_F_in_S_U_M_H_100',
      'P_M_F_in_T_U_M_F-H_100',
      'P_M_F_in_T_U_M_F-H_50',
      'P_M_F_in_T_U_TL_F-H_50',
      'RGB_BR-M_F_in_R_C_BR-M_F-H_100-0',
      'V_TL_F_in_R_U_M_F_100-0', 
      'V_TL_F_in_S_U_M_F_100-0', 
    ]
    failIfError(await encodeIds(ids))
  })
}) 
describe('Encoding', () => {
  const testEncode = async (container: string) => {
    const overrides = { [GenerateArg.Container]: container }
    const name = encodingName(overrides)
    const idsToEncode = encodingIds(overrides)
    idsToEncode.forEach(async id => {
      await test(id, async () => { 
        failIfError(await encodeId(id, VideoOptions, 10))
      })
    })
    test(name, async () => { await combineIds(idsToEncode, name) })
  }


  describe('text permutations encode as video', () => { testEncode('T') })

  describe('image permutations encode as video', () => { testEncode('K') })

  describe('rect permutations encode as video', () => { testEncode('R') })

  describe('shape permutations encode as video', () => { testEncode('S') })
})

