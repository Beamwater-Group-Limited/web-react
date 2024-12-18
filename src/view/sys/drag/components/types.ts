import { FuncParamsType } from '@/api'

/** 当前选中节点 */
export type CurrentNodeType = {
  nodeId: string
  params: FuncParamsType[]
  functionName: string
}
