import {
  roleAdmin, roleSuperAdmin
} from '@/common/constant'
import { parseUserInfo } from '@/common/userInfo'
import { parseJSONString } from '@/common/parser'

const userInfo = parseUserInfo()
export const initState = {
  userInfo: {},
  unreadNoticeCnt: 0,
  forceNoticeInfo: {},
  isLogined: Object.keys(userInfo)?.length > 0,
  isAdmin: userInfo?.role === roleAdmin || userInfo?.role === roleSuperAdmin,
  isSuperAdmin: userInfo?.role === roleSuperAdmin,
  isOnlyAdmin: userInfo?.role === roleAdmin,
  isDarkMode: localStorage.getItem('dark_mode') === 'Y',
  menus: [],
  collectedRobotIds: [],
  collectedRobots: [],
  selectedRobotId: '',
  selectedRobotIp: '',
  selectedRobotNickname: '',
  selectedStrategyName: '',
  selectedRobotRecordTsMs: '',
  showRobotDetail: '',
  showAccountDetail: '',
  selectedAccountId: '',
  unreadAlert: 0,
  newAlertHasRead: true,
  isPageVisible: true,
  selectedRobotSubStatus: {},
  menuData: parseJSONString(localStorage.getItem(location.host)) || []
}
