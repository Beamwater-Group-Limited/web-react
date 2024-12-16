import { Button, Form, Input, message, Modal, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ItemType } from '../utils'
import { saveFlowApi } from '@/api'

const SaveDialogComp = (props: {
  isModalOpen: boolean
  onCancel: () => void
  funcList: ItemType[]
}) => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  /** 取消 */
  const closeHandler = () => {
    form.resetFields()
    props.onCancel()
  }
  /** 保存 */
  const onFinish = (value: { name: string }) => {
    saveFlowApi({
      all_function: props.funcList,
      flow_name: value.name
    }).then(() => {
      closeHandler()
      message.success('保存成功')
      navigate('/settings/flow-list')
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
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={closeHandler}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SaveDialogComp
