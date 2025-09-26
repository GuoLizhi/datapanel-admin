import { get, post, postJSON, postFile } from './axios'
import * as api from './api'

export function registService (params = {}) {
  return post(api.regist, params)
}

export function sendVerifyCodeService (params = {}) {
  return post(api.sendVerifyCode, params)
}

export function sendResetVerifyCodeService (params = {}) {
  return post(api.sendResetVerifyCode, params)
}

export function verifyUserService (params = {}) {
  return post(api.verifyUser, params)
}

export function loginService (params = {}) {
  return post(api.login, params)
}

export function resetLoginService (params = {}) {
  return post(api.resetPwd, params)
}

export function getUserInfoService (params = {}) {
  return get(api.getUserInfo, params)
}

export function updateNicknameService (params = {}) {
  return post(api.updateNickname, params)
}

export function updateEmailService (params = {}) {
  return post(api.updateEmail, params)
}

export function updatePhoneService (params = {}) {
  return post(api.updatePhone, params)
}

export function updatePwdService (params = {}) {
  return post(api.updatePwd, params)
}

export function getGoogleAuthStatusService (params = {}) {
  return get(api.getGoogleAuthStatus, params)
}

export function bindGooleAuthService (params = {}) {
  return post(api.bindGooleAuth, params)
}

export function unbindGooleAuthService (params = {}) {
  return post(api.unbindGoogleAuth, params)
}

export function sendAuthedVerifyCodeService (params = {}) {
  return post(api.sendAuthedVerifyCode, params)
}

export function getAllUsersService (params = {}) {
  return postJSON(api.getAllUsers, params)
}

export function updateUserRoleService (params = {}) {
  return postJSON(api.updateUserRole, params)
}

export function getUserByIdService (params = {}) {
  return postJSON(api.getUserById, params)
}

export function getAllWhiteListService (params = {}) {
  return postJSON(api.getAllWhiteList, params)
}

export function addWhiteListUserService (params = {}) {
  return postJSON(api.addWhiteListUser, params)
}

export function delWhiteListUserService (params = {}) {
  return postJSON(api.delWhiteListUser, params)
}

export function getUserKybStatusService (params = {}) {
  return postJSON(api.getUserKybStatus, params)
}

export function uploadKybFileService (params = {}) {
  return postFile(api.uploadKybFile, params)
}

export function submitKybInfoService (params = {}) {
  return postJSON(api.submitKybInfo, params)
}
