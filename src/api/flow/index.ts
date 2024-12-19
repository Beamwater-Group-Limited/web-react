import { FlowItemType } from './types'
export * from './types'

/** 获取所有流程 */
export const getAllFlowApi = async (): Promise<ApiResponseType<FlowItemType[]>> => {
  return fetch('http://119.45.31.65:28481/v1/get_all_flow', {
    method: 'POST'
  }).then((res) => res.json())
}

/** 测试运行借口 */
export const runTestApi = async (data: FlowItemType) => {
  return fetch('http://119.45.31.65:28481/v1/test_run_flow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}
