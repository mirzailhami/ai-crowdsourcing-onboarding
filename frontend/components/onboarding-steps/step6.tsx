"use client"
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { FormTooltip } from "@/components/form-tooltip"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import type { step6Schema } from "@/lib/onboarding-schemas"
import { Plus, Trash2 } from "lucide-react"

interface Step6FormProps {
  form: UseFormReturn<z.infer<typeof step6Schema>>
}

export function Step6Form({ form }: Step6FormProps) {
  const reviewersList = [
    { id: "internal", label: "Internal Team Members" },
    { id: "external", label: "External Subject Matter Experts" },
    { id: "community", label: "Community Reviewers" },
  ]

  const evaluationCriteria = form.watch("evaluation_criteria")

  const addCriterion = () => {
    form.setValue("evaluation_criteria", [...evaluationCriteria, { name: "", weight: "", description: "" }])
  }

  const removeCriterion = (index: number) => {
    form.setValue(
      "evaluation_criteria",
      evaluationCriteria.filter((_, i) => i !== index),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Evaluation</CardTitle>
        <CardDescription>Define how submissions will be evaluated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="evaluation_model"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Evaluation Model" tooltip="Select how submissions are evaluated" required>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evaluation model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post-Submission (After Deadline)</SelectItem>
                      <SelectItem value="rolling">Rolling (As Submitted)</SelectItem>
                      <SelectItem value="staged">Staged (Multiple Rounds)</SelectItem>
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
          name="reviewers"
          render={({ field }) => (
            <FormItem>
              <FormFieldWrapper label="Reviewer Roles" tooltip="Select who will review submissions" required>
                <div className="space-y-2">
                  {reviewersList.map((item) => (
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
          name="evaluation_criteria"
          render={() => (
            <FormItem>
              <FormFieldWrapper label="Evaluation Criteria" tooltip="Define criteria for judging submissions" required>
                <div className="space-y-4">
                  {evaluationCriteria?.map((criterion: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 border p-4 rounded-lg">
                      <FormField
                        control={form.control}
                        name={`evaluation_criteria.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Criterion name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`evaluation_criteria.${index}.weight`}
                        render={({ field }) => (
                          <FormItem className="w-[100px]">
                            <FormControl>
                              <Input placeholder="Weight (%)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`evaluation_criteria.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="destructive" size="icon" onClick={() => removeCriterion(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addCriterion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Criterion
                  </Button>
                </div>
                <FormMessage />
              </FormFieldWrapper>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anonymized_review"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <FormLabel className="text-base">Anonymized Review</FormLabel>
                  <FormTooltip content="Hide participant identities during review" />
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
