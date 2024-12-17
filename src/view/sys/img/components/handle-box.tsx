import { SoundOutlined } from '@ant-design/icons'
import { Button, Checkbox, message } from 'antd'
import { useState } from 'react'

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
  const [output, setOutput] = useState<string[]>([])

  const outputOptions = [
    { label: '文本', value: '文本' },
    { label: '图片', value: '图片' },
    { label: '音频', value: '音频' }
  ] //下拉框

  return (
    <div className="border-t-[1px] h-[16vh] border-zinc-300 flex flex-col gap-4 p-4">
      {/* 用户选择 */}
      <div className="flex items-center gap-4">
        <span>输出</span>
        <Checkbox.Group
          options={outputOptions}
          value={output}
          defaultValue={['Apple']}
          onChange={(v) => setOutput(v)}
        />
      </div>
      {/* 按钮组 */}
      <div className="flex items-center justify-center gap-4">
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
    </div>
  )
}

export default HandleBox
