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
    <div className="border-t-[1px] lg:h-[14vh] sm:h-[15vh] border-zinc-300 flex flex-col gap-4 p-4">
      {/* 用户选择 */}
      <div className="w-full flex items-center lg:text-base sm:text-5xl base:text-3xl gap-4 rounded">
        <div>输出</div>
        <Checkbox.Group
          disabled={props.status !== 'default'}
          style={{ width: '100%' }}
          options={outputOptions}
          value={props.output}
          defaultValue={['Apple']}
          onChange={(v) => props.setOutput(v)}
        />
      </div>
      {/* 按钮组 */}
      <div className="flex items-center justify-center gap-4">
        {props.output.includes('3') && (
          <Button
            type="primary"
            icon={<SoundOutlined />}
            size="large"
            onClick={soundHandler}
            disabled={props.status !== 'success' || !props.soundUrl || !props.output.includes('3')}
          >
            <span className="lg:text-base sm:text-5xl">朗读</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default HandleBox
