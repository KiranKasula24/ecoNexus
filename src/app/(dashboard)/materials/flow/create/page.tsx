"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface MaterialFlowFormData {
  // Basic Material Information
  materialName: string;
  materialCategory: string;
  materialSubtype: string;
  physicalForm: string;

  // Volume & Units
  monthlyVolume: number;
  unit: string;
  batchSize: number;

  // Quality & Composition
  qualityGrade: string;
  contaminationLevel: number;
  composition: Record<string, number>; // e.g., {"steel": 95, "impurities": 5}
  moistureContent: number;

  // Environmental Data
  carbonFootprint: number;
  waterUsage: number;
  energyConsumption: number;

  // Financial Data
  currentDisposalCost: number;
  marketValue: number;
  processingCost: number;

  // Operational Data
  storageLocation: string;
  storageCapacity: number;
  generationFrequency: string;

  // Waste Classification
  isHazardous: boolean;
  wasteCode: string;
  regulatoryClassification: string;

  // Additional Properties
  technicalProperties: Record<string, any>;
  certifications: string[];
  documents: File[];
}

export default function MaterialFlowFormPage() {
  const router = useRouter();
  const { company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<Partial<MaterialFlowFormData>>({
    materialCategory: "",
    materialSubtype: "",
    physicalForm: "",
    monthlyVolume: 0,
    unit: "tons",
    qualityGrade: "",
    contaminationLevel: 0,
    currentDisposalCost: 0,
    carbonFootprint: 0,
    isHazardous: false,
    certifications: [],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Submit material flow data
      const res = await fetch("/api/materials/flow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create material flow");
      }

      alert("Material flow created and passport generated successfully!");
      router.push(`/dashboard/passports/${data.passport.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const materialCategories = [
    "metal",
    "plastic",
    "paper",
    "glass",
    "textile",
    "electronic",
    "organic",
    "chemical",
  ];

  const physicalForms = [
    "solid",
    "liquid",
    "powder",
    "granular",
    "sheet",
    "scrap",
    "mixed",
  ];

  const units = ["tons", "kg", "liters", "cubic_meters", "pieces"];

  const qualityGrades = ["A", "B", "C", "D"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Material Flow Analysis
        </h1>
        <p className="mt-2 text-gray-600">
          Complete material information to generate a digital passport and
          calculate KPIs
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex items-center ${s < 4 ? "flex-1" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Basic Info</span>
          <span>Quality & Env</span>
          <span>Financial</span>
          <span>Review</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Material Information */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Basic Material Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Material Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.materialName || ""}
                  onChange={(e) => updateField("materialName", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Steel Scrap Grade A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Material Category *
                </label>
                <select
                  required
                  value={formData.materialCategory || ""}
                  onChange={(e) =>
                    updateField("materialCategory", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {materialCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Material Subtype
                </label>
                <input
                  type="text"
                  value={formData.materialSubtype || ""}
                  onChange={(e) =>
                    updateField("materialSubtype", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Stainless Steel 304"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Physical Form *
                </label>
                <select
                  required
                  value={formData.physicalForm || ""}
                  onChange={(e) => updateField("physicalForm", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select form</option>
                  {physicalForms.map((form) => (
                    <option key={form} value={form}>
                      {form.charAt(0).toUpperCase() + form.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Volume *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.monthlyVolume || ""}
                  onChange={(e) =>
                    updateField("monthlyVolume", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit *
                </label>
                <select
                  required
                  value={formData.unit || "tons"}
                  onChange={(e) => updateField("unit", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Batch Size
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.batchSize || ""}
                  onChange={(e) =>
                    updateField("batchSize", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Typical batch size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Generation Frequency
                </label>
                <select
                  value={formData.generationFrequency || ""}
                  onChange={(e) =>
                    updateField("generationFrequency", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="irregular">Irregular</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next: Quality & Environmental
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quality & Environmental Data */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Quality & Environmental Data
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quality Grade *
                </label>
                <select
                  required
                  value={formData.qualityGrade || ""}
                  onChange={(e) => updateField("qualityGrade", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select grade</option>
                  {qualityGrades.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  A = Highest, D = Lowest
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contamination Level (%) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.contaminationLevel || ""}
                  onChange={(e) =>
                    updateField(
                      "contaminationLevel",
                      parseFloat(e.target.value),
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Moisture Content (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.moistureContent || ""}
                  onChange={(e) =>
                    updateField("moistureContent", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Carbon Footprint (kg CO₂/unit) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.carbonFootprint || ""}
                  onChange={(e) =>
                    updateField("carbonFootprint", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Water Usage (liters/unit)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.waterUsage || ""}
                  onChange={(e) =>
                    updateField("waterUsage", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Energy Consumption (kWh/unit)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.energyConsumption || ""}
                  onChange={(e) =>
                    updateField("energyConsumption", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isHazardous || false}
                  onChange={(e) => updateField("isHazardous", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This material is classified as hazardous waste
                </span>
              </label>
            </div>

            {formData.isHazardous && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Waste Code
                  </label>
                  <input
                    type="text"
                    value={formData.wasteCode || ""}
                    onChange={(e) => updateField("wasteCode", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., EWC 17 04 05"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Regulatory Classification
                  </label>
                  <input
                    type="text"
                    value={formData.regulatoryClassification || ""}
                    onChange={(e) =>
                      updateField("regulatoryClassification", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next: Financial Data
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Financial Data */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Financial Data
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Disposal Cost (€/month) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.currentDisposalCost || ""}
                  onChange={(e) =>
                    updateField(
                      "currentDisposalCost",
                      parseFloat(e.target.value),
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  How much you currently pay to dispose of this material
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estimated Market Value (€/unit)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.marketValue || ""}
                  onChange={(e) =>
                    updateField("marketValue", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Potential selling price if recycled/reused
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Processing Cost (€/unit)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.processingCost || ""}
                  onChange={(e) =>
                    updateField("processingCost", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Cost to prepare material for sale/reuse
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Storage Location
                </label>
                <input
                  type="text"
                  value={formData.storageLocation || ""}
                  onChange={(e) =>
                    updateField("storageLocation", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Warehouse A, Section 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Storage Capacity (units)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.storageCapacity || ""}
                  onChange={(e) =>
                    updateField("storageCapacity", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Review & Submit
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Review & Submit
            </h2>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Material:</span>{" "}
                    {formData.materialName}
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>{" "}
                    {formData.materialCategory}
                  </div>
                  <div>
                    <span className="text-gray-600">Volume:</span>{" "}
                    {formData.monthlyVolume} {formData.unit}/month
                  </div>
                  <div>
                    <span className="text-gray-600">Form:</span>{" "}
                    {formData.physicalForm}
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Quality & Environmental
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Quality Grade:</span>{" "}
                    {formData.qualityGrade}
                  </div>
                  <div>
                    <span className="text-gray-600">Contamination:</span>{" "}
                    {formData.contaminationLevel}%
                  </div>
                  <div>
                    <span className="text-gray-600">Carbon Footprint:</span>{" "}
                    {formData.carbonFootprint} kg CO₂
                  </div>
                  <div>
                    <span className="text-gray-600">Hazardous:</span>{" "}
                    {formData.isHazardous ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Financial</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Disposal Cost:</span> €
                    {formData.currentDisposalCost}/month
                  </div>
                  <div>
                    <span className="text-gray-600">Market Value:</span> €
                    {formData.marketValue}/{formData.unit}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  What happens next?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Digital passport will be generated automatically</li>
                  <li>✓ KPIs will be calculated and displayed on dashboard</li>
                  <li>✓ Your agent will start looking for circular deals</li>
                  <li>✓ Material will be listed on the Nexus feed</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Material Flow & Passport"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
