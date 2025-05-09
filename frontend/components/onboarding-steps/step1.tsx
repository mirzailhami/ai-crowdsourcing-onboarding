"use client"

import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { step1Schema } from "@/lib/onboarding-schemas"

interface Step1FormProps {
  form: UseFormReturn<z.infer<typeof step1Schema>>
}

export function Step1Form({ form }: Step1FormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Define Your Challenge</CardTitle>
        <CardDescription>Clearly articulate your problem statement, goals, and challenge type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Challenge Title" tooltip="A descriptive title" required>
                <FormControl>
                  <Input placeholder="Enter a clear, concise title" {...field} />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="problem_statement"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Problem Statement" tooltip="Define the problem" required>
                <FormControl>
                  <Textarea placeholder="Describe the problem..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Challenge Goals" tooltip="Define outcomes" required>
                <FormControl>
                  <Textarea
                    placeholder="What outcomes are you hoping to achieve?"
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
          name="challenge_type"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Challenge Type" tooltip="Select challenge type" required>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select challenge type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ideation">Ideation & Concepts</SelectItem>
                      <SelectItem value="development">Software Development</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="ai">Artificial Intelligence</SelectItem>
                      <SelectItem value="design">Design & UX</SelectItem>
                      <SelectItem value="research">Research & Analysis</SelectItem>
                    </SelectContent>
                  </Select>
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
