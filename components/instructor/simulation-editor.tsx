"use client";

import { useState, useEffect } from "react";
import type { SimulationTemplate } from "@/lib/types/simulation-template";
import { PatientSidebar } from "./patient-sidebar";
import { SimulationSummary } from "./simulation-tabs/summary";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { SimulationVitals } from "./simulation-tabs/vitals";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  saveSimulation,
  deleteSimulation,
} from "@/lib/actions/simulations";

const tabs = [
  { value: "summary", label: "Summary" },
  { value: "vitals", label: "Vitals" },
  { value: "orders", label: "Orders" },
  { value: "diagnostics", label: "Diagnostics" },
  { value: "mar", label: "MAR" },
  { value: "progress-notes", label: "Progress Notes" },
  { value: "assessment", label: "Assessment" },
  { value: "lda", label: "LDA" },
  { value: "wounds", label: "Wounds" },
  { value: "io", label: "I/O" },
];

type SimulationEditorProps = {
  initialSimulation: SimulationTemplate;
  isNew?: boolean;
};

export function SimulationEditor({
  initialSimulation,
  isNew = false,
}: SimulationEditorProps) {
  const [simulation, setSimulation] = useState(initialSimulation);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(!isNew);
  const [lastSaved, setLastSaved] = useState(initialSimulation);

  const hasUnsavedChanges =
    JSON.stringify(simulation) !== JSON.stringify(lastSaved);
  const router = useRouter();

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  /** Saves the simulation with the selected status. */
  async function handleSave(status: "draft" | "published") {
    if (isSaving || isDeleting) return;

    setIsSaving(true);

    try {
      const saved = await saveSimulation({
        ...simulation,
        status,
      });

      setSimulation(saved);
      setHasBeenSaved(true);
      setLastSaved(saved);

      toast.success(
        status === "draft"
          ? "Draft saved successfully."
          : "Simulation published successfully.",
      );

      router.replace(`/instructor/simulations/${saved.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save simulation.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handlePublish() {
    const confirmed = window.confirm(
      "Are you sure you want to publish this simulation?"
    );

    if (confirmed) {
      void handleSave("published");
    }
  }

  /** Deletes the simulation after confirmation. */
  async function handleDelete() {
    if (isDeleting || isSaving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${simulation.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteSimulation(simulation.id);

      toast.success("Simulation deleted successfully.");

      router.replace("/instructor/simulations");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete simulation.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleBack() {
    if (isSaving || isDeleting) return;

    if (
      hasUnsavedChanges &&
      !window.confirm("You have unsaved changes. Leave without saving?")
    ) {
      return;
    }

    router.push("/instructor/simulations");
  }

  return (
    <div className="space-y-4">

      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {simulation.title || "Untitled simulation"}
          </h1>

          <p className="text-sm text-muted-foreground">
            Status: {simulation.status}
          </p>

          {hasUnsavedChanges && (
            <p className="text-sm text-amber-600">
              Unsaved changes
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            disabled={isSaving || isDeleting}
            onClick={handleBack}
          >
            Back to Library
          </Button>

          <Button
            variant="outline"
            disabled={isSaving || isDeleting}
            onClick={() => handleSave("draft")}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>

          <Button
            disabled={isSaving || isDeleting}
            onClick={handlePublish}
          >
            {isSaving
              ? "Saving..."
              : simulation.status === "published"
                ? "Update Published Simulation"
                : "Publish"}
          </Button>

          {hasBeenSaved && (
            <Button
              variant="destructive"
              disabled={isSaving || isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">

        <PatientSidebar patient={simulation.patient} />

        <main className="min-w-0 flex-1">
          <Tabs defaultValue="summary">

            <TabsList
              variant="line"
              className="data-horizontal:h-auto w-full flex-wrap justify-start gap-y-3 pb-3"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-9 flex-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value="summary"
              className="rounded-lg border p-4"
            >
              <SimulationSummary
                simulation={simulation}
                onChange={setSimulation}
              />
            </TabsContent>

            <TabsContent
              value="vitals"
              className="rounded-lg border p-4"
            >
              <SimulationVitals
                vitals={simulation.vitals ?? []}
                onChange={(vitals) =>
                  setSimulation((previous) => ({
                    ...previous,
                    vitals,
                  }))
                }
              />
            </TabsContent>

            {tabs
              .filter(
                (tab) =>
                  tab.value !== "summary" &&
                  tab.value !== "vitals",
              )
              .map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="rounded-lg border p-4"
                >
                  <h2 className="text-lg font-semibold">
                    {tab.label}
                  </h2>

                  <p className="text-muted-foreground">
                    {tab.label} editor coming soon.
                  </p>
                </TabsContent>
              ))}

          </Tabs>
        </main>
      </div>
    </div>
  );
}
