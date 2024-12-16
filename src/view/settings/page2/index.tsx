import { useState } from 'react'
import { TodoHeader, TodoShow } from './components'
import { Card } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
function TodoList() {
  // 输入框值
  const [searchValue, setSearchValue] = useState('')
  // 待办列表
  const [todoList, setTodoList] = useState<{ id: number; content: string; status: boolean }[]>([])
  //展示用的列表
  const [showTodoList, setShowTodoList] = useState<
    { id: number; content: string; status: boolean }[]
  >([])

  /** 输入框改变时 */
  const searchValueChangeHandler = (value: string) => {
    setSearchValue(value)
    setShowTodoList(
      todoList.filter((todoItem) => {
        return todoItem.content.includes(value)
      })
    )
  }

  /** 添加待办事项 */
  const addTodoHandler = () => {
    const newTodoList = [
      ...todoList,
      {
        id: Math.random(),
        content: searchValue,
        status: false
      }
    ]
    setTodoList(newTodoList)
    setShowTodoList(newTodoList)
    setSearchValue('')
  }
  /** 复选框 */
  const todoItemStatusChangeHandler = (e: CheckboxChangeEvent, id: number) => {
    setTodoList(
      todoList.map((todoItem) => {
        if (todoItem.id === id) {
          return {
            ...todoItem,
            status: e.target.checked
          }
        } else {
          return todoItem
        }
      })
    )
  }

  /** 删除todo */
  const delTodoItemHandler = (id: number) => {
    setTodoList(todoList.filter((todo) => todo.id !== id))
    setShowTodoList(showTodoList.filter((todo) => todo.id !== id))
  }

  return (
    <>
      <Card
        className="w-[40rem] mx-auto mt-[5rem]"
        hoverable
        title={
          <TodoHeader
            searchValue={searchValue}
            searchValueChangeHandler={searchValueChangeHandler}
            addTodoHandler={addTodoHandler}
          />
        }
      >
        {/* 待办列表 */}
        <div className="h-[30rem] overflow-y-auto pr-5">
          <TodoShow
            showTodoList={showTodoList}
            todoItemStatusChangeHandler={todoItemStatusChangeHandler}
            delTodoItemHandler={delTodoItemHandler}
          />
        </div>
      </Card>
    </>
  )
}

export default TodoList
