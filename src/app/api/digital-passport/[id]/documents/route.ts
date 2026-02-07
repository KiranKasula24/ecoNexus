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
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("document_type") as string;
    const uploadedBy = formData.get("uploaded_by") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Verify passport exists
    const { data: passport, error: passportError } = await supabase
      .from("material_passports")
      .select("id")
      .eq("id", passportId)
      .single();

    if (passportError || !passport) {
      return NextResponse.json(
        { error: "Passport not found" },
        { status: 404 },
      );
    }

    // 2. Upload file to Supabase Storage
    const fileName = `${passportId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("passport-documents")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    // 3. Get public URL
    const { data: urlData } = supabase.storage
      .from("passport-documents")
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;

    // 4. Create document record
    const documentData: any = {
      passport_id: passportId,
      document_type: documentType || "certification",
      file_url: fileUrl,
      uploaded_by: uploadedBy,
      verification_status: "pending",
    };

    const { data: document, error: documentError } = await (
      supabase.from("passport_documents") as any
    )
      .insert(documentData)
      .select()
      .single();

    if (documentError) {
      throw new Error(
        `Document record creation failed: ${documentError.message}`,
      );
    }

    // 5. Create passport event
    const eventData: any = {
      passport_id: passportId,
      event_type: "document_uploaded",
      description: `Document uploaded: ${documentType}`,
      metadata: {
        document_id: document.id,
        document_type: documentType,
        file_name: file.name,
      },
    };

    await supabase.from("passport_events").insert(eventData);

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        passport_id: passportId,
        document_type: documentType,
        file_url: fileUrl,
        verification_status: "pending",
      },
    });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: error.message || "Document upload failed" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: passportId } = await context.params;

  try {
    const { data: documents, error } = await supabase
      .from("passport_documents")
      .select("*")
      .eq("passport_id", passportId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      passport_id: passportId,
      documents: documents || [],
    });
  } catch (error: any) {
    console.error("Document fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch documents" },
      { status: 500 },
    );
  }
}
