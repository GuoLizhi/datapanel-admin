import { Button, Form, Input, message, Modal } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { useRequest } from 'ahooks'
import { sendAuthedVerifyCodeService, updatePwdService } from '@/service/user'
import useCountDown from '@/hooks/useCountDown'
import { countDownInit } from '@/common/constant'

const EditPwdModal = ({ visible, toggle, userInfo }) => {
  const [form] = Form.useForm()
  const {
    remain,
    startCountDown,
    setRemain,
    timerRef
  } = useCountDown()
  const [hasSendVerifyCode, setSendVerifyCode] = useState(false)

  const {
    loading: sendVerifyCodeLoading,
    run: sendVerifyCodeRun
  } = useRequest(sendAuthedVerifyCodeService, {
    manual: true,
    onBefore: () => {
      setRemain(countDownInit)
    },
    onSuccess: resp => {
      if (resp?.data?.success) {
        setSendVerifyCode(true)
        startCountDown(countDownInit)
        message.success('发送成功')
      }
    }
  })

  const {
    loading: updatePwdLoading,
    run: updatePwdRun
  } = useRequest(updatePwdService, {
    manual: true,
    onSuccess: resp => {
      if (resp?.data?.success) {
        onClose()
        Modal.success({
          title: '温馨提醒',
          content: '修改成功'
        })
      }
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

  const onSendVerifyCode = () => {
    sendVerifyCodeRun({
      email: userInfo.email,
      type: 'update_password'
    })
  }

  const onSubmit = (values) => {
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim()
      }
    }
    updatePwdRun(values)
  }

  const onClose = useCallback(() => {
    toggle(false)
    clearTimeout(timerRef.current)
    if (form) {
      form.resetFields()
    }
  }, [toggle, form, timerRef])

  return (
    <Modal
      title="修改密码"
      open={visible}
      className="edit-pwd-modal"
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item label="旧密码" name="originPwd" rules={[
          { required: true, message: '旧密码不能为空' }
        ]}
        >
          <Input.Password placeholder="请输入旧密码"/>
        </Form.Item>
        <Form.Item label="新密码" name="newPwd" rules={[
          { required: true, message: '新密码不能为空' }
        ]}
        >
          <Input.Password placeholder="请输入新密码"/>
        </Form.Item>
        <Form.Item label="确认新密码" name="confirmedNewPwd" rules={[
          { required: true, message: '确认新密码不能为空' }
        ]}
        >
          <Input.Password placeholder="请再次输入新密码"/>
        </Form.Item>
        <Form.Item label="邮箱验证码" name="emailCode" rules={[
          { required: true, message: '邮箱验证码不能为空' }
        ]}
        >
          <Input.Search
            placeholder="请输入邮箱验证码"
            enterButton={
              <Button
                onClick={onSendVerifyCode}
                loading={sendVerifyCodeLoading}
              >
                {sendBtnText}
              </Button>
            }
          />
        </Form.Item>
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updatePwdLoading}
          >
            确认
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

EditPwdModal.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func,
  userInfo: PropTypes.object
}

export default EditPwdModal
