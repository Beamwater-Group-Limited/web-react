import { useNavigate } from 'react-router-dom'
import RobotStyleObject from './index.module.less'
/** 机器人组件 */
const RobotComp = (props: { className?: string }) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate('/demo/settings')}
      className={`fixed lg:w-[6vw] base:w-[8vw] sm:w-[20vw] cursor-pointer lg:h-[15vh] base:h-[15vh] sm:h-[15vh] flex flex-col items-center justify-center ${props.className}`}
    >
      <div className={`${RobotStyleObject['robot-box']} w-full h-full`}></div>
      <span className="text-[#006aff98]">智能机器人</span>
    </div>
  )
}

export default RobotComp
