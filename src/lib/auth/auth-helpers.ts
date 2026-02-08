import { supabase } from "@/lib/database/supabase";

export async function signUp(
  email: string,
  password: string,
  companyData: {
    name: string;
    industry: string;
    entity_type: "manufacturer" | "recycler" | "logistics" | "energy_recovery";
    address: string;
    city: string;
    country: string;
  },
) {
  try {
    console.log("1. Starting signup...");

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("2. Auth response:", {
      user: authData.user?.id,
      error: authError,
    });

    if (authError) {
      console.error("Auth error:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("User creation failed - no user returned");
    }

    // 2. Determine locality
    const locality = companyData.city.toLowerCase().replace(/\s+/g, "-");

    console.log("3. Creating company for user:", authData.user.id);

    // 3. Create company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        user_id: authData.user.id,
        name: companyData.name,
        industry: companyData.industry,
        entity_type: companyData.entity_type,
        locality,
        location: {
          address: companyData.address,
          city: companyData.city,
          country: companyData.country,
          lat: 48.1351, // Placeholder
          lng: 11.582,
        },
      })
      .select()
      .single();

    console.log("4. Company creation:", {
      company: company?.id,
      error: companyError,
    });

    if (companyError) {
      console.error("Company creation error:", companyError);
      throw new Error(`Company creation failed: ${companyError.message}`);
    }

    if (!company) {
      throw new Error("Company creation returned no data");
    }

    console.log("5. Creating agent for company:", company.id);

    // 4. Create agent (moved from trigger to here)
    const agentType =
      companyData.entity_type === "recycler" ? "specialist_recycler" : "local";

    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .insert({
        company_id: company.id,
        name: `Agent-${companyData.name}`,
        agent_type: agentType,
        locality,
        status: "active",
      })
      .select()
      .single();

    console.log("6. Agent creation:", { agent: agent?.id, error: agentError });

    if (agentError) {
      console.error("Agent creation error:", agentError);
      // Don't throw - agent can be created later on first login
      console.warn("Agent creation failed, will retry on first login");
    }

    console.log("7. Signup complete!");

    return {
      user: authData.user,
      company,
      agent,
      session: authData.session,
    };
  } catch (error) {
    console.error("SIGNUP FAILED:", error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log("1. Starting sign in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("2. Sign in response:", { user: data.user?.id, error });

    if (error) throw error;
    if (!data.user) throw new Error("Login failed");

    console.log("3. Fetching company...");

    // Fetch company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    console.log("4. Company fetch:", {
      company: company?.id,
      error: companyError,
    });

    if (companyError) {
      console.error("Company fetch error:", companyError);
      throw new Error("Company record not found");
    }

    console.log("5. Checking for agent...");

    // Check if agent exists, create if not
    const { data: existingAgent, error: agentFetchError } = await supabase
      .from("agents")
      .select("id")
      .eq("company_id", company.id)
      .maybeSingle();

    console.log("6. Agent check:", {
      exists: !!existingAgent,
      error: agentFetchError,
    });

    if (!existingAgent && !agentFetchError) {
      console.log("7. Creating agent on first login...");

      const agentType =
        company.entity_type === "recycler" ? "specialist_recycler" : "local";

      const { error: agentCreateError } = await supabase.from("agents").insert({
        company_id: company.id,
        name: `Agent-${company.name}`,
        agent_type: agentType,
        locality: company.locality || "unknown",
        status: "active",
      });

      if (agentCreateError) {
        console.error("Agent creation on login failed:", agentCreateError);
        // Don't block login for this
      } else {
        console.log("8. Agent created successfully on first login");
      }
    }

    return {
      user: data.user,
      company,
      session: data.session,
    };
  } catch (error) {
    console.error("SIGN IN FAILED:", error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (companyError) return null;

    return {
      user,
      company,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
