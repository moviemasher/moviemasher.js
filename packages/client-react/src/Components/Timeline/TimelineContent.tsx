import React from 'react'
import { EventType, SelectionType } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from '../../declarations'
import { useListeners } from '../../Hooks/useListeners'
import { useEditor } from '../../Hooks/useEditor'
import { View } from '../../Utilities/View'
import { TimelineContext } from '../../Contexts/TimelineContext'

/**
 * @parents Timeline
 * @children TimelineTracks, TimelineScrubber, TimelineSizer
 */
export function TimelineContent(props: PropsWithChildren): ReactResult {
  const timelineContext = React.useContext(TimelineContext)

  const { setScroll } = timelineContext
  const ref = React.useRef<HTMLDivElement>(null)
  const editor = useEditor()
  const resetScroll = () => { ref.current?.scrollTo(0, 0) }
  useListeners({ [EventType.Mash]: resetScroll })

  const onClick = () => { editor.deselect(SelectionType.Track) }
  const onScroll = () => {
    setScroll({ x: ref.current!.scrollLeft, y: ref.current!.scrollTop })
  }
  const viewProps = { ...props, onClick, onScroll, ref }
  return <View {...viewProps} />
}
