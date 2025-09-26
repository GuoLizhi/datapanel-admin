import { Button, Form, Input, message, Modal, Spin } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import './index.scss'
import { useRequest } from 'ahooks'
import {
  bindGooleAuthService,
  getGoogleAuthStatusService,
  sendAuthedVerifyCodeService,
  unbindGooleAuthService
} from '@/service/user'
import QRCode from 'qrcode'
import { parseUserInfo } from '@/common/userInfo'
import useCountDown from '@/hooks/useCountDown'
import { countDownInit } from '@/common/constant'

const GoogleAuth = () => {
  const [hasBind, setBind] = useState('')
  const [secret, setSecret] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const {
    remain,
    startCountDown,
    setRemain,
    timerRef
  } = useCountDown()
  const [hasSendVerifyCode, setSendVerifyCode] = useState(false)
  const {
    remain: remainUn,
    startCountDown: startCountDownUn,
    setRemain: setRemainUn,
    timerRef: timerRefUn
  } = useCountDown()
  const [hasSendVerifyCodeUn, setSendVerifyCodeUn] = useState(false)

  const {
    loading: sendVerifyCodeLoadingUn,
    run: sendVerifyCodeRunUn
  } = useRequest(sendAuthedVerifyCodeService, {
    manual: true,
    onBefore: () => {
      setRemainUn(countDownInit)
    },
    onSuccess: resp => {
      if (resp?.data?.success) {
        setSendVerifyCodeUn(true)
        startCountDownUn(countDownInit)
        message.success('发送成功')
      }
    }
  })

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
    loading: getGoogleAuthStatusLoading
  } = useRequest(getGoogleAuthStatusService, {
    onSuccess: async resp => {
      if (resp?.data?.hasBind) {
        setBind(resp?.data?.hasBind ? 'Y' : 'N')
      } else {
        setBind('N')
        setSecret(resp?.data?.secret ?? '')
        const url = await getQrUrl(resp?.data?.secret)
        setQrUrl(url)
      }
    },
    onError: () => {
      setBind('N')
    }
  })

  const {
    loading: bindGooleAuthLoading,
    run: bindGooleAuthRun
  } = useRequest(bindGooleAuthService, {
    manual: true,
    onSuccess: resp => {
      if (resp?.data?.success) {
        Modal.success({
          title: '温馨提醒',
          content: '绑定成功',
          onOk: () => {
            setBind('Y')
          }
        })
      }
    }
  })

  const {
    loading: unbindGooleAuthLoading,
    run: unbindGooleAuthRun
  } = useRequest(unbindGooleAuthService, {
    manual: true,
    onSuccess: resp => {
      if (resp?.data?.success) {
        Modal.success({
          title: '温馨提醒',
          content: '解绑成功',
          onOk: () => {
            setBind('N')
          }
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

  const sendBtnTextUn = useMemo(() => {
    if (sendVerifyCodeLoadingUn) {
      return '发送中'
    }
    if (!hasSendVerifyCodeUn) {
      return remainUn === countDownInit
        ? '发送验证码'
        : `已发送(${remainUn})`
    } else {
      return remainUn === 0
        ? '重新发送'
        : `已发送(${remainUn})`
    }
  }, [sendVerifyCodeLoadingUn, hasSendVerifyCodeUn, remainUn])

  useEffect(() => {
    const current = timerRef.current
    const currentUn = timerRefUn.current
    return () => {
      clearTimeout(current)
      clearTimeout(currentUn)
    }
  }, [timerRef, timerRefUn])

  const getQrUrl = useCallback(async (s) => {
    try {
      const { email } = parseUserInfo()
      const host = location.hostname?.replace('www.', '') ?? ''
      const result = await QRCode.toDataURL(`otpauth://totp/${host}:${email}?secret=${s}&iss`)
      return result
    } catch (err) {
      return ''
    }
  }, [])

  const onSubmit = (values) => {
    const params = Object.assign({}, values, { secret })
    bindGooleAuthRun(params)
  }

  const onUnbind = (values) => {
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim()
      }
    }
    unbindGooleAuthRun(values)
  }

  const onSendVerifyCode = () => {
    const { email } = parseUserInfo()
    sendVerifyCodeRun({
      email,
      type: 'google_auth'
    })
  }

  const onSendVerifyCodeUn = () => {
    const { email } = parseUserInfo()
    sendVerifyCodeRunUn({
      email,
      type: 'unbind_google_auth'
    })
  }

  if (hasBind === 'Y') {
    return (
      <Spin spinning={getGoogleAuthStatusLoading}>
        <div className="google-auth-page">
          <Breadcrumb />
          <p className="title">您已成功绑定谷歌验证器，如需解绑请输入邮箱验证码和谷歌验证码</p>
          <Form className="unbind-form" onFinish={onUnbind}>
            <Form.Item label="谷歌验证码" name="googleCode" rules={[
              { required: true, message: '谷歌验证码不能为空' },
              { pattern: /^\d{6}$/, message: '谷歌验证码格式不正确' }
            ]}
            >
              <Input placeholder="请输入谷歌验证码" allowClear />
            </Form.Item>
            <Form.Item label="邮箱验证码" name="emailCode" rules={[
              { required: true, message: '谷歌验证码不能为空' },
              { pattern: /^\d{6}$/, message: '谷歌验证码格式不正确' }
            ]}
            >
              <Input.Search
                placeholder="请输入邮箱验证码"
                allowClear
                enterButton={
                  <Button
                    onClick={onSendVerifyCodeUn}
                    loading={sendVerifyCodeLoadingUn}
                  >
                    {sendBtnTextUn}
                  </Button>
                }
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={unbindGooleAuthLoading}
            >
              解绑谷歌验证器
            </Button>
          </Form>
        </div>
      </Spin>
    )
  }
  return (
    <Spin spinning={getGoogleAuthStatusLoading}>
      <div className="google-auth-page">
        <Breadcrumb />
        <h3>操作步骤</h3>
        <div className="step-container">
          <div className="step-wrapper">
            <p className="step">1. 首先您需要在您的手机上下载Google Authenticator（身份验证器）</p>
            <p className="step">2. 安装完成后，使用谷歌身份验证器扫描右侧二维码即可完成绑定</p>
            <p className="step">3. 如果无法扫描，请手动添加账户，密钥为<span className="red">{secret}</span></p>
            <Form className="bind-form" onFinish={onSubmit}>
              <Form.Item label="谷歌验证码" name="googleCode" rules={[
                { required: true, message: '谷歌验证码不能为空' },
                { pattern: /^\d{6}$/, message: '谷歌验证码格式不正确' }
              ]}
              >
                <Input placeholder="请输入谷歌验证码" allowClear />
              </Form.Item>
              <Form.Item label="邮箱验证码" name="emailCode" rules={[
                { required: true, message: '${label}不能为空' },
                { pattern: /^\d{6}$/, message: '${label}格式不正确' }
              ]}
              >
                <Input.Search
                  placeholder="请输入邮箱验证码"
                  allowClear
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
              <Button
                type="primary"
                htmlType="submit"
                loading={bindGooleAuthLoading}
              >
                绑定谷歌验证器
              </Button>
            </Form>
          </div>
          <div className="img-wrapper">
            { qrUrl && <img src={qrUrl} alt="" /> }
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default GoogleAuth
