import { CloudUploadOutlined, LinkOutlined, UserOutlined } from '@ant-design/icons'
import { Bubble, Sender } from '@ant-design/x'
import { default as SearchDrawerComp } from './components/search-drawer'
import { Button, Flex, message, theme, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Page1 = () => {
  const [searchVisible, setSearchVisible] = useState(false)
  const navigate = useNavigate()
  const toPage1 = () => {
    navigate('/page1')
  }
  const { token } = theme.useToken()
  const [open, setOpen] = useState(false)

  const SearchHeader = () => {
    return (
      <Sender.Header title="Upload Sample" open={open} onOpenChange={setOpen}>
        <Flex vertical align="center" gap="small" style={{ marginBlock: token.paddingLG }}>
          <CloudUploadOutlined style={{ fontSize: '4em' }} />
          <Typography.Title level={5} style={{ margin: 0 }}>
            Drag file here (just demo)
          </Typography.Title>
          <Typography.Text type="secondary">
            Support pdf, doc, xlsx, ppt, txt, image file types
          </Typography.Text>
          <Button
            onClick={() => {
              message.info('Mock select file')
            }}
          >
            Select File
          </Button>
        </Flex>
      </Sender.Header>
    )
  }

  return (
    <>
      <div className="w-full relative h-full flex flex-col items-center justify-center gap-12">
        {/* 预览按钮 */}
        <Button onClick={toPage1} className="absolute top-0 right-0" type="primary">
          使用页面1
        </Button>
        {/* 输入框 */}
        <div className="w-[50%]" onClick={() => setSearchVisible(true)}>
          <Sender
            prefix={
              <Button
                type="text"
                icon={<LinkOutlined />}
                onClick={() => {
                  setOpen(!open)
                }}
              />
            }
            header={<SearchHeader />}
            disabled
            allowSpeech
            placeholder="输入您想要搜索的内容"
          />
        </div>
        {/* 对话框 */}
        <div className="w-[50%] h-[80%] bg-slate-200 rounded p-4">
          <Flex gap="middle" vertical>
            <Bubble
              placement="start"
              content="Good morning, how are you?"
              avatar={{
                icon: <UserOutlined />,
                style: { color: '#f56a00', backgroundColor: '#fde3cf' }
              }}
            />
            <Bubble
              placement="end"
              content="Hi, good morning, I'm fine!"
              avatar={{
                icon: <UserOutlined />,
                style: {
                  color: '#fff',
                  backgroundColor: '#87d068'
                }
              }}
            />
          </Flex>
        </div>
      </div>
      {/* 配置框 */}
      <SearchDrawerComp visible={searchVisible} close={() => setSearchVisible(false)} />
    </>
  )
}

export default Page1
