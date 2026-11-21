import { z } from 'zod';

export const BenefitCalculationInputSchema = z.object({
  parentRole: z.enum(['mother', 'father'], {
    required_error: 'Rola rodzica jest wymagana (mother lub father)'
  }),
  contractType: z.enum(['employment', 'mandate', 'b2b'], {
    required_error: 'Forma zatrudnienia jest wymagana (employment, mandate, b2b)'
  }),
  monthlyBaseGross: z.number().positive('Podstawa wymiaru brutto musi być większa od 0'),
  childrenCount: z.number().int().min(1, 'Liczba dzieci musi wynosić co najmniej 1').max(10, 'Maksymalnie 10 dzieci'),
  hasLifeCertificate: z.boolean().default(false),
  submissionWithin21Days: z.boolean().default(true),

  // Wcześniactwo i hospitalizacja
  isPrematureOrHospitalized: z.boolean().default(false),
  birthWeek: z.number().int().min(20).max(43).optional(),
  birthWeightGrams: z.number().int().min(300).max(6000).optional(),
  hospitalDaysTotal: z.number().int().min(0).max(365).optional(),
  hospitalizationConsecutiveMin2DaysBetweenDay5And28: z.boolean().optional(),

  // Łączenie z pracą na rodzicielskim
  workPartTimeDuringParental: z.boolean().default(false),
  workFteRatio: z.number().min(0.01).max(0.5, 'Maksymalny dopuszczalny wymiar etatu to 0.5 (1/2 etatu)').optional(),
  workWeeks: z.number().int().min(1).max(82).optional(),

  // Urlop ojcowski
  includePaternityLeave: z.boolean().default(false),

  // Zasiłek opiekuńczy
  careLeaveDaysRequested: z.number().int().min(0).max(60).optional(),
  careSubjectAge: z.number().int().min(0).max(100).optional(),
  careSubjectIsDisabled: z.boolean().optional(),
});

export type BenefitCalculationInputValidated = z.infer<typeof BenefitCalculationInputSchema>;
