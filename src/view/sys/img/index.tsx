import ExampleImg from '@/assets/images/example.png'
import RobotComp from '@/components/robot'
import { CanvasOptions, CanvasWriter, ImgLayout, UploadArea } from './components'
import { ImgShowComp } from './components/img-layout/components'
import { useRef, useState } from 'react'

/** 图片页面 */
const ImgPage = () => {
  const [file, setFile] = useState<File | null>(null) //选择的图片
  const [writeFile, setWriteFile] = useState<File | null>(null) //手写的图片
  const imgHandleRef = useRef<any>()
  const writerRef = useRef<any>()
  /** 文件改变 */
  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      imgHandleRef.current?.reset()
    }
  }

  /** 清空画布 */
  const clearHandler = () => {
    if (!writerRef.current) return
    writerRef.current.clearCanvas()
  }

  /** 每次停止手写时会生成图片 */
  const createImg = (file: File) => {
    setWriteFile(file)
  }

  return (
    <div className="relative bg-white w-full flex flex-col gap-4 items-center">
      <RobotComp className="top-4 right-4" />
      <div className="flex items-center gap-4">
        <div className="w-[30vw] text-xl tracking-[2px] indent-8 leading-8">
          多层感知机（MLP）是一种经典的神经网络模型，广泛应用于手写体字符识别等任务。其结构包括输入层、隐藏层和输出层，通过全连接方式将每一层的神经元连接起来。手写体字符识别通常以像素值作为输入，将二维图像数据展平为一维向量，然后输入
          MLP 模型。隐藏层通过激活函数引入非线性能力，帮助模型捕获数据中的复杂特征，而输出层利用
          softmax
          函数生成各类别的概率分布，从而实现对手写体字符的准确分类。通过优化损失函数（如交叉熵）并使用反向传播算法，MLP
          能够高效学习输入数据的特征并进行分类预测。
        </div>
        <img src={ExampleImg} className="w-[30vw] h-[30vw]" />
      </div>
      <h1 className="text-2xl font-bold">基于多层感知机（MLP）的手写体字符识别</h1>
      {/* 手写部分 */}
      <ImgLayout
        file={writeFile}
        componentName="手写字智能处理控件"
        showChildren={<CanvasWriter ref={writerRef} createImg={createImg} />}
        optionsChildren={<CanvasOptions onClear={clearHandler} />}
      />
      <h1 className="text-2xl font-bold mt-20">基于多层感知机（MLP）的图片智能识别</h1>
      {/* 处理部分 */}
      <ImgLayout
        file={file}
        ref={imgHandleRef}
        componentName="图片智能处理控件"
        showChildren={<ImgShowComp file={file} />}
        optionsChildren={<UploadArea onChange={fileChangeHandler} />}
      />
    </div>
  )
}

export default ImgPage
