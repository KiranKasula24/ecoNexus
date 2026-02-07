import { NextResponse } from "next/server";
import { supabase } from "@/lib/database/supabase";
import { createPassportFromWasteStream } from "@/lib/material-intelligence/passport-service";

export async function GET() {
  const { data: wasteStream } = await supabase
    .from("waste_streams")
    .select("*")
    .is("passport_id", null)
    .limit(1)
    .single();

  if (!wasteStream) {
    return NextResponse.json({ error: "No waste stream found" });
  }

  try {
    const passport = await createPassportFromWasteStream(wasteStream);

    return NextResponse.json({
      success: true,
      passport,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
    });
  }
}
