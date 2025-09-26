import { useCallback, useRef, useState } from 'react'
import { countDownInit } from '@/common/constant'

function useCountDown () {
  const [remain, setRemain] = useState(countDownInit)
  const timerRef = useRef()

  const startCountDown = useCallback((count) => {
    if (count <= 0) {
      clearTimeout(timerRef.current)
      return
    }

    setRemain(count - 1)
    timerRef.current = setTimeout(() => {
      startCountDown(count - 1)
    }, 1000)
  }, [])

  return {
    remain,
    setRemain,
    startCountDown,
    timerRef
  }
}

export default useCountDown
