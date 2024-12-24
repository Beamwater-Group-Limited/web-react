import ExampleImg from '@/assets/images/example.png'
import RobotComp from '@/components/robot'
import { CanvasOptions, CanvasWriter, ImgLayout, UploadArea, TeachingVideo } from './components'
import { ImgShowComp } from './components/img-layout/components'
import { useEffect, useRef, useState } from 'react'
import { Button, Popover } from 'antd'
import { getComponentSettingApi } from '@/api'

/** 图片页面 */
const ImgPage = () => {
  const [file, setFile] = useState<File | null>(null) //选择的图片
  const [writeFile, setWriteFile] = useState<File | null>(null) //手写的图片
  const [writeVideoVisible, setWriteVideoVisible] = useState(false) //手写教学视频弹窗
  const [imgHandleVideoVisible, setImgHandleVideoVisible] = useState(false) // 图片处理弹窗
  const imgHandleRef = useRef<any>() //图片处理布局组件
  const [imgFlowId, setImgFlowId] = useState('')
  const [writeFlowId, setWriteFlowId] = useState('')
  const writerRef = useRef<any>() //手写框组件
  const writerLayoutRef = useRef<any>() //手写框布局组件
  const [open, setOpen] = useState(false) //机器人说话
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
    writerLayoutRef.current?.reset()
  }

  /** 重置手写识别状态 */
  const writeResetHandler = () => {
    writerLayoutRef.current?.reset()
  }

  /** 每次停止手写时会生成图片 */
  const createImg = (file: File) => {
    setWriteFile(file)
  }

  /** 获取组件配置 */
  const getComponentsSettings = () => {
    getComponentSettingApi().then(({ info, data }) => {
      if (info.status === 200) {
        data.forEach((item) => {
          if (item.component === '图片智能处理控件') {
            setImgFlowId(item.flow)
          } else if (item.component === '手写字智能处理控件') {
            setWriteFlowId(item.flow)
          }
        })
      }
    })
  }

  useEffect(() => {
    getComponentsSettings()
    setOpen(true)
    setTimeout(() => {
      setOpen(false)
    }, 5000)
  }, [])

  return (
    <div className="relative bg-white w-full flex flex-col gap-4 items-center">
      <Popover
        content={<span>点击我进行流程配置</span>}
        placement="left"
        trigger="click"
        open={open}
        onOpenChange={(open) => setOpen(open)}
      >
        <RobotComp className="lg:top-[0vh] right-[5vw] sm:bottom-[50vh] base:top-0" />
      </Popover>
      <div className="flex items-center lg:flex-row base:flex-row sm:flex-col gap-4">
        <div className="lg:w-[30vw] flex-1 sm:w-full lg:text-xl sm:text-5xl base:text-3xl tracking-[2px] indent-8 lg:leading-8 sm:leading-[20px]">
          多层感知机（MLP）是一种经典的神经网络模型，广泛应用于手写体字符识别等任务。其结构包括输入层、隐藏层和输出层，通过全连接方式将每一层的神经元连接起来。手写体字符识别通常以像素值作为输入，将二维图像数据展平为一维向量，然后输入
          MLP 模型。隐藏层通过激活函数引入非线性能力，帮助模型捕获数据中的复杂特征，而输出层利用
          softmax
          函数生成各类别的概率分布，从而实现对手写体字符的准确分类。通过优化损失函数（如交叉熵）并使用反向传播算法，MLP
          能够高效学习输入数据的特征并进行分类预测。
        </div>
        <img
          src={ExampleImg}
          className="lg:w-[30vw] lg:h-[30vw] sm:w-[80vw] sm:h-[80vw] base:w-[50vw] base:h-[50vh]"
        />
      </div>
      {/* 手写部分 */}
      <div className="flex items-center justify-center gap-4 base:mt-[5vh]">
        <h1 className="lg:text-2xl sm:text-5xl font-bold">基于多层感知机（MLP）的手写体字符识别</h1>
        <Button onClick={() => setWriteVideoVisible(true)} color="primary" variant="text">
          视频教学
        </Button>
      </div>
      <ImgLayout
        ref={writerLayoutRef}
        flowId={writeFlowId}
        file={writeFile}
        componentName="手写字智能处理控件"
        showChildren={
          <CanvasWriter reset={writeResetHandler} ref={writerRef} createImg={createImg} />
        }
        optionsChildren={<CanvasOptions onClear={clearHandler} />}
      />
      {/* 处理部分 */}
      <div className="flex items-center justify-center gap-4 lg:mt-[10vh] sm:mt-[5vh]">
        <h1 className="lg:text-2xl sm:text-5xl font-bold">基于多层感知机（MLP）的图片智能识别</h1>
        <Button onClick={() => setImgHandleVideoVisible(true)} color="primary" variant="text">
          视频教学
        </Button>
      </div>
      <ImgLayout
        flowId={imgFlowId}
        file={file}
        ref={imgHandleRef}
        componentName="图片智能处理控件"
        showChildren={<ImgShowComp file={file} />}
        optionsChildren={<UploadArea onChange={fileChangeHandler} />}
      />
      {/* 手写教学视频预览 */}
      <TeachingVideo
        videoPath="http://www.beamwater.cn:33030/gens/course1.mp4"
        videoVisible={writeVideoVisible}
        setVideoVisible={setWriteVideoVisible}
      />
      {/* 图片处理教学视频预览 */}
      <TeachingVideo
        videoPath="http://www.beamwater.cn:33030/gens/course2.mp4"
        videoVisible={imgHandleVideoVisible}
        setVideoVisible={setImgHandleVideoVisible}
      />
    </div>
  )
}

export default ImgPage
