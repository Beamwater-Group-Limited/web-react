import { HandleApiType } from './types'
export * from './types'
/** 处理借口 */
export const imgHandleApi = async (
  data: HandleApiType
): Promise<
  ApiResponseType<{
    output_data: {
      image_list: string
      stream: string
      text: string
      voice: string
    }
    output_type: number[]
  }>
> => {
  return fetch(`${window.ipconfig.ip + window.ipconfig.pyserver}/v1/image_processing_flow_run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}
