# Contributing to TheTravStory

Welcome to the team! To maintain a scalable and conflict-free project, we follow a strict branching and contribution model.

## Branching Strategy

We use a modular GitFlow approach:

### Core Branches
- **`main`**: Production-ready code. No direct commits.
- **`staging`**: Pre-production testing environment.
- **`develop`**: Main integration branch for all modules.

### Module Integration Branches
These branches are used to integrate work within specific segments before moving to `develop`:
- `module/frontend`
- `module/backend`
- `module/ml`
- `module/database`
- `module/devops`

## Contribution Workflow

### 1. Starting a Task
1.  **Pull latest changes**: Always start by pulling the latest from the relevant module branch.
    ```bash
    git checkout module/frontend
    git pull origin module/frontend
    ```
2.  **Create a Feature Branch**:
    ```bash
    git checkout -b feat/your-feature-name
    ```

### 2. Development
- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (e.g., `feat: load user profile`, `fix: header alignment`).
- Write tests for new logic.

### 3. Submitting Changes (The PR Process)
1.  **Push your branch**: `git push origin feat/your-feature-name`
2.  **Open a Pull Request**: Target the appropriate `module/` branch (e.g., `feat/ui-fix` -> `module/frontend`).
3.  **Review**: At least one other engineer must review and approve.
4.  **Merge**: Once approved and CI passes, your lead will merge it into the module branch.

### 4. Integration to Production
- **Module -> Develop**: Module branches are merged into `develop` for full system testing.
- **Develop -> Staging**: Once a release is ready, `develop` is merged into `staging`.
- **Staging -> Main**: After final QA on staging, code is merged into `main` and tagged for production.

## Conflict Resolution
- Always rebase your feature branch onto the module branch before opening a PR to catch conflicts early.
- Keep PRs small and focused on a single task.

---
*Happy Coding!*
