import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Layout, Menu, Badge, Avatar, Dropdown, Watermark, Switch
} from 'antd'
import './index.scss'
import {
  i18nMenu,
  genMenusNew, menuConfig
} from './menu'
import i18n from '@/common/i18n'
import useUserInfo from '@/hooks/useUserInfo.js'
import { useDispatch, useSelector } from 'react-redux'
import {
  LogoutOutlined, UserOutlined
} from '@ant-design/icons'
import {
  updateDarkMode, updateLoginStatus,
  updateConsoleMenus
} from '@/store/global'
import { parseUserInfo } from '@/common/userInfo'
import dayjs from 'dayjs'
import { judgeUrl } from './utils'
import { NO_NEED_JUDGE_URL } from './constant'

const { Header, Sider } = Layout

window.globalCollectedRobots = []

const BasicLayout = () => {
  const {
    // unreadNoticeCnt,
    isDarkMode
  } = useSelector(state => state.global)
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { getUserInfo } = useUserInfo()
  const { userInfo, isInner } = useSelector(state => state.global)
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectKeys] = useState([])
  const loc = useLocation()
  const dispatch = useDispatch()
  const [showNewsDrawer, setShowNewsDrawer] = useState(false)
  const [newsCnt, setNewsCnt] = useState(0)

  const menus = useMemo(() => {
    if (menuConfig?.length > 0) {
      return genMenusNew(menuConfig)
    }
  }, [menuConfig])

  useEffect(() => {
    if (menuConfig?.length > 0) {
      dispatch(updateConsoleMenus(JSON.parse(JSON.stringify(menuConfig[0]?.children)) ?? []))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuConfig])

  useEffect(() => {
    if (menus?.length > 0) {
      const url = location.pathname
      const user = parseUserInfo()
      if (!judgeUrl(menus, url, user?.role) && !(NO_NEED_JUDGE_URL.includes(url))) {
        navigate(menus[0]?.children[0]?.key)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus])

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  useEffect(() => {
    const bodyEle = document.body
    if (isDarkMode) {
      bodyEle.classList.add('body-dark-mode')
      localStorage.setItem('dark_mode', 'Y')
    } else {
      bodyEle.classList.remove('body-dark-mode')
      localStorage.removeItem('dark_mode')
    }
  }, [isDarkMode])

  useEffect(() => {
    const openKey = loc.pathname.split('/')?.[1]
    setOpenKeys([openKey])
    setSelectKeys(loc.pathname)
  }, [loc.pathname])

  const onMenuClick = (openKeys) => {
    setOpenKeys(openKeys)
  }

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  const handleLangChange = ({ key }) => {
    i18n.changeLanguage(key)
  }

  const onSideMenuSelect = (item) => {
    setSelectKeys(item.selectedKeys)
    navigate(item.key)
  }

  const goPersonalCenter = () => {
    navigate('/account/user-info')
  }

  const logout = () => {
    localStorage.removeItem('JWT_TOKEN')
    localStorage.removeItem('USER_INFO')
    dispatch(updateLoginStatus(false))
    navigate('/login')
  }

  // const goNotifyPage = () => {
  //   navigate('/account/message-list?pageNo=1&pageSize=10&status=0')
  // }

  const goChatGPT = () => {
    window.open('http://141.164.56.89:3000/')
  }

  const dropDownMenu = [
    {
      key: 'personalCenter',
      label: <span onClick={goPersonalCenter}>个人中心</span>,
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: <span onClick={logout}>退出登录</span>,
      icon: <LogoutOutlined />
    }
  ]

  const watermarkContent = useMemo(() => {
    const user = parseUserInfo()
    return `${user?.nickname} ${dayjs().format('YYYY-MM-DD')}`
  }, [])

  const modeToggleChange = useCallback((checked, e) => {
    dispatch(updateDarkMode(checked))
  }, [dispatch])

  const waterMarkStyle = useMemo(() => {
    return { fontSize: 12, color: 'rgba(0,0,0,.08)' }
  }, [])

  const handleLastestNewsClick = () => {
    setShowNewsDrawer(!showNewsDrawer)
    setNewsCnt(0)
  }

  return (
    <Layout className="basic-layout">
      <Header className="header">
        <p className="title">量化交易管理后台</p>
        <div className="info-wrapper">
          {isInner && <span className="chatgpt" onClick={goChatGPT}>ChatGPT</span>}
          {/* <Badge count={unreadNoticeCnt} className="warning-badge" onClick={goNotifyPage}>
            <span className="warning-icon">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="bell"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M816 768h-24V428c0-141.1-104.3-257.7-240-277.1V112c0-22.1-17.9-40-40-40s-40 17.9-40 40v38.9c-135.7 19.4-240 136-240 277.1v340h-24c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h216c0 61.8 50.2 112 112 112s112-50.2 112-112h216c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM512 888c-26.5 0-48-21.5-48-48h96c0 26.5-21.5 48-48 48zM304 768V428c0-55.6 21.6-107.8 60.9-147.1S456.4 220 512 220c55.6 0 107.8 21.6 147.1 60.9S720 372.4 720 428v340H304z"></path>
              </svg>
            </span>
          </Badge> */}
          <Dropdown menu={{ items: dropDownMenu }} className="info-dropdown">
            <div>
              <Avatar className="avatar">{userInfo?.nickname?.slice(0, 1)}</Avatar>
              <span className="username">{userInfo?.nickname}</span>
            </div>
          </Dropdown>
          <Dropdown
            menu={{ items: i18nMenu, onClick: handleLangChange }}
            className="i18n-dropdown"
          >
            <svg
              viewBox="0 0 24 24"
              focusable="false"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z " className="css-c4d79v"></path>
            </svg>
          </Dropdown>
          <div className="mode-toggle">
            夜间模式 <Switch
              checkedChildren="关闭"
              unCheckedChildren="开启"
              checked={isDarkMode}
              onChange={modeToggleChange}
            />
          </div>
        </div>
      </Header>
      <Layout>
        <Sider
          theme="light"
          className="sider"
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          <Menu
            items={menus}
            mode="inline"
            className="sider-menu"
            onSelect={onSideMenuSelect}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            onOpenChange={onMenuClick}
          />
        </Sider>
        <div className="main-content">
          <Watermark content={watermarkContent} font={waterMarkStyle}>
            <Outlet />
          </Watermark>
          <div className='latest-news-wraper' onClick={handleLastestNewsClick}>
            <Badge count={newsCnt} overflowCount={10}>
              <Avatar shape="square" size="large">NEWS</Avatar>
            </Badge>
          </div>
        </div>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
