import { FlowItemType, getAllFlowApi, runTestApi } from '@/api'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, message, Space, Table, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
/** 流程列表页面 */
const FlowListPage = () => {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const [flowList, setFlowList] = useState<FlowItemType[]>([])
  const getFlowList = () => {
    setLoading(true)
    getAllFlowApi()
      .then(({ data }) => {
        setFlowList(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const toEdit = (item: FlowItemType) => {
    navigate('/drag?id=' + item.id)
  }

  /** 点击测试 */
  const testHandler = (item: FlowItemType) => {
    setLoading(true)
    runTestApi(item)
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

  const columns: TableProps<FlowItemType>['columns'] = [
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
  return (
    <>
      <div className="flex justify-between mb-4">
        <Button
          className="float-left"
          color="default"
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
          variant="text"
        >
          返回
        </Button>
        <Button type="primary" onClick={() => navigate('/drag')}>
          新增流程
        </Button>
      </div>
      <Table loading={loading} rowKey="id" columns={columns} dataSource={flowList} />
    </>
  )
}

export default FlowListPage
