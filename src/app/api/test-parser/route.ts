import { NextResponse } from "next/server";
import { parseInvoiceText } from "@/lib/ai/invoice-parser";

export async function GET() {
  const fakeText = `
    Invoice #INV-12345
    Date: 2024-01-15
    ACME GmbH
    
    Steel 10 tons 800 €
    Aluminum 5 tons 2400 €
    
    Total: 16000 €
  `;

  const parsed = parseInvoiceText(fakeText);

  return NextResponse.json(parsed);
}
