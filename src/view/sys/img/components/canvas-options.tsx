import { Button } from 'antd'

/** 画布操作栏目 */
const CanvasOptions = (props: { onClear: () => void }) => {
  return (
    <div className="lg:w-[80%] lg:h-full lg:pt-0 sm:pt-[5px] flex items-center justify-center">
      <Button onClick={props.onClear}>
        <span className="lg:text-base sm:text-5xl">清空画布</span>
      </Button>
    </div>
  )
}

export default CanvasOptions
