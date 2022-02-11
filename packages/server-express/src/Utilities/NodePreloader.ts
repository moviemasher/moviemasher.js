import fs from 'fs'
import https from 'https'
import path from 'path'
import md5 from 'md5'
import { loadImage } from 'canvas'


import { Any, GraphFile, GraphType, LoadPromise, Preloader } from '@moviemasher/moviemasher.js'

class NodePreloader implements Preloader {
  constructor(cacheDirectory: string, fileDirectory: string) {
    this.cacheDirectory = cacheDirectory
    this.fileDirectory = fileDirectory
  }

  private cacheByKey = new Map<string, Any>()

  cacheDirectory: string

  fileDirectory: string

  getFile(graphFile: GraphFile): Any {
    const cachePath = this.key(graphFile)
    const something = this.cacheByKey.get(cachePath)
    console.log(this.constructor.name, "getFile", cachePath, something)
    return something
  }

  graphType = GraphType.Mash

  key(graphFile: GraphFile): string {
    const { file } = graphFile
    const local = !file.startsWith('http')
    if (local) return file // path.resolve(this.fileDirectory, file)

    const extension = path.extname(file)
    const base = path.basename(file, extension)
    const directory = path.dirname(file)
    const urlBase = `${directory}/${base}`
    const fileMd5 = md5(urlBase)
    const fileName = `${fileMd5}${extension}`
    return path.join(this.cacheDirectory, fileName)
  }

  loadFilePromise(graphFile: GraphFile): Promise<GraphFile> {
    const { file, type } = graphFile

    const local = !file.startsWith('http')
    const cachePath = this.key(graphFile)

    let promise: Promise<void> = local ? Promise.resolve() : new Promise((resolve, reject) => {
      console.log(this.constructor.name, 'requesting', file)
      https.get(file, (res) => {
        console.log(this.constructor.name, 'requested', file)
        const stream = fs.createWriteStream(cachePath)
        res.pipe(stream)
        stream.on('finish', () => {
          console.log(this.constructor.name, 'loadFilePromise finish', cachePath)
          stream.close()
          resolve()
        })
        stream.on('error', () => { reject() })
      })
    })

    return promise.then(() => {
      console.log("loadFilePromise loadImage...")
      const promise = loadImage(cachePath)
      // new Promise((resolve) => {
      //   const image = new canvas.Image()
      //   image.src = cachePath
      //   image.onload = () => {
      //     console.log(this.constructor.name, 'loadFilePromise onload', cachePath)
      //     this.cacheByKey.set(cachePath, image)
      //     resolve()
      //   }
      // })
      return promise.then((image) => {
        this.cacheByKey.set(cachePath, image)
        console.log("loadFilePromise loadImage", cachePath, image.constructor.name)
        return graphFile
      })
    })
  }

  loadFilesPromise(files: GraphFile[]): Promise<GraphFile[]> {
    return Promise.all(files.map(file => this.loadFilePromise(file)))
  }

  loadedFile(graphFile: GraphFile): boolean {
    return true
  }
  loadingFile(graphFile: GraphFile): boolean { return false }

  loadingFilePromise(graphFile: GraphFile): LoadPromise { return Promise.resolve() }
}

export { NodePreloader }
