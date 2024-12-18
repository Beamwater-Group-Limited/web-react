import { FuncParamsType } from '@/api'
import { Graph } from '@antv/x6'

export type ItemType = {
  functionName: string
  params: FuncParamsType[]
}

// 在 X6 图形中获取拓扑排序的节点列表
export const getOrderedNodes = (graph: Graph) => {
  const nodes = graph.getNodes() // 获取所有节点
  const edges = graph.getEdges() // 获取所有边

  // 构建邻接表
  const adjacencyList: any = {}
  nodes.forEach((node) => {
    adjacencyList[node.id] = []
  })

  // 将边的关系存入邻接表
  edges.forEach((edge) => {
    let source = edge.getSourceCell()
    let target = edge.getTargetCell()
    if (source && target) {
      const sourceId = source.id
      const targetId = target.id
      const attr = {
        functionName: target.getData()?.functionName || '',
        params: target.getData()?.params || []
      }
      adjacencyList[sourceId].push({ targetId, attr })
    }
  })

  // 拓扑排序的辅助函数
  const visited = new Set()
  const result: ItemType[] = []
  const visiting = new Set()

  const dfs = ({ targetId: nodeId, attr }: { targetId: string; attr: ItemType }) => {
    if (visited.has(nodeId)) return // 如果已经访问过，跳过
    if (visiting.has(nodeId)) {
      throw new Error('Graph has a cycle')
    }

    visiting.add(nodeId)
    adjacencyList[nodeId].forEach((item: { targetId: string; attr: ItemType }) => {
      dfs(item)
    })

    visiting.delete(nodeId)
    visited.add(nodeId)
    result.unshift(attr) // 将节点放到结果的前面
  }

  // 对所有节点进行 DFS
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      dfs({
        targetId: node.id,
        attr: {
          functionName: node.getData()?.functionName || '',
          params: node.getData()?.params || []
        }
      })
    }
  })

  return result
}
