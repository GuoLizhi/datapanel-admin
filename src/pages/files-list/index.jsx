import React, { useEffect, useState } from 'react'
import {
  useNavigate
  // useSearchParams
} from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getFileListService } from '@/service/file'
import { useRequest } from 'ahooks'
import {
  Button, Table, Form,
  Select
} from 'antd'

import './index.scss'

dayjs.extend(utc)

const FileLists = () => {
  const [fileLists, setFileLists] = useState([])
  const [total, setTotal] = useState(0)
  const [searchCondition, setSearchCondition] = useState({
    pageSize: 10,
    pageNo: 1
  })
  const navigate = useNavigate()
  const [form] = Form.useForm()
  // const [searchParams] = useSearchParams()
  // const order = searchParams.get('order')
  // const sortField = searchParams.get('sortField')

  // const handleLinkClick = (val) => {
  //   window.open(val, '_blank')
  // }

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
      title: '币种',
      dataIndex: 'Symbol',
      align: 'center',
      key: 'Symbol'
    },
    {
      title: '文件大小(MB)',
      dataIndex: 'FileSize',
      align: 'center',
      key: 'FileSize',
      render: (val) => {
        return `${(val / (1024 * 1024))?.toFixed(2)}MB`
      }
    },
    {
      title: '文件类型',
      dataIndex: 'DataType',
      align: 'center',
      key: 'DataType'
    },
    {
      title: '文件上次修改时间',
      dataIndex: 'FileModifyTime',
      align: 'center',
      key: 'FileModifyTime'
    },
    {
      title: '文件名',
      dataIndex: 'Filename',
      align: 'center',
      key: 'Filename'
    },
    {
      title: '上传时间',
      dataIndex: 'CreatedAt',
      align: 'center',
      key: 'CreatedAt',
      width: 200,
      // sorter: true,
      // sortOrder: (sortField === 'newsTime' && order) || ''
      render: (val) => {
        return dayjs.utc(val, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '操作',
      dataIndex: 'Operate',
      align: 'center',
      key: 'Operate',
      fixed: 'right',
      render: (_, record) => {
        return <Button type='link'>删除</Button>
      }
    }
  ]

  const {
    run: getFileListRun,
    loading: getFileListLoading
  } = useRequest(getFileListService, {
    manual: true,
    onSuccess: (resp, params) => {
      setTotal(resp?.data?.count ?? 0)
      setFileLists(resp?.data?.list ?? [])
    }
  })

  useEffect(() => {
    getFileListRun({
      ...searchCondition,
      symbols: searchCondition?.symbols?.split('|') || undefined
    })
  }, [searchCondition, getFileListRun])

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
      pageSize: pagination.pageSize,
      order: sortOptions.order,
      sortField: sortOptions.field
    }
    setSearchCondition(params)
  }

  const onSearch = (values) => {
    setSearchCondition({
      ...searchCondition,
      ...values,
      symbols: values.symbols?.join('|')
    })
  }

  return (
    <div className='files-page'>
      <Breadcrumb />
      <div className='files-list'>
        <div className='operate-sec'>
          <Form
            layout='inline'
            className='files-filter-form'
            onFinish={onSearch}
            form={form}
          >
            <Form.Item name='exchange' className='form-item'>
              <Select
                options={[{ label: 'woo_usdt_swap', value: 'woo_usdt_swap' }, { label: 'bitget_usdt_swap', value: 'bitget_usdt_swap' }]}
                placeholder='请选择交易所'
                allowClear
                filterOption={(input, option) => option.label.includes(input)}
                showSearch
              />
            </Form.Item>
            <Form.Item name='symbols' className='form-item'>
              <Select
                options={[
                  { label: 'ygg_usdt', value: 'ygg_usdt' },
                  { label: 'xmr_usdt', value: 'xmr_usdt' }
                ]}
                placeholder='请选择币种'
                allowClear
                filterOption={(input, option) => option.label.includes(input)}
                showSearch
                mode="multiple"
                maxTagCount={'responsive'}
              />
            </Form.Item>
            <Form.Item name='dataType' className='form-item'>
              <Select
                options={[{ label: 'bbo', value: 'bbo' }, { label: 'bbb', value: 'bbb' }]}
                placeholder='请选择文件类型'
                allowClear
                filterOption={(input, option) => option.label.includes(input)}
                showSearch
              />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={getFileListLoading}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          className='files-list-table'
          columns={columns}
          dataSource={fileLists}
          loading={getFileListLoading}
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

export default FileLists
