import { FuncItemType } from '../drag'

export type FlowItemType = {
  id: string
  data: {
    all_function: FuncItemType[]
    flow_name: string
  }
}
