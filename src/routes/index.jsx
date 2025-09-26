import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/login'
import Regist from '../pages/regist'
import Layout from '../components/Layout'
import NotFound from '@/pages/not-found'
import { useSelector } from 'react-redux'
import UserInfo from '@/pages/user-info'
import GoogleAuth from '../pages/google-auth'
import ChatGPT from '@/pages/chatgpt'
import UsersList from '@/pages/users-list'
import UserWhitelist from '@/pages/user-whitelist'

const App = () => {
  const { isLogined } = useSelector(state => state.global)

  if (!isLogined) {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/regist" element={<Regist />}></Route>
            <Route path="*" element={<Navigate to="/login" />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    )
  }

  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<Layout />}>
          <Routes>
            <Route exact path="/" element={<Layout />}>
              <Route path="account">
                <Route path="" element={<Navigate to="user-info" />} />
                <Route path="google-auth" element={<GoogleAuth />} />
                <Route path="user-info" element={<UserInfo />} />
                <Route path="chatgpt" element={<ChatGPT />} />
              </Route>
              {<Route path="admin">
                <Route path="" element={<Navigate to="users-list" />} />
                <Route path="users-list" element={<UsersList />} />
                <Route path="whitelist" element={<UserWhitelist />} />
              </Route>}
            </Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/regist" element={<Regist />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
