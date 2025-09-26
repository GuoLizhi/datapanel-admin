import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import './index.scss'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { uploadKybFileService } from '@/service/user'

const ChatGPT = () => {
  const onCustomRequest = (options) => {
    uploadKybFileService({
      file: options.file
    }).then(res => {
      options.onSuccess(null, options.file)
    })
  }

  return (
    <div className="chatgpt-page">
      <Breadcrumb />
      <Upload customRequest={onCustomRequest} multiple>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </div>
  )
}

export default ChatGPT
