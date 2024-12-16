import { CloseCircleOutlined } from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { UploadFile, Image, Spin } from 'antd'
import { memo, useEffect } from 'react'

/** 输入框头部 */
const SenderHeaderComp = (props: {
  loading: boolean
  fileList: UploadFile[]
  setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  //图片组件
  const ImageItemComp = memo((props: { file: UploadFile }) => {
    const url = URL.createObjectURL(props.file as unknown as File)
    useEffect(() => {
      return () => {
        URL.revokeObjectURL(url) // 清理临时URL
      }
    }, [url])
    return <Image width={70} height={70} src={url} />
  })

  //移除文件
  const removeFile = (file: UploadFile) => {
    const newFileList = props.fileList.filter((item) => item.uid !== file.uid)
    if (newFileList.length === 0) {
      props.setOpen(false)
    }
    props.setFileList(newFileList)
  }

  return (
    <Sender.Header title="附件" open={props.open} closable={false} onOpenChange={props.setOpen}>
      {props.fileList.length > 0 && (
        <Spin spinning={props.loading}>
          <div className="max-h-[90px] overflow-y-auto flex flex-wrap gap-1">
            {props.fileList.map((item) => {
              return (
                <div key={item.name} className="relative group p-1">
                  <CloseCircleOutlined
                    onClick={() => removeFile(item)}
                    className="absolute right-[-3px] top-[-3px] z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <ImageItemComp file={item} />
                </div>
              )
            })}
          </div>
        </Spin>
      )}
    </Sender.Header>
  )
}

export default SenderHeaderComp
