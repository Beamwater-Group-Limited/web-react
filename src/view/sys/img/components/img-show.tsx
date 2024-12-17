import { Image } from 'antd'
import { useState, useEffect } from 'react'

/** 图片展示组件 */
const ImgShowComp = (props: { file: File | null | string }) => {
  const [visible, setVisible] = useState(false)
  const [url, setUrl] = useState<string | undefined>(undefined)

  // 如果是 File 类型，创建 URL
  useEffect(() => {
    if (props.file && typeof props.file !== 'string') {
      const objectUrl = URL.createObjectURL(props.file)
      setUrl(objectUrl)

      // 组件卸载时清理 URL
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl)
        }
      }
    } else {
      setUrl(undefined) // 如果文件是 undefined 或 string，清除 URL
    }
  }, [props.file])

  // 如果没有文件，则不渲染任何东西
  if (!props.file) {
    return <div></div>
  }

  // 渲染图片
  const renderImage = () => {
    const src = typeof props.file === 'string' ? props.file : url
    return (
      <img
        className="cursor-pointer rounded"
        onClick={() => setVisible(true)}
        src={src}
        style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
      />
    )
  }

  return (
    <>
      {renderImage()}
      <Image
        preview={{
          visible,
          onVisibleChange: (value) => setVisible(value)
        }}
        style={{ display: 'none' }}
        src={typeof props.file === 'string' ? props.file : url}
      />
    </>
  )
}

export default ImgShowComp
