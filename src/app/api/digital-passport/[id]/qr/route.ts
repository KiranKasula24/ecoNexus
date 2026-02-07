import { NextRequest, NextResponse } from "next/server";
import {
  generatePassportQR,
  generatePassportQRSVG,
} from "@/lib/passport/qr-generator";
import { supabase } from "@/lib/database/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const passportId = params.id;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "png"; // png, svg

  try {
    // 1. Verify passport exists
    const { data: passport, error } = await supabase
      .from("material_passports")
      .select(
        "id, material_category, material_subtype, current_owner_company_id",
      )
      .eq("id", passportId)
      .single();

    if (error || !passport) {
      return NextResponse.json(
        { error: "Passport not found" },
        { status: 404 },
      );
    }

    // 2. Generate QR code
    if (format === "svg") {
      const qrSvg = await generatePassportQRSVG(passportId);
      return new NextResponse(qrSvg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `inline; filename="passport-${passportId}.svg"`,
        },
      });
    } else {
      // Return as data URL (for embedding in HTML/PDF)
      const qrDataUrl = await generatePassportQR(passportId);
      return NextResponse.json({
        success: true,
        qr_code: qrDataUrl,
        passport_id: passportId,
      });
    }
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}
