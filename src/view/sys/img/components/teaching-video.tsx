import { Image } from 'antd'
/** 教学视频预览 */
const TeachingVideo = (props: {
  videoPath: string
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
        imageRender: () => <video muted width="100%" controls src={props.videoPath} />,
        toolbarRender: () => null,
        onVisibleChange: (value) => {
          props.setVideoVisible(value)
        }
      }}
    />
  )
}

export default TeachingVideo
