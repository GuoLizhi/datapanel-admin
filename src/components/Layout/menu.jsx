import React from 'react'
import { AccountBookOutlined, GoldOutlined, LineChartOutlined, MacCommandOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
// import { parseUserInfo } from '@/common/userInfo'

export const menuConfig = [
  {
    key: 'assets',
    label: '资源列表',
    icon: 'GoldOutlined',
    // role: [],
    children: [
      {
        key: '/assets/files-list',
        label: '文件列表'
      },
      {
        key: '/assets/apply-list',
        label: '申请列表'
      },
      {
        key: '/assets/download-history',
        label: '下载历史'
      }
    ]
  },
  {
    key: 'admin',
    label: '用户管理',
    icon: 'GoldOutlined',
    // role: [],
    children: [
      {
        key: '/admin/users-list',
        label: '用户列表'
      },
      {
        key: '/admin/whitelist',
        label: '白名单'
      }
    ]
  }
]

export function genMenusNew (menus = []) {
  // const { role } = parseUserInfo()
  const result = []
  for (let i = 0; i < menus?.length; i++) {
    if (Array.isArray(menus[i]?.children) && menus[i]?.children?.length > 0) {
      // if (menus[i].role.includes(role)) {
      menus[i].children = genMenusNew(menus[i]?.children)
      result.push({
        label: menus[i]?.label,
        key: menus[i]?.key,
        role: menus[i]?.role,
        icon: getIconComponent(menus[i]?.icon),
        children: menus[i]?.mkey?.split('-')?.length >= 3 ? null : menus[i]?.children
      })
      // }
    } else {
      // if (menus[i]?.role?.includes(role)) {
      result.push({
        label: menus[i]?.label,
        key: menus[i]?.key,
        role: menus[i]?.role,
        icon: getIconComponent(menus[i]?.icon),
        children: null
      })
      // }
    }
  }
  return result
}

export const i18nMenu = [
  {
    key: 'zh-CN',
    label: <span>简体中文</span>,
    icon: <em className="nation-flag">🇨🇳</em>
  },
  {
    key: 'zh-HK',
    label: <span>繁體中文</span>,
    icon: <em className="nation-flag">🇭🇰</em>
  },
  {
    key: 'en-US',
    label: <span>English</span>,
    icon: <em className="nation-flag">🇺🇸</em>
  }
]

export const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'AccountBookOutlined':
      return <AccountBookOutlined />
    case 'LineChartOutlined':
      return <LineChartOutlined />
    case 'MacCommandOutlined':
      return <MacCommandOutlined />
    case 'RobotOutlined':
      return <RobotOutlined />
    case 'UserOutlined':
      return <UserOutlined />
    case 'GoldOutlined':
      return <GoldOutlined />
    default:
      return null
  }
}
