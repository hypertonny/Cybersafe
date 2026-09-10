# ADR-003: SSRF Mitigation & Untrusted Payload Sandboxing

**Status:** Accepted  
**Date:** 2026-09-10  
**Deciders:** Core Engineering Team  

---

## Context
CyberSafe accepts arbitrary URLs and uploaded files from unauthenticated users. If the URL Parser naively opens network sockets to verify SSL certificates or WHOIS domains, attackers could target internal network infrastructure, VPC peering connections, or cloud instance metadata (e.g., `http://169.254.169.254`). Similarly, malicious uploaded files could attempt binary execution or zip-bomb exploits.

## Decision
We enforce a strict **Sandboxed Ingestion Policy**:
1. **SSRF Guard:** Before establishing any outbound socket connection for domain/SSL inspection, the hostname is resolved to its IP address and checked against a blacklist of forbidden CIDRs:
   - Loopback (`127.0.0.0/8`, `::1`)
   - Private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   - Link-local and cloud metadata (`169.254.0.0/16`)
   - Shared address space (`100.64.0.0/10`)
2. **Static-Only File Inspection:** Files are never executed. Inspection is strictly confined to cryptographic hashing (SHA-256), magic-byte file signature validation, and static regex parsing.
3. **Payload Size Guard:** Uploads exceeding 15MB are rejected immediately at the HTTP gateway before buffer allocation.

## Consequences
### Positive:
- Neutralizes SSRF vulnerabilities, cloud credential theft, and internal port scanning.
- Protects container host environments from malware execution.

### Negative / Trade-offs:
- Legitimate users attempting to test intranet or localhost URLs (e.g. during corporate penetration tests) cannot scan private IPs through this public pipeline.
