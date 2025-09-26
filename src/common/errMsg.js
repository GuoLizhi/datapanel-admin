import { message } from 'antd'

export function getErrMsg (err) {
  return err?.message ?? '网络异常，请稍后重试！'
}

export function onError (err) {
  const msg = getErrMsg(err)
  message.error(msg)
}
