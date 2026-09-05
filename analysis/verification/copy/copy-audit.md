# Copy audit — site/index.html (source-grounded)

Auditor: narrative-content teammate. Status: **final for this build, revised after team-lead's source-integrity spot check** (corrections 1 and 2 applied; lines 65, 82, 89, 90, 157, 307, 344 after the favicon line was inserted at line 10). Line numbers were located by script against the shipped file at write time; `python3 analysis/verification/copy/check-copy.py` re-runs the structural, forbidden-word and digit sweeps (§G) and reports the current line of every quoted phrase in this audit so drift is visible.

Sources (READ ONLY, facts about Nick):
- **INFO** = `/Users/scottscheferman/Nick Salazar Website/Nick salazar website info.txt`
  - L2 `2nds Mate Unlimited, 1600-ton Master`
  - L3 `10 years surveying`
  - L5 `Specialize in break bulk, heavy lift / project cargo, steel pipe / plate / coils, stock throughput warehouse inspections, cargo claim surveys, CSC container inspections, draft survey, towing survey, loading / stowage surveys, railcar loading, truck loading, jack and slide, airfreight, packing / create surveys.`
  - L7–8 `My previous employer` / `https://eimc.com/`
- **STORY** = `/Users/scottscheferman/Nick Salazar Website/nicksalazar story for website.md` — research document; used ONLY for general industry explanation, never for Nick-specific facts (RECOVERY.md "Copy integrity"). Its rarity / command-history / "personally oversaw" framings are deliberately NOT used.
- **ASSETS** = provenance from media-preparation (`analysis/verification/media/content-descriptions.md`, `reconciliation.md`, `site/assets/MANIFEST.md`): 7 photos = client originals from IMG_*.HEIC (unverified location/date/job/client/person); 7 videos + posters = Grok-generated re-stagings of those photos, no audio.

Legend: **INFO Ln** = supplied fact · **GEN (STORY §)** = general industry explanation, phrased generally · **LITERAL** = literal description of the asset · **NONE** = no factual claim.

## A. Head, nav, hero
| index.html line | Claim | Support |
|---|---|---|
| 10 | `<link rel="icon" href="data:,">` | NONE — empty data URI so the browser makes no /favicon.ico request (visual-motion request); no external request. |
| 6 | title: "Nick Salazar — Independent Marine Surveyor & Cargo Consultant" | INFO L2–5 (credentials, surveying specialties); "independent marine surveyor and cargo consultant" is how STORY L3 restates the supplied brief. |
| 7 | meta description (credentials, "about ten years surveying", service terms) | INFO L2, L3, L5; every listed term maps to a supplied service. |
| 6,7,17,100,445,446,447 | "Nick Salazar" (nav mark, footer mark) | INFO file (first person "My credentials") / STORY L3. |
| 7,39,80 | "Second Mate Unlimited" | INFO L2 (`2nds Mate Unlimited`, rendered per RECOVERY). |
| 7,39,87 | "1600-Ton Master" | INFO L2. |
| 41 | "Independent marine surveyor & cargo consultant" | INFO L5 + STORY L3 restatement of the supplied brief. |
| 42 | "About ten years surveying cargo." | INFO L3 (`10 years surveying`, rendered "about ten" per RECOVERY "approximately 10 years"). |
| 42 | "When something is lifted, stowed, moved or claimed, someone has to see it and write down what happened. That is the job." | NONE — general description of survey work (GEN STORY L7). No Nick-specific claim. |
| 44 | hero caption "AI-generated, based on a photograph in Nick’s files" | ASSETS — media-preparation: 01-hero.mp4 is Grok-generated and re-stages hero.jpg (client original). |
| 19,43 | nav labels + "Build a brief" | NONE. |

