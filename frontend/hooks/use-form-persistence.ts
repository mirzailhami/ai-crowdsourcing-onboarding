"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLocalStorage } from "@/lib/local-storage";

export function useFormPersistence(formData: any, setFormData: (data: any) => void) {
  const [persistedData, setPersistedData] = useLocalStorage("crowdlaunch:form-data", {});
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (isInitialLoadRef.current && Object.keys(formData).length === 0 && Object.keys(persistedData).length > 0) {
      console.log("Restoring persisted data:", persistedData);
      const restoredData = { ...persistedData };

      // Convert date strings back to Date objects for Step 5
      if (restoredData.step5) {
        if (restoredData.step5.start_date && typeof restoredData.step5.start_date === "string") {
          restoredData.step5.start_date = new Date(restoredData.step5.start_date);
        }
        if (restoredData.step5.end_date && typeof restoredData.step5.end_date === "string") {
          restoredData.step5.end_date = new Date(restoredData.step5.end_date);
        }
        if (restoredData.step5.milestones && Array.isArray(restoredData.step5.milestones)) {
          restoredData.step5.milestones = restoredData.step5.milestones.map((milestone: any) => ({
            ...milestone,
            date: milestone.date && typeof milestone.date === "string" ? new Date(milestone.date) : milestone.date,
          }));
        }
      }

      setFormData(restoredData);
      isInitialLoadRef.current = false;
    }
  }, [persistedData, formData, setFormData]);

  const updateFormData = useCallback(
    (data: any) => {
      console.log("Updating formData:", data);
      setFormData(data);
      setPersistedData(data);
    },
    [setFormData, setPersistedData],
  );

  const clearFormData = useCallback(() => {
    console.log("Clearing formData");
    setFormData({});
    setPersistedData({});
  }, [setFormData, setPersistedData]);

  return { updateFormData, clearFormData };
}