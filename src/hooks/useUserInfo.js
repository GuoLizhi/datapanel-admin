import { useDispatch } from 'react-redux'
import { useRequest } from 'ahooks'
import { getUserInfoService } from '@/service/user.js'
import { updateLoginStatus, updateUserInfo } from '@/store/global/index.js'
import { parseUserInfo } from '@/common/userInfo'
import { Modal } from 'antd'

function useUserInfo () {
  const dispatch = useDispatch()
  const { loading, run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess: resp => {
      const userInfo = resp?.data ?? {}
      const preUserInfo = parseUserInfo()
      // 如果角色发生变化
      if (
        typeof preUserInfo.role === 'number' &&
        typeof userInfo.role === 'number' &&
        preUserInfo.id === userInfo.id &&
        preUserInfo.role !== userInfo.role
      ) {
        localStorage.removeItem('USER_INFO')
        localStorage.removeItem('JWT_TOKEN')
        Modal.warning({
          title: '请注意',
          content: '用户权限发生变化，请重新登陆',
          okText: '确认',
          onOk: () => {
            localStorage.removeItem('JWT_TOKEN')
            localStorage.removeItem('USER_INFO')
            dispatch(updateLoginStatus(false))
            const currLocation = encodeURIComponent(location.href)
            location.href = `${location.origin}/login?redirect=${currLocation}`
          }
        })
        return
      }
      // 如果用户被禁用
      if (userInfo.role === 9) {
        localStorage.removeItem('USER_INFO')
        localStorage.removeItem('JWT_TOKEN')
        Modal.warning({
          title: '请注意',
          content: '当前用户已被禁用，请联系管理员',
          okText: '确认',
          onOk: () => {
            dispatch(updateLoginStatus(false))
            location.href = `${location.origin}/login`
          }
        })
        return
      }
      localStorage.setItem('USER_INFO', JSON.stringify(userInfo))
      dispatch(updateUserInfo(userInfo))
    }
  })
  return {
    getUserInfoLoading: loading,
    getUserInfo: run
  }
}

export default useUserInfo
