import { Button } from 'antd'

/** 画布操作栏目 */
const CanvasOptions = (props: { onClear: () => void }) => {
  return (
    <div className="w-[80%] h-full flex items-center justify-center">
      <Button onClick={props.onClear}>清空画布</Button>
    </div>
  )
}

export default CanvasOptions
