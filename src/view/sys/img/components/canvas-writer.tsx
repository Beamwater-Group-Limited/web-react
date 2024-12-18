import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react'

/** 手写画布 */
const CanvasWriter = forwardRef(
  (
    props: {
      createImg: (file: File) => void
    },
    ref: Ref<any>
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null) // 获取 canvas 元素的引用
    const [isDrawing, setIsDrawing] = useState(false) // 记录当前是否正在绘制
    const [brushColor] = useState('black') // 画笔颜色
    const [brushSize] = useState(2) // 画笔大小

    const getCanvasImg = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dataUrl = canvas.toDataURL('image/png')
      // 将 Base64 数据转换为 Blob 对象
      const byteString = atob(dataUrl.split(',')[1]) // 去掉 data:image/png;base64, 部分
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uintArray = new Uint8Array(arrayBuffer)
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i)
      }

      // 创建 Blob 对象
      const blob = new Blob([uintArray], { type: 'image/png' })

      // 将 Blob 转换为 File 对象
      const file = new File([blob], 'canvas_image.png', { type: 'image/png' })
      return file
    }

    /** 清空画布 */
    const clearCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height) // 清除画布
      ctx.fillStyle = 'white' // 设置填充颜色为白色
      ctx.fillRect(0, 0, canvas.width, canvas.height) // 填充整个画布
    }

    useImperativeHandle(ref, () => ({
      getCanvasImg,
      clearCanvas
    }))

    // 初始化画布设置
    const initializeCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      // 设置背景为白色
      ctx.lineCap = 'round' // 设置线条的端点为圆形
      ctx.lineJoin = 'round' // 设置连接点为圆形
      ctx.strokeStyle = brushColor // 设置画笔颜色
      ctx.lineWidth = brushSize // 设置画笔大小
      ctx.clearRect(0, 0, canvas.width, canvas.height) // 清除画布
      ctx.fillStyle = 'white' // 设置填充颜色为白色
      ctx.fillRect(0, 0, canvas.width, canvas.height) // 填充整个画布
    }

    // 获取鼠标相对于 canvas 的位置
    const getCanvasPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return { x: 0, y: 0 }
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.x
      const y = e.clientY - rect.y
      return { x, y }
    }

    // 开始绘制
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getCanvasPosition(e)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.beginPath() // 开始路径
      ctx.moveTo(x, y) // 设置绘制起始点
      setIsDrawing(true) // 开始绘制
    }

    // 绘制路径
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const dom = document.getElementById('canvas') as HTMLCanvasElement
      if (!isDrawing || !dom) return
      const { x, y } = getCanvasPosition(e)
      const ctx = dom.getContext('2d')
      if (!ctx) return
      ctx.lineTo(x, y) // 绘制到当前位置
      ctx.stroke() // 执行绘制
    }

    // 停止绘制
    const stopDrawing = () => {
      setIsDrawing(false) // 停止绘制
      let img = getCanvasImg()
      if (!img) return
      props.createImg(img)
    }

    useEffect(() => {
      initializeCanvas()
    }, [])

    return (
      <canvas
        id="canvas"
        ref={canvasRef}
        className="w-full h-full border-neutral-800 border z-10 rounded"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    )
  }
)

export default CanvasWriter
