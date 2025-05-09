"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Lightbulb, ArrowLeft, ArrowRight, HelpCircle, Check } from "lucide-react"
import { OnboardingSteps } from "@/components/onboarding-steps"
import { SupportModal } from "@/components/support-modal"
import { ChallengeSummary } from "@/components/challenge-summary"
import { FloatingAlert } from "@/components/floating-alert"
import { useFormPersistence } from "@/hooks/use-form-persistence"
import { AIAssistant } from "@/components/ai-assistant"
import { createChallenge, updateChallenge } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({})
  const [stepValidation, setStepValidation] = useState({})
  const [showValidationError, setShowValidationError] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")
  const [challengeId, setChallengeId] = useState<number | null>(null)
  const [currentFormValues, setCurrentFormValues] = useState<any>({})
  const totalSteps = 7

  const formRef = useRef<{ submit: (callback?: (data?: any) => void) => void; getValues: () => any }>(null)

  const { updateFormData, clearFormData } = useFormPersistence(formData, setFormData)

  // Handle form value changes
  const handleFormValuesChange = useCallback((values: any) => {
    setCurrentFormValues(values)
  }, [])

  // Debug log for form data changes
  useEffect(() => {
    console.log("Current formData:", formData)
    console.log("Current formValues:", currentFormValues)
  }, [formData, currentFormValues])

  // Handle step validation (only updated when validation is triggered)
  const handleStepValidation = useCallback(
    (isValid) => {
      setStepValidation((prev) => {
        // Only update if the value is different
        if (prev[currentStep] !== isValid) {
          console.log(`Step ${currentStep} validation: ${isValid}`)
          return { ...prev, [currentStep]: isValid }
        }
        return prev
      })
    },
    [currentStep],
  )

  // Function to check if a step is valid based on its data
  const validateStepData = useCallback((stepNumber, stepData) => {
    if (!stepData) return false

    const requiredFields =
      {
        1: ["title", "challenge_type", "problem_statement", "goals"],
        2: ["participant_type", "geographic_filter", "language"],
        3: ["submission_formats", "submission_documentation", "submission_instructions"],
        4: ["prize_model", "budget"],
        5: ["start_date", "end_date"],
        6: ["evaluation_model", "reviewers", "evaluation_criteria"],
        7: ["notification_preferences", "notification_methods", "access_level"],
      }[stepNumber] || []

    // Check if required fields are present in the step data
    const missingFields = requiredFields.filter((field) => {
      if (Array.isArray(stepData[field])) {
        return !stepData[field] || stepData[field].length === 0
      }
      return !stepData[field] || String(stepData[field]).trim() === ""
    })

    return missingFields.length === 0
  }, [])

  // Validate all steps
  const validateAllSteps = useCallback(() => {
    const invalidSteps = []

    for (let step = 1; step <= totalSteps; step++) {
      const stepData = formData[`step${step}`]
      if (!validateStepData(step, stepData)) {
        invalidSteps.push(step)
      }
    }

    return {
      isValid: invalidSteps.length === 0,
      invalidSteps,
    }
  }, [formData, validateStepData, totalSteps])

  // Handle Next button click - SIMPLIFIED VERSION
  const handleNext = async () => {
    // Trigger form validation and submission
    formRef.current?.submit(async (submittedData) => {
      // If no data was submitted, show an error
      if (!submittedData) {
        setValidationMessage("Please complete all required fields before proceeding.")
        setShowValidationError(true)
        return
      }

      console.log("Submitted data for step", currentStep, ":", submittedData)

      // Update the form data with the submitted data
      const updatedFormData = {
        ...formData,
        [`step${currentStep}`]: submittedData,
      }

      // Update the form data state
      updateFormData(updatedFormData)

      // Clear any validation errors
      setShowValidationError(false)

      // Move to the next step or review mode
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      } else {
        // For the last step, go to review mode
        setIsReviewMode(true)
      }
    })
  }

  // Handle Previous button click
  const handlePrevious = () => {
    setShowValidationError(false)
    if (isReviewMode) {
      setIsReviewMode(false)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle Edit button click in review mode
  const handleEditStep = (stepNumber) => {
    setCurrentStep(stepNumber)
    setIsReviewMode(false)
    setShowValidationError(false)
  }

  // Handle final submission
  const handleSubmit = async () => {
    // Validate all steps before final submission
    const { isValid, invalidSteps } = validateAllSteps()
    if (!isValid) {
      setValidationMessage(`Please complete all required fields in steps: ${invalidSteps.join(", ")}`)
      setShowValidationError(true)
      return
    }

    try {
      setFormSubmitted(true)
      setShowValidationError(false)

      // Create the full payload by merging all step data
      const payload = Object.keys(formData).reduce((acc, key) => {
        const stepData = formData[key]
        if (stepData && typeof stepData === "object") {
          return { ...acc, ...stepData }
        }
        return acc
      }, {})

      console.log("Final submission payload:", payload)

      // Format dates for API
      if (payload.start_date) {
        payload.start_date =
          payload.start_date instanceof Date
            ? payload.start_date.toISOString()
            : new Date(payload.start_date).toISOString()
      }
      if (payload.end_date) {
        payload.end_date =
          payload.end_date instanceof Date ? payload.end_date.toISOString() : new Date(payload.end_date).toISOString()
      }
      if (payload.milestones) {
        payload.milestones = payload.milestones.map((milestone: any) => ({
          ...milestone,
          date: milestone.date
            ? milestone.date instanceof Date
              ? milestone.date.toISOString()
              : new Date(milestone.date).toISOString()
            : null,
        }))
      }

      if (challengeId) {
        await updateChallenge(challengeId, payload)
        toast({ title: "Challenge Updated", description: "Your challenge has been updated." })
      } else {
        const newChallenge = await createChallenge(payload)
        setChallengeId(newChallenge.id)
        toast({ title: "Challenge Created", description: "Your challenge has been created." })
      }

      clearFormData()
      setFormSubmitted(false)
      setCurrentStep(1)
      setIsReviewMode(false)
      setChallengeId(null)
      toast({ title: "Challenge Submitted", description: "Your challenge has been successfully submitted." })
    } catch (error) {
      console.error("Error submitting challenge:", error)
      setFormSubmitted(false)
      toast({ title: "Error", description: "Failed to submit challenge. Please try again.", variant: "destructive" })
    }
  }

  const progressPercentage = isReviewMode ? 100 : (currentStep / totalSteps) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Lightbulb className="h-6 w-6" />
            <span>CrowdLaunch</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => setShowSupportModal(true)}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Get Support
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSupportModal(true)}>
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid gap-6 px-4 py-6 md:px-6 md:py-8 lg:grid-cols-[1fr_350px] lg:gap-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                {isReviewMode ? "Review Your Challenge" : "Launch Your Challenge"}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {isReviewMode ? "Review" : `Step ${currentStep} of ${totalSteps}`}
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />

            {isReviewMode ? (
              <ChallengeSummary onEditStep={handleEditStep} formData={formData} />
            ) : (
              <OnboardingSteps
                ref={formRef}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onStepValidation={handleStepValidation}
                onFormValuesChange={handleFormValuesChange}
                formData={formData}
                updateFormData={updateFormData}
              />
            )}

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 && !isReviewMode}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isReviewMode ? "Back to Steps" : "Previous"}
              </Button>

              {isReviewMode ? (
                <Button onClick={handleSubmit} disabled={formSubmitted}>
                  {formSubmitted ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <span className="animate-spin">⟳</span>
                    </>
                  ) : (
                    <>
                      Submit Challenge
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentStep === totalSteps ? "Review" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-6 lg:sticky lg:top-[81px] lg:self-start">
            <Tabs defaultValue="assistant">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="assistant" className="space-y-4">
                <AIAssistant
                  currentStep={currentStep}
                  formData={{
                    challenge_type: formData.step1?.challenge_type || "",
                    title: formData.step1?.title || "",
                    problem_statement: formData.step1?.problem_statement || "",
                    goals: formData.step1?.goals || "",
                    target_audience: formData.step2?.participant_type || "",
                    enable_forums: formData.step2?.enable_forums || false,
                    geographic_filters: formData.step2?.geographic_filter || "",
                    participant_skills: formData.step2?.language || "",
                    diversity_goals: formData.step2?.diversity_goals || "",
                    submission_formats: formData.step3?.submission_formats || [],
                    required_docs: formData.step3?.submission_documentation || [],
                    instructions: formData.step3?.submission_instructions || "",
                    allow_video_submissions: formData.step3?.allow_video_submissions || false,
                    prize_structure: formData.step4?.prize_model || "",
                    non_monetary_rewards: formData.step4?.non_monetary_rewards || "",
                    budget: formData.step4?.budget || 0,
                    tiered_prizes: formData.step4?.tiered_prizes || false,
                    sponsorship_ideas: formData.step4?.sponsorship_ideas || "",
                    milestones: formData.step5?.milestones || [],
                    timeline: formData.step5?.timeline_notes || "",
                    key_dates: formData.step5?.key_dates || "",
                    submission_deadline: formData.step5?.end_date || null,
                    buffer_time: formData.step5?.buffer_time || "",
                    evaluation_criteria: formData.step6?.evaluation_criteria || [],
                    anonymous_judging: formData.step6?.anonymized_review || false,
                    number_of_judges: formData.step6?.reviewers?.length || 0,
                    scoring_rubrics: formData.step6?.scoring_rubrics || "",
                    tie_handling: formData.step6?.tie_handling || "",
                    key_metrics: formData.step7?.success_metrics || "",
                    success_measures: formData.step7?.success_metrics || "",
                    notification_settings: formData.step7?.notification_preferences || [],
                    dispute_handling: formData.step7?.dispute_handling || "",
                    update_frequency: formData.step7?.update_frequency || "",
                  }}
                  currentFormValues={currentFormValues}
                  onRequestSupport={() => setShowSupportModal(true)}
                />
              </TabsContent>
              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Challenge Preview</h3>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                          {isReviewMode
                            ? "Review your complete challenge configuration above."
                            : "Your challenge details will appear here as you complete each step."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <FloatingAlert
        message={validationMessage}
        isVisible={showValidationError}
        onClose={() => setShowValidationError(false)}
      />

      {showSupportModal && <SupportModal challengeId={challengeId} onClose={() => setShowSupportModal(false)} />}
    </div>
  )
}