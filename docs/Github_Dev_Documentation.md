
# Git & GitHub Operations Manual
**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Operational Standard  
**Scope:** All developers  
**Enforcement:** Mandatory  
**Violations:** Treated as operational failures

----------

## 1. Git & GitHub Responsibility Model

### What Git Handles

-   Local version control: commits, branches, history, staging
-   Local conflict detection during merges/rebases
-   Local reflog (recovery tool for lost commits)

### What GitHub Handles

-   Remote repository storage and availability
-   Branch protection rule enforcement
-   Code review enforcement (PR requirement)
-   Access control and authentication
-   CI/CD pipeline triggers

### Developer Responsibilities (Personal Accountability)

Every developer is responsible for:

-   Writing clear commit messages
-   Not committing secrets or credentials
-   Reviewing their own code before requesting review
-   Testing their code locally before pushing
-   Resolving merge conflicts they create
-   Adhering to branch naming conventions
-   Keeping local branches clean
-   Notifying the team if they push to main (immediately)

### Shared Ownership Rules

In a 3–6 person team, "shared ownership" means:

-   Any developer can approve PRs (except their own)
-   Any developer can merge to main (only if requirements are met)
-   Any developer can cut a release
-   Any developer can initiate a hotfix
-   **If a change breaks production, whoever merged it bears responsibility**, not "the code owner"

### Escalation Ownership

-   **Local issues** (merge conflicts, lost commits): Resolver owns it; ask the team if stuck
-   **PR reviews** (slow reviews): Author can ping any developer for review; if no response in 4 hours, contact senior dev
-   **Broken main/production**: First person to detect it owns the investigation and fix attempt; escalate to team if unresolved in 30 minutes
-   **Disputes over Git decisions** (rebase vs merge, branch strategy): Senior engineering manager decides; document decision in this manual immediately

----------

## 2. Repository Standards

### Required Repository Structure

```
repository-root/
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
├── src/                     # Application source code
├── tests/                   # Test suite
├── docs/                    # Documentation
├── .gitignore              # See section below
├── .env.example            # Template for environment variables
├── README.md               # Mandatory
├── CHANGELOG.md            # Mandatory
├── package.json (or equivalent dependency file)
└── LICENSE                 # Recommended

```

### Mandatory Files

#### README.md

-   Must exist in repository root
-   Must include:
    -   One-line project description
    -   Quick start instructions (how to run locally)
    -   List of dependencies and versions
    -   Development workflow link (point to this manual)
    -   Contact/Slack channel for questions

#### .gitignore

Must include patterns for:

-   Node modules (`node_modules/`)
-   Python virtualenv (`venv/`, `.venv/`)
-   IDE files (`.vscode/`, `.idea/`)
-   OS files (`DS_Store`, `Thumbs.db`)
-   Log files (`*.log`)
-   Environment files (`.env`, `.env.local`)
-   Build artifacts (`dist/`, `build/`)
-   Package lock inconsistencies (if using lockfiles, commit them; if ignoring, document why)

#### .env.example

-   Must exist and be committed
-   Contains all env variable names with placeholder values
-   No real credentials or secrets
-   Must stay in sync with actual `.env` structure
-   Developers copy to `.env` locally and fill in real values

#### CHANGELOG.md

-   Must exist
-   Manually updated with every release
-   Format: List releases from newest to oldest with date and changes
-   Used for release notes

### Branch Protection Rules

#### main branch must enforce:

```
✓ Require pull request reviews before merging
  └─ Minimum 1 approval required
✓ Require status checks to pass before merging
  └─ All CI/CD pipelines must pass
✓ Require branches to be up to date before merging
✓ Require conversation resolution before merging
✓ FORBIDDEN: Allow force pushes
✓ FORBIDDEN: Allow deletions

```

#### develop branch (if using Git Flow) must enforce:

```
✓ Require pull request reviews before merging (minimum 1)
✓ Require status checks to pass before merging
✓ FORBIDDEN: Allow force pushes
✓ FORBIDDEN: Allow deletions

```

#### release/* branches:

```
✓ Require pull request reviews before merging (minimum 1)
✓ FORBIDDEN: Allow force pushes
✓ FORBIDDEN: Allow deletions

```

#### hotfix/* branches:

```
✓ Require status checks to pass
- May bypass PR approval if production is actively broken
  (document override reason in GitHub)

```

----------

## 3. Local Development Workflow (Daily Use)

### Daily Workflow Checklist

#### Before Starting Work

```bash
# 1. Make sure you're on the correct branch
git branch -v

# 2. Fetch latest changes (do NOT automatically merge)
git fetch origin

# 3. Check if your branch is behind
git log --oneline origin/main..HEAD  # Commits only in your branch
git log --oneline HEAD..origin/main  # Commits you're behind on

# 4. If behind, rebase onto main (see section 6)
git rebase origin/main

```

#### Making Changes

```bash
# 1. Edit your files
# 2. Check what changed
git status
git diff                # Unstaged changes
git diff --staged       # Staged changes

# 3. Stage changes (not everything at once)
git add src/file.js     # Specific file
git add src/            # Entire directory
# Do NOT use: git add .  (too risky; use git add --interactive if unsure)

# 4. Review what you're committing
git diff --staged

# 5. Commit with a clear message (see standards below)
git commit -m "Fix: prevent null pointer in user service"

```

#### Before Pushing

```bash
# 1. Make sure main is not broken locally
npm test (or your test command)

# 2. Check what you're about to push
git log --oneline main..HEAD   # Your commits only
git log --oneline -p HEAD~3..HEAD  # Last 3 commits with diffs

# 3. Check for hardcoded secrets, credentials, tokens
git diff origin/HEAD..HEAD     # Review everything you're pushing

# 4. If all good, push
git push origin your-branch-name

# 5. After push, verify it appeared on GitHub

```

### When to Commit

-   After completing a single logical unit of work
-   After a small, testable change
-   After changes that compile/pass tests
-   When you can write a meaningful commit message in one sentence
-   Roughly every 15–30 minutes of work (not every keystroke)

### When NOT to Commit

-   When code doesn't compile or has syntax errors
-   When you're mid-refactor and things are broken
-   When you have untested changes in production code
-   When you don't know what you're committing (staged too much)
-   When your commit message would be "stuff" or "WIP" (use git stash instead)

### Commit Frequency Guidance

-   **Too frequent** (every line): Creates noise, makes history unreadable
-   **Too infrequent** (once per day): Makes blame/bisect useless, hard to revert parts
-   **Goldilocks zone**: Logical units, 5–20 line changes per commit, understandable message

