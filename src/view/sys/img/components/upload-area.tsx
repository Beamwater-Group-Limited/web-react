import { InboxOutlined } from '@ant-design/icons'

/** 拖拽上传区域 */
const UploadArea = (props: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center bg-slate-200 gap-2">
      <InboxOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />
      <p className="text-base">点击或拖拽文件至此区域上传</p>
      <p className="text-sm">支持 jpg、png、gif 等常见图片格式</p>
      <input
        onChange={props.onChange}
        className="w-full opacity-0 h-full absolute cursor-pointer"
        type="file"
      />
    </div>
  )
}

export default UploadArea
