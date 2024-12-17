import { Form, Row, Col, Radio, Checkbox, Select, Button } from 'antd'

/** 聊天语音配置 */
const ChatSettings = (props: {
  options: {
    label: string
    key: string
  }[]
}) => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
  }
  return (
    <Form
      form={form}
      initialValues={{
        input: '1',
        output: ['1', '2'],
        flow_id: props.options[0]?.key || ''
      }}
      name="imgSettingsForm"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
    >
      <Row>
        <Col span={12}>
          {/* 输入 */}
          <Form.Item name="input" label="输入" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value={'1'}>文字</Radio>
              <Radio value={'3'}>声音</Radio>
            </Radio.Group>
          </Form.Item>
          {/* 输出 */}
          <Form.Item name="output" label="输出" rules={[{ required: true }]}>
            <Checkbox.Group>
              <Checkbox value={'1'}>文字</Checkbox>
              <Checkbox value={'2'}>图片</Checkbox>
              <Checkbox value={'3'}>声音</Checkbox>
              <Checkbox value={'4'}>文本文件</Checkbox>
              <Checkbox value={'5'}>流</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="flow_id" label="处理流程" rules={[{ required: true }]}>
            <Select options={props.options} />
          </Form.Item>
          <Form.Item>
            <div className="flex items-end justify-end">
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default ChatSettings
