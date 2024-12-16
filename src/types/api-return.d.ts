/* eslint-disable */
/** 接口的响应数据都应该遵守该规则 */
declare interface ApiResponseType<T> {
  data: T
  info: {
    name: string
    status: number
    size: number
  }
}
