import { Graph } from '@antv/x6'

/**
 * 验证图形的拓扑结构：
 * 1. 检查是否有开始节点（没有入度的节点，shape 为 custom-circle 且 label 为 "开始"）
 * 2. 检查是否有结束节点（没有出度的节点，shape 为 custom-circle 且 label 为 "结束"）
 * 3. 检查是否有孤立节点（没有入度和出度的节点）
 * 4. 检查是否有未被处理的过程节点（shape 为 custom-rect 且 label 为 "过程"）
 * @param graph - X6 图实例
 * @returns 返回错误信息字符串，如果没有问题则返回空字符串
 */
export const validateGraph = (graph: Graph): string => {
  const nodes = graph.getNodes() // 获取所有节点
  const edges = graph.getEdges() // 获取所有边

  // 用于记录每个节点的入度和出度
  const inDegree: { [key: string]: number } = {}
  const outDegree: { [key: string]: number } = {}

  // 初始化所有节点的入度和出度为0
  nodes.forEach((node) => {
    inDegree[node.id] = 0
    outDegree[node.id] = 0
  })

  // 更新每个节点的入度和出度
  edges.forEach((edge) => {
    const source = edge.getSourceCell()
    const target = edge.getTargetCell()
    if (source && target) {
      const sourceId = source.id
      const targetId = target.id
      outDegree[sourceId] += 1
      inDegree[targetId] += 1
    }
  })

  let startNodeCount = 0
  let endNodeCount = 0
  let isolatedNodeCount = 0
  let processNodeCount = 0

  // 遍历所有节点检查开始节点、结束节点、孤立节点和过程节点
  nodes.forEach((node) => {
    const nodeId = node.id
    const shape = node.shape
    const label = (node as any).label // 获取节点的 label

    // 检查是否是孤立节点
    if (inDegree[nodeId] === 0 && outDegree[nodeId] === 0) {
      isolatedNodeCount += 1
    }

    // 判断开始节点
    if (shape === 'custom-circle' && label === '开始' && inDegree[nodeId] === 0) {
      startNodeCount += 1
    }

    // 判断结束节点
    if (shape === 'custom-circle' && label === '结束' && outDegree[nodeId] === 0) {
      endNodeCount += 1
    }

    // 判断过程节点
    if (shape === 'custom-rect' && label === '过程') {
      processNodeCount += 1
    }
  })

  // 检查是否符合拓扑结构要求
  if (startNodeCount !== 1) {
    return '图中必须有且仅有一个开始节点'
  }

  if (endNodeCount !== 1) {
    return '图中必须有且仅有一个结束节点'
  }

  if (isolatedNodeCount > 0) {
    return `图中存在 ${isolatedNodeCount} 个未连接的孤立节点`
  }

  // 检查是否有过程节点未被处理
  if (processNodeCount > 0) {
    return '有过程未被处理'
  }

  return '' // 如果没有问题，返回空字符串
}