## B. Video plates (story paragraphs and captions)
Caption form (shortened for mobile at visual-motion's request, semantics agreed with media-preparation): "<literal scene> · AI-generated, based on a photograph in Nick’s files". "Based on" is used because media-preparation can attest the clip reproduces the photo's composition but cannot prove the generator ingested it. The word "footage" is not used anywhere.
Every plate story is general description of what a survey type does, tied to a listed service. The only Nick-specific verbs are "Nick attends…" / "Nick surveys…", restating INFO L5 "Specialize in …". No plate is captioned as a job, a place, or documentary footage.
| index.html line | Claim | Support |
|---|---|---|
| 65 | "Coils arrive with mill marks, strapping, edge protection and a weight on the packing list…" | GEN — ordinary steel-cargo practice (STORY L25). |
| 65 | "A steel survey records count, condition, marks and any damage exactly as found, with photographs that match the tally." | GEN (STORY L25). |
| 65 | "Pipe, plate and coil are surveyed the same way, at every hand-over, so the condition at each hand-over is on record." | INFO L5 `steel pipe / plate / coils`. Observable-condition wording (team-lead correction 1); no responsibility/liability determination. |
| 67 | caption "Steel coils, covered store · AI-generated, based on a photograph in Nick’s files" | LITERAL (poster/video 02) + ASSETS (media-preparation: re-stages photo-coils.jpg). |
| 126 | "Rigging, sling angles, the crane’s set-up, the receiving railcar or deck, and the tie-down that follows are each checked against the plan…" | GEN (STORY L24, L30–31). |
| 126 | "Nick attends heavy lift and project cargo operations and railcar loadings as an independent surveyor" | INFO L5 `heavy lift / project cargo`, `railcar loading`. |
| 128 | caption "Crawler crane, unit onto railcar · AI-generated, based on a photograph in Nick’s files" | LITERAL (poster 03) + ASSETS (re-stages photo-crane.jpg). Crane livery not named. |
| 215 | "Timber blocking, bracing frames and lashings have to hold through road, rail and sea…" | GEN (STORY L30). |
| 215 | "A loading and stowage survey documents the securing as fitted, with the container number, the seal and photographs, before the doors close." | INFO L5 `loading / stowage surveys`; GEN description. |
| 217 | caption "Units braced in a container · AI-generated, based on a photograph in Nick’s files" | LITERAL (poster 04) + ASSETS (re-stages photo-drums.jpg). Strap text / desiccant logo not named. |
| 284 | "Break bulk cargo travels exposed: flat racks, trailers, deck stow, weather." | GEN (STORY L24, ref 9). |
| 284 | "Nick surveys break bulk and truck loadings for condition, marks and securing…" | INFO L5 `break bulk`, `truck loading`. |
| 286 | caption "Tarped loads on flat racks · AI-generated, based on a photograph in Nick’s files" | LITERAL (poster 05) + ASSETS (re-stages photo-yard.jpg). Carrier / lessor / container numbers not named. |
| 307 | "Packing problems show up long after the crate is closed, when it is too late to fix them." | GEN (STORY L34). Observable, no claim/dispute framing (team-lead correction 1 sweep). |
| 307 | "A packing and crate survey checks the crate, the cradle, the bracing, the wrapping and the marks…" | INFO L5 `packing / create surveys` (typo = crate); GEN (STORY L34). |
| 309 | caption "Wrapped machine, open crate · AI-generated, based on a photograph in Nick’s files" | LITERAL (poster 06) + ASSETS (re-stages photo-warehouse.jpg). |
| 330 | "High-value, time-critical cargo still needs someone to confirm its condition, its packing and its securing on the pallet or dolly before it is built up…" | GEN (STORY L33). |
| 330 | "Nick surveys airfreight shipments with the same discipline as an ocean lift…" | INFO L5 `airfreight`. |
| 330 | "…a report written for the shipper and the underwriter alike." | NONE — intended readership, not an outcome. |
| 332 | caption "Units on a roller dolly, warehouse · AI-generated, based on a photograph in Nick’s files" | LITERAL (poster 07 is an indoor scene per media-preparation) + ASSETS (re-stages photo-skid.jpg). Ground-handler signage not named; "air cargo" deliberately NOT asserted in the caption. |

## C. Credentials section
| index.html line | Claim | Support |
|---|---|---|
| 75 | heading "What the licenses certify" | NONE. |
| 7,39,80 | "Second Mate Unlimited" | INFO L2. |
| 82 | "A U.S. merchant mariner deck officer license in the unlimited-tonnage class. What it covers in practice depends on the routes, endorsements and limitations printed on the credential." | GEN — license class only; scope deferred to the credential (team-lead correction 2 wording). NO command or authority claim. |
| 83 | "…a stowage plan, a stability calculation or a lashing arrangement is read the way a watch officer reads it, not only the way an inspector does." | GEN — deck-officer exam scope (STORY L15). Perspective, not history. |
| 7,39,87 | "1600-Ton Master" | INFO L2. |
| 89 | "A merchant mariner master’s license in the 1600 gross ton class, likewise subject to the routes, endorsements and limitations on the credential." | GEN — license class only; scope deferred to the credential (team-lead correction 2 wording). NO command or authority claim. |
| 90 | "Why it matters to you: it brings a master’s frame of reference, navigation, stability and vessel safety, to a towing survey or a loading survey." | Perspective / frame of reference only (team-lead correction 2); not history, not authority. |
| 96 | "About ten years surveying. Previously employed at EIMC." | INFO L3; INFO L7–8 (`My previous employer` / eimc.com). Plain text, no link, no logo, no endorsement. |
| 100 | "Credentials as supplied by Nick Salazar; not independently verified on this page." | RECOVERY "Client-supplied credentials are not independently verified"; STORY L78. |
| 103 | alt text for hero.jpg (literal) | LITERAL; media-preparation confirms hero.jpg is a client original. |
| 104 | caption "A heavy unit lifted on a spreader beam. From Nick’s files." | LITERAL + ASSETS (client original). No location, job, date or outcome. |

## D. Services matrix (14 items, verbatim from INFO L5, "create" → "crate")
| line | Service (verbatim from INFO L5) | Support |
|---|---|---|
| 140 | Break bulk | INFO L5; GEN STORY L24. |
| 144 | Heavy lift / project cargo | INFO L5; GEN STORY L24. |
| 148 | Steel pipe / plate / coils | INFO L5; GEN STORY L25. |
| 152 | Stock throughput warehouse inspections | INFO L5; GEN STORY L26 (STP policy definition). "insured" describes the policy type, NOT Nick’s insurance. |
| 157 | Cargo claim surveys — "The nature, apparent cause and extent of loss or damage, as observed on attendance and recorded for the claim file." | INFO L5; GEN STORY L27. Phrased as observed/recorded findings, not determinations binding anyone (team-lead correction 1). |
| 160 | CSC container inspections | INFO L5; GEN STORY L28 (CSC = Convention for Safe Containers). |
| 164 | Draft survey | INFO L5; GEN STORY L29. |
| 168 | Towing survey | INFO L5; Required by RECOVERY ("including towing"); GEN description. |
| 172 | Loading / stowage surveys | INFO L5; GEN STORY L30. |
| 176 | Railcar loading | INFO L5; GEN STORY L31. |
| 180 | Truck loading | INFO L5; GEN STORY L31. |
| 184 | Jack and slide | INFO L5; GEN STORY L32. |
| 188 | Airfreight | INFO L5; GEN STORY L33. |
| 192 | Packing / crate surveys | INFO L5; INFO typo "create" corrected; GEN STORY L34. |

Completeness: 14/14 supplied services present, in the supplied order. The same 14 names populate `select#bf-service` (options from line 368).

## E. Work gallery (client originals)
| index.html line | Claim | Support |
|---|---|---|
| 226 | "Photographs from Nick’s files, captioned with what is in the frame." | ASSETS — media-preparation: the seven photo-*.jpg/hero.jpg are client originals from IMG_*.HEIC. |
| 231 | photo-coils caption | LITERAL. Coil emblem / handwritten figures not named. |
| 237 | photo-crane caption | LITERAL. Crane livery not named. |
| 243 | photo-drums caption | LITERAL. |
| 249 | photo-skid caption | LITERAL. Signage / dolly number not named. |
| 255 | photo-warehouse caption | LITERAL. |
| 261 | photo-yard caption | LITERAL. Container numbers / carrier / lessor not named. |
No caption says where, when, for whom, or what the outcome was. No visible brand, container number or signage is transcribed.

## F. "Why independent", contact, footer
| index.html line | Claim | Support |
|---|---|---|
| 344 | "Nick is engaged by one party and answerable to the facts. That independence is what makes a survey report worth relying on by everyone who has to read it." | GEN (STORY L9, ref 4). Describes the role; no dispute-weight or outcome claim (team-lead correction 1 sweep). |
| 348 | "Photographs, tallies, measurements and a clear timeline, written for someone who was not there…" | GEN (STORY L7 evidentiary role). |
| 352 | "The person who attends is the person who writes and signs. Questions about the survey go to the surveyor who was on site." | Follows from "independent marine surveyor" as a named individual (INFO is first person); STORY L51 framing. No numbers, no roster claims. |
| 363 | "There is no form to submit here… copy or download…" | NONE — literal description of the utility. |
| 359 | HTML comment: PRE-PUBLICATION DEPENDENCY (contact destination not supplied) | Required by lead brief / RECOVERY. |
| 435 | "Nothing is sent from this page. Copy or download the brief and send it through your own channel." | Required by RECOVERY / lead brief. |
| 443 | footer statement | NONE. |
| 446 | footer note "Credentials as supplied by Nick Salazar. Video plates are AI-generated illustrations based on photographs from Nick’s files; gallery photographs are the originals." | RECOVERY + ASSETS (media-preparation provenance). |
| 447 | "© 2026 Nick Salazar" | NONE (current year). |

## G. Forbidden-claims checklist
Command form: `rg -n -i -c -- "<term>" site/index.html` (whole-word check added where the substring is ambiguous).
| term | hits (case-insensitive) | note |
|---|---|---|
| rare | 0 |  |
| unusual | 0 |  |
| command | 0 |  |
| commanded | 0 |  |
| guarantee | 0 |  |
| settle | 0 |  |
| Houston | 0 |  |
| phone | 1 | only inside the required PRE-PUBLICATION DEPENDENCY HTML comment; no phone number on the page |
| @ | 0 |  |
| testimonial | 0 |  |
| trusted by | 0 |  |
| years of | 0 |  |
| % | 0 |  |
| + | 0 |  |
| seamless | 0 |  |
| unleash | 0 |  |
| empower | 0 |  |
| elevate | 0 |  |
| NAMS | 0 |  |
| SAMS | 0 substring / 0 whole-word | substring check |
| accredit | 0 |  |
| insur | 1 | "stock insured across storage and transit" — general STP policy description (STORY L26), not Nick’s insurance |
| most surveyors | 0 |  |
| responsib | 0 | added after team-lead spot check |
| liab | 0 | added |
| who pays | 0 | added |
| resolve | 0 | added |
| decide | 0 | added |
| authori | 0 | added |
| unrestricted | 0 | added |
| dispute / blame | 0 / 0 | added |
| endorse | 2 | lines 82, 89 only — "endorsements and limitations" in the two license-scope sentences (team-lead's wording); no endorsement of Nick by any party |
| only surveyor | 0 |  |
| decade | 0 |  |
| Hargis | 0 |  |
| Harris | 0 |  |
| Seacom | 0 |  |
| CAI | 0 substring / 0 whole-word | substring hits only if any; see command output |
| Bahri | 0 |  |
| WFS | 0 |  |
| SIDA | 0 |  |
| CNEU | 0 |  |
| DOL 3796 | 0 |  |
| Sabine | 0 |  |
| Apex | 0 |  |
| Lone Star | 0 |  |

Digit sweep: `rg -n "[0-9]" site/index.html` minus asset paths / width / height / rows / data-plate / section comments / `<h1>`–`<h3>` tags leaves lines 4, 7, 39, 87, 89, 428, 447 — i.e. `utf-8`, the meta description and hero credentials (`1600-Ton Master`), the two license lines (`1600`), `tabindex="0"`, and `© 2026`. No metrics, counts, percentages or "N+" figures anywhere.

Also verified: no logos, no external links, no `<em>`/`<i>` inside headings (no italic headers), no emoji, no stock names, no "click here"; EIMC appears once as plain text (client-supplied previous employer); the three peer firms are not mentioned.

## H. Open items
1. Contact destination: none supplied; the page states plainly that nothing is sent. Pre-publication dependency comment at `#contact`.
2. visual-motion may still rename hooks; copy is unaffected.
3. Independent review (redcell) should re-run §G after any copy edit.
