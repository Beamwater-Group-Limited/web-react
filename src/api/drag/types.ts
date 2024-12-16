export type FuncItemType = {
  function_name: string
  http_url: string
  parameters:
    | string
    | {
        parameters: string
        template: string
      }
}
