import { NextResponse } from "next/server";
import { DEFAULT_LEGISLATIVE_2026 } from "@hacknation/shared";

export async function GET() {
  return NextResponse.json({
    ok: true,
    legalState: "2026-04-01",
    source: "Ustawa zasiłkowa (Dz.U. z 2026 r. poz. 854) & Kodeks pracy (Dz.U. z 2026 r. poz. 1245)",
    parameters: DEFAULT_LEGISLATIVE_2026,
  });
}
