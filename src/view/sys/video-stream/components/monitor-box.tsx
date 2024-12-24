import { forwardRef, Ref, useEffect, useImperativeHandle, useRef } from 'react'
import { message } from 'antd'
import WebRtcStreamer from '@/utils/webrtcstreamer'
import { getRandomString } from '@lichang666/utils'
const MonitorBoxComp = forwardRef(
  (
    props: { onCapture: (file: File) => void; className?: string; rtsp?: string },
    ref: Ref<any>
  ) => {
    const webRtcServer = useRef<any>(null)
    const webrtcConfig = useRef({
      url: 'http://192.168.0.70:8000',
      options: 'rtptransport=tcp&timeout=60',
      rtsp: ''
    })
    const videoId = useRef(getRandomString(5))

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const videoInit = async () => {
      if (props.rtsp) {
        webrtcConfig.current.rtsp = props.rtsp
      }
      let { rtsp, options, url } = webrtcConfig.current
      webRtcServer.current = new WebRtcStreamer(videoId.current, url)
      webRtcServer.current.connect(rtsp, options)
    }

    useEffect(() => {
      if (!window.RTCPeerConnection) {
        message.error('当前浏览器不支持RTC')
      }
      videoInit()
      return () => {
        webRtcServer.current.disconnect()
      }
    }, [props.rtsp])

    const captureHandler = () => {
      const video = document.getElementById(videoId.current) as HTMLVideoElement
      const canvas = canvasRef.current
      if (!video || !canvas) return
      const context = canvas.getContext('2d')
      if (context) {
        // 获取视频的宽高
        const videoWidth = video.videoWidth
        const videoHeight = video.videoHeight
        // 设置缩放后的宽度，最大为 1000px
        const maxWidth = 1000
        let canvasWidth = videoWidth
        let canvasHeight = videoHeight
        // 如果视频宽度大于 1000，则按比例缩放
        if (videoWidth > maxWidth) {
          const scale = maxWidth / videoWidth
          canvasWidth = maxWidth
          canvasHeight = videoHeight * scale
        }
        // 设置 canvas 的宽高为缩放后的值
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        // 将视频当前帧绘制到 canvas 上
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight)
        // 将 Canvas 内容转为 Blob 对象
        canvas.toBlob((blob) => {
          if (blob) {
            // 将 Blob 转换为 File 对象
            const file = new File([blob], 'screenshot.png', { type: 'image/png' })
            props.onCapture(file)
          }
        }, 'image/png')
      }
    }

    useImperativeHandle(ref, () => ({
      captureHandler
    }))
    return (
      <div className={`border-[1px] border-solid border-gray-300 p-2 ${props.className}`}>
        <span className="mb-4">{props.rtsp}</span>
        <video
          id={videoId.current}
          className="w-[40vw] h-[20vw]"
          style={{ objectFit: 'fill' }}
          muted
        ></video>
        {/* 隐藏的 Canvas 元素 */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    )
  }
)

export default MonitorBoxComp
