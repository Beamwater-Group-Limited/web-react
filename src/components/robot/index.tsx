import RobotStyleObject from './index.module.less'
/** 机器人组件 */
const RobotComp = (props: { className?: string }) => {
  return (
    <div
      className={`${RobotStyleObject['robot-box']} absolute w-[5vw] cursor-pointer h-[10vh] ${props.className}`}
    ></div>
  )
}

export default RobotComp
