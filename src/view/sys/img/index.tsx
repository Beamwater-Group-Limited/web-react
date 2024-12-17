import ResImg from '@/assets/images/res.jpg'
import { useState } from 'react'
import RobotComp from '@/components/robot'
import { StatusTag, ImgShowComp, UploadArea, HandleBox } from './components'

/** 图片页面 */
const ImgPage = () => {
  const [file, setFile] = useState<File | null>(null) //选择的图片
  const [handledImg, setHandledImg] = useState<string>('') // 处理后的图片
  const [loading, setLoading] = useState(false) //loading
  const [resultTxt, setResultTxt] = useState('') //识别结果
  const [status, setStatus] = useState<'processing' | 'error' | 'success' | 'default'>('default')

  /** 重置状态 */
  const resetStatus = () => {
    setStatus('default')
    setHandledImg('')
    setResultTxt('')
  }

  /** 点击处理 */
  const onHandle = () => {
    if (file) {
      setStatus('processing')
      setLoading(true)
      setTimeout(() => {
        setHandledImg(ResImg)
        setLoading(false)
        setStatus('success')
        setResultTxt('这是处理后的文本')
      }, 2000)
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-4 items-center">
      <RobotComp className="top-4 right-4" />
      {/* 处理部分 */}
      <div className="h-[80vh] w-[80vw] border-[1px] border-zinc-300 rounded bg-slate-50 grid grid-cols-2">
        <div className="h-full border-r-[1px] border-zinc-300">
          {/* 图片展示区域 */}
          <div className="w-full h-[64vh] overflow-auto p-4 flex items-center justify-center">
            <ImgShowComp file={file} />
          </div>
          {/* 上传区域 */}
          <UploadArea
            reset={resetStatus}
            setFile={setFile}
            file={file}
            loading={loading}
            onHandle={onHandle}
          />
        </div>
        <div className="h-full">
          <div className="text-xl text-zinc-700 tracking-[2px] h-[80%]">
            {/* 处理结果的图片 */}
            <div className="h-[44.8vh] overflow-auto border-b-[1px] flex items-center justify-center">
              <ImgShowComp file={handledImg} />
            </div>
            {/* 处理结果的文字 */}
            <div className="h-[19.2vh] w-full flex">
              <div className="w-[30%] border-r-[1px] flex items-center justify-center">
                <StatusTag status={status} />
              </div>
              <div className="w-[70%] p-2">{resultTxt}</div>
            </div>
          </div>
          {/* 处理框 */}
          <HandleBox status={status} resultTxt={resultTxt} />
        </div>
      </div>
    </div>
  )
}

export default ImgPage
