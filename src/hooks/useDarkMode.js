import { useSelector } from 'react-redux'

export function useDarkMode () {
  const { isDarkMode } = useSelector(state => state.global)
  return {
    isDarkMode
  }
}
