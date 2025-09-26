export function parseJSONString (str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return {}
  }
}
