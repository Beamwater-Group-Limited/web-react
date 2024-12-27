import { BubbleListComp, InputBoxComp, FlowSelectorComp } from './components'
import { Suggestion } from '@ant-design/x'
import { useRef, useState } from 'react'
import { BubbleItemType } from './types'
import { FlowItemType, imgHandleApi } from '@/api'
import { Popover, UploadFile } from 'antd'
import { InputBoxCompRef } from './components/input-box'
import RobotComp from '@/components/robot'

const suggestions = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    extra: 'Extra Info'
  }
]

const ChatPage = () => {
  const [bubbleList, setBubbleList] = useState<BubbleItemType[]>([]) // 对话框
  const [loading, setLoading] = useState<boolean>(false) //加载效果
  const [currentFlow, setCurrentFlow] = useState<FlowItemType>() //当前流程
  const [fileList, setFileList] = useState<UploadFile[]>([]) //文件列表

  const inputBoxRef = useRef<InputBoxCompRef>(null)
  const [popVis, setPopVis] = useState(false)
  /** 点击提交 */
  const submitHandler = () => {
    if (!inputBoxRef.current) return
    const { inputValue, setInputValue } = inputBoxRef.current
    if (inputValue === '' || inputValue === '/' || !currentFlow) return
    setBubbleList((pre) => {
      return [
        ...pre,
        {
          time: new Date().getTime().toString(),
          content: inputValue,
          role: 'user'
        },
        {
          time: new Date().getTime().toString(),
          content: '',
          loading: true,
          role: 'ai'
        }
      ]
    })
    setLoading(true)
    imgHandleApi({
      input_type: [1],
      input_data: {
        text: inputValue,
        image_data: '',
        voice_data: '',
        file_data: '',
        stream: ''
      },
      output_type: [1],
      flow_id: currentFlow.id
    })
      .then(({ data, info }) => {
        if (info.status === 200) {
          setBubbleList((pre) => {
            return [
              ...pre.slice(0, pre.length - 1),
              {
                time: new Date().getTime().toString(),
                content: data.output_data.text,
                role: 'ai'
              }
            ]
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
    setInputValue('')
  }

  return (
    <div className="relative bg-white w-full h-full">
      <Popover
        content={<span>点击我进行流程配置</span>}
        placement="left"
        trigger="click"
        open={popVis}
        onOpenChange={(open) => setPopVis(open)}
      >
        <RobotComp className="lg:top-[0vh] right-[5vw] sm:bottom-[50vh] base:top-0" />
      </Popover>
      {/* 流程选择器 */}
      <FlowSelectorComp
        className="absolute top-[1vh] lg:left-[25vw] sm:left-[10vw] w-[50vw]"
        currentFlow={currentFlow}
        setCurrentFlow={setCurrentFlow}
      />
      {/* 对话框 */}
      <BubbleListComp bubbleList={bubbleList} setBubbleList={setBubbleList} />
      {/* 输入框 */}
      <div className="absolute bottom-[1vh] lg:left-[25vw] base:left-[25vw] sm:left-[10vw] lg:w-[50vw] base:w-[50vw] z-30 bg-white">
        <Suggestion
          items={suggestions}
          onSelect={(itemVal) => {
            inputBoxRef.current?.setInputValue(`[${itemVal}]:`)
          }}
        >
          {({ onTrigger, onKeyDown }) => {
            return (
              <InputBoxComp
                ref={inputBoxRef}
                fileList={fileList}
                setFileList={setFileList}
                loading={loading}
                onKeyDown={onKeyDown}
                setLoading={setLoading}
                submitHandler={submitHandler}
                onTrigger={onTrigger}
              />
            )
          }}
        </Suggestion>
      </div>
    </div>
  )
}

export default ChatPage
