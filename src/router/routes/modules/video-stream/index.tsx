import VideoStream from '@/view/sys/video-stream'
import { PlayCircleOutlined } from '@ant-design/icons'
const VideoStreamModule: MenuItemType = {
  order: 5,
  name: '视频流处理页面',
  path: 'video-stream',
  icon: <PlayCircleOutlined />,
  element: <VideoStream />
}

export default VideoStreamModule
