import ResImg from '@/assets/images/res.jpg'
import RobotComp from '@/components/robot'
import { Image } from 'antd'
import { ImgLayout, UploadArea } from './components'
import { ImgShowComp } from './components/img-layout/components'
import { useRef, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'

/** 图片页面 */
const ImgPage = () => {
  const [file, setFile] = useState<File | null>(null) //选择的图片
  const imgHandleRef = useRef<any>()
  /** 文件改变 */
  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      imgHandleRef.current?.reset()
    }
  }
  return (
    <div className="relative bg-white w-full flex flex-col gap-4 items-center">
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
      <ImgLayout
        file={file}
        ref={imgHandleRef}
        componentName="图片处理控件"
        showChildren={<ImgShowComp file={file} />}
        optionsChildren={<UploadArea onChange={fileChangeHandler} />}
      />
      {/* 手写部分 */}
      <ImgLayout
        file={file}
        ref={imgHandleRef}
        componentName="手写处理控件"
        showChildren={<ImgShowComp file={file} />}
        optionsChildren={
          <div className="w-[80%] h-full flex flex-col justify-center items-center bg-slate-200 gap-2">
            <InboxOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />
            <p className="text-base">点击或拖拽文件至此区域上传</p>
            <p className="text-sm">支持 jpg、png、gif 等常见图片格式</p>
            <input
              onChange={fileChangeHandler}
              className="w-full opacity-0 h-full absolute cursor-pointer"
              type="file"
            />
          </div>
        }
      />
    </div>
  )
}

export default ImgPage
