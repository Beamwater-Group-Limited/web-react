import {
  BubbleListComp,
  InputBoxComp
  // FlowSelectorComp
  // MonitorBoxComp
} from './components'
import { Suggestion } from '@ant-design/x'
import { useRef, useState } from 'react'
import { BubbleItemType } from './types'
import { FlowItemType, runApi } from '@/api'
import { UploadFile } from 'antd'
// import { getRandomString } from '@lichang666/utils'
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

const Page1 = () => {
  const [bubbleList, setBubbleList] = useState<BubbleItemType[]>([]) // 对话框
  const [loading, setLoading] = useState<boolean>(false) //加载效果
  const [currentFlow, setCurrentFlow] = useState<FlowItemType>() //当前流程
  const [fileList, setFileList] = useState<UploadFile[]>([]) //文件列表

  const inputBoxRef = useRef<InputBoxCompRef>(null)

  /** 点击提交 */
  const submitHandler = () => {
    if (!inputBoxRef.current) return
    const { inputValue, setInputValue } = inputBoxRef.current
    if (fileList.length > 0) {
      setLoading(true)
      let file = fileList[0]
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (!event.target || !event.target.result) return
        let src = event.target.result as string
        const fileBase64 = src.split(',')[1]
        if (inputValue === '/' || !currentFlow) return
        setBubbleList((pre) => [
          ...pre,
          {
            time: new Date().getTime().toString(),
            content: `<img src="${src}" alt="alt text" style="width: 200px; height: 200px;" />`,
            role: 'user'
          }
        ])
        runApi({
          image_data: fileBase64,
          ...currentFlow
        }).then(({ info, data }) => {
          setLoading(false)
          if (info.status === 200) {
            setLoading(false)
            setInputValue('')
            setFileList([])
            inputBoxRef.current && inputBoxRef.current.setOpen(false)
            setBubbleList((pre) => [
              ...pre,
              {
                time: new Date().getTime().toString(),
                content: data.value,
                role: 'ai'
              }
            ])
          }
        })
      }
      reader.readAsDataURL(file as unknown as Blob)
    } else {
      if (inputValue === '' || inputValue === '/' || !currentFlow) return
      setBubbleList((pre) => {
        return [
          ...pre,
          {
            time: new Date().getTime().toString(),
            content: inputValue,
            role: 'user'
          }
        ]
      })
      setInputValue('')
    }
  }

  /** 截屏后保存图片 */
  // const captureHandler = (file: File) => {
  //   let f = file as unknown as UploadFile
  //   f.uid = getRandomString(12)
  //   setFileList((pre) => {
  //     return [...pre, f]
  //   })
  //   inputBoxRef.current && inputBoxRef.current.setOpen(true)
  // }

  return (
    <div className="relative bg-white w-full h-full">
      <RobotComp className="top-6 left-6" />
      {/* <MonitorBoxComp onCapture={captureHandler} /> */}
      {/* 流程选择器 */}
      {/* <FlowSelectorComp currentFlow={currentFlow} setCurrentFlow={setCurrentFlow} /> */}
      {/* 对话框 */}
      <BubbleListComp bubbleList={bubbleList} setBubbleList={setBubbleList} />
      {/* 输入框 */}
      <div className="absolute bottom-[1vh] left-[25vw] w-[50vw] z-30 bg-white">
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

export default Page1
