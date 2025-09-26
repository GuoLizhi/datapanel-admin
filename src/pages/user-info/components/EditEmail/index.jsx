import { Button, Form, Input, message, Modal } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { countDownInit, regExp } from '@/common/constant'
import { useRequest } from 'ahooks'
import { sendAuthedVerifyCodeService, updateEmailService } from '@/service/user.js'
import useCountDown from '@/hooks/useCountDown'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateLoginStatus } from '@/store/global'

const EditEmailModal = ({ visible, toggle, userInfo }) => {
  const {
    remain: originRemain,
    startCountDown: startOriginCountDown,
    setRemain: setOriginRemain,
    timerRef: originTimerRef
  } = useCountDown()
  const {
    remain: newRemain,
    startCountDown: startNewCountDown,
    setRemain: setNewRemain,
    timerRef: newTimerRef
  } = useCountDown()
  const [hasSendOriginVerifyCode, setSendOriginVerifyCode] = useState(false)
  const [hasSendNewVerifyCode, setSendNewVerifyCode] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 发送旧邮箱验证码
  const {
    loading: sendOriginVerifyCodeLoading,
    run: sendOriginVerifyCodeRun
  } = useRequest(sendAuthedVerifyCodeService, {
    manual: true,
    onBefore: () => {
      setOriginRemain(countDownInit)
    },
    onSuccess: resp => {
      if (resp?.data?.success) {
        setSendOriginVerifyCode(true)
        startOriginCountDown(countDownInit)
        message.success('发送成功')
      }
    }
  })

  // 发送新邮箱验证码
  const {
    loading: sendNewVerifyCodeLoading,
    run: sendNewVerifyCodeRun
  } = useRequest(sendAuthedVerifyCodeService, {
    manual: true,
    onBefore: () => {
      setNewRemain(countDownInit)
    },
    onSuccess: resp => {
      if (resp?.data?.success) {
        setSendNewVerifyCode(true)
        startNewCountDown(countDownInit)
        message.success('发送成功')
      }
    }
  })

  // 更新邮箱
  const {
    run: updateEmailRun,
    loading: updateEmailLoading
  } = useRequest(updateEmailService, {
    manual: true,
    onSuccess: resp => {
      if (resp?.data?.success) {
        Modal.success({
          title: '温馨提示',
          content: '修改成功，您需要使用新邮箱重新登录',
          onOk: () => {
            onClose()
            localStorage.removeItem('JWT_TOKEN')
            localStorage.removeItem('USER_INFO')
            dispatch(updateLoginStatus(false))
            navigate('/login')
          }
        })
      }
    }
  })

  const sendBtnText = useMemo(() => {
    if (sendOriginVerifyCodeLoading) {
      return '发送中'
    }
    if (!hasSendOriginVerifyCode) {
      return originRemain === countDownInit
        ? '发送验证码'
        : `已发送(${originRemain})`
    } else {
      return originRemain === 0
        ? '重新发送'
        : `已发送(${originRemain})`
    }
  }, [sendOriginVerifyCodeLoading, hasSendOriginVerifyCode, originRemain])

  const sendBtnTextNew = useMemo(() => {
    if (sendNewVerifyCodeLoading) {
      return '发送中'
    }
    if (!hasSendNewVerifyCode) {
      return newRemain === countDownInit
        ? '发送验证码'
        : `已发送(${newRemain})`
    } else {
      return newRemain === 0
        ? '重新发送'
        : `已发送(${newRemain})`
    }
  }, [sendNewVerifyCodeLoading, hasSendNewVerifyCode, newRemain])

  const onClose = useCallback(() => {
    toggle(false)
    clearTimeout(originTimerRef.current)
    clearTimeout(newTimerRef.current)
    if (form) {
      form.resetFields()
    }
  }, [toggle, form, originTimerRef, newTimerRef])

  const onSubmit = (values) => {
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim()
      }
    }
    updateEmailRun({
      newEmailCode: values.newEmailCode,
      originEmailCode: values.originEmailCode,
      newEmail: values.newEmail
    })
  }

  const onSendOriginCode = () => {
    sendOriginVerifyCodeRun({
      email: userInfo.email,
      type: 'update_email_origin'
    })
  }

  const onSendNewVerifyCode = () => {
    const newEmail = form.getFieldValue('newEmail')
    if (!newEmail) {
      message.error('请输入新邮箱')
      return
    }
    if (!regExp.email.test(newEmail)) {
      message.error('新邮箱格式不正确')
      return
    }
    if (newEmail === userInfo.email) {
      message.error('新旧邮箱一致，无需修改')
      return
    }
    sendNewVerifyCodeRun({
      email: form.getFieldValue('newEmail'),
      type: 'update_email_new'
    })
  }

  return (
    <Modal
      title="修改邮箱"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="edit-email-modal"
      maskClosable={false}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item label="原邮箱验证码" name="originEmailCode" rules={[
          { required: true, message: '原邮箱验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确' }
        ]}
        >
          <Input.Search
            placeholder="请输入原邮箱验证码"
            enterButton={<Button
              onClick={onSendOriginCode}
              loading={sendOriginVerifyCodeLoading}
            >
              {sendBtnText}
            </Button>}
          />
        </Form.Item>
        <Form.Item label="新邮箱地址" name="newEmail" rules={[
          { required: true, message: '新邮箱地址不能为空' },
          { pattern: regExp.email, message: '新邮箱地址格式不正确' }
        ]}
        >
          <Input placeholder="请输入新邮箱地址" />
        </Form.Item>
        <Form.Item label="新邮箱验证码" name="newEmailCode" rules={[
          { required: true, message: '新邮箱验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确' }
        ]}
        >
          <Input.Search
            placeholder="请输入新邮箱验证码"
            enterButton={
              <Button
                loading={sendNewVerifyCodeLoading}
                onClick={onSendNewVerifyCode}
              >
                {sendBtnTextNew}
              </Button>
            }
          />
        </Form.Item>
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            loading={updateEmailLoading}
            htmlType="submit"
          >
            确认
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

EditEmailModal.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func,
  userInfo: PropTypes.object
}

export default EditEmailModal
