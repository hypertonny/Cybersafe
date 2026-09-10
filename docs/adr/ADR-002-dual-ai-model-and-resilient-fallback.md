# ADR-002: Dual AI Model Strategy with Resilient Deterministic Fallback

**Status:** Accepted  
**Date:** 2026-09-10  
**Deciders:** Core Engineering Team  

---

## Context
TRD Section 2 specifies Claude vision/text for OCR and explanation generation. However, relying exclusively on an external SaaS LLM introduces single-point-of-failure risks: API rate limits, network outages, or transient latency spikes exceeding the 8-second SLA. Furthermore, the PRD requires that the system remain useful even when upstream providers experience downtime.

## Decision
We implement a **Hybrid AI Strategy with Deterministic Grounded Fallback**:
1. **Primary Route:** Invoke multimodal vision/text LLM (Claude 3.5 Sonnet / Gemini 1.5 Flash) with an aggressive 3.5-second timeout and 1 immediate retry.
2. **Deterministic Fallback Engine:** If the LLM provider fails, returns an error, or times out, the system automatically falls back to an internal templated generator that constructs the `simple`, `detailed`, and `technical` explanations directly from the deterministic `evidence_collection` and `signals`.
3. **Telemetry Flagging:** When fallback occurs, the response sets `is_degraded = True` and `reduced_confidence = True` so clients and audit logs transparently know the output was derived deterministically.

## Consequences
### Positive:
- 100% operational resilience: The system never crashes or errors out simply because an external LLM API is down.
- Zero risk of hallucinated security advice during fallback.
- Enables offline local testing and continuous integration without requiring live paid API tokens.

### Negative / Trade-offs:
- Fallback explanations are more structured and less conversational than LLM-generated output, though functionally equivalent in accuracy.
