import { FuncItemType } from './types'
export * from './types'
/** 获取所有函数 */
export const getAllFunctionApi = async (): Promise<
  ApiResponseType<
    {
      name: string
      value: FuncItemType[]
    }[]
  >
> => {
  return fetch('http://192.168.0.100:8080/v1/get_all_function', {
    method: 'GET'
  }).then((res) => res.json())
}

/** 根据id获取flow */
export const getFlowByIdApi = async (id: string) => {
  return fetch('http://192.168.0.100:8080/v1/get_flow_by_id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      flow_id: id
    })
  }).then((res) => res.json())
}

/** 保存流程 */
export const saveFlowApi = async (data: { all_function: any[]; flow_name: string }) => {
  return fetch('http://192.168.0.100:8080/v1/save_flow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}
