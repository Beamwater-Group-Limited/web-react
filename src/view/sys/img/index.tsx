import { InboxOutlined } from '@ant-design/icons'
import { Upload, UploadFile, UploadProps, Image, Button } from 'antd'
import { useState } from 'react'
import RobotComp from '@/components/robot'
import FlowSelector from '@/view/sys/chat/components/flow-selector'
import { FlowItemType } from '@/api'

const { Dragger } = Upload

/** 图片页面 */
const ImgPage = () => {
  const [currentFlow, setCurrentFlow] = useState<FlowItemType | undefined>()
  const [fileList, setFileList] = useState<UploadFile[]>([]) //文件列表
  //上传参数
  const uploadProps: UploadProps = {
    beforeUpload(file) {
      setFileList([file])
      return false
    },
    onDrop(e) {
      let files = e.dataTransfer.files as unknown as UploadFile[]
      if (files && files.length > 0) {
        setFileList([files[0]])
      }
    },
    fileList,
    showUploadList: false
  }

  //图片展示组件
  const ImgShowComp = () => {
    if (fileList.length === 0) {
      return <div></div>
    } else {
      let file = fileList[0]
      let url = URL.createObjectURL(file as any)
      return <Image src={url} />
    }
  }

  return (
    <div className="relative flex flex-col gap-4 items-center">
      <RobotComp className="top-4 left-4" />
      {/* 处理部分 */}
      <div className="h-[60vh] w-[60vw] border-[1px] border-zinc-300 rounded bg-slate-50 grid grid-cols-2">
        <div className="border-r-[1px] border-zinc-300 flex justify-center items-center p-4">
          <ImgShowComp />
        </div>
        <div className="h-full overflow-auto flex p-4 text-xl text-zinc-700 tracking-[2px]">
          处理结果描述
        </div>
      </div>
      {/* 上传部分 */}
      <div className="flex gap-4">
        <Dragger {...uploadProps}>
          <div className="w-[40vw] h-[20vh] flex flex-col items-center justify-center">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或者拖拽文件至此上传</p>
            <p className="ant-upload-hint">支持图片格式文件</p>
          </div>
        </Dragger>
        <div className="w-[15vw] flex flex-col items-end justify-end gap-8">
          <FlowSelector currentFlow={currentFlow} setCurrentFlow={setCurrentFlow} />
          <Button type="primary" size="large">
            处理
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ImgPage
