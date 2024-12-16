import { Graph, Node } from '@antv/x6'
import { ItemType } from './getNodes'

export const nodeReview = (graph: Graph | null, nodeList: ItemType[]) => {
  if (!graph) return
  const startX = 500 // 起始X坐标
  const startY = 50 // 起始Y坐标
  const gapY = 100 // 节点之间的水平间距
  // 添加开始节点
  const startNode = graph.addNode({
    id: 'start-node',
    shape: 'custom-circle',
    x: startX,
    y: startY,
    label: '开始'
  })
  // 遍历节点列表并添加节点
  const nodes: Node<Node.Properties>[] = []
  nodeList.forEach((item: any, index) => {
    const node = graph.addNode({
      id: `node-${index}`,
      shape: 'custom-rect', // 使用自定义 rect
      x: startX,
      y: startY + (index + 1) * gapY, // 按顺序排列
      label: item.function_name
    })
    node.setData({
      functionName: item.function_name,
      params: item.parameters === '' ? '' : item.parameters.template
    })
    nodes.push(node)
  })
  // 添加结束节点
  const endNode = graph.addNode({
    id: 'end-node',
    shape: 'custom-circle',
    x: startX,
    y: startY + (nodeList.length + 1) * gapY,
    label: '结束'
  })
  // 连接开始节点与第一个节点
  graph.addEdge({
    source: startNode,
    target: nodes[0], // 第一个节点
    attrs: {
      line: {
        stroke: '#5F95FF',
        strokeWidth: 2
      }
    }
  })
  // 遍历节点之间添加连接
  nodes.forEach((node, index) => {
    if (index < nodes.length - 1) {
      graph.addEdge({
        source: node,
        target: nodes[index + 1],
        attrs: {
          line: {
            stroke: '#5F95FF',
            strokeWidth: 2
          }
        }
      })
    }
  })
  // 连接最后一个节点与结束节点
  graph.addEdge({
    source: nodes[nodes.length - 1], // 最后一个节点
    target: endNode,
    attrs: {
      line: {
        stroke: '#5F95FF',
        strokeWidth: 2
      }
    }
  })
}
