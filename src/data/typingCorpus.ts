/**
 * Typing Corpus & Test Paragraphs Repository
 * Categorized by professional domain benchmarks
 */

export interface TextCategory {
  id: string;
  name: string;
  description: string;
  texts: string[];
}

export const TYPING_CATEGORIES: TextCategory[] = [
  {
    id: 'architecture',
    name: 'Tech & Architecture',
    description: 'Cloud systems, distributed consensus, microservices, and concurrency.',
    texts: [
      'Modern web architectures require strict decoupling between presentation layers and state-authoritative backends. By processing keystroke telemetry through statistical variance pipelines, high-throughput engines achieve deterministic fraud detection without imposing perceptible latency on touch-typists.',
      'Distributed systems enforce eventual consistency through asynchronous consensus protocols like Raft and Paxos. When designing fault-tolerant databases, engineers must balance network partition tolerance against serializable isolation levels to eliminate race conditions.',
      'Container orchestration platforms abstract bare metal infrastructure into scalable pools of compute. Efficient deployment pipelines leverage declarative manifests and immutable artifacts to ensure idempotent rollbacks across heterogeneous cloud environments.',
      'A service mesh provides transparent communication between distributed services by handling traffic routing, mutual TLS authentication, retries, and observability. Engineers use sidecar proxies to enforce consistent networking policies without embedding infrastructure concerns directly into application code.',

      'Event-driven architectures decouple producers from consumers through asynchronous messaging systems. Durable event logs enable replay, recovery, and independent scaling, while idempotent handlers prevent duplicate deliveries from creating inconsistent business transactions.',
  
      'Database sharding distributes records across multiple partitions to improve throughput and reduce storage pressure. Choosing an effective partition key requires careful consideration of access patterns, data distribution, cross-shard queries, and the operational complexity of rebalancing workloads.',
  
      'Modern infrastructure relies on observability signals including structured logs, distributed traces, and application metrics. Correlation identifiers connect requests across service boundaries, helping engineers identify latency bottlenecks and diagnose failures in complex production environments.',
  
      'A robust caching strategy reduces repeated database queries by keeping frequently accessed objects close to application servers. Cache invalidation, expiration policies, and stampede prevention must be carefully designed to balance freshness, availability, and memory consumption.',
  
      'Concurrency control protects shared resources when multiple workers execute overlapping operations. Optimistic locking, transactional isolation, and atomic compare-and-swap instructions help preserve correctness while minimizing unnecessary contention under heavy workloads.',
  
      'Infrastructure as code enables teams to define networks, permissions, compute resources, and deployment policies through version-controlled configuration. Automated validation and staged rollouts reduce configuration drift while making infrastructure changes repeatable and auditable.',
  
      'Zero-trust security assumes that every request requires explicit verification, regardless of its network origin. Identity-aware access policies, short-lived credentials, device posture checks, and continuous authorization reduce the impact of compromised accounts and lateral movement.',
  
    ],
  },
  {
    id: 'legal',
    name: 'Legal & Court Reporting',
    description: 'Verbatim court transcripts, contractual covenants, and evidentiary motions.',
    texts: [
      'The certified transcript represents an accurate verbatim record of testimony presented before the administrative tribunal. Speed and mechanical consistency remain paramount, ensuring every spoken syllable is captured with verified fidelity and cryptographic chain of custody.',
      'Counsel for the plaintiff hereby submits this motion for summary judgment on the grounds that no genuine issue of material fact remains for determination by the trier of fact. The undisputed evidentiary record conclusively demonstrates statutory compliance.',
      'The parties agree that neither the execution nor performance of this agreement shall constitute a waiver of any preexisting intellectual property covenants. All proprietary disclosures shall remain confidential under strict non-disclosure obligations.',
      'The witness affirmed under oath that the statements contained in the deposition were true and complete to the best of their knowledge. Counsel reserved the right to submit additional documentary evidence before the conclusion of the evidentiary hearing.',

      'The court hereby directs both parties to exchange all relevant disclosures within the prescribed period. Failure to comply with the scheduling order may result in appropriate sanctions, subject to the applicable procedural rules and the circumstances presented.',
  
      'Nothing in this agreement shall be interpreted as creating an employment relationship, joint venture, or partnership between the contracting parties. Each party remains independently responsible for its personnel, regulatory obligations, and applicable tax liabilities.',
  
      'The claimant contends that the respondent failed to perform its contractual obligations despite receiving written notice and a reasonable opportunity to cure the alleged breach. The tribunal shall determine liability after reviewing the submitted exhibits and witness testimony.',
  
      'All records admitted into evidence shall be marked, indexed, and preserved in accordance with the applicable retention policy. Any objection concerning authenticity, relevance, or admissibility must be stated on the record with sufficient specificity.',
  
      'The foregoing provisions shall survive expiration or termination of this agreement to the extent necessary to give effect to confidentiality, indemnification, intellectual property, and dispute resolution obligations expressly established herein.',
  
      'Following consideration of the arguments presented by counsel, the tribunal finds that the submitted materials establish a sufficient factual basis for further proceedings. The parties shall comply with all subsequent directions issued by the presiding officer.',
  
      'The undersigned acknowledges receipt of the notice and confirms that the attached schedule accurately identifies the documents produced in response to the request. All reservations of rights and applicable privileges remain expressly preserved.'
  
    ],
  },
  {
    id: 'medical',
    name: 'Medical & Clinical',
    description: 'Clinical dictation, surgical pathology, pharmacology, and patient prognosis.',
    texts: [
      'Patient presents with acute exacerbation of chronic obstructive pulmonary disease alongside secondary hypertension. Auscultation reveals bilateral expiratory wheezing across lower lung bases, requiring intravenous bronchodilator therapy and immediate continuous pulse oximetry monitoring.',
      'Postoperative evaluation confirms successful laparoscopic cholecystectomy without anatomical complications. Hemostasis was achieved via electrocautery, and vital signs remained stable throughout endotracheal anesthesia recovery.',
      'Pharmacological intervention commenced with broad-spectrum cephalosporins following blood cultures. Renal function panels indicate normal glomerular filtration rate, with serum electrolytes remaining within therapeutic reference intervals.',
      'The patient reports progressive fatigue, intermittent dizziness, and reduced exercise tolerance over the preceding two weeks. Physical examination and laboratory findings should be interpreted alongside the medical history, current medications, and relevant clinical risk factors.',
  
      'Magnetic resonance imaging demonstrates a well-defined lesion without significant surrounding edema. The radiological impression should be correlated with the presenting symptoms and prior imaging studies before determining the appropriate diagnostic pathway.',
  
      'The discharge summary includes the principal diagnosis, relevant secondary conditions, medication reconciliation, follow-up appointments, and instructions regarding warning signs. Clear documentation supports continuity of care and reduces the likelihood of preventable medication discrepancies.',
  
      'Continuous cardiac monitoring revealed intermittent premature ventricular contractions without sustained hemodynamic instability. The clinical team reviewed electrolyte measurements, medication history, and electrocardiographic findings before establishing the subsequent monitoring plan.',
  
      'Histopathological examination identified cellular changes requiring correlation with the specimen location and clinical presentation. The final report documents the observed morphology, relevant immunohistochemical findings, and any limitations affecting diagnostic interpretation.',
  
      'During postoperative recovery, the nursing team assessed pain intensity, wound integrity, respiratory function, and fluid balance at regular intervals. Any deterioration in vital signs or new neurological symptoms required prompt communication with the responsible clinical practitioner.',
  
      'Medication reconciliation is an essential component of safe transitions between inpatient and outpatient care. Clinicians must verify the prescribed dose, administration schedule, potential interactions, allergies, and any changes introduced during hospitalization.',
  
      'The multidisciplinary review considered diagnostic uncertainty, functional status, treatment response, and the patient preferences documented during consultation. The resulting care plan included appropriate follow-up, symptom monitoring, and criteria for reassessment if the clinical condition changed.'

    ],
  },
  {
    id: 'literature',
    name: 'Literature & Philosophy',
    description: 'Classic philosophical treatises and literary prose.',
    texts: [
      'Swift fingers moved across the mechanical switches with rhythmic precision. Each stroke resonated with clockwork cadence, transforming thoughts into fluid streams of alphanumeric characters while the digital proctor silently verified the natural biomechanical variance of human hands.',
      'You have power over your mind, not outside events. Realize this, and you will find strength. The happiness of your life depends upon the quality of your thoughts, and what we do now echoes in eternity.',
      'It was a bright cold day in April, and the clocks were striking thirteen. The sky was the color of television, tuned to a dead channel, whispering tales of forgotten machines humming in the quiet hours of night.',
      'The library stood at the end of a narrow corridor where afternoon sunlight gathered in pale rectangles upon the wooden floor. Somewhere behind the shelves, an old clock measured the silence with patient, deliberate movements.',
  
      'We often mistake certainty for wisdom because uncertainty demands that we examine our assumptions. A thoughtful mind remains willing to revise its conclusions when new evidence reveals a more complete understanding of the world.',
  
      'Beyond the sleeping village, the railway stretched toward a horizon hidden beneath clouds. Every departing train carried a thousand private stories, leaving behind the quiet certainty that movement and change were inseparable companions.',
  
      'The philosopher argued that freedom was not merely the absence of restraint, but the ability to choose responsibly among competing possibilities. Such freedom required reflection, discipline, and an honest recognition of the consequences of action.',
  
      'Rain traveled across the window in silver threads, distorting the familiar streets into a landscape of shifting reflections. In that uncertain light, ordinary buildings seemed to preserve memories that no resident could entirely recall.',
  
      'Knowledge grows when curiosity is accompanied by patience and intellectual humility. The willingness to question a familiar explanation often reveals connections that remain invisible to those who mistake tradition for unquestionable truth.',
  
      'At dawn, the city awakened gradually, first through the distant rumble of delivery trucks and then through the voices of vendors arranging their stalls. The ordinary rhythm of morning concealed countless small acts of courage and perseverance.',
  
      'A meaningful life need not be measured exclusively by achievement or recognition. It may instead emerge from attention, compassion, honest work, and the quiet determination to improve the circumstances of those around us.'

    ],
  },
  {
    id: 'code',
    name: 'Code Typing (TypeScript)',
    description: 'Real syntax, brackets, arrow functions, and typed declarations.',
    texts: [
      'async function verifyCertificate(publicCode: string): Promise<VerificationResult> { const record = await db.query.certificates.findFirst({ where: eq(certificates.publicCode, publicCode) }); if (!record) return { isValid: false, error: "Not Found" }; return { isValid: true, record }; }',
      'export const rateLimiter = (maxRequests: number, windowMs: number) => { const bucket = new Map<string, number[]>(); return (req: Request, res: Response, next: NextFunction) => { const now = Date.now(); const ip = req.ip || "unknown"; next(); }; };',
      'const computeMetrics = (typed: string, target: string, durationSec: number) => { const words = typed.length / 5; const grossWpm = Math.round((words / durationSec) * 60); const errors = countErrors(typed, target); return { grossWpm, errors }; };',
      'type UserProfile = { id: string; username: string; email: string; createdAt: Date; }; const getUserProfile = async (userId: string): Promise<UserProfile | null> => { return await userRepository.findById(userId); };',
  
      'interface ApiResponse<T> { success: boolean; data: T | null; error?: { code: string; message: string; }; } const createResponse = <T>(data: T): ApiResponse<T> => ({ success: true, data });',
  
      'const retryRequest = async <T>(operation: () => Promise<T>, attempts = 3): Promise<T> => { let lastError: unknown; for (let index = 0; index < attempts; index++) { try { return await operation(); } catch (error) { lastError = error; } } throw lastError; };',
  
      'type Environment = "development" | "staging" | "production"; const getConfig = (environment: Environment) => ({ debug: environment !== "production", retries: environment === "production" ? 5 : 1, timeoutMs: 10000 });',
  
      'const groupBy = <T, K extends string | number>(items: T[], getKey: (item: T) => K): Map<K, T[]> => { const groups = new Map<K, T[]>(); for (const item of items) { const key = getKey(item); groups.set(key, [...(groups.get(key) ?? []), item]); } return groups; };',
  
      'async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> { const response = await fetch(url, { signal, headers: { Accept: "application/json" } }); if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`); return response.json() as Promise<T>; }',
  
      'class RequestQueue { private pending: Array<() => Promise<void>> = []; enqueue(task: () => Promise<void>): void { this.pending.push(task); } async process(): Promise<void> { while (this.pending.length > 0) { const task = this.pending.shift(); if (task) await task(); } } }',
  
      'const validateInput = (value: string, minLength: number, maxLength: number): boolean => { const normalized = value.trim(); return normalized.length >= minLength && normalized.length <= maxLength && !/[<>]/.test(normalized); };',
  
      'type Listener<T> = (event: T) => void; class EventBus<T> { private listeners = new Set<Listener<T>>(); subscribe(listener: Listener<T>): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); } emit(event: T): void { this.listeners.forEach(listener => listener(event)); } }',
  
      'const paginate = <T>(items: T[], page: number, pageSize: number) => { if (page < 1 || pageSize < 1) throw new RangeError("Invalid pagination parameters"); const start = (page - 1) * pageSize; return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length, totalPages: Math.ceil(items.length / pageSize) }; };'

    ],
  },
];

export const BENCHMARK_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
];

export function generateWordTest(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomWord = BENCHMARK_WORDS[Math.floor(Math.random() * BENCHMARK_WORDS.length)];
    words.push(randomWord);
  }
  return words.join(' ');
}
