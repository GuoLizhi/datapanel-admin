import React, { useCallback, useState } from 'react'
import './index.scss'
import Breadcrumb from '@/components/Breadcrumb'
import {
  Button, Col, Row
  // Form, Input, message
} from 'antd'
import EditEmailModal from './components/EditEmail'
import EditNickname from './components/EditNickname'
import EditPhoneModal from './components/EditPhone'
import EditPwdModal from './components/EditPassword'
import { useSelector } from 'react-redux'
// import useUserInfo from '@/hooks/useUserInfo.js'
// import { useRequest } from 'ahooks'
// import { updatePushDeerKeyService } from '@/service/user'

const UserInfo = () => {
  const [isShowEmailModal, setEmailModal] = useState(false)
  const [isShowPhoneModal, setPhoneModal] = useState(false)
  const [isShowNicknameModal, setNicknameModal] = useState(false)
  const [isShowPwdModal, setPwdModal] = useState(false)
  const { userInfo } = useSelector(state => state.global)
  // const [form] = Form.useForm()
  // const { getUserInfo } = useUserInfo()

  // const { loading: updatePushDeerKeyLoading, run: updatePushDeerKeyRun } = useRequest(updatePushDeerKeyService, {
  //   manual: true,
  //   onSuccess: resp => {
  //     if (resp?.data?.success) {
  //       message.success(userInfo?.pushDeerKey ? 'pushdeer key更新成功' : 'pushdeer key添加成功')
  //       getUserInfo()
  //       form.resetFields()
  //     } else {
  //       message.error(userInfo?.pushDeerKey ? 'pushdeer key更新失败' : 'pushdeer key添加失败')
  //     }
  //   }
  // })

  const onEditEmail = useCallback(() => {
    setEmailModal(true)
  }, [])

  // const onEditPhone = useCallback(() => {
  //   setPhoneModal(true)
  // }, [])

  const onEditNickname = useCallback(() => {
    setNicknameModal(true)
  }, [])

  const onEditPwd = useCallback(() => {
    setPwdModal(true)
  }, [])

  // const submitPushDeerKey = (values) => {
  //   updatePushDeerKeyRun({
  //     ...values
  //   })
  // }

  return (
    <div className="user-info-page">
      <Breadcrumb />
      <p className="title">用户信息</p>
      <Row>
        <Col span={12}>
          <span className="label">邮箱:</span>
          <span className="detail">{userInfo.email}<Button type="link" size="small" onClick={onEditEmail}>编辑</Button></span>
        </Col>
        <Col span={12}>
          {/* <span className="label">电话号码:</span>
          {
            userInfo.countryCode && userInfo.phone
              ? <span className="detail">
                ({userInfo.countryCode}){userInfo.phone}
                <Button type="link" size="small" onClick={onEditPhone}>编辑</Button>
              </span>
              : <span className="detail">
                <Button onClick={onEditPhone} type="link">添加</Button>
              </span>
          } */}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <span className="label">用户昵称:</span>
          <span className="detail">{userInfo.nickname}<Button type="link" size="small" onClick={onEditNickname}>编辑</Button></span>
        </Col>
        <Col span={12}>
          <span className="label">密码:</span>
          <span className="detail">********<Button type="link" size="small" onClick={onEditPwd}>编辑</Button></span>
        </Col>
      </Row>
      <EditEmailModal visible={isShowEmailModal} toggle={setEmailModal} userInfo={userInfo} />
      <EditNickname visible={isShowNicknameModal} toggle={setNicknameModal} />
      <EditPhoneModal visible={isShowPhoneModal} toggle={setPhoneModal} userInfo={userInfo} />
      <EditPwdModal visible={isShowPwdModal} toggle={setPwdModal} userInfo={userInfo} />
      {/* <Form className="pushdeer-key-form" onFinish={submitPushDeerKey} form={form}>
        <Form.Item
          label="pushdeer key"
          name="pushDeerKey"
          rules={[
            { required: true, message: 'pushdeer key不能为空' }
          ]}
        >
          <Input placeholder="请输入pushdeer key" allowClear />
        </Form.Item>
        <Button
          className='pushdeer-key-btn'
          type="primary"
          htmlType="submit"
          loading={updatePushDeerKeyLoading}
        >
          {userInfo?.pushDeerKey ? '更新pushdeer key' : '添加pushdeer key'}
        </Button>
      </Form> */}
    </div>
  )
}

export default UserInfo
