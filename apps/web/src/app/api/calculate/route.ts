import { NextRequest, NextResponse } from "next/server";
import {
  calculateParentalBenefits,
  DEFAULT_LEGISLATIVE_2026,
  type BenefitCalculationInput,
} from "@hacknation/shared";

export async function GET() {
  return NextResponse.json({
    service: "Zasiłkowy Przewodnik Przyszłego Rodzica — REST API",
    endpoint: "/api/calculate",
    method: "POST",
    legalState: "2026-04-01",
    engine: "deterministic-ts",
    examplePayload: {
      parentRole: "mother",
      contractType: "employment",
      monthlyBaseGross: 6500,
      childrenCount: 1,
      hasLifeCertificate: false,
      submissionWithin21Days: true,
      parenthoodType: "birth",
      isPrematureOrHospitalized: false,
      workPartTimeDuringParental: false,
      includePaternityLeave: true,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<BenefitCalculationInput>;

    const input: BenefitCalculationInput = {
      parentRole: body.parentRole ?? "mother",
      contractType: body.contractType ?? "employment",
      monthlyBaseGross: Number(body.monthlyBaseGross ?? 6500),
      childrenCount: Number(body.childrenCount ?? 1),
      hasLifeCertificate: Boolean(body.hasLifeCertificate ?? false),
      submissionWithin21Days: body.submissionWithin21Days ?? true,
      parenthoodType: body.parenthoodType ?? "birth",
      childAgeMonthsAtAdoption: body.childAgeMonthsAtAdoption,
      hasSchoolDeferral: body.hasSchoolDeferral,
      isPrematureOrHospitalized: Boolean(body.isPrematureOrHospitalized ?? false),
      birthWeek: body.birthWeek,
      birthWeightGrams: body.birthWeightGrams,
      hospitalDaysTotal: body.hospitalDaysTotal,
      hospitalizationConsecutiveMin2DaysBetweenDay5And28:
        body.hospitalizationConsecutiveMin2DaysBetweenDay5And28,
      workPartTimeDuringParental: Boolean(body.workPartTimeDuringParental ?? false),
      workFteRatio: body.workFteRatio,
      workWeeks: body.workWeeks,
      includePaternityLeave: body.includePaternityLeave ?? false,
      careLeaveDaysRequested: body.careLeaveDaysRequested,
      careSubjectAge: body.careSubjectAge,
      careSubjectIsDisabled: body.careSubjectIsDisabled,
    };

    const result = calculateParentalBenefits(input, DEFAULT_LEGISLATIVE_2026);

    return NextResponse.json({
      ok: true,
      legalState: "2026-04-01",
      input,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Nieprawidłowe dane wejściowe JSON dla kalkulatora świadczeń.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
