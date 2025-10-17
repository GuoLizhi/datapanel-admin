export const login = '/api/admin/user/loginVerify'

export const resetPwd = '/api/admin/user/reset/password'

export const regist = '/api/admin/user/register'

export const sendVerifyCode = '/api/admin/user/sendEmail'

export const sendResetVerifyCode = '/api/admin/user/sendEmail'

export const sendAuthedVerifyCode = '/api/admin/user/auth/sendEmail'

// 用户模块
export const updateUserRole = '/api/admin/user/role/update'

export const getAllUsers = '/api/admin/user/getAll'

export const verifyUser = '/api/admin/user/login'

export const getUserInfo = '/api/admin/user/getUserInfo'

export const updatePushDeerKey = '/api/admin/user/updatePushDeerKey'

export const updateNickname = '/api/admin/user/updateNickname'

export const updateEmail = '/api/admin/user/updateEmail'

export const updatePhone = '/api/admin/user/updatePhone'

export const updatePwd = '/api/admin/user/updatePassword'

export const getGoogleAuthStatus = '/api/admin/user/getGoogleAuthStatus'

export const bindGooleAuth = '/api/admin/user/bindGoogleAuth'

export const unbindGoogleAuth = '/api/admin/user/unbindGoogleAuth'

export const getUserById = '/api/admin/user/getUserById'

export const getAllWhiteList = '/api/admin/user/whitelist/all'

export const addWhiteListUser = '/api/admin/user/whitelist/add'

export const delWhiteListUser = '/api/admin/user/whitelist/remove'

export const getUserKybStatus = '/api/admin/kyb/status'

export const uploadKybFile = '/api/admin/kyb/upload'

export const submitKybInfo = '/api/admin/kyb/add'

// 通知模块
// export const getMenuConfig = '/api/admin/menu/list'

// 管理员模块
export const chatGPT = '/api/admin/chatgpt'

// 文件模块
export const getFileList = '/api/admin/file/list'
export const downloadHistoryList = '/api/admin/file/download/history'

// 申请模块
export const getApplyList = '/api/admin/apply/list'
