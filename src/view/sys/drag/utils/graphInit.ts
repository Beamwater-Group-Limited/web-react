import { Graph, Shape } from '@antv/x6'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { createStencil } from './createStencil'
/** 初始化 */
export const graphInit = (id: string = 'graph-container', stencilId: string = 'stencil') => {
  const containerDom = document.getElementById(id) as HTMLElement | undefined
  const graphContainer: Graph = new Graph({
    container: containerDom,
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'boundary', // 设置连接点在边框上
      allowBlank: false,
      snap: {
        radius: 20
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          },
          zIndex: 0
        })
      },
      validateConnection({ targetCell }) {
        if (!graphContainer || !targetCell) return false
        const edges = graphContainer.getEdges() // 获取所有边
        const targetNodes = edges.map((item) => item.getTargetCell())
        return !targetNodes.includes(targetCell)
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF'
          }
        }
      }
    },
    background: {
      color: '#F2F7FA'
    }
  })
  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  graphContainer.on('node:mouseenter', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  graphContainer.on('node:mouseleave', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, false)
  })
  graphContainer.use(new Keyboard()).use(
    new Selection({
      rubberband: true,
      showNodeSelectionBox: true
    })
  )
  //删除节点
  graphContainer.bindKey('backspace', () => {
    if (!graphContainer) return
    const cells = graphContainer.getSelectedCells()
    if (cells.length) {
      graphContainer.removeCells(cells)
    }
  })

  //创建侧边栏
  const stencil = createStencil(graphContainer)
  const stencilDom = document.getElementById(stencilId) as HTMLElement | undefined
  if (stencilDom && stencilDom.children.length > 0) {
    stencilDom.innerHTML = ''
  }
  stencilDom?.appendChild(stencil.container)
  return graphContainer
}
