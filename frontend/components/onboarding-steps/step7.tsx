"use client"

import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { step7Schema } from "@/lib/onboarding-schemas"

interface Step7FormProps {
  form: UseFormReturn<z.infer<typeof step7Schema>>
}

export function Step7Form({ form }: Step7FormProps) {
  const notificationPreferencesList = [
    { id: "submissions", label: "New Submissions" },
    { id: "questions", label: "Participant Questions" },
    { id: "milestones", label: "Milestone Reminders" },
    { id: "reviews", label: "Review Updates" },
  ]

  const notificationMethodsList = [
    { id: "email", label: "Email" },
    { id: "platform", label: "Platform Notifications" },
    { id: "sms", label: "SMS" },
  ]

  const accessLevel = [
    { id: "admin", label: "Challenge Admins" },
    { id: "reviewers", label: "Reviewers" },
    { id: "participants", label: "Participants (Limited)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring</CardTitle>
        <CardDescription>Configure how you'll monitor and communicate during the challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="notification_preferences"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Notification Preferences" tooltip="Select what to be notified about" required>
                <div className="space-y-2">
                  {notificationPreferencesList.map((item) => (
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
          name="notification_methods"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Notification Methods" tooltip="Select how to receive notifications" required>
                <div className="space-y-2">
                  {notificationMethodsList.map((item) => (
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
          name="announcement_template"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Announcement Template" tooltip="Customize the announcement template (optional)">
                <FormControl>
                  <Textarea
                    placeholder="e.g., [Challenge Name] Update: [Message]"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="access_level"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Monitoring Access" tooltip="Select who can monitor the challenge" required>
                <div className="space-y-2">
                  {accessLevel.map((item) => (
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
          name="success_metrics"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Success Metrics" tooltip="Define how success will be measured (optional)">
                <FormControl>
                  <Textarea
                    placeholder="e.g., Number of submissions, Participant engagement, Solution quality"
                    className="min-h-[100px]"
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
