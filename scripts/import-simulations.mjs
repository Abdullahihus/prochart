import fs from "node:fs";

const files = [
  "lib/simulations/atypical-chest-pain-female.generated.json",
  "lib/simulations/end-of-life.generated.json",
];

function escapeSQL(value) {
  return "'" + value.replaceAll("'", "''") + "'";
}

const statements = files.map((file) => {
  const simulation = JSON.parse(fs.readFileSync(file, "utf8"));

  return `
INSERT INTO public.simulations (id, simulation_data)
VALUES (
    ${escapeSQL(simulation.id)},
    ${escapeSQL(JSON.stringify(simulation))}::jsonb
)
ON CONFLICT (id) DO NOTHING;
`;
});

fs.writeFileSync("import-simulations.sql", statements.join("\n"));

console.log("SQL import file generated successfully.");