### Commit Message Standard

#### Format

```
<type>: <short description (50 chars max)>

<optional body explaining why, not what (72 chars per line)>

<optional footer: Refs #123, Fixes #456>

```

#### Types (choose one)

-   `feat:` New feature or capability
-   `fix:` Bug fix for existing feature
-   `refactor:` Code restructure (no behavior change)
-   `test:` New tests or test fixes
-   `docs:` Documentation updates
-   `perf:` Performance improvement
-   `chore:` Dependency updates, config changes

#### Good Examples

```
✓ fix: prevent race condition in auth token refresh
✓ feat: add two-factor authentication to login flow
✓ refactor: extract database connection logic to factory pattern
✓ perf: cache user profile queries for 5 minutes
✓ docs: update API response schema in README

```

#### Bad Examples

```
✗ fixed stuff
✗ WIP
✗ asdf
✗ update
✗ final final final
✗ fix: changed line 42 because I had to (what does "I had to" mean?)
✗ commit from my phone

```

#### Optional Body (Use When)

-   Change is not obvious from title
-   You made a non-obvious decision and need to explain why
-   Change affects multiple areas
-   Change is a workaround (explain the underlying issue)

Example:

```
fix: increase timeout for slow API calls

The CRM integration sometimes takes 8+ seconds to respond.
Previously set to 5s, causing false failures. Increased to 12s
with monitoring to detect if CRM is genuinely broken.

Refs #789

```


### Impact of Poor Commits in Small Teams

| Poor Practice | Immediate Impact | Long-Term Impact |
|--------------|------------------|-----------------|
| Commits with 50 files, unclear message | Reviewer can't understand what changed; delays PR approval | Impossible to bisect bugs; `git blame` points to the wrong commit |
| Commits that break tests | Broken `main` branch; everyone blocked | Loss of trust in commit history |
| WIP commits or "checkpoint" commits | History noise; hard to revert specific features | Time wasted reading meaningless messages |
| Commits with both refactor + feature | Can't revert feature without losing refactor; unclear PR | Difficult post-mortem analysis in production incidents |
| Commits without body explaining *why* | Code looks like random changes | New developers misunderstand intent; changes get reverted later |


----------

## 4. Branching Strategy (Small Team Optimized)

### Chosen Strategy: GitHub Flow (Not Git Flow)

**Why GitHub Flow for small teams:**

-   Git Flow has `main`, `develop`, `release/`, `hotfix/` branches → too many branches to track
-   Trunk-based (all PRs to main) with 3–6 devs → merge conflicts every day
-   GitHub Flow balances safety with simplicity:
    -   Single long-lived branch (`main`)
    -   Short-lived feature branches
    -   Every PR is a release candidate
    -   Hotfixes are just fast-tracked PRs

### Allowed Branch Types

#### main (primary branch)

-   Single source of truth for production
-   Always in a deployable state
-   Protected; only merge via PR
-   Must pass CI/CD before merge
-   Tagged with semantic versions on release

#### feature/* (temporary, short-lived)

-   Created from: `origin/main`
-   Naming: `feature/short-description` (hyphens, lowercase)
-   Examples:
    -   `feature/user-authentication`
    -   `feature/dashboard-redesign`
    -   `feature/api-caching`
-   Lifespan: Maximum 3 calendar days
-   Delete immediately after merge

#### bugfix/* (temporary, short-lived)

-   Created from: `origin/main`
-   Naming: `bugfix/issue-number-short-description`
-   Examples:
    -   `bugfix/123-null-pointer-crash`
    -   `bugfix/456-missing-validation`
-   Lifespan: Maximum 1 calendar day
-   Delete immediately after merge

#### hotfix/* (emergency, short-lived)

-   Created from: `origin/main` when production is broken
-   Naming: `hotfix/issue-number-short-description`
-   Examples:
    -   `hotfix/789-payment-service-down`
    -   `hotfix/790-data-export-corrupted`
-   Lifespan: Maximum 2 hours
-   Delete immediately after merge
-   Bypass normal PR review if production is actively failing (document override in GitHub)

#### NOT ALLOWED

-   Personal branches (`john-stuff`, `experimental`, `temp`)
-   Version branches (`v1.2.3`, `release-1-2-3`)
-   Branches for "later" merges (`old-code-backup`, `maybe-use-this`)

### Branch Naming Conventions

#### Rules

1.  Use lowercase only
2.  Use hyphens as separators (not underscores or camelCase)
3.  Maximum 50 characters
4.  Start with type prefix: `feature/`, `bugfix/`, `hotfix/`
5.  Include issue number if applicable
6.  Describe what, not why

#### Valid Examples

```
feature/payment-processing
feature/user-profile-modal
bugfix/123-auth-session-timeout
bugfix/456-csv-export-encoding
hotfix/789-database-connection-leak

```

#### Invalid Examples

```
feature_payment_processing       ✗ (underscores)
Feature/PaymentProcessing        ✗ (uppercase)
feature/payment-processing-oh-wait-also-analytics  ✗ (too long)
my-feature                       ✗ (no type prefix)
feature/refactor                 ✗ (too vague)
hotfix/temp-fix-john-debugging   ✗ (personal reference)

```
### Maximum Branch Lifespan Rules

| Branch Type | Max Lifespan | Reason |
|------------|--------------|--------|
| `feature/*` | 3 calendar days | Longer PRs increase conflicts and reviewer fatigue |
| `bugfix/*` | 1 calendar day | Bugs should be fixed fast |
| `hotfix/*` | 2 hours | Production is broken; speed is critical |

**If a branch exceeds its lifespan:**

1. Ping the author in Slack  
2. If no response in 1 hour, any developer may close the branch without merging  
3. The author must re-open a new branch with the same or similar changes  
4. Notify the senior manager if the same developer repeatedly exceeds lifespan rules

### When Branches Must Be Deleted

After merge:

-   **GitHub:** Delete button appears on merged PR → click it immediately
-   **Local:** Run `git branch -D branch-name` after verifying merge completed
-   **Check:** Run `git branch -a | grep branch-name` to confirm gone from both local and remote

Branches are NOT deleted if:

-   PR is still open (wait until merged)
-   Merge is reverted (keep until root cause fixed, then delete)
-   Branch is needed for ongoing hotfix follow-up (delete within 24 hours)

**Consequences of leaving old branches around:**

-   Cluttered branch list makes it harder to see what's active
-   Developers accidentally base new work on old branches
-   Failed branch builds create false alerts in Slack

----------

## 5. Pull Requests (PRs) & Code Reviews

### When PRs Are Mandatory

