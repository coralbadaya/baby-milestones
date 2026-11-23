# Reviewer onboarding (not published)

Send this only to a real clinician who has agreed to be named. Do not invent bios.

> Dr. [Full name], [Degrees], is a [paediatrician / obstetrician / lactation consultant] at [Hospital/Clinic, City] with [N] years of practice. [One sentence on clinical focus.] At Yarn Trails, [he/she/they] review[s] [topic area] content for accuracy against current [IAP/WHO/FOGSI] guidance. Reviews are voluntary/paid [choose] and do not constitute personal medical advice.

After they approve the wording, add one object to `src/data/reviewers.js` (`slug`, `name`, `credentials`, optional `registration`, `role`, optional `affiliation`, optional `photo`, `bio`, `reviewedSince`, optional `links`). Then set `reviewedBy` on the guides they actually signed off to that same name string.
