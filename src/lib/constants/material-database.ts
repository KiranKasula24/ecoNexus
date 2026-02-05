// ============================================
// MATERIAL REFERENCE DATABASE
// ============================================

export interface MaterialReference {
  name: string;
  aliases: string[]; // alternative names
  category: "metal" | "plastic" | "chemical" | "organic" | "composite";
  typical_units: string[];
  average_cost_per_ton?: number; // EUR
  carbon_factor?: number; // kg CO2 per kg material
}

export const MATERIAL_DATABASE: Record<string, MaterialReference> = {
  // METALS
  steel: {
    name: "Steel",
    aliases: ["steel", "stainless steel", "carbon steel", "mild steel", "SS"],
    category: "metal",
    typical_units: ["kg", "ton", "tonnes", "mt"],
    average_cost_per_ton: 800,
    carbon_factor: 1.85,
  },
  aluminum: {
    name: "Aluminum",
    aliases: ["aluminum", "aluminium", "Al", "alu"],
    category: "metal",
    typical_units: ["kg", "ton", "tonnes"],
    average_cost_per_ton: 2400,
    carbon_factor: 8.2,
  },
  copper: {
    name: "Copper",
    aliases: ["copper", "Cu"],
    category: "metal",
    typical_units: ["kg", "ton"],
    average_cost_per_ton: 9000,
    carbon_factor: 2.6,
  },
  zinc: {
    name: "Zinc",
    aliases: ["zinc", "Zn"],
    category: "metal",
    typical_units: ["kg", "ton"],
    average_cost_per_ton: 2800,
    carbon_factor: 3.2,
  },

  // PLASTICS
  hdpe: {
    name: "HDPE Plastic",
    aliases: ["hdpe", "high density polyethylene", "polyethylene"],
    category: "plastic",
    typical_units: ["kg", "ton"],
    average_cost_per_ton: 1200,
    carbon_factor: 1.9,
  },
  pet: {
    name: "PET Plastic",
    aliases: ["pet", "polyethylene terephthalate", "pete"],
    category: "plastic",
    typical_units: ["kg", "ton"],
    average_cost_per_ton: 1100,
    carbon_factor: 2.1,
  },
  pp: {
    name: "PP Plastic",
    aliases: ["pp", "polypropylene"],
    category: "plastic",
    typical_units: ["kg", "ton"],
    average_cost_per_ton: 1300,
    carbon_factor: 1.7,
  },
  pvc: {
    name: "PVC",
    aliases: ["pvc", "polyvinyl chloride"],
    category: "plastic",
    typical_units: ["kg", "ton"],
    average_cost_per_ton: 900,
    carbon_factor: 2.3,
  },

  // CHEMICALS
  sulfuric_acid: {
    name: "Sulfuric Acid",
    aliases: ["sulfuric acid", "sulphuric acid", "H2SO4"],
    category: "chemical",
    typical_units: ["l", "liters", "kg"],
    average_cost_per_ton: 100,
    carbon_factor: 0.15,
  },

  // ORGANICS
  wood: {
    name: "Wood",
    aliases: ["wood", "timber", "lumber"],
    category: "organic",
    typical_units: ["m3", "cubic meters", "ton"],
    average_cost_per_ton: 200,
    carbon_factor: -1.8, // negative = carbon sink
  },
  paper: {
    name: "Paper",
    aliases: ["paper", "cardboard", "paperboard"],
    category: "organic",
    typical_units: ["kg", "ton"],
    average_cost_per_ton: 150,
    carbon_factor: 1.0,
  },
};

// Helper function to find material by name/alias
export function findMaterial(searchTerm: string): MaterialReference | null {
  const normalized = searchTerm.toLowerCase().trim();

  for (const [key, material] of Object.entries(MATERIAL_DATABASE)) {
    if (
      material.aliases.some((alias) => normalized.includes(alias.toLowerCase()))
    ) {
      return material;
    }
  }

  return null;
}

// Unit conversion helpers
export const UNIT_CONVERSIONS: Record<string, number> = {
  // Weight (to kg)
  kg: 1,
  g: 0.001,
  ton: 1000,
  tons: 1000,
  tonne: 1000,
  tonnes: 1000,
  mt: 1000, // metric ton
  lb: 0.453592,
  lbs: 0.453592,

  // Volume (to liters)
  l: 1,
  liter: 1,
  liters: 1,
  ml: 0.001,
  m3: 1000, // cubic meter to liters
};

export function normalizeUnit(
  value: number,
  unit: string,
): { value: number; unit: string } {
  const normalizedUnit = unit.toLowerCase().trim();

  // Convert to standard units
  if (UNIT_CONVERSIONS[normalizedUnit]) {
    if (
      ["kg", "g", "ton", "tons", "tonne", "tonnes", "mt", "lb", "lbs"].includes(
        normalizedUnit,
      )
    ) {
      return {
        value: (value * UNIT_CONVERSIONS[normalizedUnit]) / 1000, // to tons
        unit: "tons",
      };
    } else if (["l", "liter", "liters", "ml", "m3"].includes(normalizedUnit)) {
      return {
        value: value * UNIT_CONVERSIONS[normalizedUnit],
        unit: "liters",
      };
    }
  }

  return { value, unit };
}
