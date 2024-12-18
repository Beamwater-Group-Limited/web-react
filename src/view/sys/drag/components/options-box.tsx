import { FuncParamsType } from '@/api'
import { Form, Input, Select } from 'antd'
import { CurrentNodeType } from './types'

const OptionsBox = (props: {
  disabled: boolean
  options: AntdSelectOption[]
  currentNode: CurrentNodeType
  onChange: (changeType: 'name' | 'param', value: string, key?: string) => void
}) => {
  const [form] = Form.useForm()
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-4">
        <span>回调</span>
        <Select
          disabled={props.disabled}
          className="w-full"
          showSearch
          value={props.currentNode.functionName}
          onChange={(e) => props.onChange('name', e)}
          options={props.options}
        />
      </div>
      <Form name="basic" form={form} layout="vertical" labelCol={{ span: 8 }} autoComplete="off">
        {props.currentNode.params.map((item: FuncParamsType) => {
          return (
            <Form.Item
              label={item.key}
              name={item.key}
              key={item.key}
              rules={[{ required: item.is_empty === '0' }]}
            >
              <Input
                disabled={item.is_update === '0' || props.disabled}
                value={item.default_value}
                onChange={(e) => props.onChange('param', e.target.value, item.key)}
              />
            </Form.Item>
          )
        })}
      </Form>
    </div>
  )
}

export default OptionsBox
