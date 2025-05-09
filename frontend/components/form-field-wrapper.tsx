import type { ReactNode } from "react"
import { FormLabel } from "@/components/ui/form"
import { FormTooltip } from "@/components/form-tooltip"

interface FormFieldWrapperProps {
  label: string
  tooltip: string
  required?: boolean
  children: ReactNode
}

export function FormFieldWrapper({ label, tooltip, required = false, children }: FormFieldWrapperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FormLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
        <FormTooltip content={tooltip} />
      </div>
      {children}
    </div>
  )
}
