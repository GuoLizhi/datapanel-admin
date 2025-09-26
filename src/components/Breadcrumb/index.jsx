import { Breadcrumb } from 'antd'
import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import pathMap from '@/common/path'
import PropTypes from 'prop-types'
import './index.scss'

const Crumb = ({ children, lastLabel, showOnlychildren = false }) => {
  const location = useLocation()

  const items = useMemo(() => {
    const paths = location.pathname.startsWith('/')
      ? location.pathname.slice(1)
      : location.pathname
    const pathsArr = paths.split('/').map(p => {
      return pathMap[p] || '未知'
    })
    pathsArr.unshift('首页')
    if (lastLabel) {
      pathsArr.pop()
      pathsArr.push(lastLabel)
    }
    return pathsArr
  }, [location, lastLabel])

  return (
    <div className="breadcrumb-wrapper">
      {!showOnlychildren && <Breadcrumb className="breadcrumb">
        {
          items.map(item => {
            return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
          })
        }
      </Breadcrumb>}
      {children}
    </div>
  )
}

Crumb.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  lastLabel: PropTypes.string,
  showOnlychildren: PropTypes.bool
}

export default Crumb
