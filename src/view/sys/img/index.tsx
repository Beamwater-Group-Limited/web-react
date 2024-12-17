import ResImg from '@/assets/images/res.jpg'
import { useState } from 'react'
import RobotComp from '@/components/robot'
import { StatusTag, ImgShowComp, UploadArea, HandleBox } from './components'
import { Image, Watermark } from 'antd'
import { imgHandleApi } from '@/api'

/** 图片页面 */
const ImgPage = () => {
  const [file, setFile] = useState<File | null>(null) //选择的图片
  const [handledImg, setHandledImg] = useState<string>('') // 处理后的图片
  const [loading, setLoading] = useState(false) //loading
  const [resultTxt, setResultTxt] = useState('') //识别结果
  const [status, setStatus] = useState<'processing' | 'error' | 'success' | 'default'>('default')
  const [output, setOutput] = useState<string[]>(['1']) //输出数组
  const [soundUrl, setSoundUrl] = useState('') //音频url

  const createSound = (base64String: string) => {
    // Step 1: 将 Base64 字符串转换为二进制数据
    const byteCharacters = atob(base64String) // 解码 Base64 字符串
    const byteArray = new Uint8Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i)
    }

    // Step 2: 创建一个 Blob 对象
    const blob = new Blob([byteArray], { type: 'audio/mp3' }) // 你可以根据文件格式调整 type

    // Step 3: 创建一个 Object URL
    const audioURL = URL.createObjectURL(blob)
    return audioURL
  }

  /** 重置状态 */
  const resetStatus = () => {
    setStatus('default')
    setHandledImg('')
    setResultTxt('')
  }

  /** 点击处理 */
  const onHandle = () => {
    if (file) {
      setLoading(true)
      setStatus('processing')
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (!event.target || !event.target.result) return
        let src = event.target.result as string
        const fileBase64 = src.split(',')[1]
        imgHandleApi({
          input_type: [2],
          input_data: {
            text: '',
            image_data: fileBase64,
            voice_data: '',
            file_data: '',
            stream: ''
          },
          output_type: output.map((item) => Number(item)),
          flow_id: '0eb08a48-e095-4d1d-92b5-6a060ee18649'
        })
          .then(({ data, info }) => {
            if (info.status === 200 && data.output_data) {
              const { message, voice } = data.output_data
              setResultTxt(message)
              setStatus('success')
              if (voice) {
                setSoundUrl(createSound(voice))
              }
            } else {
              setStatus('error')
            }
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
            setStatus('error')
          })
      }
      reader.readAsDataURL(file as unknown as Blob)
    }
  }

  return (
    <div className="relative bg-white w-full h-full flex flex-col gap-4 items-center">
      <RobotComp className="top-4 right-4" />
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">基于多层感知机（MLP）的手写体字符识别</h1>
        <Image src={ResImg} width={40} height={40} />
      </div>
      <div className="w-[50vw] text-base tracking-[2px] indent-8">
        多层感知机（MLP）
        算法对手写体字符进行识别。MLP是一种经典的神经网络模型，具有输入层、隐藏层和输出层结构。它通过将输入图像数据展平为一维向量，然后利用全连接神经网络进行训练与预测。
      </div>
      {/* 处理部分 */}
      <div className="h-[70vh] w-[80vw] border-[1px] border-zinc-300 rounded bg-slate-50">
        <Watermark content="图片处理控件1" className="w-full h-full grid grid-cols-2">
          <div className="h-full border-r-[1px] border-zinc-300">
            {/* 图片展示区域 */}
            <div className="w-full h-[56vh] overflow-auto p-4 flex items-center justify-center">
              <ImgShowComp file={file} />
            </div>
            {/* 上传区域 */}
            <UploadArea
              output={output}
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
              <div className="h-[40vh] overflow-auto border-b-[1px] flex items-center justify-center">
                <ImgShowComp file={handledImg} />
              </div>
              {/* 处理结果的文字 */}
              <div className="h-[16vh] w-full flex">
                <div className="w-[30%] border-r-[1px] flex items-center justify-center">
                  <StatusTag status={status} />
                </div>
                <div className="w-[70%] p-2">{resultTxt}</div>
              </div>
            </div>
            {/* 处理框 */}
            <HandleBox
              soundUrl={soundUrl}
              output={output}
              setOutput={setOutput}
              status={status}
              resultTxt={resultTxt}
            />
          </div>
        </Watermark>
      </div>
    </div>
  )
}

export default ImgPage
