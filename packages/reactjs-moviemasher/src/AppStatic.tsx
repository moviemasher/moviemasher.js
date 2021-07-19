// import React, { ReactElement, useEffect, useState } from 'react'
// import { Browser, BrowserNodesType, BrowserObject } from './Panels/Browser';
// import { Inspector, InspectorObject } from './Panels/Inspector';
// import { Player, PlayerNodesFrame, PlayerNodesPaused, PlayerNodesVolume, PlayerObject } from './Panels/Player';
// import {
//   Timeline,
//   TimelineNodesCopy,
//   TimelineNodesCut,
//   TimelineNodesDelete,
//   TimelineNodesPaste,
//   TimelineNodesRedo,
//   TimelineNodesRender,
//   TimelineNodesSave,
//   TimelineNodesSplit,
//   TimelineNodesUndo,
//   TimelineNodesZoom,
//   TimelineObject
// } from './Panels/Timeline';
// import './css/moviemasher-layout.css'

// import { DefinitionType, EventType, Mash, Masher, MovieMasher, UnknownObject } from '@moviemasher/moviemasher.js';
// import { v4 as uuid } from "uuid"

// interface BrowserOptions {
//   selected? : DefinitionType
//   type? : BrowserNodesType
// }

// interface PlayerOptions {
//   paused? : PlayerNodesPaused
//   volume? : PlayerNodesVolume
//   frame? : PlayerNodesFrame
// }

// interface InspectorOptions {

// }

// interface TimelineOptions {
//   copy? : TimelineNodesCopy
//   cut? : TimelineNodesCut
//   delete? : TimelineNodesDelete
//   scrub? : ReactElement
//   paste? : TimelineNodesPaste
//   redo? : TimelineNodesRedo
//   render? : TimelineNodesRender
//   save? : TimelineNodesSave
//   split? : TimelineNodesSplit
//   undo?: TimelineNodesUndo
//   zoom? : TimelineNodesZoom
// }

// interface ClassAndId {
//   className?: string
//   id?: string
// }
// interface ComponentObject extends ClassAndId {

// }

// interface RowObject extends ClassAndId {
//   components : ComponentObject[]
// }
// interface PanelObject extends ClassAndId {

//   rows : RowObject[]
// }
// interface AppStaticObject {
//   panels : PanelObject[]
//   api? : string
//   player? : PlayerOptions
//   browser? : BrowserOptions
//   timeline? : TimelineOptions
//   inspector? : InspectorOptions
// }

// interface PanelProps {
//   masher? : boolean
//   timeline?: boolean
//   inspector? : boolean
//   browser? : boolean
// }

// const AppStatic : React.FC<AppStaticObject> = (props) => {
//   const { api, browser, inspector, player, timeline, children } = props

//   if (children && typeof children !== "boolean") {
//     React.Children.map(children, child => {
//       if (!React.isValidElement<PanelProps>(child)) {
//         return child
//       }

//       let elementChild: React.ReactElement<EnrichedChildren> = child
//       if (child.props.children) {
//         elementChild = React.cloneElement<EnrichedChildren>(elementChild, {
//           children: this.enrichRadioElements(elementChild.props.children, name),
//         })
//       }

//       if (elementChild.type === 'Radio') {
//         return React.cloneElement(elementChild, {
//           onChange: () => {},
//           selectedValue: 'value',
//           name: name,
//         })
//       } else {
//         return elementChild
//       }
//     })



//     children
//   }


//   const [mash, setMash] = useState(createMash)

//   const createMasher = () : Masher => {
//     // console.log("createMasher")
//     return MovieMasher.masher.instance({ mash })
//   }

//   const [masher] = useState(createMasher)

//   const [paused, setPaused] = useState(masher.paused)
//   const [volume, setVolume] = useState(masher.volume)
//   const [frame, setFrame] = useState(masher.frame)
//   const [fps, setFps] = useState(masher.fps)
//   const [frames, setFrames] = useState(masher.frames)
//   const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>()
//   const handleDuration = () => {
//     console.log("handleDuration")
//     setFrames(masher.frames)
//   }

//   const handleFps = () => {
//     console.log("handleFps")
//     setFps(masher.fps)
//   }
//   const handleVolume = () => {
//     console.log("handleVolume")
//     setVolume(masher.volume)
//   }
//   const handlePaused = () => {
//     console.log("handlePaused", masher.paused)
//     setPaused(masher.paused)
//   }
//   const handleTime = () => {
//     // console.log("handleTime")
//     setFrame(masher.frame)
//   }


//   const changeCanvas = (value? : HTMLCanvasElement) => {
//     console.log("changeCanvas", value)
//     if (canvas) {
//       canvas.removeEventListener(EventType.Duration, handleDuration)
//       canvas.removeEventListener(EventType.Fps, handleFps)
//       canvas.removeEventListener(EventType.Pause, handlePaused)
//       canvas.removeEventListener(EventType.Play, handlePaused)
//       canvas.removeEventListener(EventType.Time, handleTime)
//       canvas.removeEventListener(EventType.Volume, handleVolume)
//     }
//     if (value) {
//       value.addEventListener(EventType.Duration, handleDuration)
//       value.addEventListener(EventType.Fps, handleFps)
//       value.addEventListener(EventType.Pause, handlePaused)
//       value.addEventListener(EventType.Play, handlePaused)
//       value.addEventListener(EventType.Time, handleTime)
//       value.addEventListener(EventType.Volume, handleVolume)
//       masher.canvas = value
//       setCanvas(value)
//     }
//   }

//   const changeFrame = (value : number) => {
//     // console.log("changeFrame", value)
//     masher.frame = value
//   }

//   const changePaused = (value : boolean) => {
//     console.log("changePaused", value)
//     masher.paused = value
//   }

//   const changeVolume = (value : number) => {
//     console.log("changeVolume", value)
//     masher.volume = value
//   }

//   useEffect(() => changeCanvas, [])

//   const nodeBrowser = (options : BrowserOptions) => {
//     const object : BrowserObject = {
//       controls: { type: options.type },
//       selected: options.selected
//     }
//     return <Browser key='browser' { ...object }/>
//   }

//   const nodeInspector = ( options : InspectorOptions) => {
//     const object : InspectorObject = {}
//     return <Inspector key='inspector' { ...object }/>
//   }

//   const nodePlayer = (options : PlayerOptions) => {
//     const controls : UnknownObject = {}
//     if (options.paused) {
//       controls.paused = {
//         value: paused,
//         setter: changePaused,
//         nodes: options.paused,
//       }
//     }
//     if (options.volume) {
//       controls.volume = {
//         value: volume,
//         setter: changeVolume,
//         nodes: options.volume,
//       }
//     }
//     if (options.frame) {
//       controls.frame = {
//         value: frame,
//         frames,
//         fps,
//         setter: changeFrame,
//         nodes: options.frame,
//       }
//     }
//     const object : PlayerObject = { controls, changeCanvas }
//     return <Player key='player' { ...object } />
//   }

//   const nodeTimeline = (options : TimelineOptions) => {
//     const controls : UnknownObject = {}
//     if (options.copy) controls.copy = { nodes: controls.copy }
//     if (options.cut) controls.cut = { nodes: controls.cut }
//     if (options.delete) controls.delete = { nodes: controls.delete }
//     if (options.scrub) {
//       controls.scrub = {
//         frame,
//         setter: changeFrame,
//         element: options.scrub
//       }
//     }
//     if (options.paste) controls.paste = { nodes: options.paste }
//     if (options.redo) controls.redo = { nodes: options.redo }
//     if (options.render) controls.render = { nodes: options.render }
//     if (options.save) controls.save = { nodes: options.save }
//     if (options.split) controls.split = { nodes: options.split }
//     if (options.undo) controls.undo = { nodes: options.undo }
//     if (options.zoom) controls.zoom = { nodes: options.zoom }
//     const object: TimelineObject = {
//       controls,
//       frames,
//       clipsSlice: mash.clipsVisibleSlice.bind(mash)
//     }
//     return <Timeline key='timeline' { ...object } />
//   }

//   const controls = []
//   if (player) controls.push(nodePlayer(player))
//   if (browser) controls.push(nodeBrowser(browser))
//   if (inspector) controls.push(nodeInspector(inspector))
//   if (timeline) controls.push(nodeTimeline(timeline))
//   return <>{ ...controls }</>
// }

// export { AppStatic, AppStaticObject }
