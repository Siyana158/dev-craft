# Benchmark scorecard

Copy this template for each case and each run. Keep raw evidence beside the completed scorecard. Score evidence, not intent or prose promises.

## Run record

```text
Case ID:
Condition: control | with dev-craft
Date:
Starter repository and commit:
dev-craft commit (if applicable):
Runtime / dependencies:
Execution environment and model version:
Time limit / elapsed time:
Task prompt checksum or saved path:
Build / lint / type / test commands run:
Screenshots / request traces / database evidence:
Checks not run and why:
```

Keep the exact prompt and dependency lockfile for each condition. Record the execution environment and version for repeatability; do not use differing versions within one comparison pair.

## UI case score

Score each dimension from 0 to 4, then compute `dimension score ÷ 4 × weight`. A score of 0 means absent or broken; 1 means mostly incomplete; 2 means partially works with clear defects; 3 means meets the acceptance checks with minor defects; 4 means meets them cleanly with evidence. Mark a dimension `N/A` only when the case genuinely does not exercise it, and redistribute its weight proportionally across the remaining dimensions before scoring either condition.

| Dimension | Weight | Evidence to inspect | Score (0–4) | Weighted points |
|---|---:|---|---:|---:|
| Task completion and interaction | 25 | Case acceptance checks, working controls, core flow |  |  |
| Visual hierarchy and specificity | 20 | Blind screenshot review; fit to stated audience and task |  |  |
| Responsive behavior | 15 | 1440 / 768 / 390 screenshots, overflow, clipping |  |  |
| Accessibility | 15 | Semantic structure, keyboard, labels, focus, contrast, reduced motion |  |  |
| Content accuracy and completeness | 10 | Supplied facts, complete states, no unsupported claims |  |  |
| Robustness and states | 10 | Loading, empty, error, validation, repeat actions |  |  |
| Maintainability | 5 | Existing conventions, clear structure, no unjustified dependencies |  |  |
| **Total** | **100** |  |  |  |

For visual hierarchy and specificity, two reviewers should independently score screenshots with the condition hidden. Record both scores and use their mean for that dimension. If only one reviewer is available, identify the score as single-reviewer.

## API case score

Score each dimension from 0 to 4 using the same scale as above.

| Dimension | Weight | Evidence to inspect | Score (0–4) | Weighted points |
|---|---:|---|---:|---:|
| Contract correctness | 15 | Status codes, response shapes, pagination, documentation |  |  |
| Authentication and ownership | 20 | Anonymous rejection and cross-user access attempts |  |  |
| Data integrity | 20 | Constraints, transactions, price authority, stock under concurrency |  |  |
| Validation and error handling | 15 | Invalid payloads, missing records, conflicts, sanitized failures |  |  |
| Security and privacy | 15 | Input handling, secret hygiene, response minimization, logs |  |  |
| Tests and repeatability | 10 | Focused tests run and clear repeatable setup |  |  |
| Operations and documentation | 5 | Migrations, safe config examples, endpoint docs |  |  |
| **Total** | **100** |  |  |  |

Any cross-user data exposure, client-controlled pricing, secret disclosure, or partial write that violates the case invariant is a **critical failure**. Report it even if the numeric score is high; do not hide it in an average.

## Results summary

| Case | Control score | With dev-craft score | Difference | Critical failure | Evidence link |
|---|---:|---:|---:|---|---|
| Dashboard |  |  |  |  |  |
| Landing page |  |  |  |  |  |
| Localized setup |  |  |  |  |  |
| Catalog API |  |  |  |  |  |

Report each case separately before reporting an overall median. Include the number of runs, reviewer count, environment, time limit, missing checks, and any deviations from the protocol. Do not describe a score difference as caused by `dev-craft` if the paired runs differed in other material ways.
