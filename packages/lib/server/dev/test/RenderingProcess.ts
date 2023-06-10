import { describe, test } from 'node:test'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { MashAssetObject, OutputOptions, SizePreview, VideoOutputOptions, assertPopulatedArray, outputOptions } from "@moviemasher/lib-shared"

import { renderingTestIdPromise, renderingMashTestPromise } from './Rendering'
import { TypeVideo } from '@moviemasher/runtime-shared'
import { GenerateMashTest } from './Generate'

describe("RenderingProcess", () => {
  // urlBaseInitialize('file://' + path.resolve(environment(EnvironmentKeyApiDirFilePrefix), 'user'))

  const testIds = [
    "P_M_F_in_S_U_M_H_100", "P_BR-M_D-F_in_R_C_BR-M_F-H_100"
  ]
  const testIdPromise = async (id) => {
    const options: VideoOutputOptions = { ...SizePreview }//, mute: true
    const videoOutput = outputOptions(TypeVideo, options) 
    const results = await renderingTestIdPromise(id, videoOutput, true, 5)
    // const [result] = results
    // assert(result, 'result')
    // // console.log(result)
    // const { destination, error } = result
    // assert(!error, 'no error')
    // assert(destination, 'destination')
    // assert(fs.existsSync(destination), `exists: ${destination}`)
    // // assert.deepStrictEqual(result, {})
  }
  testIds.forEach(id => { 
    test(`renders ${id}`, async () => { await testIdPromise(id)})
  })
  
  const standaloneFiles = [
    // "temporary/standalone/media/doug/4ae36b94-af4e-4de5-abc9-f1412b946d07/2233d7ca-89db-4593-a715-fbb025a23c19/rendering.json"
  ]
  const testFile = async (relative) => {
    const file = path.resolve(relative)
    
    const buffer = await fs.promises.readFile(file)
    const json = await buffer.toString()
    const job: { id: string, mash: MashAssetObject } = JSON.parse(json)
    const { id, mash } = job
    // console.log(job)
    assert(id, 'id')

    const { tracks } = mash
    assertPopulatedArray(tracks)
    const { clips } = tracks[0]
    assertPopulatedArray(clips)

    const renderDirectory = path.dirname(file)
    const mashDirectory = path.dirname(renderDirectory)
    const userDirectory = path.dirname(mashDirectory)
    const mediaDirectory = path.dirname(userDirectory)

  
    // const input = renderingProcessInput(id, filePrefix, defaultDirectory)
    // const processArgs = {
    //   temporaryDirectory: TestTemporary,
    //   ...input, ...job
    // }

    // const renderingProcess = renderingProcessInstance(processArgs)

    const test: GenerateMashTest = [id, mash]
    const options: OutputOptions = {}
    // mediaDirectory, userDirectory
    const results = await renderingMashTestPromise(test, options)
    // const [result] = results
    // assert(result, 'result')
    // const { destination, error } = result
    // console.log(result)
    // assert(!error, 'error')
    // assert(destination, 'destination')
    // assert(fs.existsSync(destination))

  }
  standaloneFiles.forEach(file => {
    const name = path.basename(path.dirname(file))
    test(`renders ${name}`, async () => {
      await testFile(file)
    })
  })
})
