import { FlowItemType, getAllFlowApi } from '@/api'
import { DownOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'

/** 流程选择器 */
const FlowSelector = (props: {
  currentFlow: FlowItemType | undefined
  setCurrentFlow: React.Dispatch<React.SetStateAction<FlowItemType | undefined>>
}) => {
  const [options, setOptions] = useState<
    {
      label: string
      key: string
    }[]
  >([]) //下拉框选项
  const [allFlows, setAllFlows] = useState<FlowItemType[]>([]) //所有流程

  /** 初始化选项 */
  const initOptions = () => {
    getAllFlowApi().then(({ data }) => {
      let optionList = data.map((item) => {
        return {
          label: item.data.flow_name,
          key: item.id
        }
      })
      setAllFlows(data)
      setOptions(optionList)
      if (optionList[0]) {
        props.setCurrentFlow(data[0])
      }
    })
  }

  /** 下拉改变 */
  const handleChange = (info: { key: string }) => {
    let flow = allFlows.find((item) => item.id === info.key)
    if (flow) {
      props.setCurrentFlow(flow)
    }
  }

  useEffect(() => {
    initOptions()
  }, [])
  return (
    <div className="absolute top-[1vh] left-[25vw] w-[50vw]">
      <Dropdown
        menu={{
          items: options,
          selectable: true,
          selectedKeys: [props.currentFlow?.id || ''],
          onSelect: handleChange
        }}
        trigger={['click']}
      >
        <div className="inline-flex items-center gap-1 text-slate-700 cursor-pointer p-2 rounded hover:bg-slate-100">
          <span className="text-lg font-bold">
            {props.currentFlow?.data.flow_name || '请选择流程'}
          </span>
          <DownOutlined className="text-slate-500 text-sm" />
        </div>
      </Dropdown>
    </div>
  )
}

export default FlowSelector
