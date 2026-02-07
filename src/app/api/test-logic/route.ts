import { NextResponse } from "next/server";
import {
  buildMaterialInsertRows,
  buildWasteInsertRows,
  calculateMaterialFlowTotals,
  getPeriodStart,
} from "@/lib/calculations/material-flow";

import type { IdentifiedMaterial } from "@/types/material";

export async function GET() {
  // 1️⃣ Fake company ID
  const companyId = "test-company-123";

  // 2️⃣ Simulated materials (like parser output)
  const identifiedMaterials: IdentifiedMaterial[] = [
    {
      material_type: "Steel",
      category: "input",
      quantity: 100,
      unit: "tons",
      cost: 80000,
      confidence: 0.9,
      source: "Test Invoice",
    },
    {
      material_type: "Steel Scrap",
      category: "waste",
      quantity: 20,
      unit: "tons",
      cost: 0,
      confidence: 0.8,
      source: "Test Invoice",
    },
  ];

  // 3️⃣ Get current month start
  const periodStart = getPeriodStart();

  // 4️⃣ Build material rows (simulate DB insert shape)
  const materialRows = buildMaterialInsertRows(
    companyId,
    identifiedMaterials,
    periodStart,
  );

  // ⚠️ Simulate inserted materials (add fake IDs)
  const simulatedInserted = materialRows.map((m, index) => ({
    ...m,
    id: `mat-${index}`,
    created_at: new Date().toISOString(),
  }));

  // 5️⃣ Build waste rows
  const wasteRows = buildWasteInsertRows(companyId, simulatedInserted as any);

  // ⚠️ Simulate waste insert shape
  const simulatedWaste = wasteRows.map((w, index) => ({
    ...w,
    id: `waste-${index}`,
    created_at: new Date().toISOString(),
  }));

  // 6️⃣ Calculate totals
  const totals = calculateMaterialFlowTotals(
    simulatedInserted as any,
    simulatedWaste as any,
  );

  return NextResponse.json({
    period: periodStart,
    materials: simulatedInserted,
    waste: simulatedWaste,
    totals,
  });
}
