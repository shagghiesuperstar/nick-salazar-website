# Operator edits to site/index.html (lead note; narrative-content's copy-audit.md predates these)

Recorded by the team lead on 2026-09-04 23:2x. Provenance: **supplied directly by the operator (Scott) in a mid-session message**, not from the two client source files. Not invented by the team. Keep as-is; confirm with Nick before publishing.

| line | text | provenance |
|---|---|---|
| 363 | `<a class="contact__mail" href="mailto:Houtxsurvey@outlook.com">Houtxsurvey@outlook.com</a>` | operator-supplied contact address |
| 437 | brief note: "…email it to Houtxsurvey@outlook.com" | operator-supplied |
| 448 | footer `<a class="foot__mail" href="mailto:…">` | operator-supplied |
| 361–366 | Contact section retitled "Contact"; lede "Email Nick at that address. Or describe the assignment below… Nothing is submitted from this page." | operator copy; still honest (no form submission) |
| (removed) | `<!-- PRE-PUBLICATION DEPENDENCY: contact destination … -->` | dependency satisfied by the operator |

| 7, 42, 96 | "A decade surveying cargo" (was "About ten years surveying") | operator wording of the supplied fact `10 years surveying` (INFO L3); not a rarity/comparative claim; check-copy soft term "decade" now expected here |

Static audit rule updated accordingly (years regex accepts "a decade surveying") (`tests/static_audit.py`: only this one address may appear; no `tel:`; passes).
