import { PictureOutlined, LinkOutlined } from '@ant-design/icons'
import { MenuProps, Upload, Button, Dropdown, UploadProps, UploadFile } from 'antd'

const PrefixComp = (props: {
  fileList: UploadFile<any>[]
  fileChange: (fileList: UploadFile<any>[]) => void
}) => {
  //上传组件的控制
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = props.fileList.indexOf(file)
      const newFileList = props.fileList.slice()
      newFileList.splice(index, 1)
      props.fileChange(newFileList)
    },
    beforeUpload: (_file, fileList) => {
      props.fileChange([...props.fileList, ...fileList])
      return false
    },
    showUploadList: false,
    fileList: props.fileList
  }
  const items: MenuProps['items'] = [
    {
      label: (
        <Upload {...uploadProps} accept="image/*" multiple>
          <Button icon={<PictureOutlined />} color="default" variant="text">
            图片
          </Button>
        </Upload>
      ),
      key: '0'
    }
  ]
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button type="text" icon={<LinkOutlined />} />
    </Dropdown>
  )
}

export default PrefixComp
