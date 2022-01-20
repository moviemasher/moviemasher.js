import { ServerOptions, urlForServerOptions } from "@moviemasher/moviemasher.js"

function enableStereoOpus(sdp:string):string {
  return sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111')
}

class WebrtcClient {
  constructor(serverOptions: ServerOptions = {}) {
    this.serverOptions = serverOptions
  }

  async beforeAnswer(peerConnection: RTCPeerConnection) {
    const promise = window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(something => something).catch(error => {
      console.log("beforeAnswer", error)
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

  connectionsUrl(suffix = ''): string {
    const url = urlForServerOptions(this.serverOptions, suffix)
    console.log(this.constructor.name, "connectionsUrl", url, this.serverOptions)
    return url
  }

  async createConnection(options: { stereo?: boolean } = {}) {
    const { stereo } = options

    const response1 = await fetch(this.connectionsUrl())

    const remotePeerConnection = await response1.json()
    // console.log(this.constructor.name, "createConnection", remotePeerConnection)
    const { id, localDescription } = remotePeerConnection
    const rtcConfiguration:RTCConfiguration = {  } //sdpSemantics: 'unified-plan'
    this.localPeerConnection = new RTCPeerConnection(rtcConfiguration)

    // NOTE(mroberts): This is a hack so that we can get a callback when the
    // RTCPeerConnection is closed. In the future, we can subscribe to
    // "connectionstatechange" events.
    this.localPeerConnection.close = () => {
      console.trace(this.constructor.name, "close HACK!", id)
      fetch(this.connectionsUrl(`/${id}`), { method: 'delete' }).catch(() => {})
      return RTCPeerConnection.prototype.close.apply(this.localPeerConnection)
    }

    try {
      console.log("trying to setRemoteDescription")
      await this.localPeerConnection.setRemoteDescription(localDescription)

      console.log("trying to beforeAnswer")
      await this.beforeAnswer(this.localPeerConnection)

      console.log("trying to createAnswer")
      const originalAnswer = await this.localPeerConnection.createAnswer()
      const updatedAnswer = new RTCSessionDescription({
        type: 'answer',
        sdp: stereo ? enableStereoOpus(originalAnswer.sdp!) : originalAnswer.sdp
      })
      console.log("trying to setLocalDescription")
      await this.localPeerConnection.setLocalDescription(updatedAnswer)

      console.log("trying to fetch")
      await fetch(this.connectionsUrl(`/${id}/remote-description`), {
        method: 'POST',
        body: JSON.stringify(this.localPeerConnection.localDescription),
        headers: { 'Content-Type': 'application/json' }
      })

      return this.localPeerConnection
    } catch (error) {
      console.trace(this.constructor.name, "createConnection", error)
      this.localPeerConnection.close()
      throw error
    }
  }

  localPeerConnection?: RTCPeerConnection

  localStream?: MediaStream

  serverOptions?: ServerOptions
}

export { WebrtcClient }
