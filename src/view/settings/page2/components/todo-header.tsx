import { Input, Button } from 'antd'
const TodoHeader = (props: {
  searchValue: string
  searchValueChangeHandler: (value: string) => void
  addTodoHandler: () => void
}) => {
  const { searchValue, searchValueChangeHandler, addTodoHandler } = props
  return (
    <div className="flex justify-between items-center">
      {/* 输入框 */}
      <Input
        value={searchValue}
        placeholder="输入待办事项"
        onChange={(e) => {
          searchValueChangeHandler(e.target.value)
        }}
      />
      <Button type="primary" onClick={addTodoHandler} style={{ marginLeft: '20px' }}>
        添加
      </Button>
    </div>
  )
}
export default TodoHeader
