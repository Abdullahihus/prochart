import { randomUUID } from "node:crypto";
import { SimulationEditor } from "@/components/instructor/simulation-editor";
import { emptySimulationTemplate } from "@/lib/types/simulation-template";

export const dynamic = "force-dynamic";

export default function NewSimulationPage() {
    const simulation = emptySimulationTemplate(randomUUID());

    return (
        <div className="p-6">
            <SimulationEditor
                initialSimulation={simulation}
                isNew={true}
            />
        </div>
    );
}