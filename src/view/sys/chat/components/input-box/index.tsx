import { Sender } from '@ant-design/x'
import { UploadFile } from 'antd'
import { default as PrefixComp } from './prefix'
import {
  forwardRef,
  KeyboardEventHandler,
  Ref,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import SenderHeaderComp from './sender-header'
import { getRandomString } from '@lichang666/utils'

export type InputBoxCompRef = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

/** 输入框组件 */
const InputBoxComp = forwardRef(
  (
    props: {
      loading: boolean
      fileList: UploadFile[]
      setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>
      onKeyDown: KeyboardEventHandler<any>
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
      submitHandler: () => void
      onTrigger: (info?: any) => void
    },
    ref: Ref<InputBoxCompRef>
  ) => {
    const [open, setOpen] = useState(false) //头部是否打开
    const [inputValue, setInputValue] = useState('') // 输入框

    /** 暴露子组件方法 */
    useImperativeHandle(ref, () => ({
      setOpen,
      inputValue,
      setInputValue
    }))

    /** 输入框值变化 */
    const inputValueChangeHandler = (value: string) => {
      if (value === '/') {
        props.onTrigger()
      } else if (!value) {
        props.onTrigger(false)
      }
      setInputValue(value)
    }

    /** 选择了文件 */
    const fileChangeHandler = (fileList: UploadFile[]) => {
      props.setFileList(fileList)
      if (fileList.length > 0) {
        setOpen(true)
      }
    }

    /** 粘贴图片 */
    const onPasteFile = (file: File) => {
      let newFile = file as unknown as UploadFile
      newFile.uid = getRandomString(12)
      props.setFileList((pre) => [...pre, newFile])
      setOpen(true)
    }

    useEffect(() => {
      const dragArea = document.body
      // 阻止默认行为以允许拖拽
      dragArea.addEventListener('dragover', (event) => {
        event.preventDefault()
      })
      dragArea.addEventListener('drop', (e) => {
        e.preventDefault() // 防止文件被打开在浏览器中
        const files = e.dataTransfer?.files // 获取拖拽的文件列表
        if (files && files.length > 0) {
          let newFiles = Array.from(files).map((file) => {
            ;(file as unknown as UploadFile).uid = getRandomString(12)
            return file as unknown as UploadFile
          })
          props.setFileList((pre) => [...pre, ...newFiles])
          setOpen(true)
        }
      })
    }, [])

    return (
      <Sender
        header={
          <SenderHeaderComp
            loading={props.loading}
            fileList={props.fileList}
            setFileList={props.setFileList}
            open={open}
            setOpen={setOpen}
          />
        }
        prefix={<PrefixComp fileList={props.fileList} fileChange={fileChangeHandler} />}
        value={inputValue}
        onChange={inputValueChangeHandler}
        loading={props.loading}
        allowSpeech
        onSubmit={props.submitHandler}
        onKeyDown={props.onKeyDown}
        onPasteFile={onPasteFile}
        onCancel={() => {
          props.setLoading(false)
        }}
        placeholder="输入您想要搜索的内容"
      />
    )
  }
)

export default InputBoxComp
