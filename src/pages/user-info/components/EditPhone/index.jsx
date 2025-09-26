import { Button, Form, Input, Modal, Select } from 'antd'
import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { PhoneOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { updatePhoneService } from '@/service/user'
import useUserInfo from '@/hooks/useUserInfo.js'

const EditPhoneModal = ({ visible, toggle, userInfo }) => {
  const [form] = Form.useForm()
  const { getUserInfo } = useUserInfo()

  useEffect(() => {
    if (!visible || !userInfo.countryCode || !userInfo.phone) return
    form.setFieldValue('countryCode', userInfo.countryCode)
    form.setFieldValue('phone', userInfo.phone)
  }, [visible, form, userInfo])

  const { run: updatePhoneRun, loading: updatePhoneLoading } = useRequest(updatePhoneService, {
    manual: true,
    onSuccess: resp => {
      if (resp?.data?.success) {
        onClose()
        getUserInfo()
        Modal.success({
          title: '温馨提醒',
          content: '修改成功'
        })
      }
    }
  })

  const onClose = useCallback(() => {
    toggle(false)
    if (form) {
      form.resetFields()
    }
  }, [toggle, form])

  return (
    <Modal
      title="编辑电话号码"
      className="edit-phone-modal"
      open={visible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={updatePhoneRun}>
        <Form.Item label="新电话号码" required>
          <Input.Group compact>
            <Form.Item
              noStyle
              name="countryCode"
              rules={[
                { required: true, message: '国家编码不能为空' }
              ]}
            >
              <Select style={{ width: '120px' }} placeholder="国家编码">
                <Select.Option value="+86">+86</Select.Option>
                <Select.Option value="+88">+88</Select.Option>
                <Select.Option value="+65">+65</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              name="phone"
              rules={[
                { required: true, message: '新电话号码不能为空' }
              ]}
            >
              <Input placeholder="请输入新电话号码" prefix={<PhoneOutlined />} />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" htmlType="submit" loading={updatePhoneLoading}>确认</Button>
        </div>
      </Form>
    </Modal>
  )
}

EditPhoneModal.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func,
  userInfo: PropTypes.object
}

export default EditPhoneModal
