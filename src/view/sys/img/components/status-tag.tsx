import { Tag } from 'antd'

/** 状态 */
const StatusTag = ({ status }: { status: 'processing' | 'error' | 'success' | 'default' }) => {
  return (
    <Tag bordered={false} color={status}>
      {status === 'success'
        ? '处理成功'
        : status === 'error'
          ? '处理失败'
          : status === 'default'
            ? '待处理'
            : '处理中'}
    </Tag>
  )
}
export default StatusTag
