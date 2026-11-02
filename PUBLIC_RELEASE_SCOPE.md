# Public release scope

This document defines what belongs in a public GitHub repository and static site deployment for HS.Portfolio.

## Include in public upload

- Root public HTML (20 pages)
- `css/`
- `js/`
- `images/`
- `README.md`
- `.gitignore`
- `PUBLIC_RELEASE_SCOPE.md` (this file)

## Exclude from public upload

- `_recovery_notes/`
- `recovery_reports/` (if present in or beside the project)
- Backup folders
- Log files
- Temporary / scratch files
- Editor or OS cache files
- Any internal work memos not required to run the site

## Notes

- The live site needs only HTML, CSS, JS, and images listed above.
- `.gitignore` helps keep new local-only files out of future commits. If a folder was already tracked by Git, ignore rules alone do not untrack it — handle tracking separately before first publish.
- Do not put personal absolute paths, private URLs, or internal incident notes in public files.
