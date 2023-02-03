export * from './Transcoder'

// export * from './WaveformOutputClass'
// export * from './ImageSequenceOutputClass'



/*
from RenderingProcessClass

if (upload) {
  const [clip] = this.mashInstance.tracks[0].clips
  const { contentId } = clip
  
  const definition = Defined.fromId(contentId)
  if (isPreloadableDefinition(definition)) {
    const { source: file, loadType: type } = definition
    const { preloader, args } = this
    const { outputDirectory } = args
    const graphFile: GraphFile = {
      input: true, definition, type, file
    }
    assertLoadType(type)
    
    const url = preloader.key(graphFile)
    const infoPath = preloader.infoPath(url)
    
    if (fs.existsSync(infoPath)) {
      // console.log("url", url, "infoPath", infoPath)
      return fs.promises.copyFile(infoPath, path.join(outputDirectory, `upload.${ExtensionLoadedInfo}`)).then(() => {
        return runResult
      })
    }
    
  }
}

*/