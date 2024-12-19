import { InboxOutlined } from '@ant-design/icons'

/** 拖拽上传区域 */
const UploadArea = (props: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className="lg:w-[80%] base:w-[80%] lg:h-full base:h-full sm:h-[7.5vh] flex flex-col justify-center items-center bg-slate-200 lg:gap-2 sm:gap-[3px] relative">
      <InboxOutlined className="lg:text-base sm:text-5xl" style={{ color: '#1890ff' }} />
      <p className="lg:text-base sm:text-4xl">点击或拖拽文件至此区域上传</p>
      <p className="lg:text-sm sm:text-3xl">支持 jpg、png、gif 等常见图片格式</p>
      <input
        onChange={props.onChange}
        className="w-full opacity-0 h-full sm:h-[7.5vh] absolute top-0 left-0 cursor-pointer"
        type="file"
      />
    </div>
  )
}

export default UploadArea
