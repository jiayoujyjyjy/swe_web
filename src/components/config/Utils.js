// //////////////////////////////////////////
//
//   sessionStorage
//
// //////////////////////////////////////////

/**
 * 存储sessionStorage
 */
export const sessionSetStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 */
export const sessionGetStore = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

/**
 * 删除sessionStorage
 */
export const sessionRemoveStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

/**
 * 删除所有sessionStorage
 */
export const sessionClearStore = () => {
  window.sessionStorage.clear()
}
