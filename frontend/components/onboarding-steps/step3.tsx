"use client"

import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { step3Schema } from "@/lib/onboarding-schemas"

interface Step3FormProps {
  form: UseFormReturn<z.infer<typeof step3Schema>>
}

export function Step3Form({ form }: Step3FormProps) {
  const submissionFormats = [
    { id: "github", label: "GitHub Repository" },
    { id: "video", label: "Demo Video" },
    { id: "pdf", label: "Presentation PDF" },
    { id: "zip", label: "Code Zip File" },
    { id: "other", label: "Other" },
  ]

  const submissionDocumentation = [
    { id: "readme", label: "README.md" },
    { id: "architecture", label: "Architecture Diagram" },
    { id: "user-guide", label: "User Guide" },
    { id: "api-docs", label: "API Documentation" },
    { id: "test-plan", label: "Test Plan" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission Requirements</CardTitle>
        <CardDescription>Specify what participants need to submit for your challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="submission_formats"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Submission Formats" tooltip="Select acceptable submission formats" required>
                <div className="space-y-2">
                  {submissionFormats.map((item) => (
                    <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || []
                            const newValue = checked
                              ? [...currentValue, item.id]
                              : currentValue.filter((value: string) => value !== item.id)
                            field.onChange(newValue)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item.label}</FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="submission_documentation"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Documentation Requirements" tooltip="Select required documentation" required>
                <div className="space-y-2">
                  {submissionDocumentation.map((item) => (
                    <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || []
                            const newValue = checked
                              ? [...currentValue, item.id]
                              : currentValue.filter((value: string) => value !== item.id)
                            field.onChange(newValue)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item.label}</FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="submission_instructions"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper
                label="Submission Instructions"
                tooltip="Provide clear submission instructions"
                required
              >
                <FormControl>
                  <Textarea
                    placeholder="Describe how participants should submit their work..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
