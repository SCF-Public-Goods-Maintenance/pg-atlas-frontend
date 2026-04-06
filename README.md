# PG Atlas Frontend

Frontend dashboard for [PG Atlas](https://github.com/SCF-Public-Goods-Maintenance) — the metrics backbone for the SCF Public Goods dependency graph. Built with Vite, React, TanStack Router, and TanStack Query.

Built as free open-source software under the **Mozilla Public License 2.0**.

[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/SCF-Public-Goods-Maintenance/pg-atlas-frontend/main.svg)](https://results.pre-commit.ci/latest/github/SCF-Public-Goods-Maintenance/pg-atlas-frontend/main)

## Local Development

### Prerequisites

- **Node.js** 18+ (recommend 20 LTS)
- **npm** (or pnpm / yarn)

### Setup

```bash
git clone https://github.com/SCF-Public-Goods-Maintenance/pg-atlas-frontend.git
cd pg-atlas-frontend
npm install
```

### Install pre-commit hooks

This repository uses [pre-commit](https://pre-commit.com) hooks to enforce code quality checks:

```bash
# From repo root (pg-atlas-frontend)
pre-commit install --install-hooks --hook-type pre-commit --hook-type commit-msg
```

### Run the app

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite prints).

### Lint and type-check

```bash
npm run lint
npm run build
```

`build` runs the TypeScript compiler and Vite build; a successful build implies type-checking passes.

## License

This Source Code Form is subject to the terms of the **Mozilla Public License, v. 2.0**.  
A copy of the MPL is in the [LICENSE](LICENSE) file in this repository.
