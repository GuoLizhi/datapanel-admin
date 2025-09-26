export function parseUserInfo () {
  try {
    const u = JSON.parse(localStorage.getItem('USER_INFO')) ?? {}
    return u
  } catch (err) {
    return {}
  }
}
