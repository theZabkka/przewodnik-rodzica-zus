import { describe, it, expect } from 'vitest';
import {
  evaluateApplicationForInspector,
  generateAdministrativeDecision,
  generateZ3Certificate,
  calculateWorkSharingSchedule,
  InspectorCase,
} from '../index';

describe('ZUS Inspector & Risk Engine (2026)', () => {
  it('detects JDG debt > 48.06 zł and blocks payout under Art. 2a', () => {
    const result = evaluateApplicationForInspector({
      contractType: 'b2b',
      hasDebt: true,
      debtAmount: 350.0,
      monthlySalaryGross: 10000,
      daysSinceBirth: 10,
    });

    expect(result.riskLevel).toBe('RED');
    expect(result.riskCategory).toBe('JDG_DEBT_BLOCK');
    expect(result.suggestedDecision).toBe('BLOCK_PAYOUT_DEBT');
    expect(result.autoApprovable).toBe(false);
    expect(result.legalBases.some((b) => b.includes('Art. 2a'))).toBe(true);
  });

  it('detects short tenure and high salary as suspect contract (art. 83 KC)', () => {
    const result = evaluateApplicationForInspector({
      contractType: 'employment',
      monthlySalaryGross: 18500,
      insuranceTenureDays: 42,
      daysSinceBirth: 5,
    });

    expect(result.riskLevel).toBe('RED');
    expect(result.riskCategory).toBe('SUSPECT_CONTRACT');
    expect(result.suggestedDecision).toBe('SEND_TO_AUDIT_DEPT');
    expect(result.autoApprovable).toBe(false);
    expect(result.legalBases.some((b) => b.includes('Art. 83'))).toBe(true);
  });

  it('detects late submission (> 21 days) and forces 100/70% split under Art. 30a', () => {
    const result = evaluateApplicationForInspector({
      contractType: 'employment',
      benefitType: 'MATERNITY_PARENTAL_UNIFIED',
      monthlySalaryGross: 7000,
      daysSinceBirth: 25,
      insuranceTenureDays: 300,
    });

    expect(result.riskLevel).toBe('YELLOW');
    expect(result.riskCategory).toBe('LATE_SUBMISSION');
    expect(result.suggestedDecision).toBe('CORRECT_TO_100_70');
    expect(result.autoApprovable).toBe(false);
  });

  it('detects premature birth / hospitalization requiring hospital audit under Art. 180² KP', () => {
    const result = evaluateApplicationForInspector({
      contractType: 'employment',
      isPremature: true,
      hospitalDays: 30,
      birthWeek: 31,
      daysSinceBirth: 15,
      insuranceTenureDays: 365,
    });

    expect(result.riskLevel).toBe('YELLOW');
    expect(result.riskCategory).toBe('PREMATURE_AUDIT');
    expect(result.suggestedDecision).toBe('AUDIT_HOSPITAL_DOCS');
    expect(result.legalBases.some((b) => b.includes('180²'))).toBe(true);
  });

  it('auto-approves clean, timely applications in Fast-Track mode', () => {
    const result = evaluateApplicationForInspector({
      contractType: 'employment',
      benefitType: 'MATERNITY_PARENTAL_UNIFIED',
      monthlySalaryGross: 6500,
      daysSinceBirth: 5,
      insuranceTenureDays: 365,
      hasDebt: false,
    });

    expect(result.riskLevel).toBe('GREEN');
    expect(result.riskCategory).toBe('FAST_TRACK');
    expect(result.suggestedDecision).toBe('AUTO_APPROVE_81_5');
    expect(result.autoApprovable).toBe(true);
  });
});

describe('ZUS Decision Generator', () => {
  const mockCase: InspectorCase = {
    id: 'test-1',
    caseNumber: 'ZUS/2026/ZAM/04812',
    submissionDate: '2026-11-20',
    applicantName: 'Anna Kowalska',
    pesel: '92041203456',
    benefitType: 'MATERNITY_PARENTAL_UNIFIED',
    contractType: 'employment',
    monthlySalaryGross: 7000,
    childBirthDate: '2026-11-15',
    daysSinceBirth: 5,
    isPremature: false,
    employerNip: '5260250995',
    employerName: 'PolTech Sp. z o.o.',
    isEmployerOver20: true,
    hasDebt: false,
    insuranceTenureDays: 450,
    riskLevel: 'GREEN',
    riskCategory: 'FAST_TRACK',
    riskReasons: ['Kompletny wniosek'],
    suggestedDecision: 'AUTO_APPROVE_81_5',
    status: 'APPROVED',
    upoHash: 'SHA256:test',
  };

  it('generates both formal legal decision and plain language explanation', () => {
    const decision = generateAdministrativeDecision(mockCase, 'mgr Jan Kowalski');
    expect(decision.formalText).toContain('DECYZJA O PRZYZNANIU ZASIŁKU MACIERZYŃSKIEGO');
    expect(decision.formalText).toContain('81,5%');
    expect(decision.plainLanguageText).toContain('Świetna wiadomość');
    expect(decision.plainLanguageText).toContain('81,5%');
    expect(decision.signature).toContain('mgr Jan Kowalski');
  });

  it('generates debt suspension decision when debt block is present', () => {
    const debtCase: InspectorCase = {
      ...mockCase,
      hasDebt: true,
      debtAmount: 420.0,
      riskLevel: 'RED',
      riskCategory: 'JDG_DEBT_BLOCK',
      status: 'BLOCKED',
    };
    const decision = generateAdministrativeDecision(debtCase);
    expect(decision.formalText).toContain('DECYZJA O WSTRZYMANIU WYPŁATY');
    expect(decision.formalText.toLowerCase()).toContain('art. 2a');
    expect(decision.plainLanguageText).toContain('wypłata jest wstrzymana');
  });
});

describe('Employer Z-3 & Work Sharing (Art. 182¹ᶠ KP)', () => {
  it('correctly calculates 12-month Z-3 salary table with 13.71% employee deduction', () => {
    const cert = generateZ3Certificate(
      'PolTech Sp. z o.o.',
      '5260250995',
      'Anna Kowalska',
      '92041203456',
      10000
    );

    expect(cert.months.length).toBe(12);
    expect(cert.averageMonthlyGross).toBe(10000);
    // 10000 * (1 - 0.1371) = 8629.00
    expect(cert.averageMonthlyBase).toBe(8629.0);
    // 8629 / 30 = 287.63
    expect(cert.dailyBenefitBase).toBe(287.63);
  });

  it('calculates work-sharing schedule: 16 weeks on 1/2 FTE extends leave by 8 weeks', () => {
    const schedule = calculateWorkSharingSchedule(
      'Janek Kowalski',
      'Anna Kowalska',
      32,
      0.5,
      16,
      6000
    );

    expect(schedule.extensionWeeksCount).toBe(8);
    expect(schedule.totalParentalWeeksAfterExtension).toBe(40);
    expect(schedule.weeklySalaryAmount).toBeGreaterThan(0);
    expect(schedule.weeklyBenefitAmount).toBeGreaterThan(0);
  });
});