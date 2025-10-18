import { useState, useEffect } from "react";

/**
 * 自定義 Hook：useLocalStorage
 * 讓 React 狀態自動與 localStorage 同步。
 * @param {string} key localStorage 的 key 名稱
 * @param {any} initialValue 預設值
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const json = localStorage.getItem(key);
      return json ? JSON.parse(json) : initialValue;
    } catch (err) {
      console.error("讀取 localStorage 發生錯誤:", err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error("寫入 localStorage 發生錯誤:", err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
