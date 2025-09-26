function copy (text = '') {
  const input = document.createElement('input')
  input.setAttribute('value', text)
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  setTimeout(() => {
    document.body.removeChild(input)
  }, 1000)
}

export function batchCopy (arr = []) {
  const textarea = document.createElement('textarea')
  textarea.textContent = arr.join('\n')
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  setTimeout(() => {
    document.body.removeChild(textarea)
  }, 1300)
}

export default copy
