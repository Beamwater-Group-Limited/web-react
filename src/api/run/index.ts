import { FlowItemType } from '../flow'
import { HandleApiType } from './types'
export * from './types'
export const runApi = async (
  data: {
    image_data: string
  } & FlowItemType
): Promise<
  ApiResponseType<{
    value: string
    image_input: string
  }>
> => {
  return fetch(`${window.ipconfig.ip + window.ipconfig.pyserver}/v1/run_flow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}

/** 处理借口 */
export const imgHandleApi = async (data: HandleApiType): Promise<ApiResponseType<any>> => {
  return fetch(`${window.ipconfig.ip + window.ipconfig.pyserver}/v1/image_processing_flow_run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}
