import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Masher, Player, PlayerContent, useEditor, useListeners } from "@moviemasher/client-react"
import { EventType } from '@moviemasher/moviemasher.js'
import "./index.css"

const LoaderComponent = () => {
  const [loaded, setLoaded] = React.useState(false)
  const [drawn, setDrawn] = React.useState(false)
  useListeners({ [EventType.Draw]: () => { setDrawn(true) } })
  const editor = useEditor()

  React.useEffect(() => {
    const { search } = window.location
    if (!search) return

    fetch(search.slice(1)).then(response => response.json()).then(json => {
      setDrawn(false)
      editor.load(json).then(() => { setLoaded(true) })
    })
  }, [])

  if (!(loaded && drawn)) return null

  return <div id='loaded'></div>
}

const masher = (
  <Masher className="editor">
    <Player id="preview">
      <PlayerContent id="content" />
      <LoaderComponent/>
    </Player>
  </Masher>
)
const strictMode = <StrictMode>{masher}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
