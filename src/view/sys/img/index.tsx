import { InboxOutlined, SoundOutlined } from '@ant-design/icons'
import { Image, Button, Tag, message } from 'antd'
import ResImg from '@/assets/images/res.jpg'
import { useState } from 'react'
import RobotComp from '@/components/robot'

/** 图片页面 */
const ImgPage = () => {
  const [file, setFile] = useState<File | null>(null) //选择的图片
  const [handledImg, setHandledImg] = useState<string>('') // 处理后的图片
  const [loading, setLoading] = useState(false) //loading
  const [resultTxt, setResultTxt] = useState('') //识别结果
  const [status, setStatus] = useState<'processing' | 'error' | 'success' | 'default'>('default')

  //图片展示组件
  const ImgShowComp = (props: { file: File | null | string }) => {
    const [visible, setVisible] = useState(false)
    if (!props.file) {
      return <div></div>
    } else if (typeof props.file !== 'string') {
      let url = URL.createObjectURL(props.file)
      return (
        <>
          <img
            className="cursor-pointer rounded"
            onClick={() => {
              setVisible(true)
            }}
            src={url}
            style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
          />
          <Image
            preview={{
              visible,
              onVisibleChange: (value) => {
                setVisible(value)
              }
            }}
            style={{ display: 'none' }}
            src={url}
          />
        </>
      )
    } else {
      return (
        <>
          <img
            className="cursor-pointer rounded"
            onClick={() => {
              setVisible(true)
            }}
            src={props.file}
            style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
          />
          <Image
            preview={{
              visible,
              onVisibleChange: (value) => {
                setVisible(value)
              }
            }}
            style={{ display: 'none' }}
            src={props.file}
          />
        </>
      )
    }
  }

  /** 文件改变 */
  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      setStatus('default')
      setHandledImg('')
      setResultTxt('')
    }
  }

  /** 点击处理 */
  const clickHandle = () => {
    if (file) {
      setStatus('processing')
      setLoading(true)
      setTimeout(() => {
        setHandledImg(ResImg)
        setLoading(false)
        setStatus('success')
        setResultTxt('这是识别后的文本')
      }, 2000)
    }
  }

  /** 读文字 */
  const soundHandler = () => {
    if (!window.SpeechSynthesisUtterance) {
      return message.warning('当前浏览器不支持语音功能')
    }
    if (resultTxt) {
      const utterance = new SpeechSynthesisUtterance(resultTxt)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-4 items-center">
      <RobotComp className="top-4 right-4" />
      {/* 处理部分 */}
      <div className="h-[90%] w-[80%] border-[1px] border-zinc-300 rounded bg-slate-50 grid grid-cols-2">
        <div className="h-full border-r-[1px] border-zinc-300">
          {/* 图片展示区域 */}
          <div className="w-full h-[80%] overflow-auto p-4 flex items-center justify-center">
            <ImgShowComp file={file} />
          </div>
          {/* 上传区域 */}
          <div className="w-full h-[20%] relative border-t-[1px] border-zinc-300 bg-slate-200 flex flex-col justify-center items-center gap-2">
            <InboxOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />
            <p className="text-base">点击或拖拽文件至此区域上传</p>
            <p className="text-sm">支持 jpg、png、gif 等常见图片格式</p>
            <input
              onChange={fileChangeHandler}
              className="w-full opacity-0 h-full absolute cursor-pointer"
              type="file"
            />
          </div>
        </div>
        <div className="h-full overflow-auto">
          <div className="text-xl text-zinc-700 tracking-[2px] h-[80%]">
            {/* 处理结果的图片 */}
            <div className="h-[70%] border-b-[1px] flex items-center justify-center">
              <ImgShowComp file={handledImg} />
            </div>
            {/* 处理结果的文字 */}
            <div className="h-[30%] w-full flex">
              <div className="w-[30%] border-r-[1px] flex items-center justify-center">
                <Tag bordered={false} color={status}>
                  {status === 'success'
                    ? '处理成功'
                    : status === 'error'
                      ? '处理失败'
                      : status === 'default'
                        ? '待处理'
                        : '处理中'}
                </Tag>
              </div>
              <div className="w-[70%] p-2">{resultTxt}</div>
            </div>
          </div>
          <div className="border-t-[1px] h-[20%] border-zinc-300 flex justify-center items-center gap-4">
            <Button
              type="primary"
              disabled={!file}
              size="large"
              onClick={clickHandle}
              loading={loading}
            >
              处理
            </Button>
            <Button
              type="primary"
              icon={<SoundOutlined />}
              size="large"
              onClick={soundHandler}
              disabled={status !== 'success'}
            >
              朗读
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImgPage
