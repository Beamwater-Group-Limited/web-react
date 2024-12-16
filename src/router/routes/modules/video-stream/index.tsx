import VideoStream from '@/view/sys/video-stream'
import { HomeOutlined } from '@ant-design/icons'
const VideoStreamModule: MenuItemType = {
  order: 5,
  name: '视频流处理',
  path: 'video-stream',
  icon: <HomeOutlined />,
  element: <VideoStream />
}

export default VideoStreamModule
