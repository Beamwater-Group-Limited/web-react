import { Collapse, CollapseProps } from 'antd'
import { ImgSettings } from './components'
import { FlowItemType, getAllFlowApi } from '@/api'
import { useEffect, useState } from 'react'
/** 配置页面 */
const SettingsPage = () => {
  const [_allFlows, setAllFlows] = useState<FlowItemType[]>([]) //所有流程
  const [options, setOptions] = useState<
    {
      label: string
      key: string
    }[]
  >([]) //下拉框选项

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
    })
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '图片组件配置',
      children: <ImgSettings options={options} />
    }
  ]

  useEffect(() => {
    initOptions()
  }, [])

  return (
    <div>
      <Collapse items={items} defaultActiveKey={['1']} />
    </div>
  )
}
export default SettingsPage
