import path from "path"

import {
  TestRenderOutput, TestRenderCache, TestFilePrefix
} from "../../../images-deleted/tester/Setup/Constants.mjs"

export const renderingProcessInput = (id) => {
  return {
    cacheDirectory: TestRenderCache,
    outputDirectory: `${TestRenderOutput}/${id}`,
    filePrefix: TestFilePrefix,
    defaultDirectory: 'shared',
    validDirectories: [path.resolve(TestRenderOutput)],
}}
