import * as api from './api'
import { postJSON } from './axios'

export function chatgptService (params = {}) {
  return postJSON(api.chatGPT, params)
}
