import { Button, Card, Divider, Form, Input, InputRef, message, Select, Space } from 'antd'
import {
  ComponentFlowType,
  componentSettingSaveApi,
  getAllFlowApi,
  getComponentSettingApi
} from '@/api'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import DragPage from '../drag'
import { getRouteQuery } from '@/utils'
/** 配置页面 */
const SettingsPage = () => {
  const [imgSettingsForm] = Form.useForm()
  const [writeSettingsForm] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const [settingOf, setSettingOf] = useState('') //判断是谁的配置
  const imgFlowRef = useRef<any>()
  const writeFlowRef = useRef<any>()
  const [name, setName] = useState('')
  const rtsp1InputRef = useRef<InputRef>(null)
  const [items, setItems] = useState<string[]>([])
  const [options, setOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([]) //下拉框选项

  const [imgFlow, setImgFlow] = useState('') //图片流程
  const [writeFlow, setWriteFlow] = useState('') //手写流程
  const [rtsp1, setRtsp1] = useState('') //rtsp地址
  const [rtsp2, setRtsp2] = useState('') //rtsp地址

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    setItems([...items, name])
    setName('')
  }

  /** 点击保存 */
  const saveHandler = async () => {
    const { img } = await imgSettingsForm.validateFields()
    const { write } = await writeSettingsForm.validateFields()
    if (!img || !write) return message.warning('请选择流程')
    let param: ComponentFlowType[] = [
      {
        component: settingOf === 'img' ? '图片智能处理控件' : '视频流智能处理控件1',
        flow: img,
        rtsp: settingOf === 'img' ? '' : rtsp1
      },
      {
        component: settingOf === 'img' ? '手写字智能处理控件' : '视频流智能处理控件2',
        flow: write,
        rtsp: settingOf === 'img' ? '' : rtsp2
      }
    ]
    componentSettingSaveApi(param).then((res) => {
      if (res.info.status === 200) {
        message.success('保存成功')
        navigate(-1)
      } else {
        message.error(res.info.name)
      }
    })
  }

  /** 图片流程改变时 */
  const imgFlowChange = (value: string) => {
    setImgFlow(value)
    imgFlowRef.current?.drawById(value)
  }

  /** 手写提 */
  const writeFlowChange = (value: string) => {
    setWriteFlow(value)
    writeFlowRef.current?.drawById(value)
  }

  /** 初始化选项 */
  const initOptions = () => {
    getAllFlowApi().then(({ data }) => {
      if (data instanceof Array) {
        let optionList = data.map((item) => {
          return {
            label: item.data.flow_name,
            value: item.id
          }
        })
        setOptions(optionList)
      }
    })
  }

  /** 回显 */
  const optionsReview = (type: string) => {
    getComponentSettingApi().then(({ data, info }) => {
      if (info.status === 200) {
        data.forEach((item) => {
          if (type === 'img') {
            if (item.component === '图片智能处理控件') {
              setImgFlow(item.flow)
              imgFlowRef.current?.drawById(item.flow)
              imgSettingsForm.setFieldValue('img', item.flow)
            } else if (item.component === '手写字智能处理控件') {
              setWriteFlow(item.flow)
              writeFlowRef.current?.drawById(item.flow)
              writeSettingsForm.setFieldValue('write', item.flow)
            }
          } else if (type === 'video') {
            if (item.component === '视频流智能处理控件1') {
              setImgFlow(item.flow)
              setRtsp1(item.rtsp || '')
              imgFlowRef.current?.drawById(item.flow)
              imgSettingsForm.setFieldValue('img', item.flow)
              imgSettingsForm.setFieldValue('rtsp', item.rtsp)
            } else if (item.component === '视频流智能处理控件2') {
              setWriteFlow(item.flow)
              setRtsp2(item.rtsp || '')
              writeFlowRef.current?.drawById(item.flow)
              writeSettingsForm.setFieldValue('write', item.flow)
              writeSettingsForm.setFieldValue('rtsp', item.rtsp)
            }
          }
        })
      } else {
        message.error('获取配置失败')
      }
    })
  }

  useEffect(() => {
    const params = getRouteQuery(location.search)
    if (params.page) {
      initOptions()
      if (params.page === 'img') {
        setSettingOf('img')
      } else {
        setSettingOf('video')
      }
      optionsReview(params.page)
    }
  }, [])

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          color="default"
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
          variant="text"
        >
          返回
        </Button>
        <div className="flex gap-4">
          <Button type="primary" onClick={() => navigate('/demo/flow-list')}>
            流程管理
          </Button>
          <Button type="primary" onClick={saveHandler}>
            保存
          </Button>
        </div>
      </div>
      <Card hoverable={true}>
        <Form form={imgSettingsForm} name="imgSettingsForm" layout="vertical" autoComplete="off">
          <Form.Item
            name="img"
            label={settingOf === 'img' ? '图片智能处理控件' : '视频流智能处理控件1'}
            rules={[{ required: true }]}
          >
            <Select value={imgFlow} onChange={imgFlowChange} options={options} />
          </Form.Item>
          {settingOf === 'video' && (
            <Form.Item name="rtsp" label="rtsp流地址" rules={[{ required: true }]}>
              <Select
                value={rtsp1}
                style={{ width: '100%' }}
                placeholder="给控件输入信息"
                onChange={(e) => setRtsp1(e)}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder="输入下拉内容"
                        ref={rtsp1InputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        添加下拉项
                      </Button>
                    </Space>
                  </>
                )}
                options={items.map((item) => ({ label: item, value: item }))}
              />
            </Form.Item>
          )}
        </Form>
        <DragPage show={true} ref={imgFlowRef} />
      </Card>
      <Card className="mt-8" hoverable={true}>
        <Form form={writeSettingsForm} layout="vertical" autoComplete="off" className="mt-4">
          <Form.Item
            name="write"
            label={settingOf === 'img' ? '手写字智能处理控件' : '视频流智能处理控件2'}
            rules={[{ required: true }]}
          >
            <Select value={writeFlow} onChange={writeFlowChange} options={options} />
          </Form.Item>
          {settingOf === 'video' && (
            <Form.Item name="rtsp" label="rtsp流地址" rules={[{ required: true }]}>
              <Select
                value={rtsp2}
                style={{ width: '100%' }}
                placeholder="给控件输入信息"
                onChange={(e) => setRtsp2(e)}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder="输入下拉内容"
                        ref={rtsp1InputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        添加下拉项
                      </Button>
                    </Space>
                  </>
                )}
                options={items.map((item) => ({ label: item, value: item }))}
              />
            </Form.Item>
          )}
        </Form>
        <DragPage show={true} ref={writeFlowRef} />
      </Card>
    </>
  )
}
export default SettingsPage
