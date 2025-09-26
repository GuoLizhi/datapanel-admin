import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './global/index.js'

const store = configureStore({
  reducer: {
    global: globalReducer
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: { warnAfter: 100 } })
    // middleware: getDefaultMiddleware({
    //   serializableCheck: false,
    //   immutableCheck: false
    // })
  }
})

export default store
