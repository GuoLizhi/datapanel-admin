import { Button, Form, Input, Modal, message } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { useRequest } from 'ahooks'
import { addWhiteListUserService } from '@/service/user'

const AddWhiteListUser = ({ visible, toggle, getList }) => {
  const onClose = () => {
    toggle(false)
  }

  const {
    run,
    loading
  } = useRequest(addWhiteListUserService, {
    manual: true,
    onSuccess: () => {
      message.success('添加成功')
      onClose()
      getList()
    }
  })

  const onFinish = (values) => {
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim()
      }
    }
    run(values)
  }

  return (
    <Modal
      maskClosable={false}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="add-whitelist-modal"
      title="请添加白名单用户"
    >
      <Form onFinish={onFinish} className="form">
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '邮箱不能为空' }
          ]}
        >
          <Input placeholder="请输入邮箱"/>
        </Form.Item>
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

AddWhiteListUser.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func,
  getList: PropTypes.func
}

export default AddWhiteListUser
