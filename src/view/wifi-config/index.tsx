import { Button, Card, Form, Input, message, Select } from 'antd'
import WifiIcon from '@/assets/images/wifi/wifi.png'
import WifiBad from '@/assets/images/wifi/wifi-bad.png'
import WifiFull from '@/assets/images/wifi/wifi-full.png'
import LockIcon from '@/assets/images/wifi/lock.png'
import PageStyle from './index.module.less'
import { useEffect, useState } from 'react'
type WifiItemType = {
  ssid: string
  signal_strength: number
  authentication: 0 | 1
}

type OptionItemType = {
  label: string
  value: string
  emoji: string
  desc: string
}

/** 下拉框每项 */
const optionItem = ({ data }: { data: OptionItemType }) => {
  const signal = Number(data.desc) //信号
  const auth = Number(data.emoji) //是否加密
  return (
    <div className="flex items-center justify-between gap-4" key={data.value}>
      <div className="flex items-center gap-4">
        <img
          src={signal > -50 ? WifiFull : signal > -80 ? WifiIcon : WifiBad}
          width={15}
          height={15}
        />
        <span>{data.label}</span>
      </div>
      {auth === 0 ? <img src={LockIcon} width={15} height={15} /> : null}
    </div>
  )
}

/** wifi配置页面 */
const WifiConfigPage = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [wifiOptions, setWifiOptions] = useState<OptionItemType[]>([]) // 下拉框
  const [wifiOptionsList, setWifiOptionsList] = useState<WifiItemType[]>([]) //所有wifi列表
  const [needPassword, setNeedPassword] = useState<boolean>(false) //是否需要密码
  const [ip, setIp] = useState('')
  const [connect, setConnect] = useState(false)

  /** 下拉框改变 */
  const onChange = (changedValues: any) => {
    if (changedValues.wifi) {
      form.setFieldValue('password', '')
      let wifi = changedValues.wifi
      let wifiItem = wifiOptionsList.find((item) => item.ssid === wifi)
      if (wifiItem && wifiItem.authentication === 0) {
        setNeedPassword(true)
      } else {
        setNeedPassword(false)
      }
    }
  }

  /** 连接操作 */
  const onFinish = (value: any) => {
    setLoading(true)
    fetch(
      `http://192.168.50.1:5000/connect_wifi?wifi_name=${value.wifi}&password=${value.password}`
    ).then((data) => {
      if (data.status === 200) {
        setLoading(false)
        message.success('连接成功')
        fetch('http://192.168.50.1:5000/get_wifi_ip')
          .then((res) => res.json())
          .then((data) => {
            let i = data.ip_address
            if (i) {
              setIp(data.ip_address)
              fetch('192.168.50.1:5000/connected_test').then((data) => {
                if (data.status === 200) {
                  setConnect(true)
                } else {
                  setConnect(false)
                }
              })
            }
          })
      } else {
        message.error('连接失败')
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    setLoading(true)
    fetch('http://192.168.50.1:5000/get_all_wifi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setWifiOptionsList(data)
        let options = data.map((item: WifiItemType) => {
          return {
            label: item.ssid,
            value: item.ssid,
            emoji: item.authentication.toString(),
            desc: item.signal_strength.toString()
          }
        })
        setWifiOptions(options)
        setLoading(false)
      })
      .catch(() => {
        message.error('获取wifi列表失败')
        setLoading(false)
      })
  }, [])

  return (
    <div className={`h-full w-full relative ${PageStyle['page']}`}>
      <Card className="w-[40vw] absolute right-[5vw] top-[15vh]">
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          onValuesChange={onChange}
          onFinish={onFinish}
        >
          <Form.Item name="wifi" label="选择WIFI" rules={[{ required: true }]}>
            <Select
              placeholder="选择WiFi"
              disabled={loading}
              loading={loading}
              options={wifiOptions}
              optionRender={optionItem}
              key={'ssid'}
            />
          </Form.Item>
          {needPassword && (
            <Form.Item name="password" label="密码" rules={[{ required: true }]}>
              <Input.Password placeholder="请输入密码" disabled={loading} />
            </Form.Item>
          )}
          <Form.Item>
            <Button block type="primary" loading={loading} htmlType="submit">
              连接
            </Button>
          </Form.Item>
          {ip !== '' && (
            <>
              <Form.Item label="IP地址">{ip}</Form.Item>
              {connect ? <Form.Item>可以联网</Form.Item> : <Form.Item>无法联网</Form.Item>}
            </>
          )}
        </Form>
      </Card>
    </div>
  )
}

export default WifiConfigPage
