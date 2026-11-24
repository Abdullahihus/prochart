# Instructor Development

## Completed Features

- Docker development environment
- Supabase database integration
- Simulation library and search
- Create, edit, save, publish, and delete simulations
- Publish and delete confirmations
- Unsaved changes protection
- Read-only patient sidebar
- Editable Summary and Vitals tabs
- Automatic height and weight conversions

## Development Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Add the shared Supabase project URL and publishable key to `.env.local`.

Start the application:

```bash
docker compose up --build
```

Instructor interface:

http://localhost:3000/instructor/simulations

Student interface:

http://localhost:3000/student

## Database

Simulation templates are stored in the Supabase `simulations` table. The complete simulation document is stored in the `simulation_data` JSONB column.

Database operations are located in `lib/actions/simulations.ts`.

- `getSimulations()` — List and search simulations.
- `getSimulationById()` — Retrieve a complete simulation.
- `saveSimulation()` — Create or update a simulation.
- `deleteSimulation()` — Delete a simulation.

## Instructor Components

The Create and Edit pages share the same `SimulationEditor` component.

```text
components/instructor/
├── simulation-editor.tsx
├── patient-sidebar.tsx
└── simulation-tabs/
    ├── summary.tsx
    └── vitals.tsx
```

The editor maintains a shared `SimulationTemplate` state. All clinical tabs should update this state rather than implementing separate database save functions.

## Adding New Tabs

1. Extend the relevant types in `lib/types/simulation-template.ts`.
2. Update `tryNormalizeSimulationTemplate()` if adding new root-level properties.
3. Create the tab component inside `components/instructor/simulation-tabs/`.
4. Connect the component to the shared state in `simulation-editor.tsx`.
5. Remove the corresponding placeholder tab.
6. Test saving and loading the new data.

Use the existing Summary and Vitals components as references.

## Remaining Tasks

- Orders
- Diagnostics
- MAR
- Progress Notes
- Assessment
- LDA
- Wounds
- I/O
- Student-side Supabase integration
- Additional input validation
- Prevent editing while saving
- Authentication, if required

## Security and Current Limitations

The database currently uses temporary public development policies. Authentication is not implemented. Anyone with access to the Supabase API can read, create, update, or delete simulations.

These policies must be restricted before production deployment. Only fictional patient information should be used.

Student-facing pages still retrieve built-in simulations from local JSON files.

Unsaved changes protection covers browser refresh, closing the page, and the Back to Library button, but does not cover every navigation method.


## Testing

```bash
npx tsc --noEmit
npm run lint
```

Both checks passed during instructor development.
