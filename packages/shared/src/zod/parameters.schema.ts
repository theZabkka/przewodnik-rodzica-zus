import { z } from 'zod';

export const LegislativeParametersSchema = z.object({
  id: z.string().optional(),
  minimalWageGross: z.number().positive(),
  employeeContributionDeductionPercent: z.number().min(0).max(100),
  dailyDivisor: z.number().int().positive(),
  maxJdgMonthlyBaseGross: z.number().positive(),
  jdgDebtThresholdGross: z.number().min(0),
  funeralBenefitAmount: z.number().positive(),

  // Stawki procentowe
  maternityStandardRatePercent: z.number().min(0).max(100),
  parentalStandardRatePercent: z.number().min(0).max(100),
  unifiedApplicationRatePercent: z.number().min(0).max(100),
  dadReservedParentalRatePercent: z.number().min(0).max(100),
  sickLeavePregnancyRatePercent: z.number().min(0).max(100),
  careLeaveRatePercent: z.number().min(0).max(100),

  // Urlopy macierzyńskie (tygodnie)
  maternityWeeksSingle: z.number().int().positive(),
  maternityWeeksTwins: z.number().int().positive(),
  maternityWeeksTriplets: z.number().int().positive(),
  maternityWeeksQuadruplets: z.number().int().positive(),
  maternityWeeksQuintupletsPlus: z.number().int().positive(),
  maternityMomObligatoryWeeks: z.number().int().positive(),

  // Urlopy rodzicielskie (tygodnie)
  parentalWeeksSingle: z.number().int().positive(),
  parentalWeeksMultiple: z.number().int().positive(),
  parentalWeeksSingleLifeCertificate: z.number().int().positive(),
  parentalWeeksMultipleLifeCertificate: z.number().int().positive(),
  parentalNonTransferableWeeksPerParent: z.number().int().positive(),

  // Wcześniaki
  supplementaryPre28OrWeightUnder1000MaxWeeks: z.number().int().positive(),
  supplementaryBetween28And37WeightOver1000MaxWeeks: z.number().int().positive(),
  supplementaryPost37HospitalizedMaxWeeks: z.number().int().positive(),

  // Ojcowski
  paternityWeeks: z.number().int().positive(),
  paternityMaxChildAgeMonths: z.number().int().positive(),

  // Okresy wyczekiwania (dni)
  waitingPeriodEmploymentDays: z.number().int().min(0),
  waitingPeriodMandateOrB2bDays: z.number().int().min(0),

  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const AuditConfigLogSchema = z.object({
  parameterName: z.string().min(1),
  oldValue: z.union([z.number(), z.string()]),
  newValue: z.union([z.number(), z.string()]),
  reason: z.string().min(3, 'Wymagane jest podanie uzasadnienia zmiany parametru prawnego'),
  changedBy: z.string().default('admin_zus'),
});

export type LegislativeParametersValidated = z.infer<typeof LegislativeParametersSchema>;
export type AuditConfigLogValidated = z.infer<typeof AuditConfigLogSchema>;
