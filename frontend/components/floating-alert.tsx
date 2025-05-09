"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface FloatingAlertProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function FloatingAlert({ message, isVisible, onClose, duration = 5000 }: FloatingAlertProps) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsClosing(true)
        setTimeout(() => {
          setIsClosing(false)
          onClose()
        }, 300) // Animation duration
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible && !isClosing) return null

  return (
    <div
      className={cn(
        "fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        isClosing && "opacity-0 translate-y-10",
      )}
    >
      <Alert variant="destructive" className="shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  )
}
