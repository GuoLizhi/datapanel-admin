import React, { useState } from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import SecondVerify from './components/SecondVerify'
import Copyright from '@/components/Copyright'
import { useRequest } from 'ahooks'
import { verifyUserService } from '@/service/user'
import ResetPasswd from './components/ResetPasswd'

const Login = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [isShowSecondVerify, setSecondVerify] = useState(false)
  const [hasGoogleVerify, setGoogleVerify] = useState(false)
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')
  const [showResetModal, setShowResetModal] = useState(false)

  const {
    loading: verifyUserLoading,
    run: verifyUserRun
  } = useRequest(verifyUserService, {
    manual: true,
    onSuccess: (resp, params) => {
      if (resp?.data?.success) {
        setSecondVerify(true)
        setGoogleVerify(resp?.data?.hasGoogleVerify)
        setEmail(params?.[0]?.email)
        setKey(resp?.data?.key)
      }
    }
  })

  const goRegist = () => {
    navigate('/regist')
  }

  const login = (values) => {
    verifyUserRun({
      email: values.email,
      password: values.password
    })
  }

  const handleReset = () => {
    setShowResetModal(true)
  }
  return (
    <div className="login-page">
      <h2 className="title">{import.meta.env.MODE === 'inner' ? '量化交易管理后台' : '量化交易管理后台'}</h2>
      <p className="sec-title">打造具有影响力的量化交易平台</p>
      <Form
        form={form}
        layout="horizontal"
        className="form"
        onFinish={login}
        labelCol={{ span: 5 }}>
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
        <Form.Item name="password" rules={[
          { required: true, message: '密码不能为空' }
        ]}>
          <Input.Password
            placeholder="请输入密码"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>
        <div className="line-wrapper">
          <Form.Item name="autoLogin" valuePropName="checked">
            <Checkbox>自动登录</Checkbox>
          </Form.Item>
          <Button type="link" className="forget-pwd" onClick={handleReset}>忘记密码？</Button>
        </div>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          loading={verifyUserLoading}
          block>
          登录
        </Button>
        <Button type="link" onClick={goRegist} block className="regist">还没有账号？立即注册</Button>
      </Form>
      <Copyright />
      <SecondVerify
        visible={isShowSecondVerify}
        toggle={setSecondVerify}
        hasGoogleVerify={hasGoogleVerify}
        email={email}
        verifyKey={key}
      />
      <ResetPasswd
        visible={showResetModal}
        toggle={setShowResetModal}
        hasGoogleVerify={hasGoogleVerify}
        email={email}
        verifyKey={key}
      />
    </div>
  )
}

export default Login
