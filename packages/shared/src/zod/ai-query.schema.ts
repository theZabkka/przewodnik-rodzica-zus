import { z } from 'zod';

export const AIQueryInputSchema = z.object({
  question: z.string().min(3, 'Pytanie musi zawierać co najmniej 3 znaki').max(1000),
  userContext: z.object({
    contractType: z.enum(['employment', 'mandate', 'b2b']).optional(),
    parentRole: z.enum(['mother', 'father']).optional(),
    monthlySalaryGross: z.number().positive().optional(),
    currentStage: z.enum(['pregnancy', 'after_birth', 'parental_leave', 'returning_to_work']).optional(),
  }).optional(),
});

export const AIQueryOutputSchema = z.object({
  answerPlainLanguage: z.string().min(5),
  legalBasisCitations: z.array(z.string()),
  recommendedSteps: z.array(z.string()),
  relevantFormCode: z.string().optional(),
  warningAlert: z.string().optional(),
});

export type AIQueryInputValidated = z.infer<typeof AIQueryInputSchema>;
export type AIQueryOutputValidated = z.infer<typeof AIQueryOutputSchema>;
