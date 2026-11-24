"use client";

import type {
  SimulationTemplate,
  SimulationPatient,
} from "@/lib/types/simulation-template";

import {
  heightToInches,
  weightToPounds,
} from "@/lib/format/patient-units";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SummaryProps = {
  simulation: SimulationTemplate;
  onChange: (simulation: SimulationTemplate) => void;
};

export function SimulationSummary({
  simulation,
  onChange,
}: SummaryProps) {
  const patient = simulation.patient;

  function updateSimulation<K extends keyof SimulationTemplate>(
    field: K,
    value: SimulationTemplate[K],
  ) {
    onChange({
      ...simulation,
      [field]: value,
    });
  }

  function updatePatient<K extends keyof SimulationPatient>(
    field: K,
    value: SimulationPatient[K],
  ) {
    onChange({
      ...simulation,
      patient: {
        ...patient,
        [field]: value,
      },
    });
  }

  return (
    <div className="space-y-6">

      {/* Simulation Information */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Simulation Information
        </h2>

        <div className="space-y-2">
          <Label htmlFor="simulation-title">Simulation Title</Label>
          <Input
            id="simulation-title"
            value={simulation.title}
            onChange={(e) =>
              updateSimulation("title", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter simulation description..."
            value={simulation.description ?? ""}
            onChange={(e) =>
              updateSimulation("description", e.target.value)
            }
          />
        </div>
      </section>

      {/* Patient Demographics */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">
          Patient Demographics
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Patient Name</Label>
            <Input
              id="patient-name"
              placeholder="Full name"
              value={patient.displayName ?? ""}
              onChange={(e) =>
                updatePatient("displayName", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mrn">MRN</Label>
            <Input
              id="mrn"
              value={patient.mrn ?? ""}
              onChange={(e) =>
                updatePatient("mrn", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={patient.dateOfBirth ?? ""}
              onChange={(e) =>
                updatePatient("dateOfBirth", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={0}
              value={patient.age ?? ""}
              onChange={(e) =>
                updatePatient(
                  "age",
                  e.target.value === ""
                    ? undefined
                    : Number(e.target.value),
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={patient.gender ?? ""}
              onChange={(e) =>
                updatePatient("gender", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Primary Language</Label>
            <Input
              id="language"
              value={patient.primaryLanguage ?? ""}
              onChange={(e) =>
                updatePatient("primaryLanguage", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
                id="height"
                type="number"
                min={0}
                step="any"
                placeholder="170"
                value={patient.height ? parseFloat(patient.height) : ""}
                onChange={(e) =>
                updatePatient(
                    "height",
                    e.target.value ? `${e.target.value} cm` : "",
                )
                }
            />
            <p className="text-sm text-muted-foreground">
                {heightToInches(patient.height) !== null
                ? `${heightToInches(patient.height)} inches`
                : ""}
            </p>
            </div>

            <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
                id="weight"
                type="number"
                min={0}
                step="any"
                placeholder="75"
                value={patient.weight ? parseFloat(patient.weight) : ""}
                onChange={(e) =>
                updatePatient(
                    "weight",
                    e.target.value ? `${e.target.value} kg` : "",
                )
                }
            />
            <p className="text-sm text-muted-foreground">
                {weightToPounds(patient.weight) !== null
                ? `${weightToPounds(patient.weight)} lbs`
                : ""}
            </p>
            </div>
        </div>
      </section>

      {/* Clinical Information */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">
          Clinical Information
        </h2>

        <div className="space-y-2">
          <Label htmlFor="code-status">Code Status</Label>
          <Input
            id="code-status"
            placeholder="e.g. Full Code"
            value={patient.codeStatus ?? ""}
            onChange={(e) =>
              updatePatient("codeStatus", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            placeholder="One allergy per line"
            value={patient.allergies?.join("\n") ?? ""}
            onChange={(e) =>
              updatePatient("allergies", e.target.value.split("\n"))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnoses">Admitting Diagnoses</Label>
          <Textarea
            id="diagnoses"
            placeholder="One diagnosis per line"
            value={patient.admittingDiagnoses?.join("\n") ?? ""}
            onChange={(e) =>
              updatePatient(
                "admittingDiagnoses",
                e.target.value.split("\n"),
              )
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medical-history">Medical History</Label>
          <Textarea
            id="medical-history"
            placeholder="Enter relevant medical history"
            value={patient.medicalHistory?.join("\n") ?? ""}
            onChange={(e) =>
              updatePatient(
                "medicalHistory",
                e.target.value.split("\n"),
              )
            }
          />
        </div>
      </section>

      {/* Care Team */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">
          Care Team
        </h2>

        <div className="space-y-2">
          <Label htmlFor="physician">Admitting Physician</Label>
          <Input
            id="physician"
            placeholder="Physician name"
            value={patient.admittingPhysician ?? ""}
            onChange={(e) =>
              updatePatient("admittingPhysician", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="care-team">Care Team Members</Label>
          <Textarea
            id="care-team"
            placeholder="One team member per line"
            value={patient.careTeam?.join("\n") ?? ""}
            onChange={(e) =>
              updatePatient("careTeam", e.target.value.split("\n"))
            }
          />
        </div>
      </section>
    </div>
  );
}