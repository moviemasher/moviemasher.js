import { describe, test } from 'node:test'
import assert from 'assert'

import { LoadType, arrayLast, BrowserLoaderClass, urlOptions } from "@moviemasher/moviemasher.js"

describe("Loader", () => {
  describe("parseUrlPath", () => {
    const endpoint = { 
      protocol: 'http:', hostname: 'moviemasher.com', pathname: '/username' 
    }
    const endpointPrefix = `${endpoint.protocol}//${endpoint.hostname}${endpoint.pathname}`
    // test("do it", () => {
    //   const loader = new BrowserLoaderClass(endpoint)
    //   const urls = [
    //     'svg:/file.jpg',
    //     'svg:width=1;height=1/../file.jpg',
    //     'svg:/image:100x24/audio:start=0;end=1.5/video:fps=10/http://movie.mp4',
    //   ]
    //   urls.forEach(url => {
    //     console.log(url, loader.parseUrlPath(url))
    //   })
    // })
    
    test("returns expected file for object", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const file = { 
        loaderPath: `image:/${endpointPrefix}/foo/bar.jpg`, 
        loaderType: LoadType.Image, 
        urlOrLoaderPath: `${endpointPrefix}/foo/bar.jpg`,
        options: undefined
      }
      const expected = [file]
      const actual = loader.parseUrlPath(file.loaderPath)
      assert.deepStrictEqual(actual, expected)
    })


    test("returns expected file for object", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const file = { 
        loaderPath: 'video:/object:/id', 
        loaderType: LoadType.Video, 
        urlOrLoaderPath: 'object:/id', 
        options: undefined
      }
      const files = [file]
      assert.deepStrictEqual(loader.parseUrlPath(file.loaderPath), files)
    })

    const videoFile = () => {
      const urlOrLoaderPath = `${endpointPrefix}/whatever/movie.mp4`
      const loaderType = LoadType.Video
      const frame = 2 
      const fps = 30

      const options = { frame, fps }
      const loaderPath = `${loaderType}:${urlOptions(options)}/${urlOrLoaderPath}` 
      const videoFile = { 
        loaderPath, urlOrLoaderPath, loaderType, options 
      }  
      return videoFile
    }

    test("returns expected file for video", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const file = videoFile()
      const files = [file]
      assert.deepStrictEqual(loader.parseUrlPath(file.loaderPath), files)
    })

    const audioFromVideoFiles = () => {
      const file = videoFile()
      const urlOrLoaderPath = file.loaderPath
      const loaderType = LoadType.Audio
      const options = { start: 0, end: 1.5 }
      const loaderPath = `${loaderType}:${urlOptions(options)}/${urlOrLoaderPath}` 
      const audioFile = { loaderPath, urlOrLoaderPath, loaderType, options }  
      return [file, audioFile]
    }
    
    test("returns expected files for audio from video", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const files = audioFromVideoFiles()
      // const [file] = files
      const file = arrayLast(files)
      assert.deepStrictEqual(loader.parseUrlPath(file.loaderPath), files.reverse())
    })

    const imageFromVideoFiles = () => {
      const file = videoFile()
      const urlOrLoaderPath = file.loaderPath
      const loaderType = LoadType.Image
      const width = 640
      const height = 480
      const options = { width, height }
      const loaderPath = `${loaderType}:${urlOptions(options)}/${urlOrLoaderPath}` 
      const audioFile = { loaderPath, urlOrLoaderPath, loaderType, options }  
      return [file, audioFile]
    }
    
    test("returns expected files for image from video", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const files = imageFromVideoFiles()
      // const [file] = files
      const file = arrayLast(files)
      assert.deepStrictEqual(loader.parseUrlPath(file.loaderPath), files.reverse())
    })
  })
  
})