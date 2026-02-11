/**
 * NEXAAPEX - SUPER AGENT (LOCALITY COORDINATOR)
 * Detects symbiosis patterns and announces opportunities
 */

import { supabase } from "@/lib/database/supabase";

const supabaseAdmin = supabase;

export class SuperAgent {
  private agentId: string;
  private locality: string;
  private constraints: any;

  constructor(agent: any) {
    this.agentId = agent.id;
    this.locality = agent.locality;
    this.constraints = agent.constraints || {};
  }

  async runCycle(): Promise<{ actions: number; errors: string[] }> {
    const actions: string[] = [];
    const errors: string[] = [];

    try {
      // Step 1: Analyze material flows in locality
      const flows = await this.analyzeMaterialFlows();
      actions.push(`Analyzed ${flows.length} material flows`);

      // Step 2: Detect circular patterns (symbiosis)
      const symbioses = await this.detectSymbiosis(flows);
      actions.push(`Detected ${symbioses.length} symbiosis patterns`);

      // Step 3: Announce high-value opportunities
      const announced = await this.announceSymbioses(symbioses);
      actions.push(`Announced ${announced} symbiosis opportunities`);

      // Step 4: Cross-locality coordination
      const crossLocalityOpps = await this.coordinateCrossLocality();
      actions.push(`Found ${crossLocalityOpps} cross-locality opportunities`);
    } catch (error: any) {
      errors.push(error.message);
    }

    return { actions: actions.length, errors };
  }

  /**
   * Analyze material flows in locality
   */
  private async analyzeMaterialFlows(): Promise<any[]> {
    // Get all companies in locality
    const { data: companies } = await supabaseAdmin
      .from("companies")
      .select("id, name")
      .ilike("location->>city", `%${this.locality}%`);

    if (!companies) return [];

    const flows: any[] = [];

    for (const company of companies) {
      // Get their waste streams (outputs)
      const { data: outputs } = await supabaseAdmin
        .from("waste_streams")
        .select("material_type, material_category, monthly_volume")
        .eq("company_id", company.id);

      // Get their material requirements (inputs)
      const { data: inputs } = await supabaseAdmin
        .from("materials")
        .select("material_type, material_category, monthly_volume")
        .eq("company_id", company.id)
        .eq("source_type", "requirement");

      flows.push({
        company_id: company.id,
        company_name: company.name,
        outputs: outputs || [],
        inputs: inputs || [],
      });
    }

    return flows;
  }

  /**
   * Detect circular symbiosis patterns (3+ companies)
   */
  private async detectSymbiosis(flows: any[]): Promise<any[]> {
    const symbioses: any[] = [];

    // Simple 3-way pattern detection: A produces X, B needs X and produces Y, C needs Y
    for (let i = 0; i < flows.length; i++) {
      const companyA = flows[i];

      for (const outputA of companyA.outputs) {
        // Find who needs this output
        for (let j = 0; j < flows.length; j++) {
          if (i === j) continue;
          const companyB = flows[j];

          const matchingInputB = companyB.inputs.find(
            (inp: any) => inp.material_category === outputA.material_category,
          );

          if (!matchingInputB) continue;

          // Found A → B connection
          // Now check if B produces something that someone else needs
          for (const outputB of companyB.outputs) {
            for (let k = 0; k < flows.length; k++) {
              if (k === i || k === j) continue;
              const companyC = flows[k];

              const matchingInputC = companyC.inputs.find(
                (inp: any) =>
                  inp.material_category === outputB.material_category,
              );

              if (!matchingInputC) continue;

              // Found A → B → C symbiosis!
              const annualVolume =
                Math.min(
                  outputA.monthly_volume,
                  matchingInputB.monthly_volume,
                  outputB.monthly_volume,
                  matchingInputC.monthly_volume,
                ) * 12;

              // Estimate value (simplified)
              const estimatedValue = annualVolume * 100; // €100/ton average

              // Estimate carbon savings (simplified)
              const carbonSaved = annualVolume * 0.5; // 0.5 tons CO₂/ton material

              // Check if meets minimum criteria
              const meetsCriteria =
                estimatedValue >= 25000 || // €25k/year
                carbonSaved >= 50; // 50 tons CO₂/year

              if (meetsCriteria) {
                symbioses.push({
                  companies: [
                    companyA.company_name,
                    companyB.company_name,
                    companyC.company_name,
                  ],
                  company_ids: [
                    companyA.company_id,
                    companyB.company_id,
                    companyC.company_id,
                  ],
                  flow: `${outputA.material_category} → ${outputB.material_category}`,
                  annual_volume: annualVolume,
                  estimated_value: estimatedValue,
                  carbon_saved: carbonSaved,
                  score:
                    estimatedValue * 0.4 +
                    carbonSaved * 300 * 0.3 +
                    3 * 1000 * 0.2 +
                    100 * 0.1,
                });
              }
            }
          }
        }
      }
    }

    // Sort by score and return top opportunities
    return symbioses.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /**
   * Announce symbiosis opportunities to locality
   */
  private async announceSymbioses(symbioses: any[]): Promise<number> {
    let announced = 0;

    for (const symbiosis of symbioses) {
      // Check if already announced
      const { data: existingAnnouncement } = await supabaseAdmin
        .from("agent_feed")
        .select("id")
        .eq("agent_id", this.agentId)
        .eq("post_type", "announcement")
        .contains("content", { companies_involved: symbiosis.companies })
        .eq("is_active", true)
        .single();

      if (existingAnnouncement) continue;

      const { error } = await supabaseAdmin.from("agent_feed").insert({
        agent_id: this.agentId,
        post_type: "announcement",
        content: {
          type: "symbiosis_detected",
          title: `Circular Opportunity: ${symbiosis.companies.length}-Way Symbiosis`,
          description: `${symbiosis.companies.join(" → ")} can create a circular material flow for ${symbiosis.flow}`,
          companies_involved: symbiosis.companies,
          company_ids: symbiosis.company_ids,
          estimated_value: symbiosis.estimated_value,
          carbon_saved: symbiosis.carbon_saved,
          annual_volume: symbiosis.annual_volume,
          priority: symbiosis.score > 100000 ? "high" : "medium",
        },
        locality: this.locality,
        visibility: "local",
        expires_at: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

      if (!error) announced++;
    }

    return announced;
  }

  /**
   * Coordinate with other NexaApex agents (cross-locality)
   */
  private async coordinateCrossLocality(): Promise<number> {
    // Find other NexaApex agents
    const { data: otherSuperAgents } = await supabaseAdmin
      .from("agents")
      .select("id, locality")
      .eq("agent_type", "super")
      .neq("locality", this.locality);

    if (!otherSuperAgents) return 0;

    // TODO: Implement cross-locality coordination
    // For MVP, just detect existence
    return otherSuperAgents.length;
  }
}