-   **Always.** Every change to `main`, `develop`, or `release/*` must go through a PR.
-   No exceptions, no direct pushes, no "I'll merge it myself."

### When Direct Commits Are Allowed

-   Never to `main`, `develop`, or `release/*`
-   Only to temporary branches (feature/_, bugfix/_, hotfix/*)
-   If you're working solo on a feature branch, you can force push to your own branch to clean up history (but do NOT do this on any shared branch)

### PR Creation Checklist

Before opening a PR:

```
☐ Branched from latest main: git rebase origin/main
☐ All tests pass locally: npm test (or equivalent)
☐ Code compiles/runs without errors
☐ Commit messages follow standard (section 3)
☐ No console.log or debugging code left in
☐ No hardcoded credentials, API keys, or secrets
☐ Reviewed your own changes: git diff origin/main..HEAD
☐ .env.example updated if env vars changed
☐ README updated if setup changed

```


### PR Size Limits and Reasoning

| PR Size | Acceptable | Reviews Take | Issues |
|--------|------------|--------------|--------|
| < 200 lines | Always | 10–15 min | Thorough review possible; approved same day |
| 200–400 lines | Usually OK | 20–30 min | Longer review time; higher defect rate |
| 400–800 lines | Reconsider | 1+ hour | Reviewer fatigue; bugs are easy to miss |
| > 800 lines | Split into 2+ PRs | N/A | Unacceptable; exceeds cognitive load |

**If your PR exceeds 400 lines:**  
Split it into multiple sequential PRs, stack them as dependent branches, and clearly document the dependency in each PR description.


### PR Description Template

Every PR must include:

```markdown
## What
Brief description of what changed (one sentence).

## Why
Why was this change made? Link to issue if applicable (#123).

## How
How does the code achieve the goal? Explain non-obvious parts.

## Testing
How did you test this locally? What manual tests did you do?

## Risks
Any known edge cases, performance concerns, or potential issues?

## Checklist
- [ ] Tests pass locally
- [ ] No secrets in code
- [ ] Documentation updated
- [ ] Reviewed own changes

```

Example:

```markdown
## What
Add rate limiting to API endpoints to prevent abuse.

## Why
API was receiving 10k+ requests/second from single IPs, causing
service degradation. Fixes #234.

## How
Uses Redis to track requests per IP, 100 req/sec per IP limit,
returns 429 (Too Many Requests) on exceed. Whitelist for internal
IPs in .env.

## Testing
- Locally simulated 150 req/sec and verified 429 response
- Tested whitelist functionality with internal IP ranges
- No performance impact on normal load

## Risks
Rate limit may need tuning based on real-world traffic patterns.
Redis dependency adds 2–5ms latency per request.

## Checklist
- [x] Tests pass locally
- [x] No secrets in code
- [x] Updated .env.example
- [x] Reviewed own changes

```

### Review Expectations Per Team Size

#### 3 developers

-   Minimum 1 approval required
-   Any developer can approve
-   Review must happen within 4 hours (SLA)
-   If author unavailable, reviewer can merge after 1 approval
-   Senior dev should review security/infra changes

#### 4–6 developers

-   Minimum 1 approval required (2 for production-critical changes)
-   Any developer can approve
-   Review must happen within 4 hours (SLA)
-   Rotating reviewer assignment prevents one person reviewing everything

### Approval Rules

#### Who can approve

-   Any developer on the team (except the author of the PR)
-   No "self-approval" ever

#### What qualifies as approval

-   GitHub "Approve" button with comment
-   Comment "Looks good, approved"
-   Thumbs up emoji on PR (NOT sufficient on its own; use Approve button)

#### What happens if approval is skipped

-   PR cannot merge (GitHub blocks it)
-   If CI/CD passes but approval missing, human error occurred
-   Merge requester must manually request approval from at least 1 developer

#### Special cases

**Security review required for:**

-   Changes to authentication/authorization
-   Changes to secrets management
-   Changes to API access control
-   Any new external dependency

**If no senior dev is available for security review:**

-   Any two junior developers can approve together
-   Document the decision in PR comments
### What Happens If Reviews Are Skipped

| Scenario | Consequence | Recovery |
|---------|-------------|----------|
| Merged without approval (branch protection fails) | GitHub blocks the merge; cannot proceed | Obtain approval and retry merge |
| Merged via force push bypassing protection | Team notified; code merged unsafely | Immediate post-merge review; document override reason |
| Reviewed but insufficient review time | Defect reaches `main`; may reach production | Revert if caught pre-release; senior manager investigates |
| PR merged with failing CI/CD | `main` is broken; all developers blocked | Immediate revert; root cause analysis required |




----------

## 6. Merge Strategy & Conflict Handling

### Merge vs Rebase Rules

#### Policy

-   **Feature/bugfix PRs to main:** Squash merge (one commit per PR)
-   **Release branch back to main:** Merge commit (preserve release structure)
-   **Hotfix PRs to main:** Squash merge for cleanliness

#### Rationale

-   Squash keeps main history clean (one commit = one feature)
-   Merge commits preserve release timeline
-   Avoids rewriting main history after merge (main is immutable)

#### How to Set Merge Strategy in GitHub

1.  Go to repository **Settings** → **Pull Requests**
2.  Configure allowed merge methods:
    -   ✓ Squash and merge (default)
    -   ✓ Merge pull requests (for releases)
    -   ✗ Allow rebase merging (disabled to prevent rewriting main)

### Rebase Rules for Local Work

Use rebase to update your feature branch with latest main:

```bash
# Before pushing/PR, bring in latest changes
git fetch origin
git rebase origin/main

# If you want to keep your branch commit message clean
git rebase -i origin/main    # Interactive rebase to squash/fixup commits

```

**Never rebase after pushing.** Once pushed, your team may be building on your branch. Rebase only on local branches before first push.

### Conflict Resolution Process

#### If conflicts occur during rebase/merge

1.  **Don't panic.** Conflicts are normal in a 3–6 person team.
    
2.  **Identify what conflicts:**
    
    ```bash
    git status                    # Shows conflicted files
    git diff --name-only --diff-filter=U   # Unmerged files only
    
    ```
    
3.  **Understand both sides:**
    
    ```bash
    git show :1:filename          # Their version (from main)
    git show :2:filename          # Your version (from your branch)
    git show :3:filename          # Common ancestor version
    git diff :1:filename :2:filename  # Diff between theirs and yours
    
    ```
    
4.  **Resolve manually:**
    
    -   Open the conflicted file in editor
    -   Conflicts marked with `<<<<<<<`, `=======`, `>>>>>>>`
    -   Keep the correct code (may be both, may be one side)
    -   Delete conflict markers
    -   Test the code locally to ensure it works
5.  **Mark resolved:**
    
    ```bash
    git add conflicted-file.js
    git rebase --continue         # If rebasing
    # OR
    git commit -m "Merge: resolve conflicts" # If merging
    
    ```
    
6.  **Verify result:**
    
    ```bash
    git log -1 --name-status  # See what was merged
    npm test                  # Make sure nothing broke
    
    ```
    
7.  **Push:**
    
    ```bash
    git push origin your-branch-name -f   # -f only if you just rebased locally
    
    ```
    


### Who Resolves Conflicts and When

| Conflict Type | Who Resolves | Timeline |
|--------------|--------------|----------|
| During your local rebase | You (author of the feature branch) | Before pushing |
| During PR merge | You (author) if notified; reviewer if urgent | Before merging |
| On `main` (post-merge) | Whoever pushed the bad merge | Immediately (within 30 min) |

**If conflict resolution takes more than 30 minutes:**

- Stop and ask for help  (avoid thrashing)
- Walk through the conflict with a peer
- Document the tricky parts in the commit message body


### What NOT to Do During Conflicts

```bash
# ✗ DO NOT: Abort and start over (wastes time)
git rebase --abort
git merge --abort

# ✗ DO NOT: Use git accept-ours / accept-theirs blindly
git checkout --ours filename
git checkout --theirs filename
# (You might lose code)

# ✗ DO NOT: Delete conflict markers and hope it works
# (Code will be incomplete or broken)

# ✗ DO NOT: Merge main back into your feature branch repeatedly
git merge origin/main    # Avoid this; use rebase instead

# ✗ DO NOT: Force push after merge (main is protected anyway)
git push origin main -f  # GitHub blocks this

# ✗ DO NOT: Ignore unresolved conflicts and push
git push                 # Git won't let you

```

----------

## 7. Versioning, Releases & Hotfixes

### Release Tagging Rules

#### Semantic Versioning (Required)

Format: `major.minor.patch` (e.g., `1.2.3`)

-   **major:** Breaking changes (users must update code)
-   **minor:** New features (backward compatible)
-   **patch:** Bug fixes (no new features)

#### When to increment

```
1.0.0 → 1.0.1        fix: small bug fix
1.0.0 → 1.1.0        feat: new feature (backward compatible)
1.0.0 → 2.0.0        breaking change: removed deprecated API

```

#### Tag naming in GitHub

```
v1.2.3                # Standard (v prefix)
NOT: 1.2.3            (no prefix)
NOT: release-1.2.3    (non-standard)
NOT: v1.2.3-prod      (no suffix)

```

#### Tag creation process

```bash
# 1. Ensure you're on main and up to date
git checkout main
git pull origin main

# 2. Verify what you're releasing (last commit or last 5)
git log --oneline -n 5

# 3. Create an annotated tag (not lightweight)
git tag -a v1.2.3 -m "Release 1.2.3: bug fixes and performance improvements"

# 4. Push tag to GitHub
git push origin v1.2.3

# 5. In GitHub, create Release from tag with notes (see CHANGELOG.md)

# 6. Verify in GitHub UI

```

### Release Workflow

#### Pre-Release Checklist

```
☐ All PRs merged and reviewed
☐ Main branch builds successfully (CI/CD passes)
☐ All tests pass locally and in CI/CD
☐ README versions are current
☐ CHANGELOG.md updated with all changes since last release
☐ No outstanding security issues or known bugs
☐ Notify team: "Releasing version X.Y.Z in 15 minutes"

```

#### Release Steps

```
1. Create release branch (optional, but recommended for safety):
   git checkout -b release/v1.2.3

2. Update version in package.json (or version file):
   "version": "1.2.3"

3. Update CHANGELOG.md:
   ## [1.2.3] - 2026-01-15
   ### Added
   - New user authentication flow
   ### Fixed
   - Null pointer crash in data export

4. Commit:
   git commit -m "chore: release version 1.2.3"

5. Create PR, merge to main after approval

6. Tag and push (see above)

7. Deploy to production:
   - GitHub Actions workflow triggered automatically (recommended)
   - OR manual deployment by designated person

8. Verify production:
   - Health checks passing
   - Basic functionality works
   - No error spikes in logs

9. Announce release to stakeholders (Slack, email)

```

### Hotfix Workflow (Urgent Production Issues)

Use only when production is actively broken or severely degraded.

#### Hotfix Checklist

```
☐ Production issue confirmed and isolated
☐ Issue is blocking users or causing data loss
☐ Issue cannot wait for next regular release (usually < 4 hours)
☐ Root cause identified (don't guess)

```

#### Hotfix Steps

```bash
# 1. Create hotfix branch from main (not develop)
git checkout main
git pull origin main
git checkout -b hotfix/issue-number-short-desc

# 2. Fix the issue (minimal, surgical change)
# - Do NOT refactor while fixing
# - Do NOT add new features
# - Only fix the broken thing

# 3. Test extensively locally
npm test
npm start  # Verify by hand

# 4. Commit with clear message
git commit -m "hotfix: fix payment processing timeout

Production was failing to process 40% of transactions due to
5-second timeout being too short for CRM integration. Increased
to 12 seconds based on logs showing 8–10 second CRM response time.

Fixes #999"

# 5. Push and create PR
git push origin hotfix/issue-number-short-desc

# 6. Get approval (may bypass normal review if production is actively broken)
# - Add "🔴 HOTFIX" to PR title
# - In comments: note that this bypasses normal review due to production impact
# - At least one other developer should review within 30 minutes

# 7. Merge (squash merge)
# - Use GitHub UI or: git merge --squash hotfix/... then git push

# 8. Delete branch immediately
git push origin --delete hotfix/issue-number-short-desc

# 9. Tag as patch release
git tag -a v1.2.4 -m "Hotfix: payment processing timeout"
git push origin v1.2.4

# 10. Deploy to production (same as regular release)

# 11. Monitor for 1 hour
# - Check logs for errors
# - Monitor transaction rates
# - Check error tracking (Sentry, etc.)

# 12. Communicate all-clear to stakeholders

```

### Rollback Strategy

If a release breaks production:

#### Immediate Actions (First 10 minutes)

```
1. Stop deployment if still in progress
2. Assess damage:
   - Is partial functionality broken or total?
   - How many users affected?
   - Is data being corrupted?
3. Post in #incidents Slack channel with status
4. Get one other developer to verify the problem (not just you)

```
#### Decide: Rollback or Hotfix

| Scenario | Decision | Action |
|---------|----------|--------|
| Total system down, no workaround | **Rollback** | Revert to the previous version immediately |
| Partial feature broken, other features work | **Hotfix** | Create a hotfix if the fix takes < 30 min; otherwise rollback |
| Data corruption or data loss | **Rollback immediately** | Do not attempt a hotfix; investigate post-incident |
| Minor bug, no user impact | **Do not rollback** | Create a hotfix within the next hour |


#### Rollback Execution

```bash
# 1. Identify previous stable version (from GitHub Releases)
# Example: rolling back from v1.2.3 to v1.2.2

# 2. Revert to previous tag (do NOT delete current tag)
git checkout v1.2.2

# 3. Deploy v1.2.2 to production (same deployment mechanism)

# 4. Verify in production (health checks, smoke test)

# 5. Post update in #incidents:
# "Rolled back from v1.2.3 to v1.2.2. System stable. RCA in progress."

# 6. Root cause analysis (do within 24 hours):
# - What went wrong?
# - Why didn't tests catch it?
# - How to prevent in future?
# - Document in #incidents or internal wiki

# 7. Create new hotfix branch to fix the real issue:
git checkout -b hotfix/issue-number
# ... make fix ...
# ... release as v1.2.3-hotfix or v1.2.4 depending on what changed ...

# 8. After hotfix is thoroughly tested and approved, redeploy

```
### Responsibility During a Broken Release

| Phase | Owner | Actions |
|------|-------|---------|
| **Detection** | Whoever sees the error first | Notify the team immediately; post in `#incidents` |
| **Assessment** | Any available developer | Determine rollback vs hotfix; get a second opinion |
| **Rollback decision** | Senior engineering manager (or on-call, if assigned) | Approve or reject the rollback |
| **Execution** | Any developer (coordinate in Slack to avoid duplicates) | Perform rollback or deploy hotfix |
| **Communication** | Whoever ran the fix | Update `#incidents` every 10 minutes until resolved |
| **RCA and prevention** | Developer who merged + whoever cut the release | Complete RCA within 24 hours; document in the wiki |

**If no clear owner, the senior manager decides.**

----------

## 8. Secrets, Configs & Security Rules

### What Must Never Be Committed

#### Absolute ban list

```
# Credentials
- API keys (Stripe, AWS, Google, Twilio, etc.)
- Passwords (database, admin, service accounts)
- OAuth tokens, refresh tokens, session tokens
- SSH private keys
- SSL certificates (private key only; public cert OK)
- Auth0/Firebase secrets

# Data
- Real customer data (email addresses, phone numbers, SSN, etc.)
- Real payment card numbers (even partial)
- Real database backups or exports

# Environment
- .env files with real values
- config.json with real credentials
- docker-compose with hardcoded secrets
- Kubernetes secrets manifests

# Examples of what NOT to commit
✗ git commit -m "add api key" (key in code)
✗ git add .env              (real env file)
✗ git add config.prod.json  (production config)

```

### Handling Environment Files

#### Safe approach

```
DO:
✓ Commit .env.example with placeholder values
✓ Commit .env.sample with template structure
✓ .gitignore includes .env, .env.local, .env.production
✓ Document in README how to set up .env

DO NOT:
✗ Commit any .env.* file with real secrets
✗ Gitignore .env.example (it must be in repo)
✗ Leave .env setup as "figure it out yourself"

```

#### .env.example format

```env
# Database
DATABASE_URL=postgresql://localhost:5432/myapp_dev
DATABASE_PASSWORD=your-password-here

# API Keys
STRIPE_API_KEY=sk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx

# OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Service URL
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

```

#### Developer setup (documented in README)

```bash
# Copy template and fill in real values
cp .env.example .env

# Retrieve secrets from secure location:
# 1. For local dev: use integration keys from provider dashboard
# 2. For CI/CD: secrets stored in GitHub Secrets (encrypted)
# 3. For production: use environment variables set by DevOps/infra team

```

### Secrets Rotation Rules After Accidental Exposure

If a secret is committed and pushed:

#### Immediate (within 1 hour)

```
1. Do NOT try to "fix" by deleting it in a new commit
   (It's still in history; deletion is useless)

2. Notify team immediately in #security Slack channel

3. Disable the leaked secret immediately:
   - Stripe: regenerate API key
   - AWS: disable access key, create new one
   - GitHub/GitLab: revoke personal access token
   - Database: change password
   - Anything else: follow provider's revocation process

4. Verify the leaked secret is no longer active (test with old key; should fail)

```

#### Short-term (within 24 hours)

```
1. Notify relevant stakeholders (security team, PII team, etc.)

2. If production secret was leaked:
   - Audit logs: check if secret was used from outside
   - Check for unauthorized access/changes
   - Document findings

3. Permanently remove from Git history:
   git filter-branch --tree-filter 'rm -f path/to/file' HEAD
   # OR use BFG Repo-Cleaner (easier for large repos):
   bfg --delete-files filename

4. Force push to remove from remote:
   git push origin main -f

5. Notify all developers to re-fetch (their local histories may have old secret)

```

#### Post-incident (within 1 week)

```
1. Conduct brief review:
   - How did secret get committed?
   - Why wasn't .env.example used?
   - Was .gitignore not set up correctly?

2. Prevent recurrence:
   - Add pre-commit hook to detect secrets (see tooling section)
   - Audit .gitignore for gaps
   - Update onboarding checklist

3. Document in team wiki/Slack summary

```

### Secret Detection Tools (Recommended Setup)

#### Local: Pre-commit hook

Install git-secrets or similar:

```bash
# Option 1: git-secrets (AWS-maintained)
brew install git-secrets
git secrets --install
git secrets --register-aws

# Option 2: detect-secrets (Yelp)
pip install detect-secrets
detect-secrets scan > .secrets.baseline

```

#### CI/CD: GitHub Actions

```yaml
name: Secret Detection
on: [pull_request]
jobs:
  detect-secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: detectsecrets-action@v0.13
        with:
          baseline: .secrets.baseline

```

#### Result: Blocked PR if secrets detected (fails CI)


### Consequences of Leaking Secrets

| Exposure | Immediate Risk | Long-term Consequence |
|---------|----------------|-----------------------|
| API key (non-sensitive) | Can be rotated; low risk | Added to vault history |
| Database password | Unauthorized DB access; data breach risk | Full password rotation required; audit log review |
| OAuth token | Account takeover; unauthorized API calls | Revoke token; review audit logs for abuse |
| SSH private key | Server compromise | Regenerate keypair; audit server access logs; check for backdoors |
| AWS / cloud credentials | Complete infrastructure access | Revoke credentials; audit all resource changes; rotate all related secrets |



----------

## 9. Failure & Recovery Scenarios

### Accidental Commit to main

**Scenario:** You pushed a commit directly to main (bypassed PR).

#### Immediate Fix (If not yet deployed)

```bash
# 1. Get the commit hash
git log --oneline -n 5

# 2. Revert it (creates new commit that undoes your commit)
git revert <commit-hash>

# 3. Push the revert
git push origin main

# 4. Notify team: "Accidentally pushed to main. Reverted <commit-hash>. Reopening as PR."

# 5. Create proper PR from feature branch
git checkout -b feature/my-feature
git cherry-pick <commit-hash>
git push origin feature/my-feature
# Then open PR normally

```

#### If Already in Production

```
1. Immediate: Run revert command above
2. Deploy revert to production
3. Create hotfix to fix the issue properly
4. Escalate to senior manager: brief incident review
5. Update branch protection rules if enforcement failed

```

#### Root Cause

-   Did branch protection fail? (GitHub admin checks rules)
-   Did developer accidentally force push? (git push origin main -f)
-   Was main not protected? (Enable protection immediately)

### Broken main Branch

**Scenario:** Someone merged broken code and main no longer builds.

#### Detection

```bash
# Everyone should see CI/CD failure notification
# Check GitHub Actions: Red X on latest commit

```

#### Immediate Response (First 30 minutes)

```
1. STOP all other work; this is a blocker

2. Post in #incidents: "Main branch broken. Investigating."

3. Find the most recent commit:
   git log --oneline -n 3

4. Identify the culprit commit:
   git show <commit-hash>       # View the commit
   git diff <commit-hash>~1..<commit-hash>  # See exact changes

5. Two options:
   Option A: Revert if fix is unclear
   git revert <commit-hash>
   git push origin main

   Option B: Quick hotfix if issue is obvious
   git checkout main
   git pull origin main
   # Fix the code
   git commit -m "fix: resolve build error from <commit-hash>"
   git push origin main

6. Verify fix:
   git log --oneline -n 2
   Check GitHub Actions: Green checkmark

```

#### Post-Incident

```
1. Notify #incidents: "Main is fixed. Cause: X. RCA below."

2. Root cause analysis:
   - Did author test locally? (npm test not run)
   - Did CI/CD fail but merge happened anyway? (CI not set to block)
   - Did reviewer miss it? (code review was insufficient)

3. Prevent recurrence:
   - Require CI/CD pass before merge (enforce in branch protection)
   - Add pre-push hook to run tests locally
   - Retrain developer on local testing

```

#### Prevention Checklist

```
☐ CI/CD pipeline runs on every PR
☐ CI/CD must pass before merge (not optional)
☐ Developer tests locally before pushing:
   npm test
   npm build
   npm start  # Manual smoke test

☐ Branch protection enforces CI/CD status check
☐ New developers onboarded on test requirements

```

### Bad Merge

**Scenario:** Two people merged conflicting changes and the result is broken.

#### Diagnosis

```bash
# Identify the merge commit
git log --oneline -n 5
# Will show something like: "Merge pull request #456 ..."

# See what was merged
git show <merge-commit-hash>

# Compare to the commit before merge
git diff <merge-commit-hash>~1..<merge-commit-hash>

```

#### Recovery Option 1: Revert the Merge

```bash
# If the merge is recent and not yet in production
git revert -m 1 <merge-commit-hash>
git push origin main

# Update the PR/comment: "Merge reverted due to conflict issues.
# Please resolve conflicts and re-submit."

```

#### Recovery Option 2: Fix the Conflict Properly

```bash
# If you understand the conflict
git checkout main
git pull origin main

# Manually fix the issue
# ... edit files ...
git add fixed-file.js
git commit -m "fix: resolve merge conflict from PR #456

The PR merged with conflicts that weren't properly resolved.
Kept the authentication logic from feature-a and caching from
feature-b, tested both together."

git push origin main

```

#### Root Cause

-   Did developer skip conflict resolution? (rushed merge)
-   Did reviewer not test the merge? (insufficient review)
-   Did CI/CD pass despite broken merge? (tests don't cover scenario)

#### Prevention

```
Before merging:
☐ CI/CD passes
☐ Reviewer runs tests locally on merged version
☐ Reviewer manually tests the specific conflict areas
☐ Commit message explains conflict resolution strategy

Example reviewer comment:
"Approved. Verified locally: auth tokens work with new cache,
no race conditions. Tests pass."

```

### Force Push Damage

**Scenario:** Someone ran `git push -f` and rewrote history.

#### What Happens

-   Remote history is rewritten
-   Other developers have "old" commits locally
-   Merging becomes messy
-   Commits appear to disappear

#### Prevention (Should Not Happen)

```
Branch protection rule:
✗ Do NOT allow force pushes to main, develop, release/*
✓ Allow force push only to personal branches (feature/*, bugfix/*)
  (even then, only before first push to open PR)

```

#### If Force Push Happened on Protected Branch

```
1. GitHub rejects it (branch protection blocks it)

2. If rejected: Developer gets error message, no damage done
   Error: "Permission denied... protected branch"

3. If somehow succeeded (config error):
   a) Check GitHub branch protection settings immediately
   b) Verify settings are correct
   c) Contact GitHub support if unauthorized force push occurred
   d) Restore history from Git reflog (if < 30 days)

```

#### If Force Push on Personal Branch

```
# OK for developer to do:
git push origin feature/my-feature -f

# (Only if they haven't opened PR yet)
# Once PR is opened, no more force pushes (other devs may have checked it out)

# If someone force pushed after PR was opened:
git fetch origin
git reset --hard origin/feature/my-feature  # Accept their version
# Then ask them why in Slack (shouldn't have done it)

```

### Lost Commits

**Scenario:** You can't find a commit you made.

#### Possible Causes

1.  You committed locally but didn't push
2.  You reset/rebased and lost local commits
3.  You switched branches and thought commits were on main
4.  You deleted a branch

#### Recovery Using Reflog

```bash
# Git keeps a safety log of all your actions for ~30 days
git reflog

# You'll see output like:
# a1b2c3d HEAD@{0}: commit: my latest work
# d4e5f6g HEAD@{1}: rebase -i: squash
# h7i8j9k HEAD@{2}: checkout: switching to feature/new-branch
# ...

# Find the commit you want to restore
# Let's say it's at HEAD@{2}

# Option 1: Create a branch from that state
git checkout -b recovery-branch HEAD@{2}
git log -n 3  # Verify commit is there

# Option 2: Cherry-pick the commit to current branch
git cherry-pick a1b2c3d

# Option 3: Reset to that state (destructive, be careful)
git reset --hard HEAD@{2}

```

#### Prevention

```
☐ Push frequently (daily minimum)
☐ Before rebasing, create a backup branch:
   git branch backup-feature-x
   git rebase origin/main
   # After rebase succeeds, delete backup:
   git branch -d backup-feature-x

☐ Don't use git reset --hard unless you're sure
   Use git reset --soft or --mixed instead (safer)

☐ Don't delete branches without checking
   git branch -d feature-x  (safe, won't delete if not merged)
   git branch -D feature-x  (dangerous, deletes even if unmerged)

```

----------

## 10. Do's, Don'ts & Non-Negotiable Rules
### Absolute Rules (No Exceptions)

| Rule | Category | Consequence of Violation |
|-----|----------|--------------------------|
| Every change to `main` must go through a PR | **MANDATORY** | Code does not merge (GitHub blocks it) |
| PR must have ≥1 approval before merge | **MANDATORY** | Code does not merge (GitHub blocks it) |
| CI/CD must pass before merge | **MANDATORY** | Code does not merge (GitHub blocks it) |
| No secrets, API keys, or credentials in code | **MANDATORY** | Security incident; secret rotation; audit |
| Commit message must follow the required format | **MANDATORY** | PR reviewer requests changes |
| Only squash merges to `main` (no merge commits) | **MANDATORY** | Enforced during review; reviewer blocks merge |
| Branch must be deleted after merge | **MANDATORY** | Clutter/confusion; after 2nd offense, senior dev deletes it |
| No force-pushing to `main`, `develop`, `release/*` | **MANDATORY** | GitHub blocks it (branch protection) |
| Max PR size: 400 lines (split if larger) | **MANDATORY** | Reviewer requires split before approval |

---

### Forbidden Practices

| Practice | Why It's Forbidden | What Happens If You Do It |
|--------|--------------------|---------------------------|
| Committing `.env` files with real secrets | Exposes credentials to the team and GitHub history | Security incident; key rotation; incident report |
| Using `git push -f` on shared branches | Rewrites history; breaks others’ local copies | GitHub blocks it; if bypassed, reflog recovery required |
| Merging without reading the code | Broken code reaches production | Revert + RCA + disciplinary action |
| Commits like `"stuff"` or `"WIP"` | Unreadable history; impossible to blame/bisect | Reviewer requires squash/rebase before merge |
| Skipping tests locally before pushing | CI/CD fails; blocks the team | CI/CD failure; you revert your own PR |
| Opening multiple PRs from the same branch | Tracking and merge conflicts become unmanageable | Reviewer requests consolidation into one PR |
| Rebasing after pushing (shared branches) | Breaks other developers’ local histories | Git rejects push or requires coordination; senior dev resolves |
| Keeping branches open for > 3 days | Branch diverges; conflicts accumulate | Senior dev closes branch; work must restart |
| Merging without CI/CD passing | Broken `main` | GitHub blocks it; if merged, immediate revert |
| Leaving TODO/FIXME without issues | Work is forgotten; tech debt grows | Reviewer blocks merge until issue is created |

---

### Optional Practices

| Practice | When It's OK | When to Avoid |
|--------|--------------|---------------|
| Use `git stash` | Temporarily save uncommitted work | Do not use as long-term storage |
| Use `git cherry-pick` | Move a specific commit between branches | Do not copy into `main`; use a PR instead |
| Rebase for local cleanup | Clean commit history before first PR | Never rebase after pushing shared branches |
| Leave code comments | Explain *why*, not *what* | Don’t use comments as a TODO list |
| Use `--no-ff` merge | Preserve history in some orgs | Not used here; squash merge preferred |
| Use GitHub Discussions | Async RFC or architecture discussion | Not required; Slack is primary |


## 11. Command Cheat Sheets & Decision Tables

### Essential Git Commands (Quick Reference)

#### Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global core.editor "nano"  # or vim, code, etc

```

#### Cloning & Branch Management

```bash
git clone <repository-url>              # Download repo
git branch                              # List local branches
git branch -a                           # List all branches (local + remote)
git branch -v                           # List with last commit info
git checkout -b feature/name            # Create + switch to new branch
git checkout main                       # Switch to main
git branch -d feature/old               # Delete local branch (safe)
git branch -D feature/old               # Delete local branch (force, lose commits)
git push origin --delete feature/old    # Delete remote branch

```

#### Daily Commits

```bash
git status                              # What changed?
git diff                                # Unstaged changes (detailed)
git diff --cached (or --staged)         # Staged changes (detailed)
git add src/file.js                     # Stage specific file
git add src/                            # Stage all in directory
git commit -m "type: description"       # Commit with message
git push origin feature/name            # Push to remote

```

#### Reviewing Changes

```bash
git log --oneline -n 10                 # Last 10 commits (short format)
git log -p -n 2                         # Last 2 commits with full diff
git log --graph --oneline --all         # Visual branch graph
git show <commit-hash>                  # View specific commit
git diff main..feature/name             # What changed in feature vs main
git diff origin/main..HEAD              # Your commits vs remote main

```

#### Fetching & Updating

```bash
git fetch origin                        # Download changes (no merge)
git fetch origin main                   # Download main only
git pull origin main                    # Fetch + merge (use rarely)
git rebase origin/main                  # Fetch + rebase onto main (preferred)

```

#### Undoing Changes

```bash
git restore file.js                     # Discard changes to file (git 2.23+)
git checkout -- file.js                 # Discard changes to file (older git)
git reset HEAD file.js                  # Unstage file (keep changes)
git reset --soft HEAD~1                 # Undo last commit, keep changes staged
git reset --mixed HEAD~1                # Undo last commit, keep changes unstaged
git reset --hard HEAD~1                 # Undo last commit, lose all changes
git revert <commit-hash>                # Create new commit that undoes old one

```

#### Merge & Rebase

```bash
git rebase origin/main                  # Rebase your branch onto main
git rebase -i HEAD~3                    # Interactive rebase of last 3 commits
git rebase --continue                   # Continue after resolving conflicts
git rebase --abort                      # Cancel rebase
git merge origin/main                   # Merge main into current branch (avoid)
git merge --squash origin/feature/x     # Squash + merge (for PRs, do in GitHub UI)

```

#### Handling Conflicts

```bash
git status                              # See conflicted files
git diff                                # See conflicts in detail
git checkout --ours file.js             # Keep your version
git checkout --theirs file.js           # Keep their version
git add file.js                         # Mark as resolved
git rebase --continue                   # After all resolved

```

#### Stashing (Temporary Storage)

```bash
git stash                               # Save uncommitted changes
git stash list                          # View all stashes
git stash pop                           # Apply + delete most recent stash
git stash apply stash@{0}               # Apply without deleting
git stash drop stash@{0}                # Delete stash

```

#### Recovery

```bash
git reflog                              # View all recent actions
git checkout -b recovery HEAD@{2}       # Recover old state as new branch
git cherry-pick <commit-hash>           # Copy specific commit here
git filter-branch --tree-filter 'rm -f file' HEAD  # Remove file from history

```

#### Tags & Releases

```bash
git tag                                 # List all tags
git tag -a v1.2.3 -m "Release 1.2.3"   # Create annotated tag
git push origin v1.2.3                  # Push tag to remote
git checkout v1.2.3                     # Check out specific version
git log --oneline --decorate            # Show tags in log

```

----------


### Decision Tables

#### "I need to do X, what's the right Git command?"

| Goal | Command | Why This One |
|----|--------|--------------|
| Create a new feature branch | `git checkout -b feature/name` | Creates and switches to a new branch from current `HEAD` |
| Save work without committing | `git stash` | Temporary storage; avoids polluting history |
| Update my branch with latest `main` | `git rebase origin/main` | Replays commits on top of `main`; cleaner than merge |
| See what I'm about to push | `git diff origin/HEAD..HEAD` | Compares local commits against remote |
| Undo last commit, keep changes | `git reset --soft HEAD~1` | Keeps changes staged (`--mixed` keeps them unstaged) |
| Delete a bad commit from history | `git revert <hash>` | Safe; creates a new commit without rewriting history |
| Clean up multiple commits into one | `git rebase -i HEAD~3` then squash | Only if not pushed or only on your machine |
| Resolve a merge conflict | Edit file → remove markers → `git add` → `git commit` | Manual resolution is required; markers show both sides |
| Find which commit broke something | `git bisect` | Binary search through commits |
| Recover a deleted branch | `git reflog` + `git checkout -b <name> <hash>` | Reflog is your safety net (~30 days) |

---

#### "My branch is in state X, what do I do?"

| Situation | Status Check | Action | Command |
|---------|--------------|--------|---------|
| Branch is behind `main` | `git log origin/main..HEAD` shows nothing | Rebase | `git rebase origin/main` |
| Branch has conflicts | `git status` shows *Unmerged paths* | Resolve manually | Edit files → `git add` → `git commit` |
| Committed to wrong branch | `git log -n 1` shows commit on wrong branch | Cherry-pick + revert | `git revert <hash>` (wrong branch), `git cherry-pick <hash>` (correct branch) |
| Pushed after rebase | `git push` rejected as diverged | Force push (solo branch only) | `git push origin <branch> -f` |
| Multiple commits, want to squash | `git log --oneline feature..main` shows many commits | Interactive rebase | `git rebase -i HEAD~5` |
| Accidentally deleted local branch | `git branch -d feature/x` | Check reflog | `git reflog`, recreate branch |
| CI/CD failed but code looks OK | `git log -1 --stat` | Run tests locally | `npm test`, re-push if fixed |
| Can’t remember commit message | `git log --grep="keyword"` | Search history | Or `git log -p` to search by content |

---

#### "I'm in a crisis, what's the fastest fix?"

| Crisis | Diagnosis | Fast Fix | Validate |
|------|-----------|----------|----------|
| `main` won’t build | `git log -1` + `npm test` | `git revert <commit>` | Run tests; check CI |
| PR has conflicts | `git status` on PR branch | `git rebase origin/main` + resolve | `git rebase --continue` |
| Accidentally pushed secrets | `git log --all --grep="api"` | Rewrite history; rotate secret | Verify old key is disabled |
| Lost a commit | `git reflog` | `git cherry-pick <hash>` or recovery branch | `git log` confirms |
| Force push damaged `main` | Branch protection should block | Restore from reflog | Verify history restored |
| Merge conflict is unclear | `git show :1:file :2:file :3:file` | Read all versions; edit manually | Test merged result |
| Author of PR unavailable | Review PR + commits | Merge if safe | Post in Slack: *“Merged PR #X due to timeout”* |

----------

## Appendix: Onboarding Checklist for New Developers

New developer starting on team? Use this checklist:

```
BEFORE FIRST DAY:
☐ Clone repository: git clone <url>
☐ Copy .env.example to .env: cp .env.example .env
☐ Ask on Slack or README where to get real .env values
☐ Install dependencies: npm install (or equivalent)
☐ Run tests: npm test (should all pass)
☐ Run app locally: npm start (should start without errors)

FIRST DAY TASKS:
☐ Read this Git manual (sections 1–5)
☐ Create first branch: git checkout -b feature/first-task
☐ Make a small change, commit, push, open PR
☐ Senior dev reviews PR, gives feedback
☐ You fix feedback, push again
☐ PR gets approved and merged (first time experience)

FIRST WEEK:
☐ Read sections 6–8 (merge, release, security)
☐ Participate in code review (review someone else's PR)
☐ Ask questions when confused (read manual section first, then ask)
☐ Make 5–10 commits; get familiar with git flow

FIRST MONTH:
☐ Read sections 9–12 (recovery, rules, cheat sheets)
☐ Help cut a release (assisted by senior dev)
☐ Experience a hotfix or rollback (if applicable)
☐ Pair with another dev on complex PR

ONGOING:
☐ Follow this manual religiously
☐ Ask senior dev if unsure (better to ask than to guess)
☐ Suggest improvements to this manual (e.g., "I think X is unclear")

```

----------
## Document History

| Version | Date | Author | Change |
|--------|------|--------|--------|
| 1.0 | Jan 2026 | Ruturaj | Initial document for small-team (3–6 dev) operations |


----------

## How to Use This Document

-   **New developer?** Start with sections 1–5, work through onboarding checklist.
-   **Writing code?** Reference sections 3 (daily commits), 5 (PRs), 8 (security).
-   **Something broke?** Jump to section 9 (failure scenarios).
-   **Need a command?** Section 12 has all common Git commands.
-   **Confused about a rule?** Search this document first; ask senior dev if still unclear.
-   **Disagreement with a rule?** File an issue; section 11 explains how disputes are resolved.

**This document is the source of truth. When in doubt, follow it exactly. When you catch an error or ambiguity, notify the senior engineering manager to update it.**

----------

**END OF DOCUMENT**