import { FlowItemType } from '../flow'
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
  return fetch('http://192.168.0.100:8080/v1/run_flow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}

export const imgHandleApi = async (data: any) => {
  return fetch('http://192.168.0.100:8080/v1/image_processing_flow_run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}
