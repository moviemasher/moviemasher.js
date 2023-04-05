// import { Masher } from "@moviemasher/lib-core"

// import { useMasher } from "./useMasher"

import { ActivityObjects } from "../Components/Activity/ActivityContext"

export const useMasherActivity = ():  ActivityObjects => {
  // console.log("useEditorActivity")
  // const masherContext = React.useContext(MasherContext)
  // const editor = useMasher()

  // const allActivitiesRef = React.useRef<ActivityObjects>([])
  // const { eventTarget } = editor
  
  // const getSnapshot = () => {
  //   return allActivitiesRef.current
  // }

  // const handleEvent = (event: Event) => {
  //   const { type } = event
  //   if (isEventType(type) && (event instanceof CustomEvent)) {
  //     const info: ActivityInfo = event.detail
  //     const { id, type } = info
  //     const { current: allActivities } = allActivitiesRef
  //     const existing = allActivities.find(activity => activity.id === id)

  //     const activity: ActivityObject = existing || { id, activityGroup: ActivityGroup.Active, infos: [] }
  //     activity.infos.unshift(info)
  //     if (type === ActivityType.Complete) activity.activityGroup = ActivityGroup.Complete
  //     else if (type === ActivityType.Error) {
  //       activity.activityGroup = ActivityGroup.Error
  //     }
  //     if (!existing) allActivities.unshift(activity)
  //   }
  // }
  const externalStore: ActivityObjects = []
  // React.useSyncExternalStore<ActivityObjects>((callback) => {
  //   eventTarget.addEventListener(EventType.Active, callback)
  //   return () => {
  //     eventTarget.removeEventListener(EventType.Active, callback)
  //   }
  // }, getSnapshot)

  // const removeListener = () => {
  //   eventTarget.removeEventListener(EventType.Active, handleEvent)
  // }

  // const addListener = () => {
  //   eventTarget.addEventListener(EventType.Active, handleEvent)

  //   return () => { removeListener() }
  // }

  // React.useEffect(() => addListener(), [])
  
  return externalStore
}