"use client"

import { useCallback, useEffect, useRef } from "react"
import { useLocalStorage } from "@/lib/local-storage"

export function useFormPersistence(formData: any, setFormData: (data: any) => void) {
  const [persistedData, setPersistedData] = useLocalStorage("crowdlaunch:form-data", {})
  const isInitialLoadRef = useRef(true)

  // Load persisted data on initial mount only
  useEffect(() => {
    if (isInitialLoadRef.current && Object.keys(formData).length === 0 && Object.keys(persistedData).length > 0) {
      console.log("Restoring persisted data:", persistedData)
      setFormData(persistedData)
      isInitialLoadRef.current = false
    }
  }, [persistedData, formData, setFormData])

  // Update form data and persist to localStorage (only called when Next button is clicked)
  const updateFormData = useCallback(
    (data: any) => {
      console.log("Updating formData:", data)
      setFormData(data)
      setPersistedData(data)
    },
    [setFormData, setPersistedData],
  )

  const clearFormData = useCallback(() => {
    console.log("Clearing formData")
    setFormData({})
    setPersistedData({})
  }, [setFormData, setPersistedData])

  return { updateFormData, clearFormData }
}
