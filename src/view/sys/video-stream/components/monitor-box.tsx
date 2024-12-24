import { forwardRef, Ref, useEffect, useImperativeHandle, useRef } from 'react'
import { message } from 'antd'
import WebRtcStreamer from '@/utils/webrtcstreamer'
import { getRandomString } from '@lichang666/utils'
const MonitorBoxComp = forwardRef(
  (props: { onCapture: (file: File) => void; className?: string; rtsp: string }, ref: Ref<any>) => {
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
    }, [])

    const captureHandler = () => {
      const video = document.getElementById(videoId.current) as HTMLVideoElement
      const canvas = canvasRef.current
      if (!video || !canvas) return
      const context = canvas.getContext('2d')
      if (context) {
        // 设置 canvas 的宽高与 video 一致
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // 将视频当前帧绘制到 canvas 上
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
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
