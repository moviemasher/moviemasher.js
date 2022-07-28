import { RenderingProcessInput } from "../../../packages/server-express/src/Server/RenderingServer/RenderingProcess/RenderingProcess"
import path from "path"
import { idGenerate } from "@moviemasher/moviemasher.js/src/Utility/Id"

import {
  TestRenderOutput, TestRenderCache, TestFilePrefix
} from "../Setup/Constants"

export const renderingProcessInput = (id: string): RenderingProcessInput => {
  return {
    cacheDirectory: TestRenderCache,
    outputDirectory: `${TestRenderOutput}/${id}`,
    filePrefix: TestFilePrefix,
    defaultDirectory: 'shared',
    validDirectories: [path.resolve(TestRenderOutput)],
}}
