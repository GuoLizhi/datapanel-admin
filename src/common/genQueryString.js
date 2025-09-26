export function genQueryString (params = {}) {
  const urlParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      urlParams.set(key, value)
    }
  })
  return urlParams.toString()
}
