import { Form, Button, Modal, Select, message } from 'antd'
import React, { useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { pairsDurationOption } from '../../constant'
import { addMarketPairService, updateMarketPairService } from '@/service/notification'
import { useRequest } from 'ahooks'

const commonFormRules = [{ required: true, message: '${label}不能为空' }]

const PairsShowSetting = ({
  visible,
  toggle,
  pairsConfig = { pairs: ['BTCUSDT', 'ETHUSDT'], conditions: '1h' },
  getSelectedPairsListRun,
  marketPairInfo
}) => {
  const [form] = Form.useForm()

  // 添加
  const {
    run: addMarketPairRun,
    loading: addMarketPairLoading
  } = useRequest(addMarketPairService, {
    manual: true,
    onSuccess: (resp) => {
      message.success('添加成功')
      getSelectedPairsListRun()
      onClose()
    }
  })

  // 更新
  const {
    run: updateMarketPairRun,
    loading: updateMarketPairLoading
  } = useRequest(updateMarketPairService, {
    manual: true,
    onSuccess: (resp) => {
      message.success('更新成功')
      getSelectedPairsListRun()
      onClose()
    }
  })

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        pairs: pairsConfig?.pairs || undefined,
        conditions: pairsConfig?.conditions || '1h'
      })
    }
  }, [visible, form, pairsConfig])

  const onClose = () => {
    toggle(false)
    form.resetFields()
  }

  const onFinish = (values) => {
    if (pairsConfig?.ID) {
      updateMarketPairRun({
        ID: pairsConfig?.ID,
        ...values
      })
      return
    }
    addMarketPairRun({
      ...values
    })
  }

  return (
    <Modal
      title={pairsConfig?.ID ? '更新币种涨跌幅播报' : '添加币种涨跌幅播报'}
      open={visible}
      className="pairs-setting-modal"
      footer={null}
      onCancel={onClose}
      maskClosable={false}
    >
      <Form
        labelCol={{ span: 4 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="pairs"
          className="form-item"
          label='交易对'
          rules={[
            ...commonFormRules,
            ({ getFieldValue }) => ({
              validator (_, value) {
                if (value?.length > 6) {
                  return Promise.reject(new Error('暂时只允许添加6个自选币种'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <Select
            options={marketPairInfo?.marketPairs?.map((item) => ({ label: item, value: item }))}
            placeholder="请选择交易对"
            allowClear
            filterOption={(input, option) => option.label.includes(input)}
            showSearch
            mode="multiple"
            defaultValue={pairsConfig?.pairs}
            // maxTagCount={6}
            // maxTagCount={'responsive'}
            // max={6}
          />
        </Form.Item>
        <Form.Item name="conditions" className="form-item" label='时间区间' rules={[...commonFormRules]}>
          <Select
            options={pairsDurationOption}
            placeholder="请选择时间"
            allowClear
            filterOption={(input, option) => option.label.includes(input)}
            showSearch
          />
        </Form.Item>
        <div className="footer">
          <Button onClick={onClose} className='add-remark-cancel-btn'>取消</Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={addMarketPairLoading || updateMarketPairLoading}
          >
            确认
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

PairsShowSetting.propTypes = {
  visible: PropTypes.bool,
  toggle: PropTypes.func,
  pairsConfig: PropTypes.object,
  getSelectedPairsListRun: PropTypes.func,
  marketPairInfo: PropTypes.object
}

export default memo(PairsShowSetting)
