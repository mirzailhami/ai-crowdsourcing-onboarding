"use client"

import { useEffect, useImperativeHandle, forwardRef, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { getSchemaForStep, defaultValues } from "@/lib/onboarding-schemas"
import { Step1Form } from "./onboarding-steps/step1"
import { Step2Form } from "./onboarding-steps/step2"
import { Step3Form } from "./onboarding-steps/step3"
import { Step4Form } from "./onboarding-steps/step4"
import { Step5Form } from "./onboarding-steps/step5"
import { Step6Form } from "./onboarding-steps/step6"
import { Step7Form } from "./onboarding-steps/step7"

interface OnboardingStepsProps {
  currentStep: number
  onStepChange: (step: number) => void
  onStepValidation: (isValid: boolean) => void
  onFormValuesChange: (values: any) => void
  formData: any
  updateFormData: (data: any) => void
}

export const OnboardingSteps = forwardRef(
  ({ currentStep, onStepChange, onStepValidation, onFormValuesChange, formData, updateFormData }: OnboardingStepsProps, ref) => {
    // Track if this is the initial render
    const initialRenderRef = useRef(true)
    // Track the current step to detect changes
    const prevStepRef = useRef(currentStep)

    // Get the current step's schema
    const schema = getSchemaForStep(currentStep)

    // Get default values for the current step
    const stepDefaultValues = defaultValues[`step${currentStep}`]

    // Get existing data for the current step
    const existingStepData = formData[`step${currentStep}`] || {}

    // Merge default values with existing data
    const mergedValues = { ...stepDefaultValues, ...existingStepData }

    // Initialize the form with the merged values
    const form = useForm({
      resolver: zodResolver(schema),
      mode: "onSubmit", // Only validate on submit, not while typing
      defaultValues: mergedValues,
    })

    const { formState, trigger, reset, getValues, watch } = form
    const { isValid, errors } = formState

    // Watch form values and notify parent of changes
    useEffect(() => {
      const subscription = watch((values) => {
        console.log(`Form values changed for step ${currentStep}:`, values)
        onFormValuesChange(values)
      })
      return () => subscription.unsubscribe()
    }, [watch, currentStep, onFormValuesChange])

    // Only update validation when explicitly triggered (not during typing)
    useEffect(() => {
      if (!initialRenderRef.current) {
        console.log(`Step ${currentStep} - isValid:`, isValid)
        console.log(`Step ${currentStep} - Errors:`, errors)
        onStepValidation(isValid)
      }
    }, [isValid, currentStep, errors, onStepValidation])

    // Reset form ONLY when step changes or on initial render
    useEffect(() => {
      const stepChanged = prevStepRef.current !== currentStep
      prevStepRef.current = currentStep

      if (initialRenderRef.current || stepChanged) {
        const stepData = formData[`step${currentStep}`]
        console.log(`Step ${currentStep} - Loading Form Data:`, stepData)

        // Reset with either existing data or defaults
        const resetData = { ...stepDefaultValues, ...stepData }

        // Ensure arrays are properly initialized
        if (currentStep === 3) {
          resetData.submission_formats = resetData.submission_formats || []
          resetData.submission_documentation = resetData.submission_documentation || []
        } else if (currentStep === 6) {
          resetData.reviewers = resetData.reviewers || []
          resetData.evaluation_criteria = resetData.evaluation_criteria || []
        } else if (currentStep === 7) {
          resetData.notification_preferences = resetData.notification_preferences || []
          resetData.notification_methods = resetData.notification_methods || []
          resetData.access_level = resetData.access_level || []
        }

        reset(resetData)
        initialRenderRef.current = false

        // Validate form after reset, but only if we have data
        if (stepData && Object.keys(stepData).length > 0) {
          setTimeout(() => {
            trigger().then((isValid) => {
              console.log(`Initial validation for step ${currentStep}: ${isValid}`)
              onStepValidation(isValid)
            })
          }, 100)
        }
      }
    }, [currentStep, formData, reset, trigger, onStepValidation, stepDefaultValues])

    // Handle form submission (only called when Next button is clicked)
    const onSubmit = (data: any) => {
      console.log("Form data for step", currentStep, ":", data)

      // Update the form data with the current step's data
      const updatedFormData = {
        ...formData,
        [`step${currentStep}`]: data,
      }

      updateFormData(updatedFormData)
    }

    // Expose submit and getValues methods to parent component
    useImperativeHandle(ref, () => ({
      submit: async (callback?: (data?: any) => void) => {
        console.log(`Submitting Step ${currentStep}...`)
        const isValid = await trigger()
        console.log(`Validation result for step ${currentStep}: ${isValid}`)

        if (isValid) {
          const data = getValues()
          console.log(`Form data for step ${currentStep}:`, data)
          onSubmit(data)
          if (callback) callback(data)
        } else {
          const errors = form.formState.errors
          console.log(`Submission Errors for Step ${currentStep}:`, errors)

          // Log specific error details for debugging
          Object.keys(errors).forEach((field) => {
            console.log(`Field ${field} error:`, errors[field])
          })
          if (callback) callback(undefined)
        }
      },
      getValues: () => {
        const values = getValues()
        console.log(`Getting form values for step ${currentStep}:`, values)
        return values
      },
    }))

    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return <Step1Form form={form} />
        case 2:
          return <Step2Form form={form} />
        case 3:
          return <Step3Form form={form} />
        case 4:
          return <Step4Form form={form} />
        case 5:
          return <Step5Form form={form} />
        case 6:
          return <Step6Form form={form} />
        case 7:
          return <Step7Form form={form} />
        default:
          return <Step1Form form={form} />
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>{renderStep()}</form>
      </Form>
    )
  },
)

OnboardingSteps.displayName = "OnboardingSteps"