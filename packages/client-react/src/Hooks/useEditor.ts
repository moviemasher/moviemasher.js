import React from "react"
import { Editor } from "@moviemasher/moviemasher.js"
import { EditorContext } from "../Contexts/EditorContext"

export const useEditor = (): Editor => React.useContext(EditorContext).editor!
