export type FuncParamsType = {
  key: string
  default_value: string
  is_empty: '0' | '1'
  is_update: '0' | '1'
}

export type FuncItemType = {
  function_name: string
  http_url: string
  parameters: FuncParamsType[]
}
