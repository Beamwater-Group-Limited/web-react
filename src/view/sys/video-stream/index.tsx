import MonitorBoxComp from './components/monitor-box'

/** 视频流处理 */
const VideoStreamPage = () => {
  const handleCapture = (file: File) => {
    console.log(file)
  }

  return (
    <div>
      <MonitorBoxComp onCapture={handleCapture} />
    </div>
  )
}

export default VideoStreamPage
