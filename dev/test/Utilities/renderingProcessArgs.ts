import { idGenerate } from "@moviemasher/moviemasher.js"

import {
  TestRenderOutput, TestRenderCache, TestFilePrefix
} from "../Setup/Constants"

export const renderingProcessTestArgs = (id?: string) => {
  const definedId = id || idGenerate()
  return {
    cacheDirectory: TestRenderCache,
    outputDirectory: `${TestRenderOutput}/${definedId}`,
    filePrefix: TestFilePrefix,
    defaultDirectory: 'shared',
    validDirectories: [],
    id: definedId,
}}
