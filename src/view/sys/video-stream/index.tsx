import { Popover } from 'antd'
import RobotComp from '@/components/robot'
import { useEffect, useState } from 'react'
import { ComponentFlowType, getComponentSettingApi } from '@/api'
import VideoStreamComp from './components/video-stream-comp'

/** 视频流处理 */
const VideoStreamPage = () => {
  const [rtsp1, setRtsp1] = useState<ComponentFlowType>() //视频流智能处理控件1
  const [rtsp2, setRtsp2] = useState<ComponentFlowType>() //视频流智能处理控件2
  const [open, setOpen] = useState(false)

  /** 获取组件配置 */
  const getComponentsSettings = () => {
    getComponentSettingApi().then(({ info, data }) => {
      if (info.status === 200) {
        data.forEach((item) => {
          if (item.component === '视频流智能处理控件1') {
            setRtsp1(item)
          } else if (item.component === '视频流智能处理控件2') {
            setRtsp2(item)
          }
        })
      }
    })
  }
  useEffect(() => {
    setOpen(true)
    setTimeout(() => {
      setOpen(false)
    }, 5000)
    getComponentsSettings()
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
        <RobotComp className="lg:top-[0] right-[5vw] sm:bottom-[50vh] base:top-0" />
      </Popover>
      <div className="flex justify-center gap-4 mt-[5vh]">
        {/* 视频流智能处理控件1 */}
        <VideoStreamComp
          videoPath="http://www.beamwater.cn:33030/gens/course3.mp4"
          compName="视频流智能处理控件1"
          rtsp={rtsp1?.rtsp}
          flowId={rtsp1?.flow || ''}
        />
        {/* 视频流智能处理控件2 */}
        <VideoStreamComp
          videoPath="http://www.beamwater.cn:33030/gens/course3.mp4"
          compName="视频流智能处理控件2"
          rtsp={rtsp2?.rtsp}
          flowId={rtsp2?.flow || ''}
        />
      </div>
    </div>
  )
}

export default VideoStreamPage
