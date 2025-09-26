export const login = '/api/v1/user/loginVerify'

export const resetPwd = '/api/v1/user/reset/password'

export const regist = '/api/v1/user/register'

export const sendVerifyCode = '/api/v1/user/sendEmail'

export const sendResetVerifyCode = '/api/v1/user/sendEmail'

export const sendAuthedVerifyCode = '/api/v1/user/auth/sendEmail'

// 用户模块
export const updateUserRole = '/api/v1/user/role/update'

export const getAllUsers = '/api/v1/user/getAll'

export const verifyUser = '/api/v1/user/login'

export const getUserInfo = '/api/v1/user/getUserInfo'

export const updatePushDeerKey = '/api/v1/user/updatePushDeerKey'

export const updateNickname = '/api/v1/user/updateNickname'

export const updateEmail = '/api/v1/user/updateEmail'

export const updatePhone = '/api/v1/user/updatePhone'

export const updatePwd = '/api/v1/user/updatePassword'

export const getGoogleAuthStatus = '/api/v1/user/getGoogleAuthStatus'

export const bindGooleAuth = '/api/v1/user/bindGoogleAuth'

export const unbindGoogleAuth = '/api/v1/user/unbindGoogleAuth'

export const getUserById = '/api/v1/user/getUserById'

export const getAllWhiteList = '/api/v1/user/whitelist/all'

export const addWhiteListUser = '/api/v1/user/whitelist/add'

export const delWhiteListUser = '/api/v1/user/whitelist/remove'

export const getUserKybStatus = '/api/v1/kyb/status'

export const uploadKybFile = '/api/v1/kyb/upload'

export const submitKybInfo = '/api/v1/kyb/add'

// 通知模块
export const getMenuConfig = '/api/v1/menu/list'

// 管理员模块
export const chatGPT = '/api/v1/chatgpt'

// 前端监控上报
export const submitErrorToDingTalk = '/api/v1/notice/dingding'
