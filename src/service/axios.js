import { message } from 'antd'
import axios from 'axios'

// axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://35.72.73.146' : ''
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'https://datapanel.dev' : ''

// 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('JWT_TOKEN') || ''}`
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use((response) => {
  const isBlob = response.headers['content-type']?.indexOf('application/octet-stream') > -1 ||
    response.headers['content-type']?.indexOf('application/zip') > -1
  if (response.status === 200 && isBlob) {
    return Promise.resolve(response)
  }
  if (response.status === 200 && response.data?.code === 200) {
    return Promise.resolve(response)
  } else {
    message.error(response?.data?.msg ?? '系统错误，请稍后再试')
    return Promise.reject(response)
  }
}, error => {
  const status = error.response.status
  if (status === 401) {
    localStorage.removeItem('JWT_TOKEN')
    localStorage.removeItem('USER_INFO')
    const currLocation = encodeURIComponent(location.href)
    location.href = `${location.origin}/login?redirect=${currLocation}`
    return Promise.reject(error)
  }
  message.error('系统错误，请稍后再试')
  return Promise.reject(error)
})

export function get (url, params = {}) {
  const api = url?.replace('/api/v1', '')
  const newUrl = `${url}?api=${api}`
  return new Promise((resolve, reject) => {
    axios
      .get(newUrl, {
        params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function post (url, params = {}) {
  const api = url?.replace('/api/v1', '')
  const newUrl = `${url}?api=${api}`
  return new Promise((resolve, reject) => {
    axios
      .post(newUrl, new URLSearchParams(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function postJSON (url, params = {}) {
  const api = url?.replace('/api/v1', '')
  const newUrl = `${url}?api=${api}`
  return new Promise((resolve, reject) => {
    axios
      .post(newUrl, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function postJSONTimeout (url, params = {}) {
  const api = url?.replace('/api/v1', '')
  const newUrl = `${url}?api=${api}`
  return new Promise((resolve, reject) => {
    axios
      .post(newUrl, params, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 1 * 1000
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function download (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'blob',
        timeout: 5 * 60 * 1000
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function postFile (url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function postFileBlb (url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data,
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function getDownload (url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        // responseType: 'arraybuffer',
        responseType: 'blob'
        // timeout: 5 * 60 * 1000
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default axios
