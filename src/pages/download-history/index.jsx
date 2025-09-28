import React, { useEffect, useState } from 'react'
import {
  useNavigate
} from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { downloadHistoryListService } from '@/service/file'
import { useRequest } from 'ahooks'
import {
  Button, Table, Form,
  Input, Tag, Tooltip
} from 'antd'

import './index.scss'

dayjs.extend(utc)

const DownloadHistory = () => {
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
      title: '交易所',
      dataIndex: 'Exchange',
      align: 'center',
      key: 'Exchange'
    },
    {
      title: 'ApiKey',
      dataIndex: 'ApiKey',
      align: 'center',
      key: 'ApiKey',
      render: (val) => {
        return (
          <Tooltip title={val}>
            <span>{val?.slice(0, 8)}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '币种',
      dataIndex: 'Symbols',
      align: 'center',
      key: 'Symbols',
      render: (val) => {
        return val?.split(',')?.map((item, index) => (
          <Tag key={index} className='tag-item'>{item}</Tag>
        ))
      }
    },
    {
      title: '文件类型',
      dataIndex: 'DataType',
      align: 'center',
      key: 'DataType'
    },
    {
      title: '文件大小(MB)',
      dataIndex: 'TotalSize',
      align: 'center',
      key: 'TotalSize',
      render: (val) => {
        return `${(val / (1024 * 1024))?.toFixed(2)}MB`
      }
    },
    {
      title: '下载时间范围-起始时间',
      dataIndex: 'StartDate',
      align: 'center',
      key: 'StartDate'
    },
    {
      title: '下载时间范围-结束时间',
      dataIndex: 'EndDate',
      align: 'center',
      key: 'EndDate'
    }
  ]

  const {
    run: getApplyListRun,
    loading: getApplyListLoading
  } = useRequest(downloadHistoryListService, {
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

export default DownloadHistory
