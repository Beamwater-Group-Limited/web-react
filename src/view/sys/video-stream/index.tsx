import MonitorBoxComp from './components/monitor-box'
import { Button, Card, Input, message, Popover } from 'antd'
import RobotComp from '@/components/robot'
import { useEffect, useRef, useState } from 'react'
import { ComponentFlowType, getComponentSettingApi, imgHandleApi } from '@/api'

/** 视频流处理 */
const VideoStreamPage = () => {
  const rtsp1Ref = useRef<any>() //视频流智能处理控件1
  const rtsp2Ref = useRef<any>() //视频流智能处理控件2
  const [rtsp1, setRtsp1] = useState<ComponentFlowType>() //视频流智能处理控件1
  const [rtsp2, setRtsp2] = useState<ComponentFlowType>() //视频流智能处理控件2
  const [rtsp1Loading, setRtsp1Loading] = useState(false)
  const [rtsp2Loading, setRtsp2Loading] = useState(false)
  const [open, setOpen] = useState(false)

  const [rtsp1Txt, setRtsp1Txt] = useState('') //视频流智能处理控件1的文本
  const [rtsp2Txt, setRtsp2Txt] = useState('') //视频流智能处理控件2的文本
  const rtsp1Loop = useRef(false) //视频流智能处理控件1的循环
  const rtsp2Loop = useRef(false) //视频流智能处理控件2的循环

  const [rtsp1Result, setRtsp1Result] = useState<string[]>([]) //视频流智能处理控件1的结果
  const [rtsp2Result, setRtsp2Result] = useState<string[]>([]) //视频流智能处理控件2的结果

  /** 点击了rtsp1的开始 */
  const rtsp1Start = () => {
    if (rtsp1Ref.current) {
      rtsp1Loop.current = true
      rtsp1Ref.current.captureHandler()
    }
  }

  /** 点击了rtsp2的开始 */
  const rtsp2Start = () => {
    if (rtsp2Ref.current) {
      rtsp2Loop.current = true
      rtsp2Ref.current.captureHandler()
    }
  }

  /** 视频流智能处理控件1 */
  const rtsp1handleCapture = (file: File) => {
    if (!rtsp1) return message.error('请先配置组件')
    const reader = new FileReader()
    reader.onload = async (event) => {
      if (!event.target || !event.target.result) return
      let src = event.target.result as string
      const fileBase64 = src.split(',')[1]
      setRtsp1Loading(true)
      imgHandleApi({
        input_type: [1, 2],
        input_data: {
          text: rtsp1Txt,
          image_data: fileBase64,
          voice_data: '',
          file_data: '',
          stream: ''
        },
        output_type: [1],
        flow_id: rtsp1.flow
      })
        .then(({ data, info }) => {
          if (info.status === 200) {
            setRtsp1Result((pre) => [data.output_data.text, ...pre])
          }
        })
        .finally(() => {
          setRtsp1Loading(false)
          if (rtsp1Loop.current) rtsp1Start()
        })
    }
    reader.readAsDataURL(file)
  }
  /** 视频流智能处理控件2 */
  const rtsp2handleCapture = (file: File) => {
    if (!rtsp2) return message.error('请先配置组件')
    const reader = new FileReader()
    reader.onload = async (event) => {
      if (!event.target || !event.target.result) return
      let src = event.target.result as string
      const fileBase64 = src.split(',')[1]
      setRtsp2Loading(true)
      imgHandleApi({
        input_type: [1, 2],
        input_data: {
          text: rtsp2Txt,
          image_data: fileBase64,
          voice_data: '',
          file_data: '',
          stream: ''
        },
        output_type: [1],
        flow_id: rtsp2.flow
      })
        .then(({ data, info }) => {
          if (info.status === 200) {
            setRtsp2Result((pre) => [data.output_data.text, ...pre])
          }
        })
        .finally(() => {
          setRtsp2Loading(false)
          if (rtsp2Loop.current) rtsp2Start()
        })
    }
    reader.readAsDataURL(file)
  }
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
        <div className="w-[45vw]">
          <Card hoverable={true}>
            <div className="mb-4">视频流智能处理控件1</div>
            <MonitorBoxComp ref={rtsp1Ref} rtsp={rtsp1?.rtsp} onCapture={rtsp1handleCapture} />
            <div className="flex items-center justify-center gap-4 mt-4">
              <Input value={rtsp1Txt} onChange={(e) => setRtsp1Txt(e.target.value)} />
              <Button type="primary" onClick={rtsp1Start} loading={rtsp1Loading}>
                开始
              </Button>
              <Button onClick={() => (rtsp1Loop.current = false)}>结束</Button>
            </div>
            <div className="mt-12 h-[15vh] overflow-y-auto flex flex-col gap-4">
              {rtsp1Result.map((item, index) => {
                return <div key={index}>{item}</div>
              })}
            </div>
          </Card>
        </div>
        {/* 视频流智能处理控件2 */}
        <div className="w-[45vw]">
          <Card hoverable={true}>
            <div className="mb-4">视频流智能处理控件2</div>
            <MonitorBoxComp ref={rtsp2Ref} rtsp={rtsp2?.rtsp} onCapture={rtsp2handleCapture} />
            <div className="flex items-center justify-center gap-4 mt-4">
              <Input value={rtsp2Txt} onChange={(e) => setRtsp2Txt(e.target.value)} />
              <Button type="primary" onClick={rtsp2Start} loading={rtsp2Loading}>
                开始
              </Button>
              <Button onClick={() => (rtsp2Loop.current = false)}>结束</Button>
            </div>
            <div className="mt-12 h-[15vh] overflow-y-auto flex flex-col gap-4">
              {rtsp2Result.map((item, index) => {
                return <div key={index}>{item}</div>
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VideoStreamPage
