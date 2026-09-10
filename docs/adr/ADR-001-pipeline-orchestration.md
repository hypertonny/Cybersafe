# ADR-001: Asynchronous Five-Stage Pipeline Orchestration

**Status:** Accepted  
**Date:** 2026-09-10  
**Deciders:** Core Engineering Team  

---

## Context
CyberSafe must process untrusted user submissions across 4 formats (Screenshot, Text, URL, File) and evaluate them against multiple security engines before generating an LLM explanation and actionable guidance. The system must meet strict non-functional latency requirements (under 8 seconds end-to-end) and maintain 99.5% availability.

## Decision
We adopt an **Asynchronous Five-Stage Pipeline Architecture** coordinated by a central `AnalysisOrchestrator`:
1. **Stage 1: Input Processor:** Asynchronous format-specific extraction and normalization into a uniform `InputProcessorOutput` dataclass.
2. **Stage 2: Parallel Security Engines:** Concurrent execution of `RulesEngine`, `MLModelClassifier`, and `SecurityChecks` using Python's `asyncio.gather()`.
3. **Stage 3: Risk Engine:** Deterministic scoring combining engine weights ($w_1=0.35, w_2=0.35, w_3=0.30$), calculating calibrated confidence, and categorizing threats.
4. **Stage 4: LLM Explanation Layer:** Asynchronous synthesis of three explanation levels (Simple, Detailed, Technical) grounded strictly in the `evidence_collection`.
5. **Stage 5: Action Plan Generator:** Generation of structured next steps (`what_happened`, `why_risky`, `what_to_do`).

## Consequences
### Positive:
- Parallel execution of Stage 2 reduces latency from ~4.5s (sequential) to ~1.2s.
- Clear module separation of concerns enables independent unit testing and mock substitution.
- Linear data flow guarantees predictable debugging and structured telemetry logging.

### Negative / Trade-offs:
- Python asyncio requires strict non-blocking I/O throughout all parser libraries (e.g. using `httpx` or thread pools for synchronous network lookups).
