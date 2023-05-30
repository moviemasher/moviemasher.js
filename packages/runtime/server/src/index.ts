import { EventEmitter }  from 'events'

export const MovieMasher = new EventEmitter()

MovieMasher.addListener('test', (event) => {
  console.log(event)
})
MovieMasher.emit('test', new CustomEvent('test'))