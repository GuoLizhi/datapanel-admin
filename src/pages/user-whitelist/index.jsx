import React, { useState } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { Button, Form, Popconfirm, Table, message } from 'antd'
import { useRequest } from 'ahooks'
import { delWhiteListUserService, getAllWhiteListService } from '@/service/user'
import './index.scss'
import AddWhiteListUser from './components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const UserWhitelist = () => {
  const [isShowAddUser, setAddUser] = useState(false)
  const [dataSource, setDataSource] = useState([])

  const {
    run: getListRun,
    loading: getListLoading
  } = useRequest(getAllWhiteListService, {
    onSuccess: resp => {
      setDataSource(resp?.data ?? [])
    }
  })

  const { run: delRun } = useRequest(delWhiteListUserService, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
      getListRun()
    }
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
      width: 20
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      key: 'email'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      key: 'createdAt',
      render: val => {
        return dayjs(val).local().format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      align: 'center',
      key: 'operator',
      render: (val) => {
        return val || '_'
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      render: (_, record) => {
        return (
          <Popconfirm
            onConfirm={() => delRun({ id: record.id })}
            title="请确认"
            description="确认要删除吗？"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        )
      }
    }
  ]

  return (
    <div className="user-whitelist-page">
      <Breadcrumb />
      <Form layout="inline">
        <Form.Item>
          <Button type="primary" onClick={() => setAddUser(true)}>新增</Button>
        </Form.Item>
      </Form>
      <div className="table-panel">
        <Table
          className="whitelist-table"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          size="small"
          rowKey="id"
          loading={getListLoading}
        />
      </div>
      <AddWhiteListUser
        visible={isShowAddUser}
        toggle={setAddUser}
        getList={getListRun}
      />
    </div>
  )
}

export default UserWhitelist
