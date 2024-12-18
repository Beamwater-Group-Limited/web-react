import { Graph } from '@antv/x6'
import { useEffect, useRef, useState } from 'react'
import { default as SaveDialogComp } from './components/save-dialog'
import { getOrderedNodes, graphInit, createStencil, nodeReview } from './utils'
import './index.css'
import { Button, Input, Select } from 'antd'
import { useLocation } from 'react-router-dom'
import { getRouteQuery } from '@/utils'
import { FuncItemType, FuncParamsType, getAllFunctionApi, getFlowByIdApi } from '@/api'
/** 拖拽生成页面 */
const DragPage = () => {
  const [allFunctions, setAllFunctions] = useState<FuncItemType[]>([])
  const [visible, setVisible] = useState(false)
  const [funcList, setFunctList] = useState<any[]>([])
  const [currentNode, setCurrentNode] = useState<{
    nodeId: string
    params: FuncParamsType[]
    functionName: string
  }>({
    nodeId: '',
    params: [],
    functionName: ''
  })
  const [id, setId] = useState('')
  const location = useLocation()
  const graph = useRef<Graph | null>(null)

  const [funcOptions, setFunctOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([])

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
    // if (node) {
    //   node.setData({
    //     params: e
    //   })
    //   setCurrentNode((pre) => {
    //     return {
    //       ...pre,
    //       params: []
    //     }
    //   })
    // }
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
            <div className="w-full">
              <div className="flex flex-col gap-4">
                <span>回调</span>
                <Select
                  className="w-full"
                  showSearch
                  disabled={id !== ''}
                  value={currentNode.functionName}
                  onChange={(e) => changeHandler(e)}
                  options={funcOptions}
                />
              </div>
              {currentNode.params.map((item: FuncParamsType) => {
                return (
                  <div className="flex flex-col gap-4 mt-12" key={item.key}>
                    <span>{item.key}</span>
                    <Input
                      disabled={item.is_update === '0'}
                      value={item.default_value}
                      onChange={(e) => paramsChange(e.target.value, item.key)}
                    />
                  </div>
                )
              })}
            </div>
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
