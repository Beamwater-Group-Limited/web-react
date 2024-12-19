import { Button, Form, message, Select } from 'antd'
import { componentSettingSaveApi, FlowItemType, getAllFlowApi } from '@/api'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import DragPage from '../drag'
/** 配置页面 */
const SettingsPage = () => {
  const [imgSettingsForm] = Form.useForm()
  const [writeSettingsForm] = Form.useForm()
  const navigate = useNavigate()
  const [_allFlows, setAllFlows] = useState<FlowItemType[]>([]) //所有流程
  const imgFlowRef = useRef<any>()
  const writeFlowRef = useRef<any>()
  const [options, setOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([]) //下拉框选项

  const [imgFlow, setImgFlow] = useState('') //图片流程
  const [writeFlow, setWriteFlow] = useState('')

  /** 点击保存 */
  const saveHandler = async () => {
    const { img } = await imgSettingsForm.validateFields()
    const { write } = await writeSettingsForm.validateFields()
    if (!img || !write) return message.warning('请选择流程')
    componentSettingSaveApi([
      {
        component: '图片智能处理控件',
        flow: img
      },
      {
        component: '手写字智能处理控件',
        flow: write
      }
    ]).then((res) => {
      if (res.info.status === 200) {
        message.success('保存成功')
        navigate(-1)
      } else {
        message.error(res.info.name)
      }
    })
  }

  /** 图片流程改变时 */
  const imgFlowChange = (value: string) => {
    setImgFlow(value)
    imgFlowRef.current?.drawById(value)
  }

  /** 手写提 */
  const writeFlowChange = (value: string) => {
    setWriteFlow(value)
    writeFlowRef.current?.drawById(value)
  }

  /** 初始化选项 */
  const initOptions = () => {
    getAllFlowApi().then(({ data }) => {
      if (data instanceof Array) {
        let optionList = data.map((item) => {
          return {
            label: item.data.flow_name,
            value: item.id
          }
        })
        setAllFlows(data)
        setOptions(optionList)
      }
    })
  }

  useEffect(() => {
    initOptions()
  }, [])

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          color="default"
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
          variant="text"
        >
          返回
        </Button>
        <div className="flex gap-4">
          <Button type="primary" onClick={() => navigate('/flow-list')}>
            流程管理
          </Button>
          <Button type="primary" onClick={saveHandler}>
            保存
          </Button>
        </div>
      </div>
      <Form form={imgSettingsForm} name="imgSettingsForm" layout="vertical" autoComplete="off">
        <Form.Item name="img" label="图片智能处理控件" rules={[{ required: true }]}>
          <Select value={imgFlow} onChange={imgFlowChange} options={options} />
        </Form.Item>
      </Form>
      <DragPage show={true} ref={imgFlowRef} />
      <Form form={writeSettingsForm} layout="vertical" autoComplete="off" className="mt-4">
        <Form.Item name="write" label="手写字智能处理控件" rules={[{ required: true }]}>
          <Select value={writeFlow} onChange={writeFlowChange} options={options} />
        </Form.Item>
      </Form>
      <DragPage show={true} ref={writeFlowRef} />
    </>
  )
}
export default SettingsPage
