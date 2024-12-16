import { Button, Checkbox } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
const TodoShow = (props: {
  showTodoList: { id: number; content: string; status: boolean }[]
  todoItemStatusChangeHandler: (e: CheckboxChangeEvent, id: number) => void
  delTodoItemHandler: (id: number) => void
}) => {
  const { showTodoList, todoItemStatusChangeHandler, delTodoItemHandler } = props
  return (
    <>
      {showTodoList.map((todoItem) => {
        return (
          <div
            key={todoItem.id}
            className="p-5 border-[1px] mb-4 border-solid border-[#ccc] rounded flex justify-between items-center"
          >
            <Checkbox
              checked={todoItem.status}
              onChange={(e) => {
                todoItemStatusChangeHandler(e, todoItem.id)
              }}
            >
              {todoItem.content}
            </Checkbox>
            <Button
              onClick={() => delTodoItemHandler(todoItem.id)}
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </div>
        )
      })}
    </>
  )
}
export default TodoShow
