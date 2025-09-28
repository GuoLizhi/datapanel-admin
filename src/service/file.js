import * as api from './api'
import { postJSON } from './axios'

export function getFileListService (params = {}) {
  return postJSON(api.getFileList, params)
}

export function downloadHistoryListService (params = {}) {
  return postJSON(api.downloadHistoryList, params)
}
