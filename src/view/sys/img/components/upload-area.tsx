import { InboxOutlined } from '@ant-design/icons'
import { Button } from 'antd'

/** 选择文件区域 */
const UploadArea = (props: {
  file: File | null
  output: string[]
  loading: boolean
  reset: () => void
  onHandle: () => void
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}) => {
  /** 文件改变 */
  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files
    if (files && files.length > 0) {
      props.setFile(files[0])
      props.reset()
    }
  }
  return (
    <div className="w-full h-[14vh] relative border-t-[1px] border-zinc-300 flex">
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
      <div className="w-[20%] h-full flex items-center justify-center">
        <Button
          type="primary"
          disabled={!props.file || props.output.length === 0}
          size="large"
          onClick={props.onHandle}
          loading={props.loading}
        >
          处理
        </Button>
      </div>
    </div>
  )
}

export default UploadArea
