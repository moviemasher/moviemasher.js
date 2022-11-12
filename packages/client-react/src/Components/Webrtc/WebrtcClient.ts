import {
  EndpointPromiser,
  Endpoints, Errors,assertDefined,
  StreamingDeleteRequest, StreamingDeleteResponse,
  StreamingRemoteRequest, StreamingRemoteResponse,
  StreamingWebrtcRequest, StreamingWebrtcResponse
} from "@moviemasher/moviemasher.js"

function enableStereoOpus(sdp:string):string {
  return sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111')
}

export class WebrtcClient {
  constructor(public endpointPromise: EndpointPromiser, public localStream?: MediaStream) {}

  beforeAnswer(peerConnection: RTCPeerConnection) {
    const { localStream } = this
    assertDefined(localStream)

    const width = 1920
    const height = 1080
    let promise = Promise.resolve()

    localStream.getTracks().forEach(track => {
      const { contentHint, kind } = track
      if (kind === 'video') {
        promise = track.applyConstraints({ width, height }).then(() => {

          peerConnection.addTrack(track, localStream)
        })
      } else peerConnection.addTrack(track, localStream)
      
      console.log(this.constructor.name, "beforeAnswer adding track", kind, contentHint, track.getCapabilities(), track.getConstraints(), track.getSettings())
      
    })

    // hack so that we can get a callback when the RTCPeerConnection
    //  is closed. In the future, we can subscribe to
    // "connectionstatechange" events.
    const { close } = peerConnection
    peerConnection.close = (...args: []) => {
      console.log(this.constructor.name, "beforeAnswer.close")
      if (!this.localStream) return

      this.localStream.getTracks().forEach(track => { track.stop() })

      return close.apply(peerConnection, args)
    }
    return promise
  }

  closeConnection() {
    console.log(this.constructor.name, "closeConnection", !!this.localPeerConnection)
    this.localPeerConnection?.close()
  }

  createConnection(options: { stereo?: boolean } = {}) {
    const { stereo } = options
    const request: StreamingWebrtcRequest = {}
    console.debug("StreamingWebrtcRequest", Endpoints.streaming.webrtc, request)
    return this.endpointPromise(Endpoints.streaming.webrtc, request).then((response: StreamingWebrtcResponse) => {
      // console.debug("StreamingWebrtcResponse", Endpoints.streaming.webrtc, response)
      const { id, localDescription } = response
      console.debug("StreamingWebrtcResponse", Endpoints.streaming.webrtc)//, localDescription.sdp

      const rtcConfiguration: RTCConfiguration = {} //sdpSemantics: 'unified-plan'
      const peer = new RTCPeerConnection(rtcConfiguration)
      this.localPeerConnection = peer

      // hack so we can get a callback when RTCPeerConnection is closed
      // in future, subscribe to connectionstatechange events?
      peer.close = () => {
        const request: StreamingDeleteRequest = { id }
        console.debug("StreamingDeleteRequest", Endpoints.streaming.delete, request)
        this.endpointPromise(Endpoints.streaming.delete, request).then((response: StreamingDeleteResponse) => {
          console.debug("StreamingDeleteResponse", Endpoints.streaming.delete, response)
        })
        return RTCPeerConnection.prototype.close.apply(peer)
      }
      try {
        console.debug(this.constructor.name, "createConnection setRemoteDescription...")//, localDescription.sdp
        peer.setRemoteDescription(localDescription).then(() => {
          console.debug(this.constructor.name, "createConnection beforeAnswer...")
          this.beforeAnswer(peer).then(() => {
            console.debug(this.constructor.name, "createConnection createAnswer...")
            peer.createAnswer().then(originalAnswer => {
              console.debug(this.constructor.name, "createConnection createAnswer!")//, originalAnswer.sdp
              const updatedAnswer = new RTCSessionDescription({
                type: 'answer',
                sdp: stereo ? enableStereoOpus(originalAnswer.sdp!) : originalAnswer.sdp
              })
              console.debug(this.constructor.name, "createConnection setLocalDescription...")
              peer.setLocalDescription(updatedAnswer).then(() => {
              console.debug(this.constructor.name, "createConnection setLocalDescription!")//, updatedAnswer.sdp
                const { localDescription: peerDescription } = peer
                if (!peerDescription) throw Errors.invalid.object + 'localDescription'

                const request: StreamingRemoteRequest = { id, localDescription: peerDescription }
                console.debug("StreamingRemoteRequest", Endpoints.streaming.remote, request)//, peerDescription.sdp
                this.endpointPromise(Endpoints.streaming.remote, request).then((response: StreamingRemoteResponse) => {
                  const { error, localDescription: remoteDescription } = response

                  if (error) console.error("StreamingRemoteResponse", Endpoints.streaming.remote, remoteDescription.sdp, error)
                  // else peer.setRemoteDescription(remoteDescription)
                })
              })
            })
            return peer
                    
          })
        

        })
      } catch (error) {
        console.trace(this.constructor.name, "createConnection", error)
        this.localPeerConnection.close()
        throw error
      }
    })
  }

  localPeerConnection?: RTCPeerConnection
}
