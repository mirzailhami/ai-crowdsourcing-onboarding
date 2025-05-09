"use client"

import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { FormTooltip } from "@/components/form-tooltip"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { step2Schema } from "@/lib/onboarding-schemas"

interface Step2FormProps {
  form: UseFormReturn<z.infer<typeof step2Schema>>
}

export function Step2Form({ form }: Step2FormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Your Audience & Registration</CardTitle>
        <CardDescription>Define who can participate and how they'll engage with your challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="participant_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormFieldWrapper label="Participant Type" tooltip="Choose who can participate">
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="open" />
                      </FormControl>
                      <FormLabel className="font-normal">Open to Public</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="invite" />
                      </FormControl>
                      <FormLabel className="font-normal">Invite Only</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geographic_filter"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Geographic Filter" tooltip="Limit participation to specific regions">
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global (No Restrictions)</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="custom">Custom Regions</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Primary Language" tooltip="Main language for communications">
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team_participation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <FormLabel className="text-base">Team Participation</FormLabel>
                  <FormTooltip content="Allow participants to form teams" />
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enable_forums"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <FormLabel className="text-base">Enable Forums & Q&A</FormLabel>
                  <FormTooltip content="Provide a space for participants to discuss" />
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
