import { message } from 'antd'

export const fullscreen = function () {
  const elem = document.body
  if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.requestFullScreen) {
    elem.requestFullscreen()
  } else {
    message.warning('浏览器不支持全屏')
  }
}
