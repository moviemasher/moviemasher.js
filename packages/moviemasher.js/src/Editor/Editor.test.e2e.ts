import fs from 'fs'
import path from 'path'

import { DefinitionObject } from '../Definition/Definition'
import { MashData } from './Editor'
import { DefinitionType, } from '../Setup/Enums'
import { ImageDefinitionObject } from '../Media/Image/Image'
import { fontDefault } from '../Media/Font/FontFactory'
import { PuppeteerHost, PuppeteerPort } from '../../../../dev/tester/src/Setup/Constants'
import { ClipObject } from '../Media/Clip/Clip'
import { clipDefault } from '../Media/Clip/ClipFactory'
import { defaultTextId } from '../../../../dev/test/Setup/Constants'

describe('Editor', () => {
  describe("svg", () => {
    test('should display text', async () => {
      const fileName = 'test/text.html'
      const filePath = path.resolve('./workspaces/tester/dist', fileName)
      const fontUrl = fontDefault.url
      // console.log("fontUrl", fontUrl)
      const html = `
      <html>
        <style>
          @font-face {
            font-family: 'CustomFont';
            src: url('${fontUrl}') format('woff2');
          }
          #content {
            font-size: 50px;
            color: red;
            font-family: 'CustomFont';
            display: inline-block;
            width: 100px;
            height: 100px;
          }
        </style>
        <body>
          <div id='content'>Text</div>
        </body>
      </html>
      `
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, html)
      const url = `http://${PuppeteerHost}:${PuppeteerPort}/${fileName}`
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('#content')
      await page.evaluateHandle('document.fonts.ready')
      const element = await page.$('#content')
      expect(element).toBeTruthy()
      const image = await element!.screenshot({ omitBackground: true })
      expect(image).toMatchImageSnapshot()
    })
    test('displays Image clip correctly', async () => {
      const imageDefinition: ImageDefinitionObject = {
        source: '../shared/image/frog.jpg',
        url: '../shared/image/frog.jpg',
        id: 'image',
        type: DefinitionType.Image,
      }
      await expectDefinitionDisplays(imageDefinition)
    })

    test('displays Text correctly', async () => {
      const clipObject: ClipObject = {
        definitionId: clipDefault.id,
        containerId: defaultTextId,
        string: 'hey!'
      }
      await expectClipDisplays(clipObject)
    })
  })

  const expectMashDataDisplays = async (data: MashData) => {
    const { id } = data.mash!
    const fileName = `${id}.json`
    const filePath = path.resolve('./workspaces/tester/dist/test/', fileName)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(data))
    const url = `http://${PuppeteerHost}:${PuppeteerPort}/test/index.html?${fileName}`
    // page.on('request', (something) => { console.log("REQUEST", something.url()) })
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()))
    page.on('pageerror', (msg) => console.log('PAGE ERROR:', msg.name, msg.message))
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('#loaded')
    const checking = 'Movie Masher'
    const title = await page.title()
    expect(title).toEqual(checking)
    expect(page.isJavaScriptEnabled()).toBeTruthy()
    // await page.evaluate(() => console.log(`url is ${location.href}`))

    const element = await page.$('#preview')
    expect(element).toBeTruthy()
    // console.log("TAKING SCREENSHOT")
    const image = await element!.screenshot()
    expect(image).toMatchImageSnapshot()
  }

  const expectClipDisplays = async (clip: ClipObject) => {
    const { label: id } = clip
    const data: MashData = {
      mash: { id, tracks: [{ clips: [clip] }] }, definitions: []
    }
    await expectMashDataDisplays(data)
  }

  const expectDefinitionDisplays = async (definition: DefinitionObject) => {
    const { id } = definition
    const visibleClipObject: ClipObject = {
      definitionId: clipDefault.id,
      contentId: id,
    }
    const data: MashData = {
      mash: { id, tracks: [{ clips: [visibleClipObject] }] }, definitions: [definition]
    }
    await expectMashDataDisplays(data)
  }

})
