import type { SimulationPatient } from "@/lib/types/simulation-template";
import {
  heightToInches,
  weightToPounds,
} from "@/lib/format/patient-units";

type PatientSidebarProps = {
  patient: SimulationPatient;
};

function PatientDetail({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium">
        {value || "Not specified"}
      </p>
    </div>
  );
}

export function PatientSidebar({
  patient,
}: PatientSidebarProps) {
  return (
    <aside className="w-64 shrink-0 space-y-4 rounded-lg border bg-muted/30 p-4">
      <div>
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
          {patient.displayName
            ? patient.displayName
                .split(" ")
                .filter(Boolean)
                .map((name) => name[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : "?"}
        </div>

        <h2 className="text-lg font-semibold">
          {patient.displayName || "Patient Name"}
        </h2>

        <p className="text-sm text-muted-foreground">
          {patient.age !== undefined
            ? `${patient.age} years`
            : "Age not specified"}
          {" | "}
          {patient.gender || "Gender not specified"}
        </p>
      </div>

      <div className="space-y-3 border-t pt-3">
        <PatientDetail label="MRN" value={patient.mrn} />
        <PatientDetail
          label="Date of Birth"
          value={patient.dateOfBirth}
        />
        <PatientDetail
            label="Height"
            value={
                heightToInches(patient.height) !== null
                ? `${parseFloat(patient.height!)} cm (${heightToInches(patient.height)} inches)`
                : patient.height
            }
            />

            <PatientDetail
            label="Weight"
            value={
                weightToPounds(patient.weight) !== null
                ? `${parseFloat(patient.weight!)} kg (${weightToPounds(patient.weight)} lbs)`
                : patient.weight
            }
            />
        <PatientDetail
          label="Primary Language"
          value={patient.primaryLanguage}
        />
      </div>

      <div className="space-y-3 border-t pt-3">
        <PatientDetail
          label="Code Status"
          value={patient.codeStatus}
        />

        <div>
          <p className="text-xs font-semibold text-red-600">
            Allergies
          </p>
          <p className="text-sm text-red-600">
            {patient.allergies?.filter(Boolean).join(", ") ||
              "Not specified"}
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t pt-3">
        <PatientDetail
          label="Admitting Diagnosis"
          value={patient.admittingDiagnoses?.filter(Boolean).join(", ")}
        />

        <PatientDetail
          label="Admitting Physician"
          value={patient.admittingPhysician}
        />

        <PatientDetail
          label="Care Team"
          value={patient.careTeam?.filter(Boolean).join(", ")}
        />
      </div>
    </aside>
  );
}