import React from 'react'
import { Modal, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import FailedTasks from '@/components/FailedTasks'

export function handleSuccess ({ resp, successMsg, failedMsg, callback }) {
  const failedTasks = [];
  (resp?.data || []).forEach(item => {
    if (!item.isSuccess) {
      failedTasks.push(item)
    }
  })
  if (failedTasks?.length === 0) {
    message.success(successMsg)
    typeof callback === 'function' && callback()
  } else {
    Modal.confirm({
      width: 560,
      className: 'robot-run-error',
      title: failedMsg,
      icon: <ExclamationCircleFilled />,
      okCancel: false,
      content: <FailedTasks failedTasks={failedTasks} />,
      onOk: () => {
        typeof callback === 'function' && callback()
      }
    })
  }
}
