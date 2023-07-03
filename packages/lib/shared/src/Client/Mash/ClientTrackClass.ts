

import type { Actions, ClientClips, ClientMashAsset, ClientTrack, Selectables, SelectedProperties } from '@moviemasher/runtime-client'
import type { Scalar } from '@moviemasher/runtime-shared'
import type { ChangePropertyActionObject } from '../Masher/Actions/Action/ActionTypes.js'


import { ActionTypeChange } from '../../Setup/ActionTypeConstants.js'
import { TypeTrack } from '../../Setup/TypeConstants.js'
import { TrackClass } from '../../Shared/Mash/Track/TrackClass.js'
import { assertPopulatedString, assertTrue } from '../../Shared/SharedGuards.js'
import { arraySet } from '../../Utility/ArrayFunctions.js'

export class ClientTrackClass extends TrackClass implements ClientTrack {

  addClips(clips: ClientClips, insertIndex = 0): void {
    let clipIndex = insertIndex || 0
    if (!this.dense)
      clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips: ClientClips = [] // build array of clips already in this.clips

    // build array of my clips excluding the clips we're inserting
    const spliceClips = this.clips.filter((other, index) => {
      const moving = clips.includes(other)
      if (moving)
        movingClips.push(other)
      // insert index should be decreased when clip is moving and comes before
      if (origIndex && moving && index < origIndex)
        clipIndex -= 1
      return !moving
    })
    // insert the clips we're adding at the correct index, then sort properly
    spliceClips.splice(clipIndex, 0, ...clips)
    this.sortClips(spliceClips)
    arraySet(this.clips, spliceClips)
  }

  declare clips: ClientClips

  declare mash: ClientMashAsset

  removeClips(clips: ClientClips): void {
    const newClips = this.clips.filter(other => !clips.includes(other))
    assertTrue(newClips.length !== this.clips.length)
    clips.forEach(clip => clip.trackNumber = -1)
    this.sortClips(newClips)
    arraySet(this.clips, newClips)
  }
  selectType = TypeTrack

  selectables(): Selectables { return [this, ...this.mash.selectables()] }

  selectedItems(actions: Actions): SelectedProperties {
    return this.properties.map(property => {
      const undoValue = this.value(property.name)
      return {
        value: undoValue,
        property, selectType: TypeTrack,
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)

          const options: ChangePropertyActionObject = {
            type: ActionTypeChange,
            target: this, property, redoValue, undoValue,
            redoSelection: actions.selection,
            undoSelection: actions.selection,
          }
          actions.create(options)
        }
      }
    })
  }
}
