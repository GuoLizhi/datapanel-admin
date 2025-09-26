import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import cn from '../locales/zhCN.json'
import hk from '../locales/zhHK.json'
import en from '../locales/enUS.json'

const resources = {
  'zh-CN': {
    translation: cn
  },
  'zh-HK': {
    translation: hk
  },
  'en-US': {
    translation: en
  }
}

i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'cn',
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie']
    }
  })

export default i18n
