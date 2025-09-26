export const Y = 'Y'
export const N = 'N'

export const regExp = {
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  pwd: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
}

export const countDownInit = 60

export const pageSize = 10

export const roleAdmin = 0

export const roleSuperAdmin = 2

export const roleTrader = 1

export const roleWatchMan = 4

export const operaionPerson = 5

export const colors = [
  'magenta', 'volcano', 'orange', 'gold'
]

export const commonFormRules = [{ required: true, message: '${label}不能为空' }]
