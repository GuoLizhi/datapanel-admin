// 打开数据库
function openDatabase (callback) {
  const request = window.indexedDB.open('collectedRobotsDB', 1)

  request.onerror = function (event) {
    console.error('Database error: ' + event.target.errorCode)
  }

  request.onsuccess = function (event) {
    const db = event.target.result
    callback(db)
  }

  request.onupgradeneeded = function (event) {
    const db = event.target.result
    if (!db.objectStoreNames.contains('collectedRobots')) {
      db.createObjectStore('collectedRobots', { keyPath: 'id' })
    }
  }
}

// 存储整个数组
function storeArray (array, callback = () => {}) {
  openDatabase(db => {
    const transaction = db.transaction(['collectedRobots'], 'readwrite')
    const objectStore = transaction.objectStore('collectedRobots')

    const arrayString = JSON.stringify(array) // 将数组转换为字符串

    const request = objectStore.put({ id: 'myArray', data: arrayString })

    request.onsuccess = function (event) {
      // eslint-disable-next-line
      callback('Array stored successfully')
    }

    request.onerror = function (event) {
      console.error('Error storing array: ' + event.target.errorCode)
    }
  })
}

// 获取整个数组并返回 Promise
function getArray () {
  return new Promise((resolve, reject) => {
    openDatabase(db => {
      const transaction = db.transaction(['collectedRobots'], 'readonly')
      const objectStore = transaction.objectStore('collectedRobots')

      const request = objectStore.get('myArray')

      request.onsuccess = function (event) {
        const arrayData = event.target.result
        if (arrayData) {
          const array = JSON.parse(arrayData.data) // 将存储的字符串转换为数组
          resolve(array)
        } else {
          resolve([])
        }
      }

      request.onerror = function (event) {
        console.error('Error retrieving array: ' + event.target.errorCode)
        reject(event.target.errorCode)
      }
    })
  })
}

// 删除数组中的某一项
function deleteItemFromArray (index, callback) {
  getArray().then(array => {
    if (index >= 0 && index < array.length) {
      array.splice(index, 1)
      storeArray(array, callback)
    }
  })
}

// 添加新的对象到数组中
function addItemToArray (newItem, callback = () => {}) {
  getArray().then(array => {
    const index = array?.findIndex((item) => newItem?.id === item?.id)
    if (index > -1) {
      array[index] = newItem
    } else {
      array.push(newItem)
    }
    storeArray(array, callback)
  })
}

// 更新原有数组中的数据
// 更新原有数组中的数据
function updateItemInArray (index, newData, callback) {
  getArray(array => {
    if (index >= 0 && index < array.length) {
      array[index] = newData
      storeArray(array, callback)
    }
  })
}

export {
  storeArray,
  getArray,
  deleteItemFromArray,
  addItemToArray,
  updateItemInArray
}
