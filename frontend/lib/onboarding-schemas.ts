import * as z from "zod"

export const step1Schema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  problem_statement: z.string().min(20, { message: "Problem statement must be at least 20 characters" }),
  goals: z.string().min(10, { message: "Goals must be at least 10 characters" }),
  challenge_type: z.string().min(1, { message: "Please select a challenge type" }),
})

export const step2Schema = z.object({
  participant_type: z.string().min(1, { message: "Please select a participant type" }),
  geographic_filter: z.string().min(1, { message: "Please select a geographic filter" }),
  language: z.string().min(1, { message: "Please select a language" }),
  team_participation: z.boolean().optional(),
  enable_forums: z.boolean().optional(),
})

export const step3Schema = z.object({
  submission_formats: z.array(z.string()).min(1, { message: "At least one submission format is required" }),
  submission_documentation: z
    .array(z.string())
    .min(1, { message: "At least one documentation requirement is required" }),
  submission_instructions: z.string().min(10, { message: "Instructions must be at least 10 characters" }),
})

export const step4Schema = z.object({
  prize_model: z.string().min(1, { message: "Please select a prize model" }),
  first_prize: z.number().min(0, { message: "First prize must be a positive number" }).optional(),
  second_prize: z.number().min(0, { message: "Second prize must be a positive number" }).optional(),
  third_prize: z.number().min(0, { message: "Third prize must be a positive number" }).optional(),
  honorable_mentions: z.number().min(0, { message: "Honorable mentions must be a positive number" }).optional(),
  budget: z.number().min(0, { message: "Total budget must be a positive number" }),
  non_monetary_rewards: z.string().optional(),
})

export const step5Schema = z
  .object({
    start_date: z.date({ required_error: "Start date is required" }),
    end_date: z
      .date({ required_error: "End date is required" })
      .refine((date) => date > new Date(), { message: "End date must be in the future" }),
    milestones: z.array(
      z.object({
        enabled: z.boolean(),
        name: z.string(),
        date: z.date().optional(),
      }),
    ),
    timeline_notes: z.string().optional(),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  })

export const step6Schema = z.object({
  evaluation_model: z.string().min(1, { message: "Please select an evaluation model" }),
  reviewers: z.array(z.string()).min(1, { message: "At least one reviewer role is required" }),
  evaluation_criteria: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Criterion name is required" }),
        weight: z.string().min(1, { message: "Weight is required" }),
        description: z.string().min(1, { message: "Description is required" }),
      }),
    )
    .min(1, { message: "At least one evaluation criterion is required" }),
  anonymized_review: z.boolean().optional(),
})

export const step7Schema = z.object({
  notification_preferences: z.array(z.string()).min(1, { message: "At least one notification preference is required" }),
  notification_methods: z.array(z.string()).min(1, { message: "At least one notification method is required" }),
  announcement_template: z.string().min(10, { message: "Template must be at least 10 characters" }).optional(),
  access_level: z.array(z.string()).min(1, { message: "At least one access role is required" }),
  success_metrics: z.string().min(10, { message: "Success metrics must be at least 10 characters" }).optional(),
})

export const defaultValues = {
  step1: {
    title: "",
    problem_statement: "",
    goals: "",
    challenge_type: "",
  },
  step2: {
    participant_type: "",
    geographic_filter: "",
    language: "",
    team_participation: false,
    enable_forums: true,
  },
  step3: {
    submission_formats: [],
    submission_documentation: [],
    submission_instructions: "",
  },
  step4: {
    prize_model: "tiered",
    first_prize: undefined,
    second_prize: undefined,
    third_prize: undefined,
    honorable_mentions: undefined,
    budget: undefined,
    non_monetary_rewards: "",
  },
  step5: {
    start_date: undefined,
    end_date: undefined,
    milestones: [
      { enabled: false, name: "Registration Close", date: undefined },
      { enabled: false, name: "Prototype Review", date: undefined },
      { enabled: false, name: "Final Submission", date: undefined },
      { enabled: false, name: "Winner Announcement", date: undefined },
    ],
    timeline_notes: "",
  },
  step6: {
    evaluation_model: "post",
    reviewers: [],
    evaluation_criteria: [
      { name: "Innovation & Creativity", weight: "", description: "" },
      { name: "Technical Feasibility", weight: "", description: "" },
      { name: "Potential Impact", weight: "", description: "" },
      { name: "Presentation & Documentation", weight: "", description: "" },
    ],
    anonymized_review: false,
  },
  step7: {
    notification_preferences: [],
    notification_methods: [],
    announcement_template: "",
    access_level: [],
    success_metrics: "",
  },
}

export const getSchemaForStep = (step: number) => {
  switch (step) {
    case 1:
      return step1Schema
    case 2:
      return step2Schema
    case 3:
      return step3Schema
    case 4:
      return step4Schema
    case 5:
      return step5Schema
    case 6:
      return step6Schema
    case 7:
      return step7Schema
    default:
      return step1Schema
  }
}
