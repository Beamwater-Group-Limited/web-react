import { UserOutlined } from '@ant-design/icons'
import { Bubble, BubbleProps } from '@ant-design/x'
import { Flex, GetProp, GetRef } from 'antd'
import { useRef } from 'react'
import { BubbleItemType } from '../types'
import markdownit from 'markdown-it'
const md = markdownit({ html: true, breaks: true })
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
)

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600
    }
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
    messageRender: renderMarkdown
  }
}

/** 对话框组件 */
const BubbleListComp = (props: {
  bubbleList: BubbleItemType[]
  setBubbleList: React.Dispatch<React.SetStateAction<BubbleItemType[]>>
}) => {
  const listRef = useRef<GetRef<typeof Bubble.List>>(null)
  return (
    <div className="absolute top-[8vh] left-[25vw] w-[50vw] h-[80vh] bg-slate-200 rounded p-4 overflow-auto">
      <Flex gap="middle" vertical>
        <Bubble.List
          autoScroll
          ref={listRef}
          style={{ maxHeight: '100%' }}
          roles={roles}
          items={props.bubbleList.map((bubbleItem) => {
            return {
              key: bubbleItem.time,
              role: bubbleItem.role,
              content: bubbleItem.content
            }
          })}
        />
      </Flex>
    </div>
  )
}

export default BubbleListComp
