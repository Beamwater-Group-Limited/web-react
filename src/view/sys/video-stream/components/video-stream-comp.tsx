import { Button, Card, Empty, Input, message, Spin } from 'antd'
import MonitorBoxComp from './monitor-box'
import { useRef, useState } from 'react'
import { imgHandleApi } from '@/api'

const VideoStreamComp = (props: { compName: string; rtsp?: string; flowId: string }) => {
  const rtspRef = useRef<any>() //视频流智能处理控件
  const [loading, setLoading] = useState(false) //loading
  const [rtspTxt, setRtspTxt] = useState('') //视频流智能处理控件的文本
  const [resultList, setResultList] = useState<string[]>([]) //结果列表
  const loop = useRef(false) //循环

  /** 点击了开始 */
  const startHandler = () => {
    if (rtspRef.current) {
      loop.current = true
      rtspRef.current.captureHandler()
    }
  }

  /** 视频流智能处理控件1 */
  const rtsphandleCapture = (file: File) => {
    if (!props.rtsp) return message.error('请先配置组件')
    const reader = new FileReader()
    reader.onload = async (event) => {
      if (!event.target || !event.target.result) return
      let src = event.target.result as string
      const fileBase64 = src.split(',')[1]
      setLoading(true)
      imgHandleApi({
        input_type: [1, 2],
        input_data: {
          text: rtspTxt,
          image_data: fileBase64,
          voice_data: '',
          file_data: '',
          stream: ''
        },
        output_type: [1],
        flow_id: props.flowId
      })
        .then(({ data, info }) => {
          if (info.status === 200) {
            setResultList((pre) => [data.output_data.text, ...pre.splice(0, 2)])
          }
        })
        .finally(() => {
          setLoading(false)
          if (loop.current) {
            startHandler()
          }
        })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-[45vw]">
      <Card hoverable={true}>
        <div className="mb-4">{props.compName}</div>
        <MonitorBoxComp ref={rtspRef} rtsp={props.rtsp} onCapture={rtsphandleCapture} />
        <div className="flex items-center justify-center gap-4 mt-4">
          <Input value={rtspTxt} onChange={(e) => setRtspTxt(e.target.value)} />
          <Button type="primary" onClick={startHandler} loading={loading}>
            开始
          </Button>
          <Button onClick={() => (loop.current = false)}>结束</Button>
        </div>
        <Spin spinning={loading} tip="处理中...">
          {resultList.length > 0 ? (
            <div className={'mt-12 h-[15vh] w-full overflow-y-auto flex flex-col gap-4'}>
              {resultList.map((item, index) => {
                return <div key={index}>{item}</div>
              })}
            </div>
          ) : (
            <div className="mt-12 h-[15vh] w-full flex items-center justify-center">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="待处理" />
            </div>
          )}
        </Spin>
      </Card>
    </div>
  )
}

export default VideoStreamComp
