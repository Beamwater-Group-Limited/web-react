import { ComponentFlowType } from './types'
export * from './types'
/** 组件保存接口 */
export const componentSettingSaveApi = async (
  data: ComponentFlowType[]
): Promise<ApiResponseType<any>> => {
  return fetch(`${window.ipconfig.ip + window.ipconfig.pyserver}/v1/component_to_flow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  }).then((res) => res.json())
}

export const getComponentSettingApi = async (): Promise<ApiResponseType<ComponentFlowType[]>> => {
  return fetch(`${window.ipconfig.ip + window.ipconfig.pyserver}/v1/get_component_to_flow_list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json())
}
