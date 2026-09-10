# ADR-004: PII Redaction and Transient Data Retention

**Status:** Accepted  
**Date:** 2026-09-10  
**Deciders:** Core Engineering Team  

---

## Context
PRD Section 9 and user trust mandate that user data, especially sensitive credentials, personal phone numbers, or private emails submitted in screenshots or text, are never inadvertently stored long-term or shared with third-party model providers for training.

## Decision
We enforce **Client-Side/Pre-Processor PII Anonymization & Ephemeral Storage**:
1. **PII Scrubbing:** The Input Processor runs a redaction pipeline replacing credit card numbers, US SSNs / national IDs, phone numbers, and raw auth tokens with synthetic masking tokens (`[REDACTED_CREDENTIAL]`, `[REDACTED_PHONE]`) prior to logging or forwarding to LLM endpoints.
2. **Transient In-Memory Retention:** Analysis records for guest users are held in memory/cache with a hard TTL of 60 minutes. Raw image binaries and file uploads are discarded immediately upon pipeline completion.
3. **Opt-in Storage:** Only authenticated users who explicitly enable "Save Analysis History" have their sanitized analysis metadata persisted in the relational database.

## Consequences
### Positive:
- Ensures strict compliance with GDPR, CCPA, and privacy-by-design standards.
- Prevents confidential user data from leaking into LLM context logs.

### Negative / Trade-offs:
- Users without an account who refresh their browser after the 1-hour window cannot retrieve historical analysis results without re-submitting.
