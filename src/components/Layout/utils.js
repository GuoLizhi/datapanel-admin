export function getPath (menus, stra) {
  let path = ''
  let strategies = []
  menus?.forEach((item) => {
    if (item?.strategy && item?.strategy?.includes(stra)) {
      path = item?.key
      strategies = item?.strategy
    } else if (item?.children && item?.children?.length > 0) {
      path = getPath(item?.children, stra)?.path ? getPath(item?.children, stra)?.path : path
      strategies = getPath(item?.children, stra)?.strategies?.length > 0 ? getPath(item?.children, stra)?.strategies : strategies
    }
  })
  return {
    path,
    strategies
  }
}

export function getUrl (stra, keywords, menus) {
  let { path, strategies } = getPath(menus, stra)
  if (path?.length > 0) {
    return `${path}?pageNo=1&keywords=${keywords}&pageSize=10&getListType=INIT&strategies=${strategies?.join('_')}`
  } else {
    path = `/other-strategy/other?pageNo=1&keywords=${keywords}&pageSize=10&getListType=INIT`
  }
  return path
}

export function judgeUrl (menus, url, role) {
  let flag = false
  for (let i = 0; i < menus?.length; i++) {
    if (url === menus[i]?.key && menus[i]?.role?.includes(role)) {
      flag = true
      break
    } else if (menus[i]?.children?.length) {
      if (judgeUrl(menus[i]?.children, url, role)) {
        flag = true
        break
      }
    }
  }
  return flag
}

export function getChg (condition, data) {
  let chg = 0
  if (condition === '5min' && data?.price5 && data?.price) {
    chg = (data?.price - data?.price5) / data?.price5
  } else if (condition === '10min' && data?.price10 && data?.price) {
    chg = (data?.price - data?.price10) / data?.price10
  } else if (condition === '30min' && data?.price30 && data?.price) {
    chg = (data?.price - data?.price30) / data?.price30
  } else if (condition === '1h' && data?.priceH1 && data?.price) {
    chg = (data?.price - data?.priceH1) / data?.priceH1
  }
  return chg
}
