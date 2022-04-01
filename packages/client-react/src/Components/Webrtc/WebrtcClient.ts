import {
  EndpointPromiser,
  Endpoints, Errors,
  StreamingDeleteRequest, StreamingDeleteResponse,
  StreamingRemoteRequest, StreamingRemoteResponse,
  StreamingWebrtcRequest, StreamingWebrtcResponse,
  StringSetter
} from "@moviemasher/moviemasher.js"

function enableStereoOpus(sdp:string):string {
  return sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111')
}

class WebrtcClient {
  constructor(endpointPromise: EndpointPromiser, setStatus: StringSetter) {
    this.setStatus = setStatus
    this.endpointPromise = endpointPromise
  }

  async beforeAnswer(peerConnection: RTCPeerConnection) {
    const promise = window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(something => something).catch(error => {
      console.error("beforeAnswer", error)
      return undefined
    })
    this.localStream = await promise

    if (!this.localStream) return

    this.localStream.getTracks().forEach(track => {

    if (!this.localStream) return
      peerConnection.addTrack(track, this.localStream)
    })

    // hack so that we can get a callback when the RTCPeerConnection
    //  is closed. In the future, we can subscribe to
    // "connectionstatechange" events.
    const { close } = peerConnection
    peerConnection.close = (...args: []) => {
      if (!this.localStream) return

      this.localStream.getTracks().forEach(track => { track.stop() })

      return close.apply(peerConnection, args)
    }
  }

  closeConnection() {
    console.log(this.constructor.name, "closeConnection", !!this.localPeerConnection)
    this.localPeerConnection?.close()
  }

  createConnection(options: { stereo?: boolean } = {}) {
    const { stereo } = options
    const request: StreamingWebrtcRequest = {}
    // console.debug("StreamingWebrtcRequest", Endpoints.streaming.webrtc, request)
    return this.endpointPromise(Endpoints.streaming.webrtc, request).then((response: StreamingWebrtcResponse) => {
      // console.debug("StreamingWebrtcRequest", Endpoints.streaming.webrtc, response)
      const { id, localDescription } = response
      const rtcConfiguration: RTCConfiguration = {} //sdpSemantics: 'unified-plan'
      const peer = new RTCPeerConnection(rtcConfiguration)
      this.localPeerConnection = peer

      // hack so we can get a callback when RTCPeerConnection is closed
      // in future, subscribe to connectionstatechange events?
      peer.close = () => {
        const request: StreamingDeleteRequest = { id }
        // console.debug("StreamingDeleteRequest", Endpoints.streaming.delete, request)
        this.endpointPromise(Endpoints.streaming.delete, request).then((response: StreamingDeleteResponse) => {
          // console.debug("StreamingDeleteRequest", Endpoints.streaming.delete, response)
        })
        return RTCPeerConnection.prototype.close.apply(peer)
      }
      try {
        // console.debug(this.constructor.name, "createConnection setRemoteDescription")
        peer.setRemoteDescription(localDescription).then(() => {
          // console.debug(this.constructor.name, "createConnection beforeAnswer")
          this.beforeAnswer(peer).then(() => {
            // console.debug(this.constructor.name, "createConnection createAnswer")
            peer.createAnswer().then((originalAnswer) => {
              const updatedAnswer = new RTCSessionDescription({
                type: 'answer',
                sdp: stereo ? enableStereoOpus(originalAnswer.sdp!) : originalAnswer.sdp
              })
              // console.debug(this.constructor.name, "createConnection setLocalDescription")
              peer.setLocalDescription(updatedAnswer).then(() => {
                const { localDescription } = peer
                if (!localDescription) throw Errors.invalid.object + 'localDescription'

                const request: StreamingRemoteRequest = { id, localDescription }
                // console.debug("StreamingRemoteRequest", Endpoints.streaming.remote, request)
                this.endpointPromise(Endpoints.streaming.remote, request).then((response: StreamingRemoteResponse) => {
                  // console.debug("StreamingRemoteResponse", Endpoints.streaming.remote, response)
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

  endpointPromise: EndpointPromiser

  localPeerConnection?: RTCPeerConnection

  localStream?: MediaStream

  setStatus: StringSetter
}

export { WebrtcClient }
