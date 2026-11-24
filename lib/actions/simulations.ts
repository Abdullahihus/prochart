"use server";

import { createClient } from "@/lib/supabase/server";
import {
  normalizeSimulationTemplate,
  type SimulationTemplate,
} from "@/lib/types/simulation-template";

import { revalidatePath } from "next/cache";

export async function getSimulations(search: string = "") {
  const supabase = await createClient();

  let query = supabase
    .from("simulations")
    .select("id, title, description, status, created_at, updated_at")
    .order("title", { ascending: true });

  if (search.trim()) {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/** Retrieves a complete simulation by ID. */
export async function getSimulationById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("simulations")
    .select("simulation_data")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return normalizeSimulationTemplate(data.simulation_data);
}

/** Creates or updates a simulation. */
export async function saveSimulation(
  simulation: SimulationTemplate,
) {
  const supabase = await createClient();

  const validated = normalizeSimulationTemplate(simulation);

  if (!validated.title.trim()) {
    throw new Error("Simulation title is required.");
  }

  const updatedSimulation = {
    ...validated,
    title: validated.title.trim(),
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("simulations")
    .upsert(
      {
        id: updatedSimulation.id,
        simulation_data: updatedSimulation,
      },
      { onConflict: "id" },
    );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/instructor/simulations");
  revalidatePath(
    `/instructor/simulations/${updatedSimulation.id}`,
  );

  return updatedSimulation;
}

/** Deletes a simulation by ID. */
export async function deleteSimulation(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("simulations")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Simulation not found or deletion not permitted.");
  }

  revalidatePath("/instructor/simulations");
}