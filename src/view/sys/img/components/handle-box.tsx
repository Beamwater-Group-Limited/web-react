import { SoundOutlined } from '@ant-design/icons'
import { Button, Checkbox } from 'antd'

/** 处理框 */
const HandleBox = (props: {
  output: string[]
  soundUrl: string
  setOutput: (v: string[]) => void
  status: 'processing' | 'error' | 'success' | 'default'
  resultTxt: string
}) => {
  /** 读文字 */
  const soundHandler = () => {
    const audio = new Audio(props.soundUrl)
    audio.play() // 播放音频
  }

  const outputOptions = [
    { label: '文本', value: '1' },
    { label: '图片', value: '2' },
    { label: '音频', value: '3' }
  ] //下拉框

  return (
    <div className="border-t-[1px] h-[14vh] border-zinc-300 flex flex-col gap-4 p-4">
      {/* 用户选择 */}
      <div className="flex items-center gap-4 border-r-[1px] rounded">
        <span>输出</span>
        <Checkbox.Group
          options={outputOptions}
          value={props.output}
          defaultValue={['Apple']}
          onChange={(v) => props.setOutput(v)}
        />
      </div>
      {/* 按钮组 */}
      <div className="flex items-center justify-center gap-4">
        <Button
          type="primary"
          icon={<SoundOutlined />}
          size="large"
          onClick={soundHandler}
          disabled={props.status !== 'success' || !props.soundUrl}
        >
          朗读
        </Button>
      </div>
    </div>
  )
}

export default HandleBox
