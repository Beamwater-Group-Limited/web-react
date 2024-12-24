import MonitorBoxComp from './components/monitor-box'
import { Popover } from 'antd'
import RobotComp from '@/components/robot'
import { useEffect, useState } from 'react'
// import { getComponentSettingApi } from '@/api'

/** 视频流处理 */
const VideoStreamPage = () => {
  // const [flowId1, setFlowId1] = useState('')
  // const [flowId2, setFlowId2] = useState('')
  const [open, setOpen] = useState(false)
  const handleCapture = (file: File) => {
    console.log(file)
  }
  /** 获取组件配置 */
  // const getComponentsSettings = () => {
  //   getComponentSettingApi().then(({ info, data }) => {
  //     if (info.status === 200) {
  //       data.forEach((item) => {
  //         if (item.component === '视频流智能处理控件1') {
  //           setFlowId1(item.flow)
  //         } else if (item.component === '视频流智能处理控件2') {
  //           setFlowId2(item.flow)
  //         }
  //       })
  //     }
  //   })
  // }
  useEffect(() => {
    setOpen(true)
    setTimeout(() => {
      setOpen(false)
    }, 5000)
    // getComponentsSettings()
  }, [])

  return (
    <div>
      <Popover
        content={<span>点击我进行流程配置</span>}
        placement="left"
        trigger="click"
        open={open}
        onOpenChange={(open) => setOpen(open)}
      >
        <RobotComp className="lg:top-[10vh] right-[5vw] sm:bottom-[50vh] base:top-0" />
      </Popover>
      <div className="flex items-center justify-center gap-4 mt-[20vh]">
        <div>
          <div className="mb-4">视频流智能处理控件1</div>
          <MonitorBoxComp
            rtsp="rtsp://admin:yuanm201109@192.168.0.111:555/Streaming/Channels/1"
            onCapture={handleCapture}
          />
        </div>
        <div>
          <div className="mb-4">视频流智能处理控件2</div>
          <MonitorBoxComp
            rtsp="rtsp://admin:yuanm201109@192.168.0.112:554/cam/realmonitor?channel=1&subtype=0"
            onCapture={handleCapture}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoStreamPage
