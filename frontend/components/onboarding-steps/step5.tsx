"use client"

import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, useRef } from "react"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { step5Schema } from "@/lib/onboarding-schemas"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"

interface Step5FormProps {
  form: UseFormReturn<z.infer<typeof step5Schema>>
}

export function Step5Form({ form }: Step5FormProps) {
  const [openStartDate, setOpenStartDate] = useState(false)
  const [openEndDate, setOpenEndDate] = useState(false)
  const initialRenderRef = useRef(true)

  // Get milestones from form, with a fallback to empty array
  const milestones = form.watch("milestones") || []

  // Add milestone without directly modifying the form state
  const addMilestone = () => {
    const currentMilestones = [...(form.getValues("milestones") || [])]
    form.setValue("milestones", [...currentMilestones, { enabled: false, name: "", date: undefined }], {
      shouldValidate: true,
    })
  }

  // Remove milestone without directly modifying the form state
  const removeMilestone = (index: number) => {
    const currentMilestones = [...(form.getValues("milestones") || [])]
    form.setValue(
      "milestones",
      currentMilestones.filter((_, i) => i !== index),
      { shouldValidate: true },
    )
  }

  // Initialize milestones if they're undefined
  useEffect(() => {
    if (initialRenderRef.current) {
      const currentMilestones = form.getValues("milestones")
      if (!currentMilestones || !Array.isArray(currentMilestones)) {
        form.setValue("milestones", [])
      }
      initialRenderRef.current = false
    }
  }, [form])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline & Milestones</CardTitle>
        <CardDescription>Set the timeline and key milestones for your challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Start Date" tooltip="Select the challenge start date" required>
                <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setOpenStartDate(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="End Date" tooltip="Select the challenge end date" required>
                <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setOpenEndDate(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="milestones"
          render={() => (
            <FormItem>
              <FormFieldWrapper label="Milestones" tooltip="Add key milestones for your challenge">
                <div className="space-y-4">
                  {Array.isArray(milestones) &&
                    milestones.map((milestone: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 border p-4 rounded-lg">
                        <FormField
                          control={form.control}
                          name={`milestones.${index}.enabled`}
                          render={({ field }) => (
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`milestones.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Milestone name" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`milestones.${index}.date`}
                          render={({ field }) => (
                            <FormItem>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? format(field.value, "PPP") : <span>Pick date</span>}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                        <Button variant="destructive" size="icon" onClick={() => removeMilestone(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  <Button type="button" variant="outline" onClick={addMilestone}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                </div>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeline_notes"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Timeline Notes" tooltip="Additional notes about the timeline (optional)">
                <FormControl>
                  <Textarea placeholder="Any additional timeline information..." className="min-h-[100px]" {...field} />
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
