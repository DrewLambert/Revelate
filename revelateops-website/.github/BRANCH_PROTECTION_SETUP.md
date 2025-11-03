# Branch Protection Setup Guide

This guide provides step-by-step instructions for configuring GitHub branch protection rules to ensure code quality gates are enforced before deployment.

## Prerequisites

- Admin access to the GitHub repository
- GitHub Actions workflows must have run at least once for the checks to appear

## Setup Instructions

### 1. Navigate to Branch Protection Settings

1. Go to your GitHub repository: `https://github.com/DrewRevelate/Revelate`
2. Click on **Settings** (top navigation)
3. In the left sidebar, click **Branches**
4. Under "Branch protection rules", click **Add rule** (or **Edit** if a rule for `main` already exists)

### 2. Configure Protection Rule for Main Branch

**Branch name pattern:** `main`

#### Required Settings (Check these boxes):

**Status Checks:**
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - Search and select the following required checks:
    - `Unit & Integration Tests`
    - `End-to-End Tests`

**Pull Request Reviews:**
- ✅ **Require a pull request before merging** (recommended)
  - Require approvals: `1` (recommended for code review)
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**

**Additional Settings (Optional but Recommended):**
- ✅ **Require conversation resolution before merging**
- ✅ **Do not allow bypassing the above settings**
- ❌ **Allow force pushes** (should remain unchecked)
- ❌ **Allow deletions** (should remain unchecked)

### 3. Save Protection Rule

Click **Create** (or **Save changes** if editing existing rule)

### 4. Optional: Protect Prerelease Branch

Repeat steps above with branch name pattern: `Prerelease`

**Recommended settings for Prerelease:**
- Require status checks (same as main)
- PR reviews: Optional (0 approvals for faster iteration)
- Allow force pushes: ❌ No

## Verification

### Test Branch Protection is Working:

1. Create a new branch from `main`:
   ```bash
   git checkout -b test-branch-protection
   ```

2. Make a trivial change (e.g., add a comment to a file)

3. Commit and push:
   ```bash
   git add .
   git commit -m "Test branch protection"
   git push -u origin test-branch-protection
   ```

4. Create a Pull Request on GitHub

5. **Expected Behavior:**
   - GitHub Actions workflows trigger automatically
   - PR shows status checks in progress
   - "Merge" button is disabled until all checks pass
   - If tests fail, merge remains blocked
   - Once all tests pass, merge button becomes enabled

6. **Verify in PR Checks Tab:**
   - `Unit & Integration Tests` - Should show ✅ or ❌
   - `End-to-End Tests` - Should show ✅ or ❌
   - Coverage reports available as artifacts

7. Delete the test branch after verification:
   ```bash
   git checkout main
   git branch -D test-branch-protection
   git push origin --delete test-branch-protection
   ```

## Vercel Integration

Vercel automatically respects GitHub branch protection rules:

1. **Vercel Dashboard** → **Project Settings** → **Git**
2. **Production Branch:** Set to `main`
3. **Deploy Hooks:** Automatic deployments enabled
4. **Ignored Build Step:** Leave empty (deploy all commits)

**How it works:**
- When PR is created → Vercel creates preview deployment
- When tests pass and PR is merged → Vercel deploys to production
- If branch protection blocks merge → Vercel won't deploy to production

## Troubleshooting

### Checks not appearing in required status checks list?

**Solution:** The workflow must run at least once before it appears in the list.
1. Push a commit to any branch
2. Wait for workflow to complete
3. Return to branch protection settings
4. The check should now appear in the search

### Merge button still enabled even when tests fail?

**Solution:** Branch protection may not be properly configured.
1. Verify "Require status checks" is checked
2. Verify both workflow jobs are selected as required
3. Save the rule
4. Try creating a new PR to test

### Want to merge despite failing tests (emergency fix)?

**Options:**
1. **Recommended:** Fix the tests, then merge
2. **Temporary:** Admin can temporarily disable branch protection
   - ⚠️ Not recommended - defeats purpose of CI/CD
3. **Better:** Add admin bypass permission for emergencies only

## Additional Resources

- [GitHub Docs: About Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions: Workflow Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Vercel Docs: Git Integration](https://vercel.com/docs/deployments/git)

## Current Configuration Status

**Last Updated:** 2025-10-30

**Protected Branches:**
- [ ] `main` - Pending manual setup
- [ ] `Prerelease` - Pending manual setup

**Required Status Checks:**
- [ ] Unit & Integration Tests
- [ ] End-to-End Tests

**Next Steps:**
1. Follow setup instructions above
2. Verify with test PR
3. Update checkboxes above when complete
