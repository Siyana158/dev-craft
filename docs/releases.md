# Releasing dev-craft

Use a version tag in the form `vMAJOR.MINOR.PATCH`.

- **Major:** incompatible changes to a skill's expected workflow or removal/renaming of a skill.
- **Minor:** a new skill or backward-compatible capability.
- **Patch:** corrections, clarifications, or compatible maintenance.

## Prepare a release

1. Confirm the intended changes are merged to `main` and run the checks listed in [CONTRIBUTING.md](../CONTRIBUTING.md).
2. Move the relevant entries from `Unreleased` in [CHANGELOG.md](../CHANGELOG.md) into a new version section with the release date. Keep `Unreleased` ready for future changes.
3. Check that README install instructions and the skill list match the repository.
4. Create and push an annotated tag, replacing the example version:

   ```bash
   git switch main
   git pull --ff-only
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```

5. In GitHub, open **Releases → Draft a new release**, select the tag, use the matching changelog section for the notes, review the result, and publish.

Do not create a release if checks fail or the release notes contain changes that are not in the tag.

## Install a pinned version

The standard README command installs from the default branch. To use a particular release, clone that tag and install the local copy:

```bash
git clone --branch vX.Y.Z --depth 1 https://github.com/Siyana158/dev-craft.git dev-craft-vX.Y.Z
npx skills add ./dev-craft-vX.Y.Z --all
```
