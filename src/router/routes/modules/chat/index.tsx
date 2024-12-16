import ChatPage from '@/view/sys/chat/index'
import { AudioOutlined } from '@ant-design/icons'
const ChatModule: MenuItemType = {
  order: 1,
  name: '聊天语音页面',
  path: 'chat',
  icon: <AudioOutlined />,
  element: <ChatPage />
}

export default ChatModule
