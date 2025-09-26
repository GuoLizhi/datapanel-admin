import React from 'react'
import { Resizable } from 'react-resizable'
import PropTypes from 'prop-types'
import './index.scss'

const ResizableTitle = (props) => {
  const { onResize, width, column, ...restProps } = props

  if (!width || ['equity'].includes(column.key)) {
    return <th {...restProps} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation()
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  )
}

ResizableTitle.propTypes = {
  onResize: PropTypes.func,
  width: PropTypes.number,
  column: PropTypes.object
}

export default ResizableTitle
