"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lightbulb, ArrowLeft, ArrowRight, HelpCircle, Check } from "lucide-react";
import { OnboardingSteps } from "@/components/onboarding-steps";
import { SupportModal } from "@/components/support-modal";
import { ChallengeSummary } from "@/components/challenge-summary";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { AIAssistant } from "@/components/ai-assistant";
import { createChallenge, updateChallenge } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Utility function to flatten nested error messages (for react-hook-form errors)
const flattenErrors = (errors: any, prefix = ""): string[] => {
  if (!errors) return [];
  const messages: string[] = [];

  Object.keys(errors).forEach((key) => {
    const error = errors[key];
    const fieldName = prefix ? `${prefix}.${key}` : key;

    if (error.message) {
      messages.push(`${fieldName}: ${error.message}`);
    }

    // Handle nested errors (e.g., arrays like milestones[0].date)
    if (Array.isArray(error)) {
      error.forEach((item: any, index: number) => {
        if (item && typeof item === "object") {
          messages.push(...flattenErrors(item, `${fieldName}[${index}]`));
        }
      });
    } else if (error && typeof error === "object") {
      messages.push(...flattenErrors(error, fieldName));
    }
  });

  return messages;
};

// Utility function to flatten backend error messages (FastAPI/Pydantic errors)
const flattenBackendErrors = (errorDetail: any[]): string[] => {
  if (!Array.isArray(errorDetail)) return ["Unknown error"];
  return errorDetail.map((error) => {
    const fieldPath = error.loc.join(".");
    return `${fieldPath}: ${error.msg}`;
  });
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [stepValidation, setStepValidation] = useState({});
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [currentFormValues, setCurrentFormValues] = useState<any>({});
  const totalSteps = 7;

  const formRef = useRef<{ submit: (callback?: (data?: any) => void) => void; getValues: () => any }>(null);

  const { updateFormData, clearFormData } = useFormPersistence(formData, setFormData);

  const { toast } = useToast();

  const handleFormValuesChange = useCallback((values: any) => {
    setCurrentFormValues(values);
  }, []);

  useEffect(() => {
    console.log("Current formData:", formData);
    console.log("Current formValues:", currentFormValues);
  }, [formData, currentFormValues]);

  const handleStepValidation = useCallback(
    (isValid) => {
      setStepValidation((prev) => {
        if (prev[currentStep] !== isValid) {
          console.log(`Step ${currentStep} validation: ${isValid}`);
          return { ...prev, [currentStep]: isValid };
        }
        return prev;
      });
    },
    [currentStep],
  );

  const validateStepData = useCallback((stepNumber, stepData) => {
    if (!stepData) return false;

    const requiredFields = {
      1: ["title", "challenge_type", "problem_statement", "goals"],
      2: ["participant_type", "geographic_filter", "language"],
      3: ["submission_formats", "submission_documentation", "submission_instructions"],
      4: ["prize_model", "budget"],
      5: ["start_date", "end_date"],
      6: ["evaluation_model", "reviewers", "evaluation_criteria"],
      7: ["notification_preferences", "notification_methods", "access_level"],
    }[stepNumber] || [];

    const missingFields = requiredFields.filter((field) => {
      if (Array.isArray(stepData[field])) {
        return !stepData[field] || stepData[field].length === 0;
      }
      return !stepData[field] || String(stepData[field]).trim() === "";
    });

    return missingFields.length === 0;
  }, []);

  const validateAllSteps = useCallback(() => {
    const invalidSteps = [];

    for (let step = 1; step <= totalSteps; step++) {
      const stepData = formData[`step${step}`];
      if (!validateStepData(step, stepData)) {
        invalidSteps.push(step);
      }
    }

    return {
      isValid: invalidSteps.length === 0,
      invalidSteps,
    };
  }, [formData, validateStepData, totalSteps]);

  const handleNext = async () => {
    if (formRef.current) {
      formRef.current.submit(async (result) => {
        console.log("Form submission result:", result);
        if (!result || (result && result.errors)) {
          const errors = result?.errors || {};
          const errorMessages = flattenErrors(errors);
          toast({
            title: "Validation Error",
            description: errorMessages.length
              ? `Please fix the following: ${errorMessages.join("; ")}`
              : "Please complete all required fields before proceeding.",
            variant: "destructive",
          });
          return;
        }

        const submittedData = result as any;
        console.log("Submitted data for step", currentStep, ":", submittedData);

        const updatedFormData = {
          ...formData,
          [`step${currentStep}`]: submittedData,
        };

        updateFormData(updatedFormData);

        if (currentStep < totalSteps) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsReviewMode(true);
        }
      });
    }
  };

  const handlePrevious = () => {
    if (isReviewMode) {
      setIsReviewMode(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    setIsReviewMode(false);
  };

  const handleSubmit = async () => {
    const { isValid, invalidSteps } = validateAllSteps();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: `Please complete all required fields in steps: ${invalidSteps.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setFormSubmitted(true);

      const payload = Object.keys(formData).reduce((acc, key) => {
        const stepData = formData[key];
        if (stepData && typeof stepData === "object") {
          return { ...acc, ...stepData };
        }
        return acc;
      }, {});

      console.log("Final submission payload (before formatting):", payload);

      if (payload.start_date) {
        payload.start_date = new Date(payload.start_date).toISOString();
      }
      if (payload.end_date) {
        payload.end_date = new Date(payload.end_date).toISOString();
      }
      if (payload.milestones) {
        payload.milestones = payload.milestones.map((milestone: any) => ({
          ...milestone,
          date: milestone.date ? new Date(milestone.date).toISOString() : null,
        }));
      }

      console.log("Final submission payload (after formatting):", payload);

      if (challengeId) {
        await updateChallenge(challengeId, payload);
        toast({
          title: "Challenge Updated",
          description: "Your challenge has been updated.",
          variant: "success",
        });
      } else {
        const newChallenge = await createChallenge(payload);
        setChallengeId(newChallenge.id);
        toast({
          title: "Challenge Created",
          description: "Your challenge has been created.",
          variant: "success",
        });
      }

      clearFormData();
      setFormSubmitted(false);
      setCurrentStep(1);
      setIsReviewMode(false);
      setChallengeId(null);
      toast({
        title: "Challenge Submitted",
        description: "Your challenge has been successfully submitted.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error submitting challenge:", error);
      setFormSubmitted(false);
      let errorMessages: string[] = [];
      if (error.response?.data?.detail) {
        errorMessages = flattenBackendErrors(error.response.data.detail);
      } else {
        errorMessages = [error.message || "An unexpected error occurred while submitting the challenge"];
      }
      toast({
        title: "Error",
        description: errorMessages.length
          ? `Submission failed: ${errorMessages.join("; ")}`
          : "An unexpected error occurred while submitting the challenge.",
        variant: "destructive",
      });
    }
  };

  const progressPercentage = isReviewMode ? 100 : (currentStep / totalSteps) * 100;

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
            <AIAssistant
              currentStep={currentStep}
              formData={{
                title: formData.step1?.title || "",
                problem_statement: formData.step1?.problem_statement || "",
                goals: formData.step1?.goals || "",
                challenge_type: formData.step1?.challenge_type || "",
                participant_type: formData.step2?.participant_type || "",
                geographic_filter: formData.step2?.geographic_filter || "",
                language: formData.step2?.language || "",
                team_participation: formData.step2?.team_participation || false,
                enable_forums: formData.step2?.enable_forums || false,
                submission_formats: formData.step3?.submission_formats || [],
                submission_documentation: formData.step3?.submission_documentation || [],
                submission_instructions: formData.step3?.submission_instructions || "",
                prize_model: formData.step4?.prize_model || "",
                first_prize: formData.step4?.first_prize || 0,
                second_prize: formData.step4?.second_prize || 0,
                third_prize: formData.step4?.third_prize || 0,
                honorable_mentions: formData.step4?.honorable_mentions || 0,
                budget: formData.step4?.budget || 0,
                non_monetary_rewards: formData.step4?.non_monetary_rewards || "",
                start_date: formData.step5?.start_date || null,
                end_date: formData.step5?.end_date || null,
                milestones: formData.step5?.milestones || [],
                timeline_notes: formData.step5?.timeline_notes || "",
                evaluation_model: formData.step6?.evaluation_model || "",
                reviewers: formData.step6?.reviewers || [],
                evaluation_criteria: formData.step6?.evaluation_criteria || [],
                anonymized_review: formData.step6?.anonymized_review || false,
                notification_preferences: formData.step7?.notification_preferences || [],
                notification_methods: formData.step7?.notification_methods || [],
                announcement_template: formData.step7?.announcement_template || "",
                access_level: formData.step7?.access_level || [],
                success_metrics: formData.step7?.success_metrics || "",
              }}
              currentFormValues={currentFormValues}
              onRequestSupport={() => setShowSupportModal(true)}
            />
          </div>
        </div>
      </main>

      {showSupportModal && <SupportModal challengeId={challengeId} onClose={() => setShowSupportModal(false)} />}
    </div>
  );
}