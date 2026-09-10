# ADR-005: Deterministic Risk Scoring Formula & Calibrated Confidence

**Status:** Accepted  
**Date:** 2026-09-10  
**Deciders:** Core Engineering Team  

---

## Context
TRD Section 7 defines a risk scoring logic combining the Rules Engine, ML Model, and Security Checks. The system must establish predictable mathematical bounds, eliminate arbitrary black-box severity shifts, and provide an interpretable confidence score that reflects inter-engine consensus.

## Decision
1. **Weighted Combination Formula:**
   $$\text{risk\_score} = (w_1 \times S_{\text{rules}}) + (w_2 \times P_{\text{ml}}) + (w_3 \times R_{\text{failed\_checks}})$$
   where $w_1 = 0.35, w_2 = 0.35, w_3 = 0.30$ and $w_1 + w_2 + w_3 = 1.0$.
2. **Discrete Severity Cutoffs:**
   - **High Risk:** $\text{risk\_score} \ge 0.75$
   - **Medium Risk:** $0.40 \le \text{risk\_score} < 0.75$
   - **Low Risk:** $\text{risk\_score} < 0.40$
3. **Fail-Safe Ambiguity Heuristic:**
   If $\text{risk\_score}$ falls within $\pm 0.03$ of a threshold (i.e. $[0.37, 0.40)$ or $[0.72, 0.75)$), the system automatically promotes the verdict to the higher severity tier (`Medium` or `High`) and records an evidence indicator explaining that caution was exercised.
4. **Calibrated Confidence Score:**
   Confidence reflects inter-engine agreement:
   $$\text{confidence} = \begin{cases}
   \min(0.99, 0.75 + 0.20 \times (1 - |S_{\text{rules}} - P_{\text{ml}}|)) & \text{if Rules and ML agree on category} \\
   \max(0.50, 0.65 - 0.15 \times |S_{\text{rules}} - P_{\text{ml}}|) & \text{if disagreement occurs}
   \end{cases}$$

## Consequences
### Positive:
- Transparent, verifiable, and unit-testable scoring logic.
- Eliminates non-deterministic LLM hallucinations in risk tier assignment.
- Fail-safe boundary rule protects users from borderline false negatives.
