import { useEffect, useRef } from 'react'
import { Button, message } from 'antd'
import WebRtcStreamer from '@/utils/webrtcstreamer'
const MonitorBoxComp = (props: { onCapture: (file: File) => void }) => {
  const webRtcServer = useRef<any>(null)
  const webrtcConfig = useRef({
    url: 'http://192.168.0.70:8000',
    options: 'rtptransport=tcp&timeout=60',
    rtsp: 'rtsp://admin:yuanm201109@192.168.0.111:555/Streaming/Channels/1'
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const videoInit = async () => {
    let { rtsp, options, url } = webrtcConfig.current
    webRtcServer.current = new WebRtcStreamer('video', url)
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
    const video = document.getElementById('video') as HTMLVideoElement
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
  return (
    <div className="absolute top-[1vh] left-[1vw]">
      <video id="video" className="w-[20vw] h-[10vw]" style={{ objectFit: 'fill' }} muted></video>
      <Button onClick={captureHandler} className="mt-2">
        截屏
      </Button>
      {/* 隐藏的 Canvas 元素 */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  )
}

export default MonitorBoxComp
