import { Image } from 'antd'
/** 教学视频预览 */
const TeachingVideo = (props: {
  videoVisible: boolean
  setVideoVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Image
      width={200}
      style={{ display: 'none' }}
      src="#"
      preview={{
        visible: props.videoVisible,
        destroyOnClose: true,
        imageRender: () => (
          <video
            muted
            width="100%"
            controls
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
          />
        ),
        toolbarRender: () => null,
        onVisibleChange: (value) => {
          props.setVideoVisible(value)
        }
      }}
    />
  )
}

export default TeachingVideo
