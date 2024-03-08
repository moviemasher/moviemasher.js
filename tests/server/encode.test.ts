import type { ClipObject, ClipObjects, Data, EncodeArgs, MashAssetObject, OutputOptions } from '@moviemasher/shared-lib/types.js'

import assert from 'node:assert'
import { describe, test } from 'node:test'

import '../../packages/@moviemasher/server-lib/src/runtime.js'
import { $ENCODE, $MASH, $VIDEO, MOVIE_MASHER, isDefiniteError, typeOutputOptions } from '@moviemasher/shared-lib/runtime.js'
import { encode } from '../../packages/@moviemasher/server-lib/src/module/encode.js'

import { readJsonFilePromise } from '../../packages/@moviemasher/server-lib/src/module/file.js'

import { GenerateArg, VideoOptions, combineIds, encodeId, encodeIds, encodingIds, encodingName } from './utility/EncodeUtility.js'

await MOVIE_MASHER.importPromise()

function failIfError<T = any>(orError: any): asserts orError is T {
  if (isDefiniteError(orError)) {
    console.log('ERROR', orError.error)
    assert.fail(orError.error.message)
  }
}

describe('Problematic', () => {
  test.skip('simplest', async () => {
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

  test.skip('audio encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-audio-id-${Date.now()}`
    const inputPath = '/moviemasher/tests/server/json/mash-audio.json'
    const orError = await readJsonFilePromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIE_MASHER.promise(encodeArgs, $ENCODE, { id, user: 'shared' })
    failIfError(await promise)
  })

  test.skip('color encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-color-id-${Date.now()}`
    const inputPath = '/moviemasher/tests/server/json/mash_color.json'
    const orError = await readJsonFilePromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIE_MASHER.promise(encodeArgs, $ENCODE, { id, user: 'shared' })
    failIfError(await promise)
  })

  test.skip('video encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-video-id-${Date.now()}`
    const inputPath = '/moviemasher/tests/server/json/mash_video.json'
    const orError = await readJsonFilePromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIE_MASHER.promise(encodeArgs, $ENCODE, { id, user: 'shared' })
    failIfError(await promise)
  })

  test.skip('text encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-text-id-${Date.now()}`
    const inputPath = '/moviemasher/tests/server/json/mash_text.json'
    const orError = await readJsonFilePromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIE_MASHER.promise(encodeArgs, $ENCODE, { id, user: 'shared' })
    failIfError(await promise)
  })  

  test.skip('shape encodes as video', async () => {
    const options: OutputOptions = typeOutputOptions($VIDEO)
    const id = `encoding-shape-id-${Date.now()}`
    const inputPath = '/moviemasher/tests/server/json/mash_shape.json'
    const orError = await readJsonFilePromise<MashAssetObject>(inputPath)
    failIfError<Data<MashAssetObject>>(orError)
    const { data: asset } = orError
    const encodeArgs: EncodeArgs = { asset, options, type: $VIDEO }
    const promise = MOVIE_MASHER.promise(encodeArgs, $ENCODE, { id, user: 'shared' })
    failIfError(await promise)
  })

  test('problematic permutations encode as video', async () => {
    const ids = [
      'RGB_M_F_in_R_U_M_H_100-0',
      'RGB_BR-M_D-F_in_R_U_BR-M_F-H_100',
      'V_BR-M_D-F_in_R_C_BR-M_F-H_100',
      'BL-RE_in_R_C_BR-M_F-H_100',
      // 'BL_in_K_U_M_H_50',
      // 'BL_in_T_U_BR-M_F-H_100-0',
      // 'BL_in_T_U_M_F-H_100-0',
      // 'BL-RE_in_K_U_M_F_100-0', 
      // 'BL-RE_in_K_U_M_H_100-0', 
      // 'BL-RE_in_K_U_M_H_50',
      // 'BL-RE_in_S_U_M_F_100-0',
      // 'P_M_D-F_in_S_U_BR-M_F-H_100-0',
      // 'P_M_F_in_A_C_M_F-H_50',
      // 'P_M_F_in_A_U_TL_F-H_50',
      // 'P_M_F_in_S_U_M_H_100',
      // 'P_M_F_in_T_U_M_F-H_100',
      // 'P_M_F_in_T_U_M_F-H_50',
      // 'P_M_F_in_T_U_TL_F-H_50',
      // 'RGB_BR-M_F_in_R_C_BR-M_F-H_100-0',
      // 'V_TL_F_in_R_U_M_F_100-0', 
      // 'V_TL_F_in_S_U_M_F_100-0', 
    ]
    failIfError(await encodeIds(ids))
  })
}) 
describe.skip('Encoding', () => {
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

