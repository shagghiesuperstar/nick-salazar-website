# Plate word pairs — final mapping (narrative-content)

Source of the service names: `/Users/scottscheferman/Nick Salazar Website/Nick salazar website info.txt` line 5. Each plate's words are tied to (a) what is visible in that plate's footage and poster and (b) one or more services on the supplied list. No two plates share a word. All words are single, short, uppercase-friendly, one span each, so the display container stays wrap-safe at 320 px.

| data-plate | section id | video / poster | Visible content (literal) | Word pair (h2 spans; accented word in bold, `data-accent`) | Service(s) on the supplied list | Rationale |
|---|---|---|---|---|---|---|
| 01 | `#top` (hero) | `01-hero.mp4` / `poster-01-hero.jpg` | Heavy unit on a spreader beam under a ship's crane, containers on deck | none (hero carries NICK / SALAZAR as the display) | heavy lift / project cargo | The name is the largest type; the plate needs no competing pair. Caption "AI-generated, based on a photograph in Nick's files". |
| 02 | `#plate-coils` | `02-coils.mp4` / `poster-02-coils.jpg` | Stacked, banded, labelled steel coils in a covered shed | Count. **Measure.** Record. (red) | steel pipe / plate / coils | Steel surveys are tally-and-condition work: count, dimensions/weights against the packing list, written record. |
| 03 | `#plate-crane` | `03-crane.mp4` / `poster-03-crane.jpg` | Crawler crane lifting an enclosed unit over a rail flatcar | Rig. **Lift.** Land. (default orange) | heavy lift / project cargo; railcar loading | The three phases of a lift the surveyor attends; "Land" ties to the receiving railcar. |
| 04 | `#plate-drums` | `04-drums.mp4` / `poster-04-drums.jpg` | Cylindrical units braced with timber frames and lashing inside a container | Block. **Brace.** Lash. (yellow) | loading / stowage surveys | The visible securing methods, in the order they are fitted. |
| 05 | `#plate-containers` | `05-containers.mp4` / `poster-05-containers.jpg` | Tarped, netted loads lashed to flat racks in an open yard | Wrap. **Secure.** Ship. (red) | break bulk; truck loading | Exposed break-bulk cargo: covering, securing, dispatch. |
| 06 | `#plate-warehouse` | `06-warehouse.mp4` / `poster-06-warehouse.jpg` | Wrapped machine on timber cradles in an open crate inside a hall | Pack. **Protect.** Prove. (default orange) | packing / crate surveys | Packing work, its purpose, and the survey's role (the photographic record). |
| 07 | `#plate-yard` | `07-yard.mp4` / `poster-07-yard.jpg` | Enclosed units on a roller dolly on a cargo warehouse floor (indoor scene despite the filename) | Weigh. Watch. **Witness.** (yellow) | airfreight | Air cargo is weighed and built up under time pressure; the surveyor watches and witnesses condition and securing. Team lead's example pair, placed where it fits best. |

## Uniqueness check
Count, Measure, Record, Rig, Lift, Land, Block, Brace, Lash, Wrap, Secure, Ship, Pack, Protect, Prove, Weigh, Watch, Witness — 18 distinct words, none repeated.

## Accent rationale
One accented word per plate (visual-motion contract; accent colours are the photo-derived tokens). The accent falls on the verb that names the surveyor's act in that plate (Measure, Lift, Brace, Secure, Protect, Witness); colours follow the dominant colour the AI render leaves in that plate: coil faces red, crane load orange, container units yellow, flat racks red (clip 05), warm timber crate orange-brown (clip 06), dolly units yellow. Sky-blue is not used: media-preparation measured no blue in the shipped clips and the lead ruled accents are orange, red and yellow only.

## Provenance note (confirmed by media-preparation)
All seven videos and all poster frames are Grok-generated re-stagings of Nick's seven client-supplied photographs (same composition, recoloured, animated, no audio). Every plate is therefore captioned "<literal scene> · AI-generated, based on a photograph in Nick's files" (shortened at visual-motion's request for 375 px; "based on" per media-preparation's attestation limits; the word "footage" is avoided so no camera presence is implied), never as a record of a job. Plate 07's clip is an indoor warehouse scene (it re-stages photo-skid.jpg), so its caption says "Units on a roller dolly in a cargo warehouse"; the airfreight story around it is general explanation of the listed service, not a claim about what the footage shows.
