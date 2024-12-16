import { FlowItemType } from './types'
export * from './types'

/** 获取所有流程 */
export const getAllFlowApi = async (): Promise<ApiResponseType<FlowItemType[]>> => {
  return fetch('http://192.168.0.100:8080/v1/get_all_flow', {
    method: 'POST'
  }).then((res) => res.json())
}
