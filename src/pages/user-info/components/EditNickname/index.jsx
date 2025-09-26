import { Button, Form, Input, Modal } from 'antd'
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { useRequest } from 'ahooks'
import { updateNicknameService } from '@/service/user.js'
import useUserInfo from '@/hooks/useUserInfo.js'

const EditNickname = ({ visible, toggle }) => {
  const [form] = Form.useForm()
  const { getUserInfo } = useUserInfo()
  const { loading, run } = useRequest(updateNicknameService, {
    manual: true,
    onSuccess: resp => {
      if (resp?.data?.success) {
        onClose()
        getUserInfo()
      }
    }
  })

  const onClose = useCallback(() => {
    toggle(false)
    if (form) {
      form.resetFields()
    }
  }, [toggle, form])

  const onSubmit = (values) => {
    run({
      nickname: values.nickname?.trim()
    })
  }

  return (
    <Modal
      title="修改昵称"
      className="edit-nickname-modal"
      open={visible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item
          name="nickname"
          label="新昵称"
          rules={[
            { required: true, message: '昵称不能为空' }
          ]}
        >
          <Input placeholder="请输入新的昵称" />
        </Form.Item>
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" htmlType="submit" loading={loading}>确认</Button>
        </div>
      </Form>
    </Modal>
  )
}

EditNickname.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func
}

export default EditNickname
