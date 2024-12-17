import { SoundOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'

/** 处理框 */
const HandleBox = (props: {
  status: 'processing' | 'error' | 'success' | 'default'
  file: File | null
  loading: boolean
  resultTxt: string
  onHandle: () => void
}) => {
  /** 读文字 */
  const soundHandler = () => {
    if (!window.SpeechSynthesisUtterance) {
      return message.warning('当前浏览器不支持语音功能')
    }
    if (props.resultTxt) {
      const utterance = new SpeechSynthesisUtterance(props.resultTxt)
      window.speechSynthesis.speak(utterance)
    }
  }
  return (
    <div className="border-t-[1px] h-[16vh] border-zinc-300 flex justify-center items-center gap-4">
      <Button
        type="primary"
        disabled={!props.file}
        size="large"
        onClick={props.onHandle}
        loading={props.loading}
      >
        处理
      </Button>
      <Button
        type="primary"
        icon={<SoundOutlined />}
        size="large"
        onClick={soundHandler}
        disabled={props.status !== 'success'}
      >
        朗读
      </Button>
    </div>
  )
}

export default HandleBox
