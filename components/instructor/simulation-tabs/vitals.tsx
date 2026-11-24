"use client";

import { useState } from "react";
import type { SimulationVitalsEntry } from "@/lib/types/simulation-template";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VitalsProps = {
  vitals: SimulationVitalsEntry[];
  onChange: (vitals: SimulationVitalsEntry[]) => void;
};

type VitalField = Exclude<
  keyof SimulationVitalsEntry,
  "id" | "date" | "time"
>;

// Measurements displayed as rows in the flowsheet.
const measurements: {
  field: VitalField;
  label: string;
  options?: string[];
}[] = [
  {
    field: "bloodPressure",
    label: "Blood Pressure (mmHg)",
  },
  {
    field: "bloodPressureLocation",
    label: "BP Location",
    options: ["Right Arm", "Left Arm", "Right Leg", "Left Leg"],
  },
  {
    field: "heartRate",
    label: "Heart Rate (bpm)",
  },
  {
    field: "respiratoryRate",
    label: "Respiratory Rate (breaths/min)",
  },
  {
    field: "temperature",
    label: "Temperature (°C)",
  },
  {
    field: "temperatureRoute",
    label: "Temperature Route",
    options: ["Tympanic", "Oral", "Rectal", "Axillary"],
  },
  {
    field: "oxygenSaturation",
    label: "SpO₂ (%)",
  },
  {
    field: "painLevel",
    label: "Pain Level (0–10)",
  },
];

export function SimulationVitals({
  vitals,
  onChange,
}: VitalsProps) {
  const [showDates, setShowDates] = useState(false);

  // Each recording creates a new column.
  function addRecording() {
    onChange([
      ...vitals,
      {
        id: crypto.randomUUID(),
        date: "",
        time: "08:00",
      },
    ]);
  }

  function updateRecording(
    id: string,
    field: Exclude<keyof SimulationVitalsEntry, "id">,
    value: string,
  ) {
    onChange(
      vitals.map((entry) =>
        entry.id === id
          ? { ...entry, [field]: value }
          : entry,
      ),
    );
  }

  function removeRecording(id: string) {
    onChange(vitals.filter((entry) => entry.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Vitals</h2>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDates}
              onChange={(e) => setShowDates(e.target.checked)}
            />
            Show Dates
          </label>

          <Button onClick={addRecording}>
            + Add Recording
          </Button>
        </div>
      </div>

      {vitals.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No vitals recorded. Click Add Recording to begin.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="min-w-48 border p-3 text-left">
                  Measurement
                </th>

                {vitals.map((entry) => (
                  <th
                    key={entry.id}
                    className="min-w-40 border p-2"
                  >
                    <div className="space-y-2">
                      {showDates && (
                        <Input
                          type="date"
                          aria-label="Recording date"
                          value={entry.date ?? ""}
                          onChange={(e) =>
                            updateRecording(
                              entry.id,
                              "date",
                              e.target.value,
                            )
                          }
                        />
                      )}

                      <Input
                        type="time"
                        aria-label="Recording time"
                        value={entry.time}
                        onChange={(e) =>
                          updateRecording(
                            entry.id,
                            "time",
                            e.target.value,
                          )
                        }
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => removeRecording(entry.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {measurements.map((measurement) => (
                <tr key={measurement.field}>
                  <th
                    scope="row"
                    className="border bg-muted/30 p-3 text-left font-medium"
                  >
                    {measurement.label}
                  </th>

                  {vitals.map((entry) => (
                    <td key={entry.id} className="border p-2">
                      {measurement.options ? (
                        <select
                          className="h-9 w-full rounded-md border bg-background px-2"
                          aria-label={`${measurement.label} at ${entry.time}`}
                          value={entry[measurement.field] ?? ""}
                          onChange={(e) =>
                            updateRecording(
                              entry.id,
                              measurement.field,
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select...</option>

                          {measurement.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          placeholder="—"
                          aria-label={`${measurement.label} at ${entry.time}`}
                          value={entry[measurement.field] ?? ""}
                          onChange={(e) =>
                            updateRecording(
                              entry.id,
                              measurement.field,
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}