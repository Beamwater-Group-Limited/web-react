import { Graph } from '@antv/x6'
import { useEffect, useRef, useState } from 'react'
import { CurrentNodeType, OptionsBox, SaveDialogComp } from './components'
import { getOrderedNodes, graphInit, createStencil, nodeReview } from './utils'
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
    const containerDom = document.getElementById('graph-container') as HTMLElement | undefined
    graph.current = graphInit(containerDom)
    const stencil = createStencil(graph.current)
    const stencilDom = document.getElementById('stencil') as HTMLElement | undefined
    if (stencilDom && stencilDom.children.length > 0) {
      stencilDom.innerHTML = ''
    }
    graph.current.on('node:mousedown', ({ node }) => {
      let n = node as any
      if (n.shape === 'custom-rect') {
        setCurrentNode({
          nodeId: n.id,
          params: n.getData()?.params || [],
          functionName: n.getData()?.functionName || ''
        })
      } else {
        setCurrentNode({
          nodeId: '',
          params: [],
          functionName: ''
        })
      }
    })
    stencilDom?.appendChild(stencil.container)
  }

  useEffect(() => {
    if (id) {
      setId('')
    }
    let query = getRouteQuery(location.search)
    getAllFunctionApi().then(({ data }) => {
      let list: { label: string; value: string }[] = []
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
    //回显
    if (query && query.id) {
      setId(query.id)
      getFlowByIdApi(query.id).then(({ data }) => {
        let funcions = data.data.all_function
        nodeReview(graph.current, funcions)
      })
    }
  }, [location])

  const changeHandler = (e: string) => {
    if (!graph.current) return
    const node = graph.current.getCellById(currentNode.nodeId)
    if (node) {
      node.setData({
        functionName: e
      })
      let funcItem = allFunctions.find((item: any) => item.function_name === e)
      ;(node as any).label = e
      if (funcItem) {
        setCurrentNode((pre) => {
          return {
            ...pre,
            params: funcItem.parameters,
            functionName: e
          }
        })
        node.setData({
          params: funcItem.parameters
        })
      }
    }
  }

  const paramsChange = (e: string, key: string) => {
    if (!graph.current) return
    const node = graph.current.getCellById(currentNode.nodeId)
    if (!node) return
    let params = (node.getData()?.params || []) as FuncParamsType[]
    let newParams = params.map((item) => {
      if (item.key === key) {
        item.default_value = e
      }
      return item
    })
    node.setData({
      params: newParams
    })
    setCurrentNode((pre) => {
      return {
        ...pre,
        params: newParams
      }
    })
  }

  const saveHandler = () => {
    if (!graph.current) return
    const nodes = getOrderedNodes(graph.current) as any
    const funcs = nodes.filter((item: any) => item !== undefined && item.functionName !== '')
    const a = funcs.map((item: any) => {
      return {
        ...allFunctions.find((i: any) => i.function_name === item.functionName),
        parameters:
          item.params === ''
            ? ''
            : {
                parameters: '',
                template: item.params
              }
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
              changeHandler={changeHandler}
              paramsChange={paramsChange}
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
