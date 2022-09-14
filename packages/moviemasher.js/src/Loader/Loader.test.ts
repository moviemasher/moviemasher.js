import { GraphFileType, LoadType } from "../Setup/Enums"
import { arrayLast } from "../Utility/Array"
import { LoaderFile } from "./Loader"
import { BrowserLoaderClass} from "./BrowserLoaderClass"
import { Endpoint } from "../declarations"
import { urlOptions } from "../Utility/Url"

describe("Loader", () => {
  describe("parseUrlPath", () => {
    const endpoint: Endpoint = { protocol: 'http', host: 'moviemasher.com', prefix: '/username' }
    
    test.only("do it", () => {
      const loader = new BrowserLoaderClass(endpoint)

      const urls = [

        'svg:/file.jpg',
        'svg:width=1;height=1/../file.jpg',
        'svg:/image:100x24/audio:start=0;end=1.5/video:fps=10/http://movie.mp4',

      ]
      urls.forEach(url => {

        console.log(url, loader.parseUrlPath(url))
      })
    })
    
    test("returns expected file for object", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const file: LoaderFile = { loaderPath: 'image:/foo/bar.jpg', loaderType: LoadType.Image, urlOrLoaderPath: 'foo/bar.jpg' }
      const files = [file]
      expect(loader.parseUrlPath(file.loaderPath)).toEqual(files)
    })


    test("returns expected file for object", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const file: LoaderFile = { 
        loaderPath: 'video:/object:/id', 
        loaderType: LoadType.Video, 
        urlOrLoaderPath: 'object:/id' 
      }
      const files = [file]
      expect(loader.parseUrlPath(file.loaderPath)).toEqual(files)
    })

    const videoFile = () => {
      const urlOrLoaderPath = '../whatever/movie.mp4'
      const loaderType = LoadType.Video
      const frame = 2 
      const fps = 30

      const options = { frame, fps }
      const loaderPath = `${loaderType}:${urlOptions(options)}/${urlOrLoaderPath}` 
      const videoFile: LoaderFile = { 
        loaderPath, urlOrLoaderPath, loaderType, options 
      }  
      return videoFile
    }

    test("returns expected file for video", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const file = videoFile()
      const files = [file]
      expect(loader.parseUrlPath(file.loaderPath)).toEqual(files)
    })

    const audioFromVideoFiles = () => {
      const file = videoFile()
      const urlOrLoaderPath = file.loaderPath
      const loaderType = LoadType.Audio
      const options = { start: 0, end: 1.5 }
      const loaderPath = `${loaderType}:${urlOptions(options)}/${urlOrLoaderPath}` 
      const audioFile: LoaderFile = { loaderPath, urlOrLoaderPath, loaderType, options }  
      return [file, audioFile]
    }
    
    test("returns expected files for audio from video", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const files = audioFromVideoFiles()
      const file = arrayLast(files)
      expect(loader.parseUrlPath(file.loaderPath)).toEqual(files)
    })

    const imageFromVideoFiles = () => {
      const file = videoFile()
      const urlOrLoaderPath = file.loaderPath
      const loaderType = LoadType.Image
      const width = 640
      const height = 480
      const options = { width, height }
      const loaderPath = `${loaderType}:${urlOptions(options)}/${urlOrLoaderPath}` 
      const audioFile: LoaderFile = { loaderPath, urlOrLoaderPath, loaderType, options }  
      return [file, audioFile]
    }
    
    test("returns expected files for image from video", () => {
      const loader = new BrowserLoaderClass(endpoint)
      const files = imageFromVideoFiles()
      const file = arrayLast(files)
      expect(loader.parseUrlPath(file.loaderPath)).toEqual(files)
    })
  })
  
})