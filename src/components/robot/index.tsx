import { useNavigate } from 'react-router-dom'
import RobotStyleObject from './index.module.less'
/** 机器人组件 */
const RobotComp = (props: { className?: string }) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate('/settings')}
      className={`${RobotStyleObject['robot-box']} fixed lg:w-[5vw] sm:w-[20vw] cursor-pointer lg:h-[10vh] sm:h-[15vh] ${props.className}`}
    ></div>
  )
}

export default RobotComp
