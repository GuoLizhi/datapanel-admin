import { Button, Form, Input, message, Modal } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import useCountDown from '@/hooks/useCountDown'
import { countDownInit } from '@/common/constant'
import './index.scss'
import { TabletOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { resetLoginService, sendResetVerifyCodeService } from '@/service/user'

const ResetPasswd = ({ visible, toggle }) => {
  const { remain, startCountDown, setRemain, timerRef } = useCountDown()
  const [hasSendVerifyCode, setSendVerifyCode] = useState(false)
  const [form] = Form.useForm()

  const {
    loading: sendVerifyCodeLoading,
    run: sendVerifyCodeRun
  } = useRequest(sendResetVerifyCodeService, {
    manual: true,
    onBefore: () => {
      setRemain(countDownInit)
    },
    onSuccess: resp => {
      if (resp?.data?.success) {
        setSendVerifyCode(true)
        startCountDown(countDownInit)
        message.success('验证码发送成功')
      }
    }
  })

  const {
    loading: loginLoading,
    run: loginRun
  } = useRequest(resetLoginService, {
    manual: true,
    onSuccess: resp => {
      if (!resp?.data) {
        message.success('密码修改成功')
        onClose()
      } else {
        message.error(resp?.msg)
      }
    },
    onError: (err) => {
      message.error(err)
    }
  })

  const sendBtnText = useMemo(() => {
    if (sendVerifyCodeLoading) {
      return '发送中'
    }
    if (!hasSendVerifyCode) {
      return remain === countDownInit
        ? '发送验证码'
        : `已发送(${remain})`
    } else {
      return remain === 0
        ? '重新发送'
        : `已发送(${remain})`
    }
  }, [sendVerifyCodeLoading, hasSendVerifyCode, remain])

  const onSendVerifyCode = useCallback(() => {
    sendVerifyCodeRun({
      email: form.getFieldValue('email'),
      type: 'reset_password'
    })
  }, [sendVerifyCodeRun, form])

  const onClose = useCallback(() => {
    toggle(false)
    setRemain(countDownInit)
    clearTimeout(timerRef.current)
    form.resetFields()
  }, [toggle, setRemain, timerRef, form])

  const onSubmit = (values) => {
    loginRun(values)
  }

  return (
    <Modal
      title="重置密码"
      className="reset-modal"
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      open={visible}>
      <Form
        className="form"
        layout="horizontal"
        labelCol={{ span: 6 }}
        form={form}
        initialValues={{ validateType: 'email' }}
        onFinish={onSubmit}>
        <Form.Item name="email" rules={[
          { required: true, message: '邮箱不能为空' },
          { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' }
        ]}>
          <Input
            placeholder="请输入邮箱"
            prefix={<MailOutlined />}
            size="large"
          />
        </Form.Item>
        <Form.Item label="" required>
          <Form.Item noStyle name="verifyCode" rules={[
            { required: true, message: '邮箱验证码不能为空' }
          ]}>
            <Input.Search placeholder="请输入邮箱验证码"
              size="large"
              allowClear
              prefix={<TabletOutlined />}
              enterButton={
                <Button
                  loading={sendVerifyCodeLoading}
                  disabled={remain > 0 && remain < countDownInit}
                  onClick={onSendVerifyCode}>
                  {sendBtnText}
                </Button>
              }
            />
          </Form.Item>
        </Form.Item>
        <Form.Item name="password" rules={[
          { required: true, message: '密码不能为空' }
        ]}>
          <Input.Password
            placeholder="请输入新密码"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>
        <Form.Item name="confirmedPassword" rules={[
          { required: true, message: '密码不能为空' },
          ({ getFieldValue }) => ({
            validator (_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('输入两次密码需保持一致'))
            }
          })
        ]}>
          <Input.Password
            placeholder="请再次输入新密码"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loginLoading}>
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

ResetPasswd.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func
}

export default ResetPasswd
