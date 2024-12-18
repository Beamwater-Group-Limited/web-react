import { FuncParamsType } from '@/api'
import { Input, Select } from 'antd'
import { CurrentNodeType } from './types'

const OptionsBox = (props: {
  options: AntdSelectOption[]
  currentNode: CurrentNodeType
  changeHandler: (e: string) => void
  paramsChange: (e: string, key: string) => void
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <span>回调</span>
        <Select
          className="w-full"
          showSearch
          value={props.currentNode.functionName}
          onChange={(e) => props.changeHandler(e)}
          options={props.options}
        />
      </div>
      {props.currentNode.params.map((item: FuncParamsType) => {
        return (
          <div className="flex flex-col gap-4 mt-12" key={item.key}>
            <span>{item.key}</span>
            <Input
              disabled={item.is_update === '0'}
              value={item.default_value}
              onChange={(e) => props.paramsChange(e.target.value, item.key)}
            />
          </div>
        )
      })}
    </div>
  )
}

export default OptionsBox
