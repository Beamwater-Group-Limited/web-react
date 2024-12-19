import { Button, Watermark } from 'antd'
import { HandleBox, ImgShowComp, StatusTag } from './components'
import { forwardRef, Ref, useImperativeHandle, useState } from 'react'
import { imgHandleApi } from '@/api'

const ImgHandleComp = forwardRef(
  (
    props: {
      componentName: string
      file: File | null
      showChildren?: React.ReactNode
      optionsChildren?: React.ReactNode
    },
    ref: Ref<any>
  ) => {
    const [handledImg, setHandledImg] = useState<string>('') // 处理后的图片
    const [loading, setLoading] = useState(false) //loading
    const [resultTxt, setResultTxt] = useState('') //识别结果
    const [status, setStatus] = useState<'processing' | 'error' | 'success' | 'default'>('default')
    const [output, setOutput] = useState<string[]>(['1']) //输出数组
    const [soundUrl, setSoundUrl] = useState('') //音频url

    useImperativeHandle(ref, () => ({
      loading,
      output,
      reset: resetStatus
    }))

    /** 创建声音文件 */
    const createSound = (base64String: string) => {
      // Step 1: 将 Base64 字符串转换为二进制数据
      const byteCharacters = atob(base64String) // 解码 Base64 字符串
      const byteArray = new Uint8Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i)
      }

      // Step 2: 创建一个 Blob 对象
      const blob = new Blob([byteArray], { type: 'audio/mp3' }) // 你可以根据文件格式调整 type

      // Step 3: 创建一个 Object URL
      const audioURL = URL.createObjectURL(blob)
      return audioURL
    }

    /** 点击处理 */
    const onHandle = () => {
      if (props.file) {
        setLoading(true)
        setStatus('processing')
        const reader = new FileReader()
        reader.onload = async (event) => {
          if (!event.target || !event.target.result) return
          let src = event.target.result as string
          const fileBase64 = src.split(',')[1]
          imgHandleApi({
            input_type: [2],
            input_data: {
              text: '',
              image_data: fileBase64,
              voice_data: '',
              file_data: '',
              stream: ''
            },
            output_type: output.map((item) => Number(item)),
            flow_id: '6334fb8a-b39b-4cbc-8e76-461eff563d42'
          })
            .then(({ data, info }) => {
              if (info.status === 200 && data.output_data) {
                const { text, voice } = data.output_data
                setResultTxt(text)
                setStatus('success')
                if (voice) {
                  setSoundUrl(createSound(voice))
                }
              } else {
                setStatus('error')
              }
              setLoading(false)
            })
            .catch(() => {
              setLoading(false)
              setStatus('error')
            })
        }
        reader.readAsDataURL(props.file as unknown as Blob)
      }
    }

    /** 重置状态 */
    const resetStatus = () => {
      setStatus('default')
      setHandledImg('')
      setResultTxt('')
    }

    return (
      <div className="w-[80vw] border-[1px] border-zinc-300 rounded bg-slate-50">
        <Watermark content={props.componentName} className="w-full h-full grid grid-cols-2">
          <div className="h-full border-r-[1px] border-zinc-300">
            {/* 图片展示区域 */}
            <div className="w-full lg:h-[56vh] sm:h-[30vh] base:h-[50vh] overflow-auto p-4 flex items-center justify-center">
              {props.showChildren}
            </div>
            {/* 上传区域 */}
            <div className="w-full lg:h-[14vh] sm:h-[15vh] flex lg:flex-row base:flex-row sm:flex-col lg:gap-4 sm:gap-[10px] relative border-t-[1px] border-zinc-300">
              {props.optionsChildren}
              <div className="lg:w-[20%] base:w-[20%] lg:h-full base:h-full sm:h-[5vh] flex items-center justify-center">
                <Button
                  type="primary"
                  disabled={!props.file || output.length === 0}
                  onClick={onHandle}
                  loading={loading}
                >
                  <span className="lg:text-base sm:text-5xl base:text-3xl">处理</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="h-full">
            <div className="text-xl text-zinc-700 tracking-[2px]">
              {/* 处理结果的图片 */}
              <div className="lg:h-[40vh] sm:h-[20vh] base:h-[30vh] overflow-auto border-b-[1px] flex items-center justify-center">
                <ImgShowComp file={handledImg} />
              </div>
              {/* 处理结果的文字 */}
              <div className="lg:h-[16vh] sm:h-[10vh] base:h-[20vh] w-full flex">
                <div className="lg:w-[30%] sm:w-[45%] border-r-[1px] flex items-center justify-center">
                  <StatusTag status={status} />
                </div>
                <div className="lg:w-[70%] sm:w-[55%] p-2">{resultTxt}</div>
              </div>
            </div>
            {/* 处理框 */}
            <HandleBox
              soundUrl={soundUrl}
              output={output}
              setOutput={setOutput}
              status={status}
              resultTxt={resultTxt}
            />
          </div>
        </Watermark>
      </div>
    )
  }
)

export default ImgHandleComp
