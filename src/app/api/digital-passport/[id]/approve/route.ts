import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/database/supabase";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: passportId } = await context.params;

  if (!passportId) {
    return NextResponse.json({ error: "Invalid passport ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { approved_by, approval_type, notes } = body;

    // approval_type: 'quality' | 'transfer' | 'verification'

    // 1. Fetch passport
    const { data: passport, error } = await supabase
      .from("material_passports")
      .select("*")
      .eq("id", passportId)
      .single();

    if (error || !passport) {
      return NextResponse.json(
        { error: "Passport not found" },
        { status: 404 },
      );
    }

    // 2. Create approval event
    const eventData: any = {
      passport_id: passportId,
      event_type: "human_approval",
      description: `${approval_type} approved by ${approved_by}`,
      metadata: {
        approval_type,
        approved_by,
        notes,
        timestamp: new Date().toISOString(),
      },
    };

    const { error: eventError } = await supabase
      .from("passport_events")
      .insert(eventData);

    if (eventError) {
      throw new Error(`Failed to record approval: ${eventError.message}`);
    }

    return NextResponse.json({
      success: true,
      passport_id: passportId,
      approval: {
        type: approval_type,
        approved_by,
        approved_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { error: error.message || "Approval failed" },
      { status: 500 },
    );
  }
}
