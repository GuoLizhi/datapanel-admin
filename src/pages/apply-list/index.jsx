import React, { useEffect, useState } from 'react'
import {
  useNavigate
} from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getApplyListService } from '@/service/apply'
import { useRequest } from 'ahooks'
import {
  Button, Table, Form,
  Input
} from 'antd'

import './index.scss'

dayjs.extend(utc)

const ApplyList = () => {
  const [fileLists, setFileLists] = useState([])
  const [total, setTotal] = useState(0)
  const [searchCondition, setSearchCondition] = useState({
    pageSize: 10,
    pageNo: 1
  })
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      align: 'center',
      key: 'ID',
      width: 80,
      fixed: 'left'
    },
    {
      title: 'ApiKey',
      dataIndex: 'ApiKey',
      align: 'center',
      key: 'ApiKey'
    },
    {
      title: '邮箱',
      dataIndex: 'Email',
      align: 'center',
      key: 'Email'
    },
    {
      title: '申请时间',
      dataIndex: 'CreatedAt',
      align: 'center',
      key: 'CreatedAt',
      fixed: 'right',
      render: (val) => {
        return dayjs.utc(val, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss')
      }
    }
  ]

  const {
    run: getApplyListRun,
    loading: getApplyListLoading
  } = useRequest(getApplyListService, {
    manual: true,
    onSuccess: (resp, params) => {
      setTotal(resp?.data?.count ?? 0)
      setFileLists(resp?.data?.list ?? [])
    }
  })

  useEffect(() => {
    getApplyListRun({
      ...searchCondition,
      symbols: searchCondition?.symbols?.split('|') || undefined
    })
  }, [searchCondition, getApplyListRun])

  useEffect(() => {
    const params = new URLSearchParams()
    for (const k in searchCondition) {
      if (searchCondition[k]) {
        params.set(k, searchCondition[k])
      }
    }
    navigate(`${location.pathname}?${params.toString()}`)
  }, [searchCondition, navigate])

  const onListsTableChange = (pagination, _, sortOptions) => {
    const params = {
      ...searchCondition,
      pageNo: pagination.current,
      pageSize: pagination.pageSize
      // order: sortOptions.order,
      // sortField: sortOptions.field
    }
    setSearchCondition(params)
  }

  const onSearch = (values) => {
    setSearchCondition({
      ...searchCondition,
      ...values
    })
  }

  return (
    <div className='apply-list-page'>
      <Breadcrumb />
      <div className='apply-list'>
        <div className='operate-sec'>
          <Form
            layout='inline'
            className='apply-filter-form'
            onFinish={onSearch}
            form={form}
          >
            <Form.Item name='email' className='form-item'>
              <Input
                placeholder='请输入邮箱模糊查询'
                allowClear
                autoComplete='off'
              />
            </Form.Item>
            <Form.Item name='apiKey' className='form-item'>
              <Input
                placeholder='请输入apiKey模糊查询'
                allowClear
                autoComplete='off'
              />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={getApplyListLoading}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          className='apply-list-table'
          columns={columns}
          dataSource={fileLists}
          loading={getApplyListLoading}
          rowKey='ID'
          size='small'
          scroll={{ x: 'max-content' }}
          bordered
          onChange={onListsTableChange}
          pagination={{
            pageSize: searchCondition.pageSize,
            current: searchCondition.pageNo,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (t) => `共${t}条`
          }}
        />
      </div>
    </div>
  )
}

export default ApplyList
