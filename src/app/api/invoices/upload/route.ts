import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/database/supabase";
import type { IdentifiedMaterial, ParsedInvoiceData } from "@/types/material";

type UploadRequest = {
  company_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  extracted_text?: string;
  parsed_data?: ParsedInvoiceData;
  materials_identified?: IdentifiedMaterial[];
};

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = (await req.json()) as UploadRequest;

  if (!body.company_id || !body.file_url || !body.file_name || !body.file_type) {
    return NextResponse.json(
      { error: "company_id, file_url, file_name, and file_type are required." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      company_id: body.company_id,
      file_url: body.file_url,
      file_name: body.file_name,
      file_size: body.file_size || 0,
      file_type: body.file_type,
      status: "uploaded",
      extracted_text: body.extracted_text || null,
      parsed_data: body.parsed_data || null,
      materials_identified: body.materials_identified || null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ invoice: data }, { status: 201 });
}
