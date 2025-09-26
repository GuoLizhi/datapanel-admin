import { createSlice } from '@reduxjs/toolkit'
import { initState } from '@/store/global/state.js'

const globalSlice = createSlice({
  name: 'global',
  initialState: initState,
  reducers: {
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    updateLoginStatus: (state, action) => {
      state.isLogined = action.payload
    },
    updateRole: (state, action) => {
      state.isAdmin = action.payload
    },
    updateWatchManRole: (state, action) => {
      state.isWatchMan = action.payload
    },
    updateDarkMode: (state, action) => {
      state.isDarkMode = action.payload
    },
    updateConsolePageVisible: (state, action) => {
      state.isPageVisible = action.payload
    },
    updateConsoleMenus: (state, action) => {
      state.menus = action.payload
    },
    updateMenuData: (state, action) => {
      state.menuData = action.payload
    }
  }
})

export default globalSlice.reducer

export const {
  updateUserInfo,
  updateNoticeUnreadCnt,
  updateForceNoticeInfo,
  updateLoginStatus,
  updateRole,
  updateWatchManRole,
  updateDarkMode,
  updateSelectedRobotId,
  updateSelectedStrategyName,
  updateShowRobotDetail,
  updateShowAccountDetail,
  updateSelectedAccountId,
  updateSelectedRobotNickname,
  updateNewAlertHasRead,
  updateAlertUnreadCnt,
  updateCollectedRobot,
  updateCollectedRobotIds,
  updateStraVersionList,
  updateSelectedRobotIp,
  updateTaskMsgStrategies,
  updateConsolePageVisible,
  updateConsoleMenus,
  updateSelectedRobotSubStatus,
  updateForceRestartStrategies,
  updateSelectedRobotRecordTsMs,
  updateMenuData
} = globalSlice.actions
