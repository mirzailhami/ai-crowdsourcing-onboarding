"use client";

import { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { getSchemaForStep, defaultValues } from "@/lib/onboarding-schemas";
import { Step1Form } from "./onboarding-steps/step1";
import { Step2Form } from "./onboarding-steps/step2";
import { Step3Form } from "./onboarding-steps/step3";
import { Step4Form } from "./onboarding-steps/step4";
import { Step5Form } from "./onboarding-steps/step5";
import { Step6Form } from "./onboarding-steps/step6";
import { Step7Form } from "./onboarding-steps/step7";

interface OnboardingStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepValidation: (isValid: boolean) => void;
  onFormValuesChange: (values: any) => void;
  formData: any;
  updateFormData: (data: any) => void;
}

export const OnboardingSteps = forwardRef(
  ({ currentStep, onStepChange, onStepValidation, onFormValuesChange, formData, updateFormData }: OnboardingStepsProps, ref) => {
    const initialRenderRef = useRef(true);
    const prevStepRef = useRef(currentStep);
    const isSubmittingRef = useRef(false); // Guard against multiple submissions

    const schema = getSchemaForStep(currentStep);
    const stepDefaultValues = defaultValues[`step${currentStep}`];
    const existingStepData = formData[`step${currentStep}`] || {};
    const mergedValues = { ...stepDefaultValues, ...existingStepData };

    if (currentStep === 5 && mergedValues.milestones) {
      mergedValues.milestones = mergedValues.milestones.map((milestone: any) => ({
        ...milestone,
        date: milestone.date ? new Date(milestone.date) : undefined,
      }));
    }

    const form = useForm({
      resolver: zodResolver(schema),
      mode: "onSubmit",
      defaultValues: mergedValues,
    });

    const { formState, trigger, reset, getValues, watch, setError } = form;
    const { isValid, errors } = formState;

    useEffect(() => {
      const subscription = watch((values) => {
        console.log(`Form values changed for step ${currentStep}:`, values);
        onFormValuesChange(values);
      });
      return () => subscription.unsubscribe();
    }, [watch, currentStep, onFormValuesChange]);

    useEffect(() => {
      if (!initialRenderRef.current) {
        console.log(`Step ${currentStep} - isValid:`, isValid);
        // Log errors safely by filtering out circular references
        console.log(
          `Step ${currentStep} - Errors:`,
          Object.fromEntries(
            Object.entries(errors).map(([key, value]) => [
              key,
              value && typeof value === "object" ? { message: value.message } : value,
            ]),
          ),
        );
        onStepValidation(isValid);
      }
    }, [isValid, currentStep, errors, onStepValidation]);

    useEffect(() => {
      const stepChanged = prevStepRef.current !== currentStep;
      prevStepRef.current = currentStep;

      if (initialRenderRef.current || stepChanged) {
        const stepData = formData[`step${currentStep}`];
        console.log(`Step ${currentStep} - Loading Form Data:`, stepData);

        const resetData = { ...stepDefaultValues, ...stepData };

        if (currentStep === 5 && resetData.milestones) {
          resetData.milestones = resetData.milestones.map((milestone: any) => ({
            ...milestone,
            date: milestone.date ? new Date(milestone.date) : undefined,
          }));
        }

        if (currentStep === 3) {
          resetData.submission_formats = resetData.submission_formats || [];
          resetData.submission_documentation = resetData.submission_documentation || [];
        } else if (currentStep === 6) {
          resetData.reviewers = resetData.reviewers || [];
          resetData.evaluation_criteria = resetData.evaluation_criteria || [];
        } else if (currentStep === 7) {
          resetData.notification_preferences = resetData.notification_preferences || [];
          resetData.notification_methods = resetData.notification_methods || [];
          resetData.access_level = resetData.access_level || [];
        }

        reset(resetData);
        initialRenderRef.current = false;

        if (stepData && Object.keys(stepData).length > 0) {
          setTimeout(() => {
            trigger().then((isValid) => {
              console.log(`Initial validation for step ${currentStep}: ${isValid}`);
              onStepValidation(isValid);
            });
          }, 100);
        }
      }
    }, [currentStep, formData, reset, trigger, onStepValidation, stepDefaultValues]);

    const onSubmit = (data: any) => {
      console.log("Form data for step", currentStep, ":", data);

      const updatedFormData = {
        ...formData,
        [`step${currentStep}`]: data,
      };

      updateFormData(updatedFormData);
    };

    useImperativeHandle(ref, () => ({
      submit: async (callback?: (data?: any) => void) => {
        if (isSubmittingRef.current) return; // Prevent multiple submissions
        isSubmittingRef.current = true;

        try {
          console.log(`Submitting Step ${currentStep}...`);
          const isValid = await trigger();
          console.log(`Validation result for step ${currentStep}: ${isValid}`);

          if (isValid) {
            const data = getValues();
            console.log(`Form data for step ${currentStep}:`, data);
            onSubmit(data);
            if (callback) callback(data);
          } else {
            // Log errors safely by filtering out circular references
            const safeErrors = Object.fromEntries(
              Object.entries(errors).map(([key, value]) => [
                key,
                value && typeof value === "object" ? { message: value.message } : value,
              ]),
            );
            console.log(`Submission Errors for Step ${currentStep}:`, safeErrors);
            if (callback) callback({ errors: safeErrors });
          }
        } finally {
          isSubmittingRef.current = false; // Reset submission guard
        }
      },
      getValues: () => {
        const values = getValues();
        console.log(`Getting form values for step ${currentStep}:`, values);
        return values;
      },
    }));

    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return <Step1Form form={form} />;
        case 2:
          return <Step2Form form={form} />;
        case 3:
          return <Step3Form form={form} />;
        case 4:
          return <Step4Form form={form} />;
        case 5:
          return <Step5Form form={form} />;
        case 6:
          return <Step6Form form={form} />;
        case 7:
          return <Step7Form form={form} />;
        default:
          return <Step1Form form={form} />;
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>{renderStep()}</form>
      </Form>
    );
  },
);

OnboardingSteps.displayName = "OnboardingSteps";