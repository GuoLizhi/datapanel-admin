import {
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  TabletOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Tooltip } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import Copyright from '@/components/Copyright'
import './index.scss'
import { registService, sendVerifyCodeService } from '@/service/user'
import { countDownInit, regExp } from '@/common/constant'
import useCountDown from '@/hooks/useCountDown'

const Regist = () => {
  const navigate = useNavigate()
  const [hasSendVerifyCode, setSendVerifyCode] = useState(false)
  const { remain, startCountDown, setRemain } = useCountDown()
  const [form] = Form.useForm()

  const {
    loading: registLoading,
    run: registRun
  } = useRequest(registService, {
    manual: true,
    onSuccess: resp => {
      if (resp?.data) {
        Modal.success({
          title: '温馨提醒',
          content: '注册成功',
          onOk: () => {
            navigate('/login')
          }
        })
      }
    }
  })

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

  const onSendVerifyCode = useCallback(() => {
    const email = form.getFieldValue('email')
    if (!regExp.email.test(email)) {
      message.error('邮箱格式不正确')
      return
    }
    sendVerifyCodeRun({
      email: form.getFieldValue('email'),
      type: 'register'
    })
  }, [form, sendVerifyCodeRun])

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

  const goLogin = useCallback(() => {
    navigate('/login')
  }, [navigate])

  const regist = useCallback(async (values) => {
    if (!hasSendVerifyCode) {
      message.error('请先发送邮箱验证码')
      return
    }
    if (values.password !== values.confirmedPassword) {
      message.error('两次输入的密码不一致，请重新输入')
      return
    }
    registRun(values)
  }, [registRun, hasSendVerifyCode])

  return (
    <div className="regist-page">
      <p className="title">账号注册</p>
      <Form
        className="regist-form"
        labelCol={{ span: 6 }}
        form={form}
        onFinish={regist}
      >
        <Form.Item name="nickname" rules={[
          { required: true, message: '用户名不能为空' }
        ]}
        >
          <Input
            placeholder="请输入用户名"
            size="large"
            allowClear
            prefix={<UserOutlined />}
            suffix={
              <Tooltip title="交易员请优先填写自己的姓名">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item name="email" rules={[
          { required: true, message: '邮箱不能为空' },
          { pattern: regExp.email, message: '邮箱格式不正确' }
        ]}
        >
          <Input
            placeholder="请输入邮箱"
            size="large"
            allowClear
            prefix={<MailOutlined />}
          />
        </Form.Item>
        <Form.Item name="verifyCode" rules={[
          { required: true, message: '邮箱验证码不能为空' },
          { pattern: /^\d{6}$/, message: '邮箱验证码格式不正确' }
        ]}
        >
          <Input.Search
            placeholder="请输入邮箱验证码"
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
        <Form.Item name="password" tooltip="123" rules={[
          { required: true, message: '密码不能为空' },
          { pattern: regExp.pwd, message: '密码至少需要包含大小写字母数字，且长度至少8位' }
        ]}
        >
          <Input.Password placeholder="请输入密码" size="large" allowClear prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item name="confirmedPassword" rules={[
          { required: true, message: '密码不能为空' },
          { pattern: regExp.pwd, message: '密码至少需要包含大小写字母数字，且长度至少8位' }
        ]}
        >
          <Input.Password placeholder="请再次输入密码" size="large" allowClear prefix={<LockOutlined />} />
        </Form.Item>
        <Button
          type="primary"
          block
          size="large"
          loading={registLoading}
          htmlType="submit"
          className="regist-btn"
        >
          注册
        </Button>
        <Button type="link" block onClick={goLogin}>已有账号？立即登录</Button>
      </Form>
      <Copyright />
    </div>
  )
}

export default Regist
