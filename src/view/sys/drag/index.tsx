import { Graph } from '@antv/x6'
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CurrentNodeType, OptionsBox, SaveDialogComp } from './components'
import { getOrderedNodes, graphInit, nodeReview } from './utils'
import './index.css'
import { Button } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { getRouteQuery } from '@/utils'
import { FuncItemType, FuncParamsType, getAllFunctionApi, getFlowByIdApi } from '@/api'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { getRandomString } from '@lichang666/utils'
/** 拖拽生成页面 */
const DragPage = forwardRef(
  (
    props: {
      show: boolean // 是否是展示模式
    },
    ref: Ref<any>
  ) => {
    const graphId = useRef('')
    const stencilId = useRef('')
    const navigate = useNavigate()
    const [allFunctions, setAllFunctions] = useState<FuncItemType[]>([])
    const [visible, setVisible] = useState(false)
    const [funcList, setFunctList] = useState<any[]>([])
    const [currentNode, setCurrentNode] = useState<CurrentNodeType>({
      nodeId: '',
      params: [],
      functionName: ''
    })
    const [id, setId] = useState('')
    const location = useLocation()
    const graph = useRef<Graph | null>(null)

    useImperativeHandle(ref, () => ({
      drawById
    }))

    const [funcOptions, setFunctOptions] = useState<AntdSelectOption[]>([])

    /** 初始化画布 */
    const initGraph = () => {
      graph.current = graphInit(graphId.current, stencilId.current)
      graph.current.on('node:mousedown', ({ node }) => {
        if (node.shape === 'custom-rect') {
          setCurrentNode({
            nodeId: node.id,
            params: node.getData()?.params || [],
            functionName: node.getData()?.functionName || ''
          })
        } else {
          setCurrentNode({
            nodeId: '',
            params: [],
            functionName: ''
          })
        }
      })
    }

    const drawById = (flowId: string) => {
      if (!graph.current) return
      graph.current.clearCells()
      if (!flowId) return
      setId(flowId)
      getFlowByIdApi(flowId).then(({ data }) => {
        let funcions = data.data.all_function
        nodeReview(graph.current, funcions)
      })
    }

    /** 初始化函数选项 */
    const functionOptionsInit = () => {
      getAllFunctionApi().then(({ data }) => {
        let list: AntdSelectOption[] = []
        let funcs: FuncItemType[] = []
        data.forEach((item) => {
          item.value.forEach((i) => {
            list.push({
              value: i.function_name,
              label: i.function_name
            })
            funcs.push(i)
          })
        })
        setAllFunctions(funcs)
        setFunctOptions(list)
        setTimeout(() => {
          initGraph()
        })
      })
    }

    /** 页面回显时调用 */
    const reviewHandler = () => {
      if (id) {
        setId('')
      }
      let query = getRouteQuery(location.search)
      if (query && query.id) {
        setId(query.id)
        getFlowByIdApi(query.id).then(({ data }) => {
          let funcions = data.data.all_function
          nodeReview(graph.current, funcions)
        })
      }
    }

    useEffect(() => {
      graphId.current = getRandomString(4)
      stencilId.current = getRandomString(4)
      functionOptionsInit()
      reviewHandler()
    }, [location])

    /** 节点改变 */
    const handleNodeChange = (changeType: 'name' | 'param', value: string, key?: string) => {
      if (!graph.current) return
      const node = graph.current.getCellById(currentNode.nodeId) as any
      if (!node) return
      // 处理节点名称变化
      if (changeType === 'name') {
        let funcItem = allFunctions.find((item) => item.function_name === value)
        node.setData({
          functionName: value
        })
        node.label = value
        if (funcItem) {
          setCurrentNode((prev) => ({
            ...prev,
            params: funcItem.parameters,
            functionName: value
          }))
          node.setData({
            params: funcItem.parameters
          })
        }
      }
      // 处理参数值变化
      if (changeType === 'param' && key) {
        let params = (node.getData()?.params || []) as FuncParamsType[]
        let newParams = params.map((item) => {
          if (item.key === key) {
            item.default_value = value
          }
          return item
        })
        node.setData({
          params: newParams
        })
        setCurrentNode((prev) => ({
          ...prev,
          params: newParams
        }))
      }
    }

    /** 保存 */
    const saveHandler = () => {
      if (!graph.current) return
      const nodes = getOrderedNodes(graph.current) as any
      const funcs = nodes.filter((item: any) => item !== undefined && item.functionName !== '')
      const a = funcs.map((item: any) => {
        return {
          ...allFunctions.find((i: any) => i.function_name === item.functionName),
          parameters: item.params
        }
      })
      setFunctList(a)
      setVisible(true)
    }
    return (
      <>
        {!props.show && (
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
            {!id && (
              <Button onClick={saveHandler} type="primary">
                保存
              </Button>
            )}
          </div>
        )}
        <div id="container" className="relative" style={{ height: props.show ? '40vh' : '70vh' }}>
          <div
            id={stencilId.current}
            className="stencil"
            style={{ display: id || props.show ? 'none' : 'block' }}
          ></div>
          <div id={graphId.current} className="graph-container"></div>
          {currentNode.nodeId && (
            <div className="absolute bg-white right-0 top-0 w-[20%] h-full p-4">
              <OptionsBox
                disabled={id !== undefined && id !== ''}
                options={funcOptions}
                currentNode={currentNode}
                onChange={handleNodeChange}
              />
            </div>
          )}
        </div>
        <SaveDialogComp
          funcList={funcList}
          isModalOpen={visible}
          onCancel={() => setVisible(false)}
        />
      </>
    )
  }
)
export default DragPage
