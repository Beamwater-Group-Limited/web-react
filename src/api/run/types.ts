export type HandleApiType = {
  input_type: number[]
  input_data: {
    text: string
    image_data: string
    voice_data: string
    file_data: string
    stream: string
  }
  output_type: number[]
  flow_id: string
}
