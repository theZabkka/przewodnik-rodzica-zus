import { z } from 'zod';

export const ZusTestCaseSchema = z.object({
  id: z.string(),
  caseNumber: z.string(),
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['standard', 'premature', 'part_time', 'jdg_debt', 'parents_split', 'life_certificate', 'bereavement']),
  pdfFileName: z.string().optional(),
  pdfUrl: z.string().url().optional(),
  contractType: z.enum(['employment', 'mandate', 'b2b']),
  monthlySalaryGross: z.number().positive(),
  childrenCount: z.number().int().min(1),
  hasLifeCertificate: z.boolean(),
  submissionWithin21Days: z.boolean(),
  isPrematureOrHospitalized: z.boolean(),
  birthWeek: z.number().int().optional(),
  birthWeightGrams: z.number().int().optional(),
  hospitalDaysTotal: z.number().int().optional(),
  workPartTimeDuringParental: z.boolean(),
  workFteRatio: z.number().optional(),
  hasDebtExceedingThreshold: z.boolean().optional(),
  expectedResult: z.object({
    insuranceVerified: z.boolean(),
    totalWeeksGranted: z.number().int().min(0),
    benefitRateDescription: z.string(),
    keyVerdictNote: z.string(),
  }),
});

export const DocumentExtractionSchema = z.object({
  pesel: z.string().length(11).regex(/^\d+$/).optional(),
  fullName: z.string().optional(),
  documentType: z.enum(['ZAM', 'Z-3', 'Z-3a', 'e-ZLA', 'USC_BIRTH_CERTIFICATE']),
  detectedGrossIncome: z.number().optional(),
  employmentContractType: z.enum(['employment', 'mandate', 'b2b']).optional(),
  birthDate: z.string().optional(),
  recognizedSickCodeB: z.boolean().optional(),
  isDebtReported: z.boolean().optional(),
  debtAmount: z.number().optional(),
});

export type ZusTestCaseValidated = z.infer<typeof ZusTestCaseSchema>;
export type DocumentExtractionValidated = z.infer<typeof DocumentExtractionSchema>;
