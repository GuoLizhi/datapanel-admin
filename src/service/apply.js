import * as api from './api'
import { postJSON } from './axios'

export function getApplyListService (params = {}) {
  return postJSON(api.getApplyList, params)
}
