/**
 * NEXAPRIME - PROCESSOR AGENT
 * Backwards chaining: Find buyer demand, then source inputs
 */

import { supabase } from "@/lib/database/supabase";

export class ProcessorAgent {
  private agentId: string;
  private companyId: string;
  private profile: any;

  constructor(agent: any, profile: any) {
    this.agentId = agent.id;
    this.companyId = agent.company_id;
    this.profile = profile;
  }

  async runCycle(): Promise<{ actions: number; errors: string[] }> {
    const actions: string[] = [];
    const errors: string[] = [];

    try {
      // Step 1: Post service offers
      const servicesPosted = await this.postServiceOffers();
      actions.push(`Posted ${servicesPosted} service offers`);

      // Step 2: Find buyer demand (backwards chaining)
      const buyerDemands = await this.findBuyerDemand();
      actions.push(`Found ${buyerDemands.length} buyer demands`);

      // Step 3: Source matching inputs
      const inputsSourced = await this.sourceMatchingInputs(buyerDemands);
      actions.push(`Sourced ${inputsSourced} inputs`);

      // Step 4: Propose three-way deals
      const dealsProposed = await this.proposeThreeWayDeals();
      actions.push(`Proposed ${dealsProposed} three-way deals`);
    } catch (error: any) {
      errors.push(error.message);
    }

    return { actions: actions.length, errors };
  }

  /**
   * Post processing service offers
   */
  private async postServiceOffers(): Promise<number> {
    if (!this.profile.processing_services) return 0;

    let posted = 0;

    for (const service of this.profile.processing_services) {
      // Check if offer exists
      const { data: existingOffer } = await supabase
        .from("agent_feed")
        .select("id")
        .eq("agent_id", this.agentId)
        .eq("post_type", "offer")
        .contains("content", { service_type: service })
        .eq("is_active", true)
        .single();

      if (existingOffer) continue;

      const capacityAvailable = Math.round(
        (this.profile.processing_capacity_tons_month || 0) *
          (1 - (this.profile.current_utilization_percentage || 0) / 100),
      );

      if (capacityAvailable < 10) continue; // Skip if low capacity

      const { error } = await supabase.from("agent_feed").insert({
        agent_id: this.agentId,
        post_type: "offer",
        content: {
          service_type: service,
          input_materials: this.profile.input_materials,
          output_materials: this.profile.output_materials,
          capacity_available: capacityAvailable,
          processing_fee: this.profile.processing_fee_per_ton?.[service] || 75,
          turnaround_days: 7,
          quality_guarantee: this.profile.output_quality_guarantee,
        },
        locality: "regional",
        visibility: "public",
        expires_at: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

      if (!error) posted++;
    }

    return posted;
  }

  /**
   * BACKWARDS CHAINING: Find what buyers want
   */
  private async findBuyerDemand(): Promise<any[]> {
    // Find buy requests for our output materials
    const { data: buyRequests } = await supabase
      .from("agent_feed")
      .select("*")
      .eq("post_type", "request")
      .eq("is_active", true)
      .in("content->material_category", this.profile.output_materials);

    return buyRequests || [];
  }

  /**
   * Source inputs that match buyer demand
   */
  private async sourceMatchingInputs(buyerDemands: any[]): Promise<number> {
    let sourced = 0;

    for (const demand of buyerDemands) {
      const outputNeeded = demand.content.material_category;

      // Find what input we need to produce this output
      // Simple mapping: assume 1:1 for MVP (e.g., plastic-scrap → recycled-plastic)
      const inputNeeded = this.profile.input_materials.find((input: string) =>
        input.includes(outputNeeded.split("-")[0]),
      );

      if (!inputNeeded) continue;

      // Search for offers of this input
      const { data: inputOffers } = await supabase
        .from("agent_feed")
        .select("*")
        .eq("post_type", "offer")
        .eq("is_active", true)
        .contains("content", { material_category: inputNeeded });

      if (inputOffers && inputOffers.length > 0) {
        // Found matching input! Mark for three-way deal
        sourced++;
      }
    }

    return sourced;
  }

  /**
   * Propose three-way deals (supplier → processor → buyer)
   */
  private async proposeThreeWayDeals(): Promise<number> {
    // TODO: Implement full three-way deal coordination
    // For MVP, focus on two-way deals (either buy input OR sell output)
    return 0;
  }
}
