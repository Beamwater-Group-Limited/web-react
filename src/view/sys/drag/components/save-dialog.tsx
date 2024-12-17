import { Button, Form, Input, message, Modal, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ItemType } from '../utils'
import { saveFlowApi } from '@/api'
import { useState } from 'react'

const SaveDialogComp = (props: {
  isModalOpen: boolean
  onCancel: () => void
  funcList: ItemType[]
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  /** 取消 */
  const closeHandler = () => {
    form.resetFields()
    props.onCancel()
  }
  /** 保存 */
  const onFinish = (value: { name: string }) => {
    setLoading(true)
    saveFlowApi({
      all_function: props.funcList,
      flow_name: value.name
    })
      .then(({ info }) => {
        if (info.status === 200) {
          closeHandler()
          message.success('保存成功')
          navigate('/flow-list')
        } else {
          message.error(info.name)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  return (
    <Modal title="保存设置" footer={<></>} open={props.isModalOpen} onCancel={closeHandler}>
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" loading={loading} htmlType="submit">
              保存
            </Button>
            <Button loading={loading} onClick={closeHandler}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SaveDialogComp
