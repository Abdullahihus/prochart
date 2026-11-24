import { notFound } from "next/navigation";
import { getSimulationById } from "@/lib/actions/simulations";
import { SimulationEditor } from "@/components/instructor/simulation-editor";

type EditSimulationPageProps = {
  params: Promise<{ templateId: string }>;
};

export default async function EditSimulationPage({
  params,
}: EditSimulationPageProps) {
  const { templateId } = await params;
  const simulation = await getSimulationById(templateId);

  if (!simulation) {
    notFound();
  }

  return (
    <div className="p-6">
      <SimulationEditor
        key={simulation.id}
        initialSimulation={simulation}
      />
    </div>
  );
}