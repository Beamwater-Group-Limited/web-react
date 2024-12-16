interface IceServersResponse {
  iceServers: RTCIceServer[]
}

interface CustomRTCPeerConnection extends RTCPeerConnection {
  peerid: number
}

class WebRtcStreamer {
  private videoElement: HTMLVideoElement | null
  private srvurl: string
  private pc: CustomRTCPeerConnection | null
  private mediaConstraints: RTCOfferOptions
  private iceServers: RTCIceServer[] | null
  private earlyCandidates: RTCIceCandidate[]
  private pcConfig: RTCConfiguration = {} // 定义 pcConfig 属性
  private dataChannel: RTCDataChannel | null

  constructor(videoElement: string | HTMLVideoElement, srvurl?: string) {
    if (typeof videoElement === 'string') {
      this.videoElement = document.getElementById(videoElement) as HTMLVideoElement
    } else {
      this.videoElement = videoElement
    }
    this.srvurl =
      srvurl || `${location.protocol}//${window.location.hostname}:${window.location.port}`
    this.pc = null
    this.mediaConstraints = { offerToReceiveAudio: true, offerToReceiveVideo: true }
    this.iceServers = null
    this.earlyCandidates = []
    this.dataChannel = null
  }

  private _handleHttpErrors(response: Response): Response {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response
  }

  public async connect(videourl: string, options?: string): Promise<void> {
    try {
      this.disconnect()

      if (!this.iceServers) {
        const response = await fetch(`${this.srvurl}/api/getIceServers`)
        const json = await this._handleHttpErrors(response).json()
        this.onReceiveGetIceServers(json, videourl, options)
      } else {
        this.onReceiveGetIceServers(
          { iceServers: this.iceServers } as IceServersResponse,
          videourl,
          options
        )
      }
    } catch (e) {
      throw e
    }
  }

  public disconnect(): void {
    if (this.videoElement?.srcObject && this.videoElement.srcObject instanceof MediaStream) {
      const mediaStream = this.videoElement.srcObject as MediaStream
      mediaStream.getTracks().forEach((track) => {
        track.stop()
        mediaStream.removeTrack(track)
      })
    }
    if (this.pc) {
      fetch(`${this.srvurl}/api/hangup?peerid=${this.pc.peerid}`).then(this._handleHttpErrors)

      try {
        this.pc.close()
      } catch (e) {
        throw e
      }
      this.pc = null
    }
    if (this.dataChannel) {
      this.dataChannel.close()
      this.dataChannel = null
    }
  }

  private onReceiveGetIceServers(
    iceServers: IceServersResponse,
    videourl: string,
    options?: string
  ): void {
    this.iceServers = iceServers.iceServers
    this.pcConfig = { iceServers: this.iceServers || [] }

    try {
      this.createPeerConnection()

      let callurl = `${this.srvurl}/api/call?peerid=${this.pc!.peerid}&url=${encodeURIComponent(videourl)}`
      if (options) {
        callurl += `&options=${encodeURIComponent(options)}`
      }

      this.earlyCandidates.length = 0

      this.pc!.createOffer(this.mediaConstraints).then((sessionDescription) => {
        this.pc!.setLocalDescription(sessionDescription).then(() => {
          fetch(callurl, { method: 'POST', body: JSON.stringify(sessionDescription) })
            .then(this._handleHttpErrors)
            .then((response) => response.json())
            .then((response) => this.onReceiveCall(response))
        })
      })
    } catch (e) {
      this.disconnect()
      throw e
    }
  }

  private createPeerConnection(): CustomRTCPeerConnection {
    this.pc = new RTCPeerConnection(this.pcConfig) as CustomRTCPeerConnection
    const pc = this.pc!
    pc.peerid = Math.random() // Assign a unique peerid to the connection

    pc.onicecandidate = (evt) => this.onIceCandidate(evt)
    pc.ontrack = (evt) => this.onAddStream(evt) // 处理远端流的添加

    try {
      this.dataChannel = pc.createDataChannel('ClientDataChannel')
    } catch (e) {
      throw e
    }

    return pc
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent): void {
    if (event.candidate) {
      if (this.pc!.currentRemoteDescription) {
        this.addIceCandidate(this.pc!.peerid, event.candidate)
      } else {
        this.earlyCandidates.push(event.candidate)
      }
    }
  }

  private addIceCandidate(peerid: number, candidate: RTCIceCandidate): void {
    fetch(`${this.srvurl}/api/addIceCandidate?peerid=${peerid}`, {
      method: 'POST',
      body: JSON.stringify(candidate)
    }).then(this._handleHttpErrors)
  }

  private onAddStream(event: RTCTrackEvent): void {
    // 处理远端流的添加
    if (event.streams && event.streams[0]) {
      this.videoElement!.srcObject = event.streams[0]
      this.videoElement!.play()
    }
  }

  private onReceiveCall(dataJson: any): void {
    const descr = new RTCSessionDescription(dataJson)
    this.pc!.setRemoteDescription(descr).then(() => {
      while (this.earlyCandidates.length) {
        const candidate = this.earlyCandidates.shift()
        this.addIceCandidate(this.pc!.peerid, candidate!)
      }
    })
  }
}

export default WebRtcStreamer
