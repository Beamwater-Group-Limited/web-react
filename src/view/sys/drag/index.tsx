import { Graph } from '@antv/x6'
import { useEffect, useRef, useState } from 'react'
import { CurrentNodeType, OptionsBox, SaveDialogComp } from './components'
import { getOrderedNodes, graphInit, nodeReview } from './utils'
import './index.css'
import { Button } from 'antd'
import { useLocation } from 'react-router-dom'
import { getRouteQuery } from '@/utils'
import { FuncItemType, FuncParamsType, getAllFunctionApi, getFlowByIdApi } from '@/api'
/** 拖拽生成页面 */
const DragPage = () => {
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

  const [funcOptions, setFunctOptions] = useState<AntdSelectOption[]>([])

  /** 初始化画布 */
  const initGraph = () => {
    graph.current = graphInit()
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
      initGraph()
    })
  }

  /** 页面回显时调用 */
  const reviewHandler = () => {
    if (id) {
      setId('')
    }
    let query = getRouteQuery(location.search)
    //回显
    if (query && query.id) {
      setId(query.id)
      getFlowByIdApi(query.id).then(({ data }) => {
        let funcions = data.data.all_function
        nodeReview(graph.current, funcions)
      })
    }
  }

  useEffect(() => {
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
      {!id && (
        <div className="flex justify-end mb-4">
          <Button onClick={saveHandler} type="primary">
            保存
          </Button>
        </div>
      )}
      <div id="container">
        <div id="stencil"></div>
        <div id="graph-container"></div>
        <div className="w-[20%] h-full p-4">
          {currentNode.nodeId && (
            <OptionsBox
              options={funcOptions}
              currentNode={currentNode}
              onChange={handleNodeChange}
            />
          )}
        </div>
      </div>
      <SaveDialogComp
        funcList={funcList}
        isModalOpen={visible}
        onCancel={() => setVisible(false)}
      />
    </>
  )
}

export default DragPage
