import { Button, Form, Input, message, Modal, Radio } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import useCountDown from '@/hooks/useCountDown'
import { countDownInit, roleAdmin, roleWatchMan } from '@/common/constant'
import './index.scss'
import { TabletOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { loginService, sendVerifyCodeService } from '@/service/user'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateLoginStatus, updateRole, updateWatchManRole } from '@/store/global'

const SecondVerify = ({ visible, toggle, hasGoogleVerify, email, verifyKey }) => {
  const { remain, startCountDown, setRemain, timerRef } = useCountDown()
  const [hasSendVerifyCode, setSendVerifyCode] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [validateType, setValidateType] = useState('email')
  const dispatch = useDispatch()

  const {
    loading: sendVerifyCodeLoading,
    run: sendVerifyCodeRun
  } = useRequest(sendVerifyCodeService, {
    manual: true,
    onBefore: () => {
      setRemain(countDownInit)
    },
    onSuccess: resp => {
      if (resp?.data) {
        setSendVerifyCode(true)
        startCountDown(countDownInit)
        message.success('验证码发送成功')
      }
    }
  })

  const {
    loading: loginLoading,
    run: loginRun
  } = useRequest(loginService, {
    manual: true,
    onSuccess: resp => {
      localStorage.setItem('JWT_TOKEN', resp?.data?.token)
      localStorage.setItem('USER_INFO', JSON.stringify(resp?.data?.userInfo))
      dispatch(updateLoginStatus(true))
      dispatch(updateRole(resp?.data?.userInfo?.role === roleAdmin))
      dispatch(updateWatchManRole(resp?.data?.userInfo?.role === roleWatchMan))
      const redirect = new URLSearchParams(search).get('redirect') ?? ''
      if (redirect) {
        location.href = decodeURIComponent(redirect)
      } else {
        navigate('/assets/files-list')
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

  const onSendVerifyCode = useCallback(() => {
    sendVerifyCodeRun({
      email,
      type: 'login'
    })
  }, [email, sendVerifyCodeRun])

  const onClose = useCallback(() => {
    toggle(false)
    setRemain(countDownInit)
    clearTimeout(timerRef.current)
  }, [toggle, setRemain, timerRef])

  const onSubmit = (values) => {
    loginRun({
      email,
      emailCode: values.emailCode,
      googleCode: values.googleCode,
      key: verifyKey,
      validateType
    })
  }

  const handleValidateTypeChange = (e) => {
    setValidateType(e.target.value)
  }

  return (
    <Modal
      title="安全验证"
      className="verify-modal"
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      open={visible}
    >
      <Form
        className="form"
        labelCol={{ span: 6 }}
        form={form}
        initialValues={{ validateType: 'email' }}
        onFinish={onSubmit}
      >
        {hasGoogleVerify && <Form.Item label="验证码类型" name="validateType" rules={[
          { required: true, message: '验证码类型不能为空' }
        ]}
        >
          <Radio.Group onChange={handleValidateTypeChange} value={validateType}>
            <Radio.Button value="email">邮箱验证码</Radio.Button>
            <Radio.Button value="google">谷歌验证码</Radio.Button>
          </Radio.Group>
        </Form.Item>}
        {validateType === 'email' && <Form.Item label="邮箱验证码" required>
          <Form.Item noStyle name="emailCode" rules={[
            { required: true, message: '邮箱验证码不能为空' }
          ]}
          >
            <Input.Search placeholder="请输入邮箱验证码"
              size="large"
              allowClear
              prefix={<TabletOutlined />}
              enterButton={
                <Button
                  loading={sendVerifyCodeLoading}
                  disabled={remain > 0 && remain < countDownInit}
                  onClick={onSendVerifyCode}
                >
                  {sendBtnText}
                </Button>
              }
            />
          </Form.Item>
        </Form.Item>}
        {
          hasGoogleVerify && validateType === 'google' && <Form.Item label="Google验证码" name="googleCode" rules={[
            { required: true, message: 'Google验证码不能为空' }
          ]}
          >
            <Input placeholder="请输入Google验证码" />
          </Form.Item>
        }
        <div className="footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loginLoading}
          >
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

SecondVerify.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func,
  hasGoogleVerify: PropTypes.bool,
  email: PropTypes.string,
  verifyKey: PropTypes.string
}

export default SecondVerify
