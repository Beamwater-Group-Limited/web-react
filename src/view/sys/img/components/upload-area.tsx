import { InboxOutlined } from '@ant-design/icons'

/** 选择文件区域 */
const UploadArea = (props: {
  reset: () => void
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
  )
}

export default UploadArea
