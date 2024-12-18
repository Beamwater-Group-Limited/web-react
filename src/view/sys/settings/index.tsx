import { Button, Form, Select } from 'antd'
import { FlowItemType, getAllFlowApi } from '@/api'
import { useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
/** 配置页面 */
const SettingsPage = () => {
  const [imgSettingsForm] = Form.useForm()
  const navigate = useNavigate()
  const [_allFlows, setAllFlows] = useState<FlowItemType[]>([]) //所有流程
  const [options, setOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([]) //下拉框选项

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
  }

  /** 初始化选项 */
  const initOptions = () => {
    getAllFlowApi().then(({ data }) => {
      let optionList = data.map((item) => {
        return {
          label: item.data.flow_name,
          value: item.id
        }
      })
      setAllFlows(data)
      setOptions(optionList)
    })
  }

  useEffect(() => {
    initOptions()
  }, [])

  return (
    <div>
      <Button
        className="float-left"
        color="default"
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
        variant="text"
      >
        返回
      </Button>
      <Form
        form={imgSettingsForm}
        name="imgSettingsForm"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item>
          <div className="flex items-end justify-end gap-4">
            <Button type="primary" onClick={() => navigate('/drag')}>
              新增流程
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </Form.Item>
        <Form.Item name="img" label="图片智能处理控件" rules={[{ required: true }]}>
          <Select options={options} />
        </Form.Item>
        <Form.Item name="write" label="手写字智能处理控件" rules={[{ required: true }]}>
          <Select options={options} />
        </Form.Item>
      </Form>
    </div>
  )
}
export default SettingsPage
