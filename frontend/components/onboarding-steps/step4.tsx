"use client"

import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { step4Schema } from "@/lib/onboarding-schemas"

interface Step4FormProps {
  form: UseFormReturn<z.infer<typeof step4Schema>>
}

export function Step4Form({ form }: Step4FormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prize Structure</CardTitle>
        <CardDescription>Define the prize model and budget for your challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="prize_model"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Prize Model" tooltip="Select how prizes are awarded" required>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prize model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiered">Tiered (Multiple Winners)</SelectItem>
                      <SelectItem value="single">Single Winner</SelectItem>
                      <SelectItem value="milestone">Milestone-Based</SelectItem>
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
          name="first_prize"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="First Prize Amount" tooltip="Enter the first prize amount" required>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="$5000"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="second_prize"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Second Prize Amount" tooltip="Enter the second prize amount (optional)">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="$2500"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="third_prize"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Third Prize Amount" tooltip="Enter the third prize amount (optional)">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="$1000"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="honorable_mentions"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Honorable Mentions" tooltip="Enter amount for honorable mentions (optional)">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="$500"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Total Budget" tooltip="Enter the total prize budget" required>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="$10000"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="non_monetary_rewards"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Non-Monetary Rewards" tooltip="Describe any non-monetary rewards (optional)">
                <FormControl>
                  <Textarea
                    placeholder="e.g., Mentorship, Product Credits, Recognition"
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
