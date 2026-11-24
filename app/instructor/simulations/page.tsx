import Link from "next/link";
import { getSimulations } from "@/lib/actions/simulations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function InstructorSimulationsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search = "" } = await searchParams;
    const simulations = await getSimulations(search);

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Simulation Library</h1>
                    <p className="text-muted-foreground">
                        Create and manage your simulations.
                    </p>
                </div>

                <Button asChild>
                    <Link href="/instructor/simulations/new">
                        Create Simulation
                    </Link>
                </Button>
            </div>

            <form className="flex gap-2">
                <Input
                    key={search}
                    name="search"
                    placeholder="Search simulations by name..."
                    defaultValue={search}
                    className="max-w-sm"
                />

                <Button type="submit">
                    Search
                </Button>

                <Button variant="outline" asChild>
                    <Link href="/instructor/simulations">
                        Clear
                    </Link>
                </Button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {simulations.map((simulation) => (
                    <Card key={simulation.id}>
                        <CardHeader>
                            <CardTitle>{simulation.title}</CardTitle>
                            <CardDescription>
                                {simulation.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-sm">
                                Status: {simulation.status}
                            </p>

                            <Button variant="outline" asChild>
                                <Link href={`/instructor/simulations/${simulation.id}`}>
                                    Edit Simulation
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {simulations.length === 0 && (
                <p className="text-muted-foreground">
                    No simulations found.
                </p>
            )}
        </div>
    );
}