import { NextRequest, NextResponse } from "next/server";
import {
  submitVerification,
  getVerificationHistory,
} from "@/lib/passport/verification-service";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: passportId } = await context.params;
    const body = await request.json();

    const result = await submitVerification(passportId, {
      method: body.method,
      verified_by: body.verified_by,
      findings: body.findings,
      evidence_documents: body.evidence_documents,
    });

    return NextResponse.json({
      success: true,
      verification: result,
    });
  } catch (error: any) {
    console.error("Verification submission error:", error);

    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: passportId } = await context.params;

    const history = await getVerificationHistory(passportId);

    return NextResponse.json({
      success: true,
      passport_id: passportId,
      verifications: history,
    });
  } catch (error: any) {
    console.error("Verification history error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch history" },
      { status: 500 },
    );
  }
}
