import { getAllUsersService } from '@/service/user'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'

export function useUsers () {
  const [users, setUsers] = useState([])
  useRequest(getAllUsersService, {
    onSuccess: resp => {
      setUsers(resp?.data ?? [])
    }
  })
  const userOpts = useMemo(() => {
    return users.map(user => {
      return {
        label: user.nickname,
        value: user.id
      }
    })
  }, [users])
  return {
    userOpts
  }
}
