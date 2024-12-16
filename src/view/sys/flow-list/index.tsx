import { Button, message, Space, Table, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
type ItemType = {
  id: string
  all_function: string[]
  flow_name: string
}

/** 流程列表页面 */
const FlowListPage = () => {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const [flowList, setFlowList] = useState<ItemType[]>([])
  const getFlowList = () => {
    setLoading(true)
    fetch('http://192.168.0.100:8080/v1/get_all_flow', {
      method: 'POST'
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setFlowList(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const toEdit = (item: ItemType) => {
    navigate('/settings/drag?id=' + item.id)
  }

  /** 点击测试 */
  const testHandler = (item: ItemType) => {
    setLoading(true)
    fetch('http://192.168.0.100:8080/v1/test_run_flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then((res) => res.json())
      .then(({ data, info }) => {
        if (info.status === 500) {
          message.error(info.name)
        } else {
          message.success(data.value)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getFlowList()
  }, [])

  const columns: TableProps<ItemType>['columns'] = [
    {
      title: '流程名称',
      dataIndex: 'data',
      key: 'data',
      render: (_) => {
        return <span>{_.flow_name}</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => testHandler(record)} color="primary" variant="text">
            测试
          </Button>
          <Button onClick={() => toEdit(record)} color="primary" variant="text">
            查看
          </Button>
        </Space>
      )
    }
  ]
  return <Table loading={loading} rowKey="id" columns={columns} dataSource={flowList} />
}

export default FlowListPage
