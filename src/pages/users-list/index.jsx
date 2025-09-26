import { getAllUsersService } from '@/service/user'
import { useRequest } from 'ahooks'
import { Spin, Table } from 'antd'
import Breadcrumb from '@/components/Breadcrumb'
import utc from 'dayjs/plugin/utc'
import React, { useEffect, useState } from 'react'
import './index.scss'
import { roleMap } from './config'
import dayjs from 'dayjs'

dayjs.extend(utc)

const UsersList = () => {
  const [users, setUsers] = useState([])

  const { loading, run: getAllUsersRun } = useRequest(getAllUsersService, {
    manual: true,
    onSuccess: resp => {
      setUsers(resp?.data ?? [])
    }
  })

  useEffect(() => {
    getAllUsersRun()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 250
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: val => {
        return roleMap[val]
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      render: val => {
        return dayjs.utc(val, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY-MM-DD HH:mm:ss')
      }
    }
  ]

  return (
    <Spin spinning={loading}>
      <div className="users-list-page">
        <Breadcrumb />
        <div className="table-panel">
          <Table
            className="user-table"
            columns={columns}
            dataSource={users}
            bordered
            pagination={false}
            rowKey="id"
            size="small"
          />
        </div>
      </div>
    </Spin>
  )
}

export default UsersList
