import { Graph } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { registerCustomNode } from './registerCustomNode'

/** 生成带层级的结构 */
const createStencilWithLayer = (graph: Graph) => {
  const startNode = graph.createNode({
    shape: 'custom-circle',
    label: '开始'
  })
  const endNode = graph.createNode({
    shape: 'custom-circle',
    label: '结束'
  })

  const custom = graph.createNode({
    shape: 'custom-rect',
    label: '过程'
  })

  let base = {
    name: 'group1',
    nodes: [startNode, endNode, custom]
  }

  // const layerList = functionList.map((item) => {
  //   return {
  //     name: item.name,
  //     nodes: item.value.map((n: any) => {
  //       return graph.createNode({
  //         shape: 'custom-rect',
  //         attrs: {
  //           body: {
  //             rx: 6,
  //             ry: 6
  //           },
  //           info: n
  //         },
  //         label: n.function_name
  //       })
  //     })
  //   }
  // })

  // return [base, ...layerList]
  return [base]
}

/** 初始化侧边栏 */
export const createStencil = (graph: Graph) => {
  const stencil = new Stencil({
    title: '流程图',
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 190,
    collapsable: true,
    groups: [
      {
        title: '基础流程图',
        name: 'group1'
      }
    ],
    layoutOptions: {
      columns: 2,
      rowHeight: 55
    }
  })
  registerCustomNode() //注册
  const customNodes = createStencilWithLayer(graph)
  customNodes.forEach((item, index) => {
    setTimeout(() => {
      //动态设置高度
      const graps = document.getElementsByClassName('x6-graph')
      let dom = graps[index] as HTMLElement
      let nodeNum = item.nodes.length
      let rows = Math.ceil(nodeNum / 2)
      dom.style.height = `${rows * 55 + 20 * rows - 1}px`
    }, 0)
    stencil.load(item.nodes, item.name)
  })
  return stencil
}
