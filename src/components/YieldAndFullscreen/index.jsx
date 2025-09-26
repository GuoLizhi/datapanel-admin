import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FullscreenOutlined, ExpandAltOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Breadcrumb from '@/components/Breadcrumb'
import { fullscreen } from '@/common/fullScreen'
import { Button, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { DUTY_OPERATOR } from '@/common/constant'
import { useSelector } from 'react-redux'
import { useCountUp } from 'react-countup'
import './index.scss'

function getCountUpConfig (ref, endValue) {
  return {
    start: 0,
    duration: 1,
    separator: ',',
    decimals: 2,
    decimal: '.',
    ref,
    end: endValue
  }
}

const YieldAndFullscreen = ({
  showYield = true,
  robotNum,
  totalYield,
  totalInitBalance,
  totalCurrBalance,
  dutyStaffYield,
  dutyStaffProfitPct,
  userInfo
}) => {
  const [isExpand, setExpand] = useState(false)
  const { isCocoConsole } = useSelector(state => state.global)
  const navigate = useNavigate()
  const initBalanceCountupRef = useRef(null)
  const yieldCountupRef = useRef(null)
  const currBalanceCountupRef = useRef(null)
  const dutyYieldCountupRef = useRef(null)
  const { update: yieldUpdate } = useCountUp(getCountUpConfig(yieldCountupRef, totalYield))
  const { update: initBalanceUpdate } = useCountUp(getCountUpConfig(initBalanceCountupRef, totalInitBalance))
  const { update: currBalanceUpdate } = useCountUp(getCountUpConfig(currBalanceCountupRef, totalCurrBalance))
  const { update: dutyYieldUpdate } = useCountUp(getCountUpConfig(dutyYieldCountupRef, dutyStaffYield))

  useEffect(() => {
    initBalanceUpdate(totalInitBalance)
  }, [totalInitBalance, initBalanceUpdate])

  useEffect(() => {
    yieldUpdate(totalYield)
  }, [totalYield, yieldUpdate])

  useEffect(() => {
    currBalanceUpdate(totalCurrBalance)
  }, [totalCurrBalance, currBalanceUpdate])

  useEffect(() => {
    dutyYieldUpdate(dutyStaffYield)
  }, [dutyStaffYield, dutyYieldUpdate])

  const handleJump = () => {
    navigate('/support-strategy/monitor-repoter')
  }

  return (
    <>
      <Breadcrumb>
        {location.pathname?.includes('/support-strategy/accmo-robots') && <Button type="link" className="expand-btn-monitor" onClick={handleJump}>监控报告</Button>}
        <Button icon={<FullscreenOutlined />} type="link" className="setting-btn" onClick={fullscreen}>全屏</Button>
        {showYield && (
        <Button
          icon={<ExpandAltOutlined />}
          type="link"
          className="expand-btn"
          onClick={() => setExpand(!isExpand)}
        >
          {isExpand ? '隐藏数据' : '显示数据'}
        </Button>
        )}
      </Breadcrumb>
      {showYield && userInfo?.role !== DUTY_OPERATOR && (
        <div className="robot-info-wrapper" style={{ display: isExpand ? 'flex' : 'none' }}>
          <div className="info-item">
            <p className="title">机器人总数</p>
            <p className="detail">{robotNum}</p>
          </div>
          <div className="info-item">
            <p className="title">利润</p>
            <p ref={yieldCountupRef} className={`detail ${totalYield > 0 && 'green'} ${totalYield < 0 && 'red'}`}>
              {/* {totalYield?.toFixed(2)} */}
            </p>
          </div>
          <div className="info-item">
            <p className="title">初始数据</p>
            <p className="detail" ref={initBalanceCountupRef}>
              {/* {totalInitBalance?.toFixed(2)} */}
            </p>
          </div>
          <div className="info-item">
            <p className="title">现有数据</p>
            <p className="detail" ref={currBalanceCountupRef}>
              {/* {totalCurrBalance?.toFixed(2)} */}
            </p>
          </div>
          <div className="info-item">
            <p className="title">增长率</p>
            <p className={`detail ${totalYield > 0 && 'green'} ${totalYield < 0 && 'red'}`}>
              {totalInitBalance !== 0 ? `${((totalYield / totalInitBalance) * 100)?.toFixed(2)}%` : '_'}
            </p>
          </div>
        </div>
      )}
      {showYield && userInfo?.role === DUTY_OPERATOR && (
        <div className="robot-info-wrapper" style={{ display: isExpand ? 'flex' : 'none' }}>
          <div className="info-item">
            <p className="title">机器人总数</p>
            <p className="detail">{robotNum}</p>
          </div>
          <div className="info-item">
            <p className="title">
              利润
              <Tooltip title={`当前利润为列表所有机器人的利润之和，当前个人利润为${totalYield?.toFixed(2)}`}>
                <QuestionCircleOutlined className='full-screen-tips-icon' />
              </Tooltip>
            </p>
            <p ref={dutyYieldCountupRef} className={`detail ${dutyStaffYield > 0 && 'green'} ${dutyStaffYield < 0 && 'red'}`}>
              {/* {dutyStaffYield?.toFixed(2)} */}
            </p>
          </div>
          <div className="info-item">
            <p className="title">初始数据</p>
            <p className="detail" ref={initBalanceCountupRef}>
              {/* {totalInitBalance?.toFixed(2)} */}
            </p>
          </div>
          <div className="info-item">
            <p className="title">现有数据</p>
            <p className="detail" ref={currBalanceCountupRef}>
              {/* {totalCurrBalance?.toFixed(2)} */}
            </p>
          </div>
          {!isCocoConsole && <div className="info-item">
            <p className="title">
              增长率
              <Tooltip title={`当前增长率为列表所有机器人的增长率，当前个人增长率为${totalInitBalance !== 0 ? `${((totalYield / totalInitBalance) * 100)?.toFixed(2)}%` : '0.00%'}`}>
                <QuestionCircleOutlined className='full-screen-tips-icon' />
              </Tooltip>
            </p>
            <p className={`detail ${dutyStaffProfitPct > 0 && 'green'} ${dutyStaffProfitPct < 0 && 'red'}`}>
              {`${(dutyStaffProfitPct * 100)?.toFixed(2)}%`}
            </p>
          </div>}
        </div>
      )}
    </>
  )
}

YieldAndFullscreen.propTypes = {
  showYield: PropTypes.bool,
  robotNum: PropTypes.number,
  totalYield: PropTypes.number,
  totalInitBalance: PropTypes.number,
  totalCurrBalance: PropTypes.number,
  dutyStaffYield: PropTypes.number,
  dutyStaffProfitPct: PropTypes.number,
  userInfo: PropTypes.object
}

export default YieldAndFullscreen
