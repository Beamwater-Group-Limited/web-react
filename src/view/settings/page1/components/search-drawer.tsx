import { Button, Drawer, Form, Input } from 'antd'

/** 搜索按钮的配置项 */
const SearchDrawerComp = (props: { visible: boolean; close: () => void }) => {
  const [form] = Form.useForm()

  const onFinish = (value: any) => {
    console.log(value)
  }

  /** 点击了取消 */
  const cancelHandler = () => {
    form.resetFields()
    props.close()
  }

  return (
    <Drawer title="配置项" size="large" onClose={cancelHandler} open={props.visible}>
      <Form form={form} name="searchForm" layout="vertical" autoComplete="off" onFinish={onFinish}>
        <Form.Item name="placeholder" label="占位内容" rules={[{ required: true }]}>
          <Input placeholder="输入框的占位内容" />
        </Form.Item>
        <Form.Item name="url" label="请求URL" rules={[{ required: true }]}>
          <Input addonBefore="http://" placeholder="请求的URL,例如:0.0.0.0:1234/api/getData" />
        </Form.Item>
        <Form.Item name="param" label="请求参数名" rules={[{ required: true }]}>
          <Input placeholder="请求参数名,例如:value" />
        </Form.Item>
        <Form.Item>
          <div className="flex items-center justify-center gap-4">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={cancelHandler}>取消</Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
export default SearchDrawerComp
