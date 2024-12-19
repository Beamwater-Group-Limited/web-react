import { ComponentFlowType } from './types'
export * from './types'
/** 组件保存接口 */
export const componentSettingSaveApi = async (
  data: ComponentFlowType
): Promise<ApiResponseType<any>> => {
  return fetch('http://192.168.0.100:8080/v1/component_to_flow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  }).then((res) => res.json())
}
