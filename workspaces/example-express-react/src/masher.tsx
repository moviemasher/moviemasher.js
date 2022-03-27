import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  Api, DefaultIcons, Masher, MasherDefault, MasherDefaultOptions,
  UploadControl, SaveControl, RenderControl, Button, BrowserDataSource,
  Process, ProcessStatus, ProcessActive,
} from "@moviemasher/client-react"

import "@moviemasher/client-react/dist/moviemasher.css"

const uploadProcess = [
  <Process key='upload-process' id='data'>
    <UploadControl>
      {DefaultIcons.upload}
    </UploadControl>
    <ProcessActive><ProcessStatus/></ProcessActive>
  </Process>
]

const saveProcess = [
  <Process key='save-process' id='data'>
    <SaveControl><Button>Save</Button></SaveControl>
  </Process>
]

const renderProcess = [
  <Process key='render-process' id='rendering'>
    <RenderControl><Button>Render</Button></RenderControl>
  </Process>
]
const icons = DefaultIcons

const browserSources = [
  <BrowserDataSource key='video' id='videosequence' className='button-icon' children={icons.browserVideo} />,
  <BrowserDataSource key='image' id='image' className='button-icon' children={icons.browserImage} />,
  <BrowserDataSource key='audio' id='audio' className='button-icon' children={icons.browserAudio} />,
]

const applicationOptions: MasherDefaultOptions = {
  icons,
  panels: {
    player: { header: { content: <img key='mm' src="mm.svg"/> }},
    browser: { header: { before: browserSources }, footer: { before: uploadProcess } },
    timeline: { header: { before: saveProcess, after: renderProcess } },
  },
}

const editor = <Masher {...MasherDefault(applicationOptions)} />
const host = <Api>{editor}</Api>
const mode = <StrictMode>{host}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
