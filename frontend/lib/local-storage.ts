"use client"

import { useState, useEffect } from "react"

export function loadFromLocalStorage(key: string) {
  if (typeof window === "undefined") return null
  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null || serialized === "undefined") return null
    return JSON.parse(serialized)
  } catch (error) {
    console.error("Error loading from localStorage:", error)
    return null
  }
}

export function saveToLocalStorage(key: string, value: any) {
  if (typeof window === "undefined") return
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

export function clearLocalStorage(key: string) {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue
      const item = loadFromLocalStorage(key)
      return item !== null ? item : initialValue
    } catch (error) {
      console.error("Error initializing localStorage:", error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== "undefined") {
        saveToLocalStorage(key, value)
      }
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorageChange = () => {
      try {
        const item = loadFromLocalStorage(key)
        if (item !== null && JSON.stringify(item) !== JSON.stringify(storedValue)) {
          setStoredValue(item)
        }
      } catch (error) {
        console.error("Error handling storage change:", error)
      }
    }

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange)

    handleStorageChange()

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}
