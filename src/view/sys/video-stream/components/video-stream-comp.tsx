import { Button, Card, Divider, Empty, Input, InputRef, message, Select, Space, Spin } from 'antd'
import MonitorBoxComp from './monitor-box'
import { useEffect, useRef, useState } from 'react'
import { imgHandleApi } from '@/api'
import { TeachingVideo } from '../../img/components'
import { PlusOutlined } from '@ant-design/icons'

const VideoStreamComp = (props: {
  compName: string
  rtsp?: string
  flowId: string
  videoPath: string
}) => {
  const rtspRef = useRef<any>() //视频流智能处理控件
  const [loading, setLoading] = useState(false) //loading
  const [rtspTxt, setRtspTxt] = useState('') //视频流智能处理控件的文本
  const [resultList, setResultList] = useState<string[]>([]) //结果列表
  const loop = useRef(false) //循环
  const [visible, setVisible] = useState(false) //视频教学弹窗
  const [items, setItems] = useState(['描述画面', '画面里面有人吗'])
  const [name, setName] = useState('')
  const inputRef = useRef<InputRef>(null)

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (name === '') return
    e.preventDefault()
    setItems([...items, name])
    setName('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  /** 点击了开始 */
  const startHandler = () => {
    if (rtspRef.current) {
      loop.current = true
      rtspRef.current.captureHandler()
    }
  }

  /** 视频流智能处理控件 */
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

  useEffect(() => {
    return () => {
      loop.current = false
    }
  }, [])

  return (
    <div className="w-[45vw]">
      <Card hoverable={true}>
        <div className="mb-4 flex items-center gap-4">
          <div className="lg:text-2xl sm:text-5xl font-bold">{props.compName}</div>
          <Button onClick={() => setVisible(true)} color="primary" variant="text">
            视频教学
          </Button>
        </div>
        <MonitorBoxComp ref={rtspRef} rtsp={props.rtsp} onCapture={rtsphandleCapture} />
        <div className="flex items-center justify-center gap-4 mt-4">
          <Select
            value={rtspTxt}
            style={{ width: '100%' }}
            placeholder="给控件输入信息"
            onChange={(e) => setRtspTxt(e)}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="输入下拉内容"
                    ref={inputRef}
                    value={name}
                    onChange={onNameChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    添加下拉项
                  </Button>
                </Space>
              </>
            )}
            options={items.map((item) => ({ label: item, value: item }))}
          />
          <Button type="primary" onClick={startHandler} loading={loading}>
            开始
          </Button>
          <Button onClick={() => (loop.current = false)}>结束</Button>
        </div>
        {resultList.length > 0 ? (
          <div className={'mt-6 h-[18vh] w-full overflow-y-auto flex flex-col gap-4'}>
            {loading && (
              <div className="flex items-center justify-center">
                <Spin />
              </div>
            )}
            {resultList.map((item, index) => {
              return <div key={index}>{item}</div>
            })}
          </div>
        ) : (
          <Spin spinning={loading}>
            <div className="mt-6 h-[18vh] w-full flex items-center justify-center">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="待点击 开始 处理" />
            </div>
          </Spin>
        )}
      </Card>
      <TeachingVideo
        videoPath={props.videoPath}
        videoVisible={visible}
        setVideoVisible={setVisible}
      />
    </div>
  )
}

export default VideoStreamComp
