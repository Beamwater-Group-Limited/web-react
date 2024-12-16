import { useEffect, useState } from 'react'

/**
 * 用于管理 localStorage 值的自定义 React Hook，实现了同步更新。
 * setStorageValue 函数用于更新 localStorage 值，并触发同步更新到组件状态。
 * 当设置为null时会清空该localStorage的值
 * @param {string} key - localStorage 中存储值的键。
 * @param {*} initialValue - 初始值。如果 localStorage 已经包含给定键的值，则忽略此初始值。
 * @returns {Object} 包含 storageValue 和 setStorageValue 的对象：
 *    - storageValue: 当前存储在 localStorage 中的值。
 *    - setStorageValue: 用于异步更新 localStorage 值的函数。
 */
export const uesLocalStorage = <T>(
  key: string,
  initialValue?: T
): {
  storageValue: T | null
  setStorageValue: (value: T) => Promise<void>
} => {
  const [storageValue, setValue] = useState(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue ?? null
  })
  const setStorageValue = (value: T) => {
    setValue(value)
    return Promise.resolve()
  }
  useEffect(() => {
    if (storageValue) {
      localStorage.setItem(key, JSON.stringify(storageValue))
    } else {
      localStorage.removeItem(key)
    }
  }, [storageValue, key])
  return {
    storageValue,
    setStorageValue
  }
}
