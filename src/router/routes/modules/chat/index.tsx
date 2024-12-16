import ChatPage from '@/view/sys/chat/index'
import { HomeOutlined } from '@ant-design/icons'
const ChatModule: MenuItemType = {
  order: 1,
  name: '聊天语音',
  path: 'chat',
  icon: <HomeOutlined />,
  element: <ChatPage />
}

export default ChatModule